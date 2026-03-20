from rest_framework import serializers
from .models import JobPosting, JobApplication, ContactMessage


# ── Public serializers ─────────────────────────────────────────────────────────

class PublicJobSerializer(serializers.ModelSerializer):
    """Only the fields a job-seeker needs to see."""
    job_type_display = serializers.CharField(source='get_job_type_display', read_only=True)

    class Meta:
        model = JobPosting
        fields = [
            'id', 'title', 'description', 'location',
            'job_type', 'job_type_display', 'salary_range',
            'requirements', 'responsibilities', 'benefits',
            'posted_date', 'application_deadline',
        ]


class PublicApplicationSerializer(serializers.ModelSerializer):
    """Public application submission – applicant fills this in."""

    class Meta:
        model = JobApplication
        fields = ['job', 'full_name', 'email', 'phone',
                  'cover_letter', 'cv', 'linkedin_profile', 'portfolio_url']

    def validate_cv(self, value):
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("CV must be smaller than 10 MB.")
        return value


class PublicContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']


# ── Admin serializers ──────────────────────────────────────────────────────────

class AdminJobSerializer(serializers.ModelSerializer):
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = JobPosting
        fields = '__all__'

    def get_application_count(self, obj):
        return obj.applications.count()


class AdminApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.ReadOnlyField(source='job.title')
    cv_url = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = JobApplication
        fields = '__all__'
        read_only_fields = ['application_date', 'updated_at']

    def get_cv_url(self, obj):
        request = self.context.get('request')
        if obj.cv and request:
            return request.build_absolute_uri(obj.cv.url)
        return None


class AdminContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['submitted_at']