import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, createJob, updateJob } from './api';

const EMPTY = {
  title: '', description: '', location: '', job_type: 'full_time',
  salary_range: '', requirements: '', responsibilities: '',
  benefits: '', application_deadline: '', is_active: true,
};

// Split a newline-separated requirements string into exactly 4 slots
const parseReqs = (str = '') => {
  const lines = str.split('\n').map(l => l.trim()).filter(Boolean);
  return [
    lines[0] || '',
    lines[1] || '',
    lines[2] || '',
    lines[3] || '',
  ];
};

// Enforce max 4 words; return the value unchanged if within limit
const capFourWords = (value) => {
  const words = value.trimStart().split(/\s+/);
  if (words.length <= 4) return value;
  return words.slice(0, 4).join(' ');
};

export default function JobForm() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const isEditing    = Boolean(id);
  const [form, setForm]       = useState(EMPTY);
  const [reqs, setReqs]       = useState(['', '', '', '']);   // 4 individual req lines
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!isEditing) return;
    getJob(id)
      .then(res => {
        setForm(res.data);
        setReqs(parseReqs(res.data.requirements));
      })
      .catch(() => setError('Failed to load job.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle one of the 4 requirement lines changing
  const handleReqChange = (index, value) => {
    const capped = capFourWords(value);
    setReqs(prev => {
      const next = [...prev];
      next[index] = capped;
      return next;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    // Merge the 4 req lines back into the form payload
    const payload = {
      ...form,
      requirements: reqs.filter(Boolean).join('\n'),
    };
    try {
      if (isEditing) {
        await updateJob(id, payload);
      } else {
        await createJob(payload);
      }
      navigate('/admin/jobs');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 style={{ color: '#1B3D2F', marginBottom: '24px' }}>
        {isEditing ? 'Edit Job' : 'Create New Job'}
      </h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.card}>
        {/* Title & Location */}
        {[
          { label: 'Title *',    name: 'title',    required: true },
          { label: 'Location *', name: 'location', required: true },
        ].map(f => (
          <Field key={f.name} label={f.label}>
            <input
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              required={f.required}
              style={styles.input}
            />
          </Field>
        ))}

        {/* Job Type */}
        <Field label="Job Type *">
          <select name="job_type" value={form.job_type} onChange={handleChange} style={styles.input}>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </Field>

        {/* Salary Range — optional */}
        <Field label="Salary Range (optional)">
          <input
            name="salary_range"
            value={form.salary_range}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. R20 000 – R30 000/month"
          />
        </Field>

        {/* Application Deadline */}
        <Field label="Application Deadline *">
          <input
            type="date"
            name="application_deadline"
            value={form.application_deadline}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </Field>

        {/* Description */}
        <Field label="Description *">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            style={{ ...styles.input, resize: 'vertical' }}
          />
        </Field>

        {/* Requirements — 4 individual lines, max 4 words each */}
        <Field label="Requirements">
          <div style={styles.reqsWrapper}>
            {reqs.map((req, i) => (
              <div key={i} style={styles.reqRow}>
                <span style={styles.reqNum}>{i + 1}</span>
                <input
                  value={req}
                  onChange={e => handleReqChange(i, e.target.value)}
                  placeholder={`Requirement ${i + 1} (max 4 words)`}
                  style={styles.input}
                />
                {/* Word counter */}
                <span style={{
                  ...styles.wordCount,
                  color: req.trim().split(/\s+/).filter(Boolean).length >= 4 ? '#c0392b' : '#999',
                }}>
                  {req.trim() === '' ? 0 : req.trim().split(/\s+/).filter(Boolean).length}/4
                </span>
              </div>
            ))}
          </div>
        </Field>

        {/* Responsibilities & Benefits */}
        {['responsibilities', 'benefits'].map(name => (
          <Field key={name} label={name.charAt(0).toUpperCase() + name.slice(1)}>
            <textarea
              name={name}
              value={form[name]}
              onChange={handleChange}
              rows={4}
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </Field>
        ))}

        {/* Active toggle */}
        <Field label="">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            Active (visible to job-seekers)
          </label>
        </Field>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Job'}
          </button>
          <button type="button" onClick={() => navigate('/admin/jobs')} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && <label style={styles.label}>{label}</label>}
    {children}
  </div>
);

const styles = {
  card:       { background: '#fff', padding: '32px', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', maxWidth: '700px' },
  label:      { display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '5px', fontWeight: 500 },
  input:      { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' },
  saveBtn:    { background: '#1B3D2F', color: '#fff', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn:  { background: '#eee', color: '#333', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  error:      { color: '#c0392b', marginBottom: '14px', background: '#fdecea', padding: '10px', borderRadius: '6px' },
  reqsWrapper:{ display: 'flex', flexDirection: 'column', gap: '10px' },
  reqRow:     { display: 'flex', alignItems: 'center', gap: '10px' },
  reqNum:     { minWidth: '20px', fontSize: '0.85rem', color: '#888', fontWeight: 600, textAlign: 'right' },
  wordCount:  { minWidth: '28px', fontSize: '0.78rem', fontWeight: 600, textAlign: 'right' },
};