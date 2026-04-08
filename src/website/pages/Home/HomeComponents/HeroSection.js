// src/Components/HeroSection.js
import React, { useState } from "react";
import recruitmentImage from "../../../assets/images/recruitment-team.jpeg";
import ContactFormModal from "../../../GlobalComponents/ContactFormModal";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        style={{
          ...styles.hero,
          backgroundImage: `url(${recruitmentImage})`,
        }}
      >
        {/* Dark overlay — deep dark green tones matching logo */}
        <div style={styles.overlay}></div>

        {/* Content container */}
        <div style={styles.container}>
          <div style={styles.textColumn}>
            <h1 style={styles.headline}>
              Aligning the Right Talent with <br />
              <span style={styles.accent}>The Right Opportunities</span>
            </h1>
            <p style={styles.subheadline}>
              With deep expertise in Engineering, Construction, Mining, FMCG,
              Architecture, Supply Chain, and Logistics, we deliver end-to-end
              recruitment solutions that drive long-term success.
            </p>
            <button
              style={styles.cta}
              aria-label="Schedule a Consultation"
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#C9A53A';
                e.currentTarget.style.color = '#1B3D2F';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#C9A53A';
              }}
            >
              Schedule a Consultation <span style={styles.plus}>+</span>
            </button>
          </div>
        </div>
      </section>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

/*
  Logo color palette applied:
  --dark-green  : #1B3D2F  (overlay base)
  --bright-green: #3DBE5C  (accent on headline)
  --gold        : #C9A53A  (CTA button)
  --light-gray  : #E8EDE8  (subheadline text)
*/

const styles = {
  hero: {
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(27,61,47,0.88) 0%, rgba(10,30,18,0.80) 100%)",
    zIndex: 1,
  },
  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 40px",
    width: "100%",
  },
  textColumn: {
    maxWidth: "600px",
    color: "#F2F2EE",
  },
  headline: {
    fontSize: "clamp(36px, 5vw, 58px)",
    fontWeight: "800",
    lineHeight: 1.2,
    marginBottom: "20px",
    color: "#F2F2EE",
  },
  accent: {
    color: "#3DBE5C",
    borderBottom: "3px solid #C9A53A",
    display: "inline-block",
    paddingBottom: "4px",
  },
  subheadline: {
    fontSize: "clamp(16px, 2vw, 18px)",
    color: "#c8d5c8",
    marginBottom: "36px",
    lineHeight: 1.7,
    maxWidth: "480px",
  },
  cta: {
    background: "transparent",
    border: "2px solid #C9A53A",
    borderRadius: "6px",
    padding: "14px 32px",
    color: "#C9A53A",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    letterSpacing: "0.3px",
  },
  plus: {
    fontSize: "20px",
    lineHeight: 1,
  },
};

export default HeroSection;