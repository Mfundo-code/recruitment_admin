from django.contrib import admin
from django.utils import timezone
from .models import JobPosting, JobApplication, ContactMessage, SiteVisit, JobView
import csv
from django.http import HttpResponse


class JobPostingAdmin(admin.ModelAdmin):
    list_display  = ['title', 'location', 'job_type', 'posted_date', 'is_active', 'total_views']
    list_filter   = ['job_type', 'is_active', 'location']
    search_fields = ['title', 'description', 'location']
    list_editable = ['is_active']
    fieldsets = (
        ('Job Information', {
            'fields': ('title', 'description', 'location', 'job_type')
        }),
        ('Details', {
            'fields': ('salary_range', 'requirements', 'responsibilities', 'benefits')
        }),
        ('Timing', {
            'fields': ('application_deadline', 'is_active')
        }),
    )

    def total_views(self, obj):
        return obj.views.count()
    total_views.short_description = 'Views'


class JobApplicationAdmin(admin.ModelAdmin):
    list_display  = ['full_name', 'job', 'status', 'application_date']
    list_filter   = ['status', 'job', 'application_date']
    search_fields = ['full_name', 'email', 'phone']
    readonly_fields = ['application_date', 'updated_at']
    actions = ['export_to_csv', 'mark_as_reviewed', 'mark_as_shortlisted']

    fieldsets = (
        ('Applicant Information', {
            'fields': ('full_name', 'email', 'phone', 'cover_letter')
        }),
        ('Documents & Links', {
            'fields': ('cv', 'linkedin_profile', 'portfolio_url')
        }),
        ('Job Information', {
            'fields': ('job',)
        }),
        ('Application Status', {
            'fields': ('status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('application_date', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def export_to_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="applications.csv"'
        writer = csv.writer(response)
        writer.writerow([
            'Name', 'Email', 'Phone', 'Job Applied',
            'Status', 'Application Date', 'LinkedIn', 'Portfolio'
        ])
        for application in queryset:
            writer.writerow([
                application.full_name,
                application.email,
                application.phone,
                application.job.title,
                application.get_status_display(),
                application.application_date.strftime('%Y-%m-%d %H:%M'),
                application.linkedin_profile,
                application.portfolio_url,
            ])
        return response
    export_to_csv.short_description = "Export selected applications to CSV"

    def mark_as_reviewed(self, request, queryset):
        queryset.update(status='reviewed')
    mark_as_reviewed.short_description = "Mark selected applications as reviewed"

    def mark_as_shortlisted(self, request, queryset):
        queryset.update(status='shortlisted')
    mark_as_shortlisted.short_description = "Mark selected applications as shortlisted"


class ContactMessageAdmin(admin.ModelAdmin):
    list_display  = ['name', 'email', 'submitted_at', 'is_read']
    list_filter   = ['is_read', 'submitted_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['submitted_at']
    list_editable = ['is_read']
    fieldsets = (
        ('Message Details', {
            'fields': ('name', 'email', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'submitted_at')
        }),
    )


@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display  = ['page', 'visited_at']
    list_filter   = ['page', 'visited_at']
    readonly_fields = ['page', 'visited_at']

    def has_add_permission(self, request):
        return False  # visits are created automatically, not manually


@admin.register(JobView)
class JobViewAdmin(admin.ModelAdmin):
    list_display  = ['job', 'viewed_at']
    list_filter   = ['job', 'viewed_at']
    readonly_fields = ['job', 'viewed_at']

    def has_add_permission(self, request):
        return False  # views are created automatically, not manually


admin.site.register(JobPosting,    JobPostingAdmin)
admin.site.register(JobApplication, JobApplicationAdmin)
admin.site.register(ContactMessage, ContactMessageAdmin)