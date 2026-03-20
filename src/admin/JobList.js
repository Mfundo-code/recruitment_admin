import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, deleteJob } from './api';

export default function JobList() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getJobs()
      .then(res => setJobs(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this job posting?')) return;
    await deleteJob(id);
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1B3D2F', margin: 0 }}>Job Postings</h1>
        <Link to="/admin/jobs/new" style={styles.newBtn}>+ New Job</Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Deadline</th>
              <th style={styles.th}>Active</th>
              <th style={styles.th}>Apps</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No jobs yet.</td></tr>
            )}
            {jobs.map(job => (
              <tr key={job.id} style={styles.row}>
                <td style={styles.td}>{job.title}</td>
                <td style={styles.td}>{job.location}</td>
                <td style={styles.td}>{job.job_type.replace('_', ' ')}</td>
                <td style={styles.td}>{job.application_deadline}</td>
                <td style={styles.td}>{job.is_active ? '✅' : '❌'}</td>
                <td style={styles.td}>{job.application_count ?? '–'}</td>
                <td style={styles.td}>
                  <Link to={`/admin/jobs/${job.id}`}       style={styles.actionLink}>View</Link>
                  <Link to={`/admin/jobs/${job.id}/edit`}  style={styles.actionLink}>Edit</Link>
                  <Link to={`/admin/jobs/${job.id}/template`} style={styles.actionLink}>Template</Link>
                  <button onClick={() => handleDelete(job.id)} style={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  newBtn:    { background: '#1B3D2F', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.95rem' },
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', overflow: 'hidden' },
  table:     { width: '100%', borderCollapse: 'collapse' },
  thead:     { background: '#1B3D2F' },
  th:        { color: '#F2F2EE', padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem' },
  row:       { borderBottom: '1px solid #f0f0f0' },
  td:        { padding: '12px 14px', fontSize: '0.9rem', color: '#333' },
  actionLink:{ marginRight: '10px', color: '#1B3D2F', textDecoration: 'none', fontWeight: 500 },
  deleteBtn: { background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' },
};