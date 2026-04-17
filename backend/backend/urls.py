
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('django-admin/', admin.site.urls),   # ← MOVED from 'admin/' to 'django-admin/'
    path('', include('jobapp.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# ── Catch-all: serve React index.html for everything else ──
urlpatterns += [
    re_path(r'^(?!api/|django-admin/|django-static/|media/).*$',
            TemplateView.as_view(template_name='index.html')),
]