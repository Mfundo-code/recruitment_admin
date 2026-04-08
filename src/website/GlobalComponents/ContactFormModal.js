// src/GlobalComponents/ContactFormModal.js
import React, { useState, useEffect } from "react";

/**
 * ContactFormModal
 *
 * Props:
 *   isOpen  {bool}   – controls visibility in modal mode
 *   onClose {func}   – called when overlay or ✕ is clicked
 *   inline  {bool}   – when true, renders as a plain card (no overlay, no close btn)
 *                      use this on the Contact page so the form is always visible
 */
const ContactFormModal = ({ isOpen, onClose, inline = false }) => {
  const [formData, setFormData]         = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [visible, setVisible]           = useState(false);
  const [emailSent, setEmailSent]       = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else {
      setVisible(false);
      // Reset email-sent state when modal closes
      setTimeout(() => setEmailSent(false), 400);
    }
  }, [isOpen]);

  const API_URL = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000/api/contact/'
    : 'https://www.zwiko.co.za/api/contact/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all fields.' });
      setIsSubmitting(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEmailSent(true);
        setSubmitStatus({
          type: 'success',
          message: `Confirmation email sent to ${formData.email}`,
        });
        setFormData({ name: '', email: '', message: '' });
        if (!inline) setTimeout(() => { setVisible(false); setTimeout(onClose, 400); }, 3200);
      } else {
        const err = await response.json().catch(() => ({}));
        let msg = 'Something went wrong. Please try again.';
        if (response.status === 400) {
          const k = Object.keys(err)[0];
          if (k) msg = `${k}: ${Array.isArray(err[k]) ? err[k][0] : err[k]}`;
        } else if (response.status === 500) {
          msg = 'Server error — your message was saved but the confirmation email could not be delivered. We will still be in touch.';
        }
        setSubmitStatus({ type: 'error', message: msg });
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'Network error. Check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldStyle = (name) => ({
    width: '100%',
    padding: '14px 16px',
    background: focusedField === name ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
    border: `1.5px solid ${focusedField === name ? 'rgba(52,152,219,0.8)' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#f0f0f0',
    outline: 'none',
    transition: 'all 0.25s ease',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
    caretColor: '#3498db',
  });

  // ── Success screen (shown after email is confirmed sent) ──────────────────
  const SuccessScreen = (
    <div style={{
      padding: '40px 32px 44px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      {/* Animated checkmark ring */}
      <div style={{ position: 'relative', width: 72, height: 72, marginBottom: 24 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(61,190,92,0.12)',
          border: '2px solid rgba(61,190,92,0.3)',
          animation: 'successPulse 1.8s ease-out infinite',
        }} />
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1B3D2F, #3DBE5C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', position: 'relative',
        }}>
          ✓
        </div>
      </div>

      <h3 style={{
        margin: '0 0 10px',
        fontSize: '1.5rem', fontWeight: 700,
        fontFamily: "'Playfair Display', serif",
        background: 'linear-gradient(135deg, #ffffff 30%, #a8c8e8 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        Message Sent!
      </h3>

      <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
        We've received your message and will get back to you within <strong style={{ color: 'rgba(255,255,255,0.75)' }}>24 hours</strong>.
      </p>

      {/* Email confirmation badge */}
      <div style={{
        marginTop: 20,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(61,190,92,0.1)',
        border: '1px solid rgba(61,190,92,0.25)',
        borderRadius: '10px',
        padding: '10px 16px',
        maxWidth: '100%',
      }}>
        <span style={{ fontSize: '1rem' }}>📧</span>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#3DBE5C', fontWeight: 600, wordBreak: 'break-all' }}>
          Confirmation email sent to {submitStatus?.message?.replace('Confirmation email sent to ', '') || ''}
        </p>
      </div>

      <p style={{ margin: '18px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.2)' }}>
        🔒 Your information is safe with us
      </p>
    </div>
  );

  // ── The inner card content ────────────────────────────────────────────────
  const Card = (
    <div style={{
      background: 'linear-gradient(145deg, #0f1923 0%, #162030 50%, #0f1923 100%)',
      borderRadius: '20px',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      width: '100%',
      boxShadow: inline
        ? '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)'
        : '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
      animation: (!inline && visible) ? 'contactSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
      position: 'relative',
    }}>
      {/* Shimmer top bar */}
      <div style={{
        height: 4,
        background: 'linear-gradient(90deg, #1B3D2F, #3DBE5C, #3498db, #C9A53A)',
        backgroundSize: '200% auto',
        animation: 'shimmer 3s linear infinite',
      }} />

      {/* Show success screen OR form */}
      {emailSent ? SuccessScreen : (
        <>
          {/* Header */}
          <div style={{ padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              {/* Pulsing online dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ position: 'relative', width: 10, height: 10 }}>
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: '#3DBE5C',
                    animation: 'pulse-ring 1.4s ease-out infinite',
                    border: '2px solid #3DBE5C',
                  }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3DBE5C', position: 'relative' }} />
                </div>
                <span style={{ color: '#3DBE5C', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  We're Online
                </span>
              </div>
              <h3 style={{
                margin: 0, fontSize: '1.75rem', fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                background: 'linear-gradient(135deg, #ffffff 30%, #a8c8e8 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1.2,
              }}>
                Get In Touch
              </h3>
              <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                We respond within 24 hours
              </p>
            </div>

            {/* Close button — only in modal mode */}
            {!inline && (
              <button
                className="contact-close"
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: 'rgba(255,255,255,0.5)',
                  width: 36, height: 36, cursor: 'pointer', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', flexShrink: 0, marginTop: 4,
                }}
              >✕</button>
            )}
          </div>

          {/* Divider */}
          <div style={{ margin: '20px 32px 0', height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '24px 32px 32px' }}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 7, color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Your Name
              </label>
              <input className="contact-input" type="text" name="name" value={formData.name}
                onChange={handleInputChange} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                style={fieldStyle('name')} placeholder="John Doe" disabled={isSubmitting} required />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 7, color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input className="contact-input" type="email" name="email" value={formData.email}
                onChange={handleInputChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                style={fieldStyle('email')} placeholder="john@example.com" disabled={isSubmitting} required />
            </div>

            {/* Message */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 7, color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Message
              </label>
              <textarea className="contact-input" name="message" value={formData.message}
                onChange={handleInputChange} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                style={{ ...fieldStyle('message'), minHeight: 120, resize: 'vertical' }}
                placeholder="How can we help you?" disabled={isSubmitting} required />
            </div>

            {/* Submit */}
            <button type="submit" className="contact-submit" disabled={isSubmitting} style={{
              width: '100%', padding: '15px',
              background: isSubmitting ? 'rgba(52,152,219,0.4)' : 'linear-gradient(135deg, #1B3D2F 0%, #2d6649 50%, #3498db 100%)',
              color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.25s ease',
              boxShadow: '0 6px 20px rgba(52,152,219,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {isSubmitting ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.7s linear infinite' }} />
                  Sending…
                </>
              ) : <>✉ Send Message</>}
            </button>

            {/* Error status only — success is handled by SuccessScreen */}
            {submitStatus && submitStatus.type === 'error' && (
              <div style={{
                marginTop: 16, padding: '13px 16px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 500,
                display: 'flex', alignItems: 'flex-start', gap: 8,
                background: 'rgba(231,76,60,0.12)',
                color: '#e74c3c',
                border: '1px solid rgba(231,76,60,0.25)',
              }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠</span>
                {submitStatus.message}
              </div>
            )}
          </form>

          {/* Footer */}
          <div style={{ padding: '0 32px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
            <span>🔒</span><span>Your information is safe with us</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        .contact-input::placeholder { color: rgba(255,255,255,0.3); }
        .contact-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(52,152,219,0.45) !important; }
        .contact-submit:active { transform: translateY(0); }
        .contact-close:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
        @keyframes contactSlideUp { from { opacity:0; transform:translateY(30px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes pulse-ring { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(1.35); opacity:0; } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes successPulse { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(1.5); opacity:0; } }
      `}</style>

      {inline ? (
        // ── Inline mode: just the card, sits in the page flow ──────────────
        Card
      ) : (
        // ── Modal mode: card inside a fixed blurred overlay ─────────────────
        (!isOpen ? null : (
          <div onClick={emailSent ? undefined : onClose} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,10,20,0.75)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease',
          }}>
            <div onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: 480 }}>
              {Card}
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default ContactFormModal;