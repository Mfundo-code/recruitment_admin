from django.db import models


class JobPosting(models.Model):
    JOB_TYPES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('remote', 'Remote'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=20, choices=JOB_TYPES)
    salary_range = models.CharField(max_length=100, blank=True)
    requirements = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    posted_date = models.DateField(auto_now_add=True)
    application_deadline = models.DateField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-posted_date']

    def __str__(self):
        return f"{self.title} ({self.get_job_type_display()})"


def cv_upload_path(instance, filename):
    return f"cvs/{instance.job.id}/{filename}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    cover_letter = models.TextField()
    cv = models.FileField(upload_to=cv_upload_path)
    linkedin_profile = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    application_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-application_date']

    def __str__(self):
        return f"{self.full_name} – {self.job.title}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"Message from {self.name} ({self.submitted_at:%Y-%m-%d})"


# ── Analytics Models ───────────────────────────────────────────────────────────

class SiteVisit(models.Model):
    """
    One record per visit. Created by the public homepage/careers page
    via POST /api/track/visit/.
    page: 'home' | 'careers'
    """
    PAGE_CHOICES = [
        ('home',    'Home'),
        ('careers', 'Careers'),
    ]
    page       = models.CharField(max_length=20, choices=PAGE_CHOICES, default='home')
    visited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-visited_at']

    def __str__(self):
        return f"{self.page} visit @ {self.visited_at:%Y-%m-%d %H:%M}"


class JobView(models.Model):
    """
    One record every time a job detail page is opened.
    Created by POST /api/track/job-view/<job_id>/.
    """
    job     = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='views')
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-viewed_at']

    def __str__(self):
        return f"View: {self.job.title} @ {self.viewed_at:%Y-%m-%d %H:%M}"