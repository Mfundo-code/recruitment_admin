// src/Components/ServicesHero.js
import React from "react";

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const ServicesHero = () => {
  return (
    <section className="services-hero">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <span className="hero-preheadline">Our Core Services</span>
        <h1 className="hero-headline">
          Recruitment Solutions for Key Industries <br />
          <span className="hero-accent">Tailored to Your Growth</span>
        </h1>
        <p className="hero-subheadline">
          Specializing in Engineering, Construction, Mining, FMCG, Architecture,
          Supply Chain, and Logistics — we deliver Executive Search, Temporary
          Staffing, Permanent Placement, and Background Verification. Our
          end‑to‑end solutions are designed to align the right talent with your
          unique opportunities.
        </p>
        <div className="hero-cta-group">
          <button className="hero-cta-primary">
            Explore Services <span className="hero-arrow">→</span>
          </button>
          <button className="hero-cta-secondary">Talk to an Expert</button>
        </div>
      </div>
      <div className="hero-bottom-accent"></div>

      <style jsx>{`
        .services-hero {
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(27,61,47,0.92) 0%, rgba(10,30,18,0.88) 100%);
          z-index: 1;
        }
        .hero-container {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 2px 5px; /* Reduced from 120px 20px 40px to 60px 20px 20px */
          text-align: center;
          color: #F2F2EE;
        }
        .hero-preheadline {
          display: inline-block;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #C9A53A;
          margin-bottom: 1rem;
          border-left: 3px solid #C9A53A;
          padding-left: 12px;
        }
        .hero-headline {
          font-size: clamp(36px, 5.5vw, 52px);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 16px;
          color: #F2F2EE;
        }
        .hero-accent {
          color: #3DBE5C;
          border-bottom: 3px solid #C9A53A;
          display: inline-block;
          padding-bottom: 4px;
        }
        .hero-subheadline {
          font-size: clamp(16px, 2vw, 18px);
          color: #c8d5c8;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 28px;
        }
        .hero-cta-group {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-cta-primary {
          background: #C9A53A;
          border: none;
          border-radius: 4px;
          padding: 14px 32px;
          color: #1B3D2F;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 10px 20px rgba(201,165,58,0.30);
        }
        .hero-cta-primary:hover {
          background: #b8922e;
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(201,165,58,0.42);
        }
        .hero-cta-secondary {
          background: transparent;
          border: 2px solid #C9A53A;
          border-radius: 4px;
          padding: 12px 28px;
          color: #C9A53A;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hero-cta-secondary:hover {
          background: rgba(201,165,58,0.10);
          transform: translateY(-2px);
        }
        .hero-arrow {
          font-size: 18px;
          line-height: 1;
        }
        .hero-bottom-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #C9A53A, transparent);
          z-index: 2;
        }
        @media (max-width: 600px) {
          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }
          .hero-cta-primary,
          .hero-cta-secondary {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default ServicesHero;