from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Count
from django.db.models.functions import TruncDate

import datetime
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import JobPosting, JobApplication, ContactMessage, SiteVisit, JobView
from .serializers import (
    PublicJobSerializer,
    PublicApplicationSerializer,
    PublicContactSerializer,
    AdminJobSerializer,
    AdminApplicationSerializer,
    AdminContactSerializer,
)


# ── Auth ───────────────────────────────────────────────────────────────────────

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {'detail': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_staff:
            return Response({'detail': 'You do not have admin access.'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access':   str(refresh.access_token),
            'refresh':  str(refresh),
            'username': user.username,
        })


class TokenRefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'Refresh token required.'}, status=400)
        try:
            refresh = RefreshToken(refresh_token)
            return Response({'access': str(refresh.access_token)})
        except Exception:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=401)


# ── Public views (no auth) ─────────────────────────────────────────────────────

class PublicJobListView(generics.ListAPIView):
    serializer_class   = PublicJobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        today = timezone.now().date()
        return JobPosting.objects.filter(is_active=True, application_deadline__gte=today)


class PublicJobDetailView(generics.RetrieveAPIView):
    serializer_class   = PublicJobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        today = timezone.now().date()
        return JobPosting.objects.filter(is_active=True, application_deadline__gte=today)


class PublicApplyView(generics.CreateAPIView):
    serializer_class   = PublicApplicationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        application = serializer.save()
        self._send_confirmation(application)

    def _send_confirmation(self, application):
        subject = "We received your application"
        body = (
            f"Dear {application.full_name},\n\n"
            f"Thank you for applying for \"{application.job.title}\".\n"
            f"We will review your application and be in touch.\n\n"
            f"Best regards,\nThe Recruitment Team"
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL,
                      [application.email], fail_silently=True)
        except Exception:
            pass


class PublicContactView(generics.CreateAPIView):
    serializer_class   = PublicContactSerializer
    permission_classes = [permissions.AllowAny]


# ── Analytics tracking (public, fire-and-forget) ──────────────────────────────

class TrackVisitView(APIView):
    """
    POST /api/track/visit/
    Body: { "page": "home" | "careers" }
    Call this on mount of your public Home and Careers pages.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        page = request.data.get('page', 'home')
        if page not in ('home', 'careers'):
            page = 'home'
        SiteVisit.objects.create(page=page)
        return Response({'ok': True}, status=status.HTTP_201_CREATED)


class TrackJobViewView(APIView):
    """
    POST /api/track/job-view/<job_id>/
    Call this on mount of your public Job Detail page.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        job = get_object_or_404(JobPosting, pk=pk)
        JobView.objects.create(job=job)
        return Response({'ok': True}, status=status.HTTP_201_CREATED)


# ── Admin permission ───────────────────────────────────────────────────────────

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


# ── Admin views (JWT IsAuthenticated) ─────────────────────────────────────────

class AdminJobListCreateView(generics.ListCreateAPIView):
    serializer_class   = AdminJobSerializer
    permission_classes = [IsAdminOrStaff]
    queryset           = JobPosting.objects.all()


class AdminJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = AdminJobSerializer
    permission_classes = [IsAdminOrStaff]
    queryset           = JobPosting.objects.all()


class AdminApplicationListView(generics.ListAPIView):
    serializer_class   = AdminApplicationSerializer
    permission_classes = [IsAdminOrStaff]

    def get_queryset(self):
        qs            = JobApplication.objects.select_related('job').all()
        job_id        = self.request.query_params.get('job')
        status_filter = self.request.query_params.get('status')
        if job_id:
            qs = qs.filter(job_id=job_id)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


class AdminApplicationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class   = AdminApplicationSerializer
    permission_classes = [IsAdminOrStaff]
    queryset           = JobApplication.objects.select_related('job').all()


class AdminDownloadCVView(APIView):
    permission_classes = [IsAdminOrStaff]

    def get(self, request, pk):
        application = get_object_or_404(JobApplication, pk=pk)
        if not application.cv:
            return Response({'detail': 'No CV on file.'}, status=404)
        return FileResponse(
            application.cv.open('rb'),
            as_attachment=True,
            filename=application.cv.name.split('/')[-1],
        )


class AdminContactListView(generics.ListAPIView):
    serializer_class   = AdminContactSerializer
    permission_classes = [IsAdminOrStaff]
    queryset           = ContactMessage.objects.all()


class AdminContactDetailView(generics.RetrieveUpdateAPIView):
    serializer_class   = AdminContactSerializer
    permission_classes = [IsAdminOrStaff]
    queryset           = ContactMessage.objects.all()


class AdminDashboardStatsView(APIView):
    """
    GET /api/admin/stats/
    Returns summary cards + chart data for the dashboard.
    """
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        today   = timezone.now().date()
        # Date range: last 7 days (including today)
        week_ago = today - datetime.timedelta(days=6)
        date_range = [week_ago + datetime.timedelta(days=i) for i in range(7)]
        date_strs  = [d.strftime('%Y-%m-%d') for d in date_range]

        # ── 7-day visit series ────────────────────────────────────────────────
        visit_qs = (
            SiteVisit.objects
            .filter(visited_at__date__gte=week_ago)
            .annotate(day=TruncDate('visited_at'))
            .values('day', 'page')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        visit_map = {}  # {date_str: {home: n, careers: n}}
        for row in visit_qs:
            d = row['day'].strftime('%Y-%m-%d')
            visit_map.setdefault(d, {'home': 0, 'careers': 0})
            visit_map[d][row['page']] = row['count']

        visits_chart = [
            {
                'date':    d,
                'home':    visit_map.get(d, {}).get('home', 0),
                'careers': visit_map.get(d, {}).get('careers', 0),
            }
            for d in date_strs
        ]

        # ── 7-day job-view series ─────────────────────────────────────────────
        jv_qs = (
            JobView.objects
            .filter(viewed_at__date__gte=week_ago)
            .annotate(day=TruncDate('viewed_at'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        jv_map = {row['day'].strftime('%Y-%m-%d'): row['count'] for row in jv_qs}
        job_views_chart = [
            {'date': d, 'views': jv_map.get(d, 0)}
            for d in date_strs
        ]

        # ── Applications by status (pie) ──────────────────────────────────────
        app_by_status = list(
            JobApplication.objects
            .values('status')
            .annotate(count=Count('id'))
            .order_by('status')
        )

        # ── Top 5 jobs by total views ─────────────────────────────────────────
        top_jobs = list(
            JobPosting.objects
            .annotate(view_count=Count('views'))
            .order_by('-view_count')
            .values('title', 'view_count')[:5]
        )

        # ── Messages read/unread (pie) ────────────────────────────────────────
        total_msgs  = ContactMessage.objects.count()
        unread_msgs = ContactMessage.objects.filter(is_read=False).count()
        messages_pie = [
            {'label': 'Read',   'value': total_msgs - unread_msgs},
            {'label': 'Unread', 'value': unread_msgs},
        ]

        # ── Applications viewed/unviewed (pie) ────────────────────────────────
        total_apps   = JobApplication.objects.count()
        pending_apps = JobApplication.objects.filter(status='pending').count()
        apps_pie = [
            {'label': 'Reviewed', 'value': total_apps - pending_apps},
            {'label': 'Pending',  'value': pending_apps},
        ]

        return Response({
            # Summary cards
            'total_jobs':            JobPosting.objects.count(),
            'active_jobs':           JobPosting.objects.filter(is_active=True, application_deadline__gte=today).count(),
            'total_applications':    total_apps,
            'pending_applications':  pending_apps,
            'unread_messages':       unread_msgs,
            'total_visits':          SiteVisit.objects.count(),
            'total_job_views':       JobView.objects.count(),

            # Chart data
            'visits_chart':          visits_chart,       # line chart
            'job_views_chart':       job_views_chart,    # bar chart
            'applications_by_status': app_by_status,    # pie chart
            'top_jobs_by_views':     top_jobs,           # horizontal bar
            'messages_pie':          messages_pie,       # pie chart
            'applications_pie':      apps_pie,           # pie chart
        })