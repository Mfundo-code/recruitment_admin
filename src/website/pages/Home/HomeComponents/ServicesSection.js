// src/Components/ServicesSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DARK_GREEN    = "#1B3D2F";
const BRIGHT_GREEN  = "#3DBE5C";
const GOLD          = "#C9A53A";
const LIGHT_BG      = "#F2F2EE";
const CARD_BG       = "linear-gradient(145deg, #e8ede8, #d4e0d4)";
const CARD_HOVER_BG = "linear-gradient(145deg, #dde8dd, #c8d8c8)";

const services = [
  {
    id: 1,
    tag: "Strategic Leadership",
    title: "Executive Search",
    description:
      "Identify and place visionary leaders who align with your strategic goals. We leverage a targeted headhunting approach to secure C‑suite and senior executives.",
    bullets: ["CEO, CFO & board-level roles", "Confidential search mandates", "Proven network & industry insights"],
  },
  {
    id: 2,
    tag: "Project & Interim Support",
    title: "Temporary Staffing",
    description:
      "Rapid access to qualified professionals for seasonal peaks, maternity cover, or specialised project needs. Talent that steps in and makes an immediate impact.",
    bullets: ["Short & long-term contracts", "Rapid onboarding support", "Project-based expertise"],
  },
  {
    id: 3,
    tag: "Long‑Term Success",
    title: "Permanent Placement",
    description:
      "We invest time in understanding your culture, team dynamics, and growth trajectory to ensure every candidate thrives for years to come.",
    bullets: ["Culture alignment & values match", "Rigorous multi-stage screening", "Post-placement support"],
  },
  {
    id: 4,
    tag: "Trust & Compliance",
    title: "Background Verification",
    description:
      "Comprehensive validation of credentials, employment history, educational qualifications, and references. Rigorous checks that protect your organisation.",
    bullets: ["Employment & education verification", "Reference checks", "Identity checks"],
  },
  {
    id: 5,
    tag: "Full‑Cycle Excellence",
    title: "End‑to‑End Recruitment",
    description:
      "We manage the complete lifecycle from job analysis through offer negotiation and onboarding. A seamless, efficient experience that saves time and delivers superior results.",
    bullets: ["Job analysis & role definition", "Sourcing, assessment & interviewing", "Offer management & onboarding"],
  },
  {
    id: 6,
    tag: "Tailored Solutions",
    title: "Customizable Solutions",
    description:
      "No two businesses are alike. We adapt our approach to your industry, volume needs, and strategic objectives from volume recruitment to niche specialist hiring.",
    bullets: ["Industry‑specific strategies", "Scalable workforce planning", "Flexible engagement models"],
  },
];

const ServicesSection = () => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  return (
    <section style={styles.section} aria-labelledby="services-heading">
      <style>{`
        @keyframes lift { from { transform: translateY(6px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes popGreen {
          0%   { transform: translateY(12px) scale(0.98); opacity: 0; }
          50%  { transform: translateY(-6px)  scale(1.02); opacity: 1; }
          100% { transform: translateY(0)     scale(1);    opacity: 1; }
        }
        .heading-animate { animation: popGreen 900ms cubic-bezier(.2,.9,.25,1) both; }
        @media (max-width: 980px) { .services-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 620px) { .services-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={styles.container}>
        <header style={styles.header}>
          <h2 id="services-heading" className="heading-animate" style={styles.headingBig}>
            What We Do
          </h2>
        </header>

        <div className="services-grid" style={styles.grid}>
          {services.map((service, idx) => {
            const isHovered = hovered === service.id;
            return (
              <article
                key={service.id}
                onMouseEnter={() => setHovered(service.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  ...styles.card,
                  ...(isHovered ? styles.cardHovered : {}),
                  animation: `lift 420ms cubic-bezier(.2,.9,.25,1) both`,
                  animationDelay: `${idx * 60}ms`,
                }}
              >
                {/* Gold top accent bar */}
                <div style={{ ...styles.cardTopAccent, opacity: isHovered ? 1 : 0.5 }} />

                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div
                    style={{
                      ...styles.iconWrap,
                      color: isHovered ? GOLD : DARK_GREEN,
                      background: isHovered ? `rgba(201,165,58,0.15)` : "rgba(255,255,255,0.75)",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M4 20c0-3.6 3.6-6.2 8-6.2s8 2.6 8 6.2" />
                    </svg>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={styles.tagRow}>
                      <span style={{ ...styles.tag, color: isHovered ? GOLD : BRIGHT_GREEN }}>
                        {service.tag}
                      </span>
                    </div>

                    <h3 style={styles.cardTitle}>{service.title}</h3>
                    <p style={styles.cardDesc}>{service.description}</p>

                    <ul style={styles.bullets}>
                      {service.bullets.map((b, i) => (
                        <li key={i} style={styles.bulletItem}>
                          <span style={{ ...styles.bulletDot, background: isHovered ? GOLD : BRIGHT_GREEN }} />
                          <span style={{ color: DARK_GREEN }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div style={styles.bottomStrip}>
          <p style={styles.stripText}>
            Not sure which solution fits? Our consultants can help you choose the right approach.
          </p>
          <a href="/contact" style={styles.stripButton}>
            Talk to a consultant
          </a>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    position: "relative",
    padding: "56px 0",
    backgroundColor: LIGHT_BG,
    overflow: "visible",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 2,
  },
  header:     { textAlign: "center", marginBottom: 28 },
  headingBig: {
    fontSize: "clamp(28px, 6vw, 56px)",
    fontWeight: 900,
    margin: 0,
    letterSpacing: "-1px",
    color: DARK_GREEN,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 18,
  },
  card: {
    position: "relative",
    background: CARD_BG,
    borderRadius: 15,
    padding: 18,
    transition: "all 0.3s ease",
    overflow: "hidden",
    minHeight: 180,
    borderBottom: "4px solid transparent",
    boxShadow: "0 15px 35px rgba(27,61,47,0.12)",
  },
  cardHovered: {
    transform: "translateY(-8px)",
    boxShadow: "0 30px 50px rgba(27,61,47,0.20)",
    borderBottomColor: GOLD,
    background: CARD_HOVER_BG,
  },
  cardTopAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
    transition: "opacity 0.22s ease",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
    boxShadow: "0 8px 20px rgba(27,61,47,0.15)",
  },
  tagRow:    { display: "flex", gap: 8, alignItems: "center", marginBottom: 6 },
  tag:       { fontSize: 11, fontWeight: 700, textTransform: "uppercase" },
  cardTitle: { fontSize: 18, fontWeight: 800, color: DARK_GREEN, margin: "6px 0" },
  cardDesc:  { fontSize: 13, color: "#2e4a38", lineHeight: 1.6, margin: 0 },
  bullets:   { listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 8 },
  bulletItem:{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 },
  bulletDot: { width: 6, height: 6, borderRadius: 6, flexShrink: 0 },
  bottomStrip: {
    marginTop: 28,
    padding: "20px",
    background: CARD_BG,
    borderRadius: 12,
    border: `1px solid ${GOLD}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  stripText:   { margin: 0, color: DARK_GREEN, fontWeight: 600 },
  stripButton: {
    background: DARK_GREEN,
    color: LIGHT_BG,
    padding: "10px 18px",
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: "none",
    transition: "all 0.2s",
    border: `2px solid ${GOLD}`,
  },
};

export default ServicesSection;