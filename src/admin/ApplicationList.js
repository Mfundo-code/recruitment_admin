import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplications } from './api';

const STATUS_COLORS = {
  pending:     '#e67e22',
  reviewed:    '#2980b9',
  shortlisted: '#27ae60',
  rejected:    '#c0392b',
  hired:       '#8e44ad',
};

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = (status = '') => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    getApplications(params)
      .then(res => setApplications(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = e => {
    setStatusFilter(e.target.value);
    load(e.target.value);
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1B3D2F', margin: 0 }}>Applications</h1>
        <select value={statusFilter} onChange={handleStatusChange} style={styles.select}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </div>

      {loading ? <p>Loading…</p> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Applicant</th>
                <th style={styles.th}>Job</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date Applied</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No applications found.</td></tr>
              )}
              {applications.map(app => (
                <tr key={app.id} style={styles.row}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 500 }}>{app.full_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{app.email}</div>
                  </td>
                  <td style={styles.td}>{app.job_title}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: STATUS_COLORS[app.status] ?? '#999' }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(app.application_date).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <Link to={`/admin/applications/${app.id}`} style={styles.viewLink}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  select:    { padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', overflow: 'hidden' },
  table:     { width: '100%', borderCollapse: 'collapse' },
  thead:     { background: '#1B3D2F' },
  th:        { color: '#F2F2EE', padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem' },
  row:       { borderBottom: '1px solid #f0f0f0' },
  td:        { padding: '12px 14px', fontSize: '0.9rem', color: '#333' },
  badge:     { color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-block' },
  viewLink:  { color: '#1B3D2F', textDecoration: 'none', fontWeight: 500 },
};