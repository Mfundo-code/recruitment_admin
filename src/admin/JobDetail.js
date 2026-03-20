import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJob } from './api';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJob(id).then(res => setJob(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!job)    return <p>Job not found.</p>;

  return (
    <div>
      <Link to="/admin/jobs" style={styles.back}>← Back to Jobs</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '12px 0 24px' }}>
        <h1 style={{ color: '#1B3D2F', margin: 0 }}>{job.title}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/admin/jobs/${id}/edit`}     style={styles.editBtn}>Edit</Link>
          <Link to={`/admin/jobs/${id}/template`} style={styles.templateBtn}>Get Template</Link>
        </div>
      </div>

      <div style={styles.card}>
        <Row label="Location">{job.location}</Row>
        <Row label="Type">{job.job_type.replace('_', ' ')}</Row>
        <Row label="Salary">{job.salary_range || 'Not specified'}</Row>
        <Row label="Deadline">{job.application_deadline}</Row>
        <Row label="Status">{job.is_active ? '✅ Active' : '❌ Inactive'}</Row>
        <Row label="Applications">{job.application_count ?? '–'}</Row>
      </div>

      {[
        { label: 'Description',      value: job.description },
        { label: 'Requirements',     value: job.requirements },
        { label: 'Responsibilities', value: job.responsibilities },
        { label: 'Benefits',         value: job.benefits },
      ].filter(s => s.value).map(s => (
        <div key={s.label} style={styles.section}>
          <h3 style={styles.sectionTitle}>{s.label}</h3>
          <p style={styles.sectionText}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
    <span style={{ width: '140px', color: '#777', fontSize: '0.85rem', flexShrink: 0 }}>{label}</span>
    <span style={{ color: '#222' }}>{children}</span>
  </div>
);

const styles = {
  back:         { color: '#C9A53A', textDecoration: 'none', fontSize: '0.9rem' },
  editBtn:      { background: '#1B3D2F', color: '#fff', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
  templateBtn:  { background: '#C9A53A', color: '#1B3D2F', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 },
  card:         { background: '#fff', padding: '20px 24px', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', marginBottom: '24px' },
  section:      { background: '#fff', padding: '20px 24px', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', marginBottom: '16px' },
  sectionTitle: { color: '#1B3D2F', marginTop: 0, marginBottom: '10px' },
  sectionText:  { color: '#444', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' },
};