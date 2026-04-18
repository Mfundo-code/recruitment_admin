// src/Components/AdvertisingSection.js
import React, { useState } from "react";
import ContactFormModal from "../../../GlobalComponents/ContactFormModal";

const AdvertisingSection = () => {
  const [showContactForm, setShowContactForm] = useState(false);

  const features = [
    "98% Long‑Term Retention",
    "100% Verified Credentials",
    "Industry‑Specific Expertise",
    "95% Client Satisfaction"
  ];

  return (
    <section className="ad-container">
      <div className="ad-content">

        <div className="ad-text-section">
          <h2 className="ad-title">
            Aligning the Right Talent with The{" "}
            <span className="highlight">Right Opportunities</span>
          </h2>
          <p className="ad-description">
            With deep expertise in Engineering, Construction, Mining, FMCG,
            Architecture, Supply Chain, and Logistics, we go beyond matching
            resumes to job descriptions. We focus on cultural fit and long‑term
            success delivering recruitment solutions that create lasting value.
          </p>
        </div>

        <div className="ad-card-section">
          <div className="ad-feature-card">
            <div className="ad-features">
              {features.map((feature, index) => (
                <div key={index} className="ad-feature-item">
                  <span className="ad-checkmark">✓</span>
                  <span className="ad-feature-text">{feature}</span>
                </div>
              ))}
            </div>
            <button className="ad-cta-button" onClick={() => setShowContactForm(true)}>
              Get Free Consultation
            </button>
          </div>
        </div>

      </div>

      <ContactFormModal isOpen={showContactForm} onClose={() => setShowContactForm(false)} />

      <style jsx>{`
        .ad-container {
          min-height: 400px;
          background: #F2F2EE;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        }

        .ad-content {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
        }

        .ad-text-section {
          flex: 1;
          max-width: 600px;
        }

        .ad-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 1.5rem 0;
          line-height: 1.2;
          color: #1B3D2F;
        }

        .highlight {
          color: #3DBE5C;
          border-bottom: 3px solid #C9A53A;
          display: inline-block;
          padding-bottom: 4px;
        }

        .ad-description {
          font-size: 1.2rem;
          line-height: 1.6;
          margin: 0;
          color: #4a6358;
        }

        .ad-card-section {
          flex: 0 0 auto;
          width: 100%;
          max-width: 400px;
        }

        .ad-feature-card {
          background: #fff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(27,61,47,0.12);
          width: 100%;
          text-align: center;
          border-bottom: 4px solid #C9A53A;
        }

        .ad-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .ad-feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }

        .ad-checkmark {
          color: #3DBE5C;
          font-weight: bold;
          font-size: 1.3rem;
          min-width: 20px;
        }

        .ad-feature-text {
          font-size: 1rem;
          color: #1B3D2F;
          text-align: left;
          font-weight: 500;
        }

        .ad-cta-button {
          background: linear-gradient(135deg, #C9A53A 0%, #1B3D2F 100%);
          color: #F2F2EE;
          border: none;
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(201,165,58,0.30);
          width: 100%;
        }

        .ad-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201,165,58,0.50);
          background: linear-gradient(135deg, #1B3D2F 0%, #C9A53A 100%);
        }

        @media (max-width: 968px) {
          .ad-content { flex-direction: column; text-align: center; gap: 2rem; }
          .ad-text-section { text-align: center; max-width: 100%; }
          .ad-card-section { max-width: 500px; width: 100%; margin: 0 auto; }
        }

        @media (max-width: 768px) {
          .ad-container { padding: 2rem 1rem; min-height: auto; }
          .ad-feature-card { padding: 1.5rem; }
          .ad-title { font-size: 2rem; margin-bottom: 1rem; }
          .ad-description { font-size: 1rem; }
        }

        @media (max-width: 480px) {
          .ad-container { padding: 1.5rem 0.75rem; }
          .ad-feature-card { padding: 1.25rem; }
          .ad-title { font-size: 1.8rem; margin-bottom: 0.8rem; }
          .ad-feature-item { gap: 0.8rem; padding: 0.4rem 0; }
          .ad-feature-text { font-size: 0.9rem; }
          .ad-cta-button { padding: 12px 24px; font-size: 1rem; }
        }
      `}</style>
    </section>
  );
};

export default AdvertisingSection;