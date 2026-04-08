// src/Components/CallToActionSection.js
import React from "react";

const CallToActionSection = () => {
  const handleCall = () => {
    window.location.href = "tel:+27113940990";
  };

  return (
    <section className="cta-container">
      <div className="cta-content">
        {/* Left section - Text content */}
        <div className="cta-text-section">
          <h2 className="cta-title">Ready to Find Your Next Star Performer?</h2>
          <p className="cta-description">
            Whether you need executive leaders, skilled engineers, or temporary
            staffing for your projects, our recruitment experts connect you with
            top talent in Engineering, Construction, Mining, FMCG, Architecture,
            Supply Chain, and Logistics. Let’s discuss how we can help you grow.
          </p>
        </div>

        <div className="cta-spacer"></div>

        {/* Right section - Phone number as button */}
        <div className="cta-contact-section">
          <button
            className="cta-phone-wrapper"
            onClick={handleCall}
            aria-label="Call us at +27 11 394 0990"
          >
            <div className="cta-phone-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="cta-phone-content">
              <div className="cta-call-text">Call Our Team</div>
              <div className="cta-phone-number">+27 11 394 0990</div>
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        /*
          Logo palette:
          --dark-green  : #1B3D2F
          --bright-green: #3DBE5C
          --gold        : #C9A53A
          --dark        : #1C1C1C
          --light-gray  : #F2F2EE
        */

        .cta-container {
          padding: 100px 2rem 5rem;
          background: linear-gradient(135deg, #1B3D2F 0%, #0e2419 100%);
          color: #F2F2EE;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
          position: relative;
          z-index: 1;
        }

        /* Gold accent line at top */
        .cta-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: #C9A53A;
          border-radius: 2px;
        }

        .cta-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .cta-text-section {
          flex: 1;
          min-width: 300px;
          max-width: 65%;
        }

        .cta-spacer {
          width: 5%;
          min-width: 40px;
        }

        .cta-contact-section {
          flex: 0 0 auto;
          min-width: 250px;
        }

        .cta-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 1.5rem 0;
          color: #F2F2EE;
          line-height: 1.2;
        }

        .cta-description {
          font-size: 1.15rem;
          line-height: 1.7;
          margin: 0;
          color: #c8d5c8;
          opacity: 0.9;
        }

        /* Phone button — gold bordered, matches hero CTA style */
        .cta-phone-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 2rem;
          background: rgba(201, 165, 58, 0.08);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          border: 2px solid #C9A53A;
          color: #F2F2EE;
          box-shadow: 0 0 24px rgba(201, 165, 58, 0.15);
          transition: all 0.3s ease;
          cursor: pointer;
          width: 100%;
          text-align: left;
          outline: none;
        }

        .cta-phone-wrapper:hover {
          transform: translateY(-2px);
          background: rgba(201, 165, 58, 0.15);
          box-shadow: 0 0 36px rgba(201, 165, 58, 0.28);
        }

        .cta-phone-wrapper:active {
          transform: translateY(0);
        }

        .cta-phone-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(201, 165, 58, 0.15);
          border-radius: 50%;
          color: #C9A53A;
          flex-shrink: 0;
        }

        .cta-phone-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .cta-call-text {
          font-size: 0.9rem;
          font-weight: 500;
          color: #c8d5c8;
          opacity: 0.85;
        }

        .cta-phone-number {
          font-size: 1.4rem;
          font-weight: 700;
          color: #C9A53A;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .cta-container {
            padding: 90px 1rem 3rem;
          }

          .cta-content {
            flex-direction: column;
            text-align: center;
            gap: 2rem;
          }

          .cta-text-section {
            max-width: 100%;
            text-align: center;
          }

          .cta-title {
            font-size: 2rem;
          }

          .cta-description {
            font-size: 1.05rem;
            padding: 0 1rem;
          }

          .cta-spacer {
            display: none;
          }

          .cta-phone-wrapper {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem;
            margin: 0 auto;
            justify-content: center;
          }

          .cta-phone-content {
            align-items: center;
          }

          .cta-phone-number {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .cta-title {
            font-size: 1.8rem;
          }

          .cta-description {
            font-size: 1rem;
          }

          .cta-phone-wrapper {
            padding: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CallToActionSection;