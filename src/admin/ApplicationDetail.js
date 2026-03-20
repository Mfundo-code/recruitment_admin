import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApplication, updateApplication, downloadCV } from './api';

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

export default function ApplicationDetail() {
  const { id }              = useParams();
  const [app, setApp]       = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes]   = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  // CV preview state
  const [cvObjectUrl, setCvObjectUrl] = useState(null);
  const [cvMime, setCvMime]           = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [cvLoading, setCvLoading]     = useState(false);
  const [cvError, setCvError]         = useState('');

  useEffect(() => {
    getApplication(id).then(res => {
      setApp(res.data);
      setStatus(res.data.status);
      setNotes(res.data.notes);
    });
    // Cleanup blob URL on unmount
    return () => { if (cvObjectUrl) URL.revokeObjectURL(cvObjectUrl); };
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await updateApplication(id, { status, notes });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = async () => {
    const res = await downloadCV(id);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a   = document.createElement('a');
    a.href    = url;
    a.download = app.cv?.split('/').pop() ?? 'cv.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleReadCV = async () => {
    setCvError('');
    // Re-use already fetched blob
    if (cvObjectUrl) { setShowPreview(true); return; }
    setCvLoading(true);
    try {
      const res  = await downloadCV(id);
      const blob = new Blob([res.data], { type: res.headers['content-type'] ?? 'application/pdf' });
      const mime = blob.type;
      const url  = URL.createObjectURL(blob);
      setCvMime(mime);
      setCvObjectUrl(url);
      setShowPreview(true);
    } catch {
      setCvError('Could not load CV preview.');
    } finally {
      setCvLoading(false);
    }
  };

  const closePreview = () => setShowPreview(false);

  if (!app) return <p>Loading…</p>;

  const cvFilename = app.cv?.split('/').pop() ?? '';
  const isPdf      = cvFilename.toLowerCase().endsWith('.pdf') || cvMime === 'application/pdf';
  const isImage    = /\.(png|jpe?g|gif|webp)$/i.test(cvFilename) || cvMime?.startsWith('image/');

  return (
    <div>
      <Link to="/admin/applications" style={styles.back}>← Back to Applications</Link>
      <h1 style={{ color: '#1B3D2F', margin: '12px 0 24px' }}>{app.full_name}</h1>

      <div style={styles.grid}>
        {/* Info card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Applicant Info</h3>
          <Info label="Email">{app.email}</Info>
          <Info label="Phone">{app.phone}</Info>
          <Info label="Job">{app.job_title}</Info>
          <Info label="Applied">{new Date(app.application_date).toLocaleString()}</Info>
          {app.linkedin_profile && (
            <Info label="LinkedIn">
              <a href={app.linkedin_profile} target="_blank" rel="noopener noreferrer" style={styles.link}>View profile</a>
            </Info>
          )}
          {app.portfolio_url && (
            <Info label="Portfolio">
              <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" style={styles.link}>View portfolio</a>
            </Info>
          )}

          {/* CV Buttons */}
          {app.cv && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handleReadCV} style={styles.readBtn} disabled={cvLoading}>
                {cvLoading ? '⏳ Loading…' : '📄 Read CV'}
              </button>
              <button onClick={handleDownload} style={styles.downloadBtn}>
                ⬇ Download CV
              </button>
            </div>
          )}
          {cvError && <p style={{ color: '#c0392b', fontSize: '0.83rem', marginTop: 8 }}>{cvError}</p>}
        </div>

        {/* Status card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Application Status</h3>
          <label style={styles.label}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={styles.select}>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <label style={{ ...styles.label, marginTop: '16px' }}>Internal Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={5}
            style={styles.textarea}
            placeholder="Add notes about this applicant…"
          />

          <button onClick={handleSave} style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Cover letter */}
      <div style={{ ...styles.card, marginTop: '20px' }}>
        <h3 style={styles.cardTitle}>Cover Letter</h3>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#444' }}>{app.cover_letter}</p>
      </div>

      {/* ── CV Preview Modal ───────────────────────────────────────────── */}
      {showPreview && cvObjectUrl && (
        <div style={styles.overlay} onClick={closePreview}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>📄 {cvFilename}</span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleDownload} style={styles.modalDownloadBtn}>⬇ Download</button>
                <button onClick={closePreview}   style={styles.modalCloseBtn}>✕ Close</button>
              </div>
            </div>

            {/* Modal body */}
            <div style={styles.modalBody}>
              {isPdf && (
                <iframe
                  src={cvObjectUrl}
                  title="CV Preview"
                  style={styles.iframe}
                />
              )}
              {isImage && (
                <img
                  src={cvObjectUrl}
                  alt="CV"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              )}
              {!isPdf && !isImage && (
                <div style={styles.unsupported}>
                  <p style={{ fontSize: '3rem', margin: 0 }}>📎</p>
                  <p style={{ color: '#555', margin: '12px 0 4px' }}>Preview not available for this file type.</p>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 16 }}>{cvFilename}</p>
                  <button onClick={handleDownload} style={styles.downloadBtn}>⬇ Download to view</button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, children }) => (
  <div style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
    <span style={{ width: '100px', color: '#777', fontSize: '0.82rem', flexShrink: 0 }}>{label}</span>
    <span style={{ color: '#222', fontSize: '0.9rem' }}>{children}</span>
  </div>
);

const styles = {
  back:        { color: '#C9A53A', textDecoration: 'none', fontSize: '0.9rem' },
  grid:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card:        { background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)' },
  cardTitle:   { color: '#1B3D2F', marginTop: 0, marginBottom: '16px' },
  link:        { color: '#1B3D2F' },

  readBtn: {
    background: '#1B3D2F', color: '#fff', border: 'none',
    padding: '10px 20px', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.9rem',
  },
  downloadBtn: {
    background: '#2d6649', color: '#fff', border: 'none',
    padding: '10px 20px', borderRadius: '6px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.9rem',
  },

  label:    { display: 'block', fontSize: '0.83rem', color: '#555', marginBottom: '5px', fontWeight: 500 },
  select:   { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box', resize: 'vertical' },
  saveBtn:  { marginTop: '16px', background: '#C9A53A', color: '#1B3D2F', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },

  // Modal
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.65)',
    zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
  },
  modal: {
    background: '#fff',
    borderRadius: 12,
    width: '90vw',
    maxWidth: 900,
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid #eee',
    background: '#1B3D2F',
  },
  modalTitle:       { color: '#F2F2EE', fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  modalDownloadBtn: { background: '#C9A53A', color: '#1B3D2F', border: 'none', padding: '7px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' },
  modalCloseBtn:    { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' },
  modalBody: {
    flex: 1, overflow: 'auto',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f5f5f5',
  },
  iframe: { width: '100%', height: '100%', border: 'none' },
  unsupported: { textAlign: 'center', padding: 40 },
};