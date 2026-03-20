import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveToken } from './api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(username, password);
      // Store the JWT – this is how ProtectedRoute knows you're in
      saveToken(data.access, data.refresh, data.username);
      navigate('/admin', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page:  { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#F2F2EE' },
  card:  { background: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,.12)', width: '320px', display: 'flex', flexDirection: 'column' },
  title: { color: '#1B3D2F', marginBottom: '28px', textAlign: 'center' },
  label: { fontSize: '0.85rem', color: '#555', marginBottom: '4px' },
  input: { padding: '11px 12px', marginBottom: '18px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', outline: 'none' },
  error: { color: '#c0392b', marginBottom: '12px', fontSize: '0.9rem' },
  btn:   { padding: '12px', background: '#1B3D2F', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '4px' },
};