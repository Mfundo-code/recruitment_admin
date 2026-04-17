import axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000/api'
    : 'https://www.mujiconsulting.co.za/api';

const api = axios.create({ baseURL: BASE_URL });

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken   = ()                      => localStorage.getItem('access_token');
export const saveToken  = (access, refresh, user) => {
  localStorage.setItem('access_token',  access);
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('username',      user);
};
export const clearToken  = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
};
export const getUsername = () => localStorage.getItem('username');

// ── Attach Bearer token ───────────────────────────────────────────────────────
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// ── Silent token refresh on 401 ───────────────────────────────────────────────
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      localStorage.getItem('refresh_token')
    ) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, {
          refresh: localStorage.getItem('refresh_token'),
        });
        localStorage.setItem('access_token', data.access);
        original.headers['Authorization'] = `Bearer ${data.access}`;
        return api(original);
      } catch {
        clearToken();
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (username, password) =>
  api.post('/auth/login/', { username, password });

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getStats = () => api.get('/admin/stats/');

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const getJobs   = (params = {}) => api.get('/admin/jobs/', { params });
export const getJob    = id            => api.get(`/admin/jobs/${id}/`);
export const createJob = data          => api.post('/admin/jobs/', data);
export const updateJob = (id, data)    => api.put(`/admin/jobs/${id}/`, data);
export const deleteJob = id            => api.delete(`/admin/jobs/${id}/`);

// ── Applications ──────────────────────────────────────────────────────────────
export const getApplications   = (filters = {}) => api.get('/admin/applications/', { params: filters });
export const getApplication    = id             => api.get(`/admin/applications/${id}/`);
export const updateApplication = (id, data)     => api.patch(`/admin/applications/${id}/`, data);
export const downloadCV        = id             =>
  api.get(`/admin/applications/${id}/cv/`, { responseType: 'blob' });

// ── Contact ───────────────────────────────────────────────────────────────────
export const getMessages   = ()         => api.get('/admin/contact/');
export const getMessage    = id         => api.get(`/admin/contact/${id}/`);
export const updateMessage = (id, data) => api.patch(`/admin/contact/${id}/`, data);

// ── Analytics tracking (call from public pages) ───────────────────────────────
// Usage: trackVisit('home')  or  trackVisit('careers')
export const trackVisit   = (page = 'home') =>
  axios.post(`${BASE_URL}/track/visit/`, { page }).catch(() => {}); // silent fail

// Usage: trackJobView(jobId)  — call on mount of public job detail page
export const trackJobView = (jobId) =>
  axios.post(`${BASE_URL}/track/job-view/${jobId}/`).catch(() => {}); // silent fail

export default api;