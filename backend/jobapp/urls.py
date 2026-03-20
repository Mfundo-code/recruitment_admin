from django.urls import path
from . import views

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────────
    path('api/auth/login/',   views.LoginView.as_view(),        name='login'),
    path('api/auth/refresh/', views.TokenRefreshView.as_view(), name='token-refresh'),

    # ── Public (no auth required) ─────────────────────────────────────────────
    path('api/jobs/',          views.PublicJobListView.as_view(),   name='public-job-list'),
    path('api/jobs/<int:pk>/', views.PublicJobDetailView.as_view(), name='public-job-detail'),
    path('api/apply/',         views.PublicApplyView.as_view(),     name='public-apply'),
    path('api/contact/',       views.PublicContactView.as_view(),   name='public-contact'),

    # ── Analytics tracking (public, fire-and-forget) ──────────────────────────
    path('api/track/visit/',              views.TrackVisitView.as_view(),   name='track-visit'),
    path('api/track/job-view/<int:pk>/',  views.TrackJobViewView.as_view(), name='track-job-view'),

    # ── Admin (JWT required) ──────────────────────────────────────────────────
    path('api/admin/stats/',                          views.AdminDashboardStatsView.as_view(),    name='admin-stats'),
    path('api/admin/jobs/',                           views.AdminJobListCreateView.as_view(),     name='admin-job-list'),
    path('api/admin/jobs/<int:pk>/',                  views.AdminJobDetailView.as_view(),         name='admin-job-detail'),
    path('api/admin/applications/',                   views.AdminApplicationListView.as_view(),   name='admin-app-list'),
    path('api/admin/applications/<int:pk>/',          views.AdminApplicationDetailView.as_view(), name='admin-app-detail'),
    path('api/admin/applications/<int:pk>/cv/',       views.AdminDownloadCVView.as_view(),        name='admin-cv-download'),
    path('api/admin/contact/',                        views.AdminContactListView.as_view(),       name='admin-contact-list'),
    path('api/admin/contact/<int:pk>/',               views.AdminContactDetailView.as_view(),     name='admin-contact-detail'),
]