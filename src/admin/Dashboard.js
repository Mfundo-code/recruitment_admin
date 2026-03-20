import React, { useEffect, useState } from 'react';
import { getStats } from './api';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  green:  '#1B3D2F',
  mid:    '#2d6649',
  gold:   '#C9A53A',
  light:  '#F2F2EE',
  orange: '#e67e22',
  blue:   '#2980b9',
  purple: '#8e44ad',
  red:    '#c0392b',
  teal:   '#16a085',
};

const STATUS_COLOR = {
  pending:     C.orange,
  reviewed:    C.blue,
  shortlisted: C.mid,
  rejected:    C.red,
  hired:       C.purple,
};

const PIE_COLORS = [C.mid, C.gold, C.orange, C.blue, C.purple, C.red];

// ── Reusable card ─────────────────────────────────────────────────────────────
const Card = ({ title, children, span = 1 }) => (
  <div style={{ ...s.card, gridColumn: `span ${span}` }}>
    {title && <h3 style={s.cardTitle}>{title}</h3>}
    {children}
  </div>
);

// ── Stat pill ─────────────────────────────────────────────────────────────────
const StatPill = ({ label, value, color, icon }) => (
  <div style={{ ...s.pill, borderTop: `4px solid ${color}` }}>
    <span style={s.pillIcon}>{icon}</span>
    <p style={{ ...s.pillValue, color }}>{value ?? '–'}</p>
    <p style={s.pillLabel}>{label}</p>
  </div>
);

// ── Custom tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={s.tooltip}>
      <p style={{ margin: '0 0 4px', fontWeight: 600, color: C.green }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0', color: p.color, fontSize: '0.82rem' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Custom pie label ──────────────────────────────────────────────────────────
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load stats.'));
  }, []);

  if (error) return <p style={{ color: C.red }}>{error}</p>;
  if (!stats) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: C.mid, marginTop: 12 }}>Loading analytics…</p>
    </div>
  );

  // Format date labels e.g. "Mar 14"
  const fmtDate = d => {
    const [, m, day] = d.split('-');
    const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[+m]} ${+day}`;
  };

  const visitsData    = stats.visits_chart.map(r => ({ ...r, date: fmtDate(r.date) }));
  const jobViewsData  = stats.job_views_chart.map(r => ({ ...r, date: fmtDate(r.date) }));
  const appsStatus    = stats.applications_by_status.map(r => ({
    name:  r.status.charAt(0).toUpperCase() + r.status.slice(1),
    value: r.count,
    color: STATUS_COLOR[r.status] ?? '#999',
  }));
  const topJobs       = [...(stats.top_jobs_by_views ?? [])].reverse(); // recharts renders bottom-up
  const msgPie        = stats.messages_pie;
  const appsPie       = stats.applications_pie;

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Dashboard</h1>
          <p style={s.pageSubtitle}>Live analytics & recruitment overview</p>
        </div>
        <div style={s.refreshBtn} onClick={() => window.location.reload()} title="Refresh">
          ↻ Refresh
        </div>
      </div>

      {/* ── Summary pills ───────────────────────────────────────────────── */}
      <div style={s.pillGrid}>
        <StatPill icon="🌐" label="Total Site Visits"    value={stats.total_visits}         color={C.teal}   />
        <StatPill icon="👁️"  label="Total Job Views"     value={stats.total_job_views}       color={C.blue}   />
        <StatPill icon="✅"  label="Active Jobs"         value={stats.active_jobs}           color={C.mid}    />
        <StatPill icon="💼"  label="Total Jobs"          value={stats.total_jobs}            color={C.green}  />
        <StatPill icon="📋"  label="Total Applications"  value={stats.total_applications}    color={C.gold}   />
        <StatPill icon="⏳"  label="Pending"             value={stats.pending_applications}  color={C.orange} />
        <StatPill icon="✉️"  label="Unread Messages"     value={stats.unread_messages}       color={C.purple} />
      </div>

      {/* ── Charts grid ─────────────────────────────────────────────────── */}
      <div style={s.grid}>

        {/* 1. Site visits — Line chart spanning 2 cols */}
        <Card title="🌐 Site Visits — Last 7 Days" span={2}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={visitsData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="home"    name="Home Page"    stroke={C.teal}  strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="careers" name="Careers Page" stroke={C.gold}  strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 2. Job views — Bar chart */}
        <Card title="👁️ Job Views — Last 7 Days" span={2}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={jobViewsData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="views" name="Views" fill={C.mid} radius={[4, 4, 0, 0]}>
                {jobViewsData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? C.mid : C.green} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 3. Applications by status — Pie */}
        <Card title="📋 Applications by Status">
          {appsStatus.length === 0 ? (
            <p style={s.empty}>No applications yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={appsStatus}
                    cx="50%" cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                  >
                    {appsStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={s.legend}>
                {appsStatus.map((e, i) => (
                  <span key={i} style={s.legendItem}>
                    <span style={{ ...s.legendDot, background: e.color }} />
                    {e.name} ({e.value})
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* 4. Messages read/unread — Pie */}
        <Card title="✉️ Messages Overview">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={msgPie}
                cx="50%" cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={PieLabel}
              >
                {msgPie.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? C.mid : C.gold} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={s.legend}>
            {msgPie.map((e, i) => (
              <span key={i} style={s.legendItem}>
                <span style={{ ...s.legendDot, background: i === 0 ? C.mid : C.gold }} />
                {e.label} ({e.value})
              </span>
            ))}
          </div>
        </Card>

        {/* 5. Applications viewed/pending — Pie */}
        <Card title="⏳ Applications Reviewed vs Pending">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={appsPie}
                cx="50%" cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={PieLabel}
              >
                {appsPie.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? C.teal : C.orange} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={s.legend}>
            {appsPie.map((e, i) => (
              <span key={i} style={s.legendItem}>
                <span style={{ ...s.legendDot, background: i === 0 ? C.teal : C.orange }} />
                {e.label} ({e.value})
              </span>
            ))}
          </div>
        </Card>

        {/* 6. Top jobs by views — Horizontal bar spanning 2 cols */}
        <Card title="🔥 Top Jobs by Views" span={2}>
          {topJobs.length === 0 ? (
            <p style={s.empty}>No job views recorded yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(160, topJobs.length * 48)}>
              <BarChart
                layout="vertical"
                data={topJobs}
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="title" width={160} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="view_count" name="Views" fill={C.gold} radius={[0, 4, 4, 0]}>
                  {topJobs.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  pageHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  pageTitle:    { color: C.green, margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 700 },
  pageSubtitle: { color: '#888', margin: 0, fontSize: '0.85rem' },
  refreshBtn:   { background: C.green, color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 },

  pillGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: 14,
    marginBottom: 24,
  },
  pill:      { background: '#fff', borderRadius: 10, padding: '18px 14px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.07)' },
  pillIcon:  { fontSize: '1.4rem' },
  pillValue: { fontSize: '2rem', fontWeight: 800, margin: '6px 0 2px' },
  pillLabel: { color: '#888', fontSize: '0.75rem', margin: 0, lineHeight: 1.3 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
  },
  card:      { background: '#fff', borderRadius: 12, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,.08)' },
  cardTitle: { color: C.green, margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700 },

  tooltip: { background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,.1)' },

  legend:     { display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10, justifyContent: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: '#555' },
  legendDot:  { width: 10, height: 10, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },

  empty: { color: '#aaa', textAlign: 'center', padding: '30px 0', margin: 0, fontSize: '0.9rem' },

  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 },
  spinner: {
    width: 36, height: 36, borderRadius: '50%',
    border: `4px solid ${C.light}`,
    borderTop: `4px solid ${C.gold}`,
    animation: 'spin 0.8s linear infinite',
  },
};

// Inject spinner keyframes once
if (typeof document !== 'undefined' && !document.getElementById('dash-spin')) {
  const style = document.createElement('style');
  style.id = 'dash-spin';
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}