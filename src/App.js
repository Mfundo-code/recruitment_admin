import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'; // ✅ useLocation imported
import { getToken } from './admin/api';

// Website components
import ScrollToTop from './website/GlobalComponents/ScrollToTop';
import Header from './website/GlobalComponents/Header';
import Footer from './website/GlobalComponents/Footer';
import Home from './website/pages/Home/Home';
import About from './website/pages/About/About';
import Careers from './website/pages/Careers/Careers';
import Projects from './website/pages/Projects/Projects';
import Services from './website/pages/Services/Services';
import Contacts from './website/pages/Contacts/Contacts';

// Admin components
import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import JobList from './admin/JobList';
import JobForm from './admin/JobForm';
import JobDetail from './admin/JobDetail';
import ApplicationList from './admin/ApplicationList';
import ApplicationDetail from './admin/ApplicationDetail';
import ContactList from './admin/ContactList';
import JobTemplateGenerator from './admin/JobTemplateGenerator';

const ProtectedRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/admin/login" replace />;
};

// ✅ Website layout component (needs useLocation, so it's defined inside the router context)
const WebsiteLayout = () => {
  const location = useLocation(); // ✅ now defined
  const hideFooter = location.pathname === '/contact';

  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ padding: 0, margin: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contacts />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website – all routes except /admin/* */}
        <Route path="/*" element={<WebsiteLayout />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected admin area */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="jobs/new" element={<JobForm />} />
          <Route path="jobs/:id/edit" element={<JobForm />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="jobs/:id/template" element={<JobTemplateGenerator />} />
          <Route path="applications" element={<ApplicationList />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="messages" element={<ContactList />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 40 }}>404 – Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;