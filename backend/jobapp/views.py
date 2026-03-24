from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.core.mail import send_mail, EmailMultiAlternatives
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
        subject = "✅ Application Received — Muji Consulting"

        plain_body = (
            f"Dear {application.full_name},\n\n"
            f"Thank you for applying for the position of \"{application.job.title}\".\n"
            f"We have successfully received your application and CV.\n\n"
            f"Our recruitment team will review your submission and contact you if your profile matches our requirements.\n\n"
            f"Best regards,\nThe Muji Consulting Team"
        )

        html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background:#0d1117;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#0d1117;padding:40px 16px;">
        </tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:560px;
                      background:linear-gradient(160deg,#0f1923 0%,#162030 60%,#0f1923 100%);
                      border-radius:20px;overflow:hidden;
                      border:1px solid rgba(255,255,255,0.07);
                      box-shadow:0 24px 60px rgba(0,0,0,0.5);">

          <!-- Top shimmer bar -->
          <tr>
            <td style="height:4px;
                       background:linear-gradient(90deg,#1B3D2F,#3DBE5C,#3498db,#C9A53A);">
            </td>
          </tr>

          <!-- Brand row -->
          <tr>
            <td style="padding:32px 36px 0;">
              <div style="display:inline-block;
                          background:linear-gradient(135deg,#1B3D2F,#3498db);
                          border-radius:10px;padding:8px 18px;">
                <span style="color:#ffffff;font-size:0.75rem;font-weight:700;
                              letter-spacing:1.5px;text-transform:uppercase;">
                  MUJI CONSULTING
                </span>
              </div>
            </td>
          </tr>

          <!-- Hero text -->
          <tr>
            <td style="padding:28px 36px 0;">
              <p style="margin:0 0 10px;font-size:0.68rem;font-weight:700;
                         letter-spacing:1.8px;text-transform:uppercase;color:#3DBE5C;">
                ● Application Received
              </p>
              <h1 style="margin:0;font-size:1.35rem;font-weight:700;
                          color:#ffffff;line-height:1.3;">
                Thanks {application.full_name},<br/>we’ve got your CV!
              </h1>
              <p style="margin:14px 0 0;font-size:0.85rem;
                         color:rgba(255,255,255,0.5);line-height:1.7;">
                Your application for <strong style="color:#ffffff;">{application.job.title}</strong>
                has been received. Our recruitment team will review it and
                reach out if your profile matches our needs.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:26px 36px 0;">
              <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td style="padding:28px 36px 0;">
              <p style="margin:0 0 18px;font-size:0.68rem;font-weight:700;
                         letter-spacing:1.2px;text-transform:uppercase;
                         color:rgba(255,255,255,0.3);">
                What Happens Next
              </p>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:14px;">
                <tr>
                  <td style="width:36px;vertical-align:top;padding-top:1px;">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:linear-gradient(135deg,#1B3D2F,#3DBE5C);
                                text-align:center;line-height:32px;
                                font-size:0.75rem;font-weight:700;color:#fff;">
                      1
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:0.82rem;
                               color:rgba(255,255,255,0.55);line-height:1.5;">
                      Our HR team reviews your CV and application.
                    </p>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:14px;">
                <tr>
                  <td style="width:36px;vertical-align:top;padding-top:1px;">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:linear-gradient(135deg,#163a5e,#3498db);
                                text-align:center;line-height:32px;
                                font-size:0.75rem;font-weight:700;color:#fff;">
                      2
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:0.82rem;
                               color:rgba(255,255,255,0.55);line-height:1.5;">
                      Shortlisted candidates are contacted for an interview.
                    </p>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="width:36px;vertical-align:top;padding-top:1px;">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:linear-gradient(135deg,#5a3a1a,#C9A53A);
                                text-align:center;line-height:32px;
                                font-size:0.75rem;font-weight:700;color:#fff;">
                      3
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:0.82rem;
                               color:rgba(255,255,255,0.55);line-height:1.5;">
                      We’ll keep your details for future opportunities
                      if not immediately selected.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:28px 36px 0;">
              <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:0.72rem;color:rgba(255,255,255,0.22);">
                      🔒 Your personal data is handled with confidentiality.
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:0.72rem;color:rgba(255,255,255,0.18);">
                      Muji Consulting &copy; 2025
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>"""

        try:
            msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[application.email],
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send(fail_silently=False)
        except Exception as e:
            # Log the error but don't raise – we don't want to block application creation
            print(f"[ApplicationConfirmation] Failed to send email to {application.email}: {e}")


class PublicContactView(generics.CreateAPIView):
    serializer_class   = PublicContactSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        contact = serializer.save()
        self._send_confirmation(contact)

    def _send_confirmation(self, contact):

        # ══════════════════════════════════════════════════════════════════════
        # EMAIL 1 — Confirmation to the visitor (e.g. johndoe@gmail.com)
        # ══════════════════════════════════════════════════════════════════════

        confirmation_subject = "✅ We received your message — Muji Consulting"

        plain_body = (
            f"Hi {contact.name},\n\n"
            f"Thank you for reaching out to Muji Consulting.\n"
            f"We've received your message and will get back to you within 24 hours.\n\n"
            f"Your message:\n\"{contact.message}\"\n\n"
            f"Best regards,\nThe Muji Consulting Team"
        )

        html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Message Received</title>
</head>
<body style="margin:0;padding:0;background:#0d1117;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#0d1117;padding:40px 16px;">
      <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:560px;
                      background:linear-gradient(160deg,#0f1923 0%,#162030 60%,#0f1923 100%);
                      border-radius:20px;overflow:hidden;
                      border:1px solid rgba(255,255,255,0.07);
                      box-shadow:0 24px 60px rgba(0,0,0,0.5);">

          <!-- Top shimmer bar -->
          <tr>
            <td style="height:4px;
                       background:linear-gradient(90deg,#1B3D2F,#3DBE5C,#3498db,#C9A53A);">
            </td>
          </tr>

          <!-- Brand row -->
          <tr>
            <td style="padding:32px 36px 0;">
              <div style="display:inline-block;
                          background:linear-gradient(135deg,#1B3D2F,#3498db);
                          border-radius:10px;padding:8px 18px;">
                <span style="color:#ffffff;font-size:0.75rem;font-weight:700;
                              letter-spacing:1.5px;text-transform:uppercase;">
                  MUJI CONSULTING
                </span>
              </div>
            </td>
          </tr>

          <!-- Hero text -->
          <tr>
            <td style="padding:28px 36px 0;">
              <p style="margin:0 0 10px;font-size:0.68rem;font-weight:700;
                         letter-spacing:1.8px;text-transform:uppercase;color:#3DBE5C;">
                ● Message Received
              </p>
              <h1 style="margin:0;font-size:1.35rem;font-weight:700;
                          color:#ffffff;line-height:1.3;">
                Hi {contact.name}, we got<br/>your message!
              </h1>
              <p style="margin:14px 0 0;font-size:0.85rem;
                         color:rgba(255,255,255,0.5);line-height:1.7;">
                Thank you for reaching out. Our team will review your
                enquiry and respond within
                <strong style="color:rgba(255,255,255,0.8);">24 hours</strong>.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:26px 36px 0;">
              <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
            </td>
          </tr>

          <!-- Message preview -->
          <tr>
            <td style="padding:24px 36px 0;">
              <p style="margin:0 0 10px;font-size:0.68rem;font-weight:700;
                         letter-spacing:1.2px;text-transform:uppercase;
                         color:rgba(255,255,255,0.3);">
                Your Message
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:rgba(255,255,255,0.05);
                            border-radius:12px;
                            border:1px solid rgba(255,255,255,0.08);">
                  <tr>
                  <td style="padding:18px 22px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="width:3px;background:linear-gradient(180deg,#3DBE5C,#3498db);
                                   border-radius:3px;vertical-align:top;">
                        </td>
                        <td style="padding-left:14px;">
                          <p style="margin:0;font-size:0.85rem;
                                     color:rgba(255,255,255,0.6);
                                     line-height:1.7;font-style:italic;">
                            &ldquo;{contact.message}&rdquo;
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  </tr>
                </table>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td style="padding:28px 36px 0;">
              <p style="margin:0 0 18px;font-size:0.68rem;font-weight:700;
                         letter-spacing:1.2px;text-transform:uppercase;
                         color:rgba(255,255,255,0.3);">
                What Happens Next
              </p>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:14px;">
                  <tr>
                  <td style="width:36px;vertical-align:top;padding-top:1px;">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:linear-gradient(135deg,#1B3D2F,#3DBE5C);
                                text-align:center;line-height:32px;
                                font-size:0.75rem;font-weight:700;color:#fff;">
                      1
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:0.82rem;
                               color:rgba(255,255,255,0.55);line-height:1.5;">
                      Our team reviews your message carefully.
                    </p>
                  </td>
                  </tr>
                </table>

              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:14px;">
                  <tr>
                  <td style="width:36px;vertical-align:top;padding-top:1px;">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:linear-gradient(135deg,#163a5e,#3498db);
                                text-align:center;line-height:32px;
                                font-size:0.75rem;font-weight:700;color:#fff;">
                      2
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:0.82rem;
                               color:rgba(255,255,255,0.55);line-height:1.5;">
                      A consultant is assigned to your enquiry.
                    </p>
                  </td>
                  </tr>
                </table>

              <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                  <td style="width:36px;vertical-align:top;padding-top:1px;">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:linear-gradient(135deg,#5a3a1a,#C9A53A);
                                text-align:center;line-height:32px;
                                font-size:0.75rem;font-weight:700;color:#fff;">
                      3
                    </div>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:0.82rem;
                               color:rgba(255,255,255,0.55);line-height:1.5;">
                      We reply to
                      <strong style="color:rgba(255,255,255,0.8);">
                        {contact.email}
                      </strong>
                      within 24 hours.
                    </p>
                  </td>
                  </tr>
                </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:28px 36px 0;">
              <div style="height:1px;background:rgba(255,255,255,0.07);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                    <p style="margin:0;font-size:0.72rem;color:rgba(255,255,255,0.22);">
                      🔒 Your information is safe and will never be shared.
                    </p>
                    </td>
                  <td align="right">
                    <p style="margin:0;font-size:0.72rem;color:rgba(255,255,255,0.18);">
                      Muji Consulting &copy; 2025
                    </p>
                  </td>
                  </tr>
                </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>"""

        try:
            # Send confirmation to the visitor
            msg = EmailMultiAlternatives(
                subject=confirmation_subject,
                body=plain_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[contact.email],
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send(fail_silently=False)

        except Exception as e:
            raise Exception(f"Email delivery failed: {e}")

        # ══════════════════════════════════════════════════════════════════════
        # EMAIL 2 — Alert to you (mfundoknox@gmail.com)
        # ══════════════════════════════════════════════════════════════════════

        try:
            from django.core.mail import EmailMessage

            owner_msg = EmailMessage(
                subject=f"📬 New website message from {contact.name}",
                body=(
                    f"You have a new contact message from the Muji Consulting website.\n\n"
                    f"──────────────────────────\n"
                    f"Name:    {contact.name}\n"
                    f"Email:   {contact.email}\n"
                    f"──────────────────────────\n\n"
                    f"Message:\n{contact.message}\n\n"
                    f"──────────────────────────\n"
                    f"Hit Reply to respond directly to {contact.name}."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=['mfundoknox@gmail.com'],
                reply_to=[contact.email],   # ← this is how you set Reply-To properly
            )
            owner_msg.send(fail_silently=False)

        except Exception as e:
            print(f"[ContactAlert] Owner notification failed: {e}")


# ── Analytics tracking (public, fire-and-forget) ──────────────────────────────

class TrackVisitView(APIView):
    """
    POST /api/track/visit/
    Body: { "page": "home" | "careers" }
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


# ── Admin views (JWT required) ─────────────────────────────────────────────────

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
        today    = timezone.now().date()
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
        visit_map = {}
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
            'visits_chart':           visits_chart,
            'job_views_chart':        job_views_chart,
            'applications_by_status': app_by_status,
            'top_jobs_by_views':      top_jobs,
            'messages_pie':           messages_pie,
            'applications_pie':       apps_pie,
        })