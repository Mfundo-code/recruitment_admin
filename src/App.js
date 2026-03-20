import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './admin/api';

import AdminLayout        from './admin/AdminLayout';
import Login              from './admin/Login';
import Dashboard          from './admin/Dashboard';
import JobList            from './admin/JobList';
import JobForm            from './admin/JobForm';
import JobDetail          from './admin/JobDetail';
import ApplicationList    from './admin/ApplicationList';
import ApplicationDetail  from './admin/ApplicationDetail';
import ContactList        from './admin/ContactList';
import JobTemplateGenerator from './admin/JobTemplateGenerator';

/**
 * ProtectedRoute – checks for a JWT in localStorage.
 * No async call needed: if the token is present the user is logged in.
 * The axios interceptor in api.js handles the case where the token has expired
 * by silently refreshing it, and redirects to /admin/login on failure.
 */
const ProtectedRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect bare root to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Login page – no protection */}
        <Route path="/admin/login" element={<Login />} />

        {/* All admin pages – protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index                           element={<Dashboard />} />
          <Route path="jobs"                     element={<JobList />} />
          <Route path="jobs/new"                 element={<JobForm />} />
          <Route path="jobs/:id/edit"            element={<JobForm />} />
          <Route path="jobs/:id"                 element={<JobDetail />} />
          <Route path="jobs/:id/template"        element={<JobTemplateGenerator />} />
          <Route path="applications"             element={<ApplicationList />} />
          <Route path="applications/:id"         element={<ApplicationDetail />} />
          <Route path="messages"                 element={<ContactList />} />
        </Route>

        <Route path="*" element={<div style={{ padding: 40 }}>404 – Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}