import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { clearToken, getUsername } from './api';

const NAV = [
  { to: '/admin',              label: '📊 Dashboard' },
  { to: '/admin/jobs',         label: '💼 Jobs' },
  { to: '/admin/applications', label: '📋 Applications' },
  { to: '/admin/messages',     label: '✉️  Messages' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = getUsername();

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div style={styles.shell}>

      {/* ── Sidebar — fixed, never scrolls ── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <h2 style={styles.brand}>Admin Panel</h2>
          <p style={styles.user}>👤 {username}</p>
          <nav style={styles.nav}>
            {NAV.map(({ to, label }) => {
              const active =
                location.pathname === to ||
                (to !== '/admin' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  style={{ ...styles.link, ...(active ? styles.activeLink : {}) }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout pinned to bottom-left */}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      {/* ── Main content — offset by sidebar width, scrolls independently ── */}
      <main style={styles.main}>
        <Outlet />
      </main>

    </div>
  );
}

const SIDEBAR_W = 230;

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
  },

  sidebar: {
    position:        'fixed',       /* ← stays put while main scrolls */
    top:             0,
    left:            0,
    width:           SIDEBAR_W,
    height:          '100vh',       /* full viewport height */
    background:      '#1B3D2F',
    color:           '#F2F2EE',
    padding:         '24px 16px',
    display:         'flex',
    flexDirection:   'column',
    justifyContent:  'space-between', /* top content vs logout at bottom */
    boxSizing:       'border-box',
    zIndex:          100,
    overflowY:       'auto',         /* in case nav grows very long */
  },

  sidebarTop: {
    display:       'flex',
    flexDirection: 'column',
  },

  brand:  { color: '#C9A53A', marginBottom: '4px', fontSize: '1.2rem' },
  user:   { color: '#aaa', fontSize: '0.8rem', marginBottom: '28px' },
  nav:    { display: 'flex', flexDirection: 'column', gap: '4px' },

  link: {
    color:          '#F2F2EE',
    textDecoration: 'none',
    padding:        '9px 12px',
    borderRadius:   '6px',
    fontSize:       '0.95rem',
    display:        'block',
  },
  activeLink: {
    background: 'rgba(255,255,255,0.15)',
    fontWeight: 600,
  },

  logoutBtn: {
    background:   'transparent',
    border:       '1.5px solid #C9A53A',
    color:        '#C9A53A',
    padding:      '9px 12px',
    borderRadius: '6px',
    cursor:       'pointer',
    fontSize:     '0.9rem',
    width:        '100%',
    textAlign:    'left',
  },

  main: {
    marginLeft:  SIDEBAR_W,          /* ← pushes content past the fixed sidebar */
    flex:        1,
    background:  '#F2F2EE',
    padding:     '32px',
    minHeight:   '100vh',
    boxSizing:   'border-box',
    overflowY:   'auto',
  },
};