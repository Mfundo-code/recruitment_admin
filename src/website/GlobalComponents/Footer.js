// src/website/GlobalComponents/Footer.js (or src/GlobalComponents/Footer.js)
import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn } from "react-icons/fa";
import LogoB from "../assets/images/LogoB.png"; // Update with actual logo if needed

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const Footer = () => {
  return (
    <footer className="footer" style={styles.footer}>
      <div style={styles.container}>
        {/* Main footer content */}
        <div style={styles.mainContent}>
          {/* Column 1: Company Info */}
          <div className="footer-column" style={styles.column}>
            <img src={LogoB} alt="Muji Consulting Services" style={styles.logo} />
            <p style={styles.tagline}>
              Bridging exceptional talent with outstanding opportunities in
              Engineering, Construction, Mining, FMCG, Architecture, Supply Chain,
              and Logistics. We deliver strategic recruitment solutions that create
              lasting value.
            </p>
            <div style={styles.socialIcons}>
              <a
                href="https://www.linkedin.com/company/muji-consulting"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                style={styles.socialIcon}
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="footer-column" style={styles.column}>
            <h4 style={styles.columnTitle}>Services</h4>
            <ul style={styles.linkList}>
              <li>
                <Link to="/services" className="footer-link" style={styles.link}>
                  Executive Search
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link" style={styles.link}>
                  Temporary Staffing
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link" style={styles.link}>
                  Permanent Placement
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link" style={styles.link}>
                  Background Verification
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link" style={styles.link}>
                  End‑to‑End Recruitment
                </Link>
              </li>
              <li>
                <Link to="/services" className="footer-link" style={styles.link}>
                  Customizable Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (remaining links only) */}
          <div className="footer-column" style={styles.column}>
            <h4 style={styles.columnTitle}>Company</h4>
            <ul style={styles.linkList}>
              <li>
                <Link to="/about" className="footer-link" style={styles.link}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="footer-link" style={styles.link}>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link" style={styles.link}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="footer-link" style={styles.link}>
                  🔐 Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-column" style={styles.column}>
            <h4 style={styles.columnTitle}>Contact</h4>
            <address style={styles.contactInfo}>
              <p>Johannesburg, 2000</p>
              <p>South Africa</p>
              <p style={styles.phone}>
                <a href="tel:+27113940990" className="footer-link" style={styles.link}>
                  +27 11 394 0990
                </a>
              </p>
              <p>
                <a href="mailto:info@mujiconsulting.co.za" className="footer-link" style={styles.link}>
                  info@mujiconsulting.co.za
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Copyright bar */}
        <div style={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Muji Consulting Services. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .footer-link:hover,
        .footer-column a:hover {
          color: #C9A53A !important;
        }
        .footer-social-icon:hover {
          background-color: #C9A53A !important;
          color: #1B3D2F !important;
          transform: translateY(-3px);
        }
        @media (max-width: 992px) {
          .footer > div > div:first-child {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .footer > div > div:first-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#1B3D2F",
    color: "#F2F2EE",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    borderTop: "4px solid #C9A53A",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "3rem 1.5rem 1rem",
  },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "2rem",
    marginBottom: "2rem",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logo: {
    height: "40px",
    width: "auto",
    marginBottom: "1rem",
  },
  tagline: {
    fontSize: "0.9rem",
    color: "#c8d5c8",
    marginBottom: "1.2rem",
    lineHeight: 1.5,
  },
  socialIcons: {
    display: "flex",
    gap: "0.8rem",
  },
  socialIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(201,165,58,0.12)",
    color: "#C9A53A",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    textDecoration: "none",
  },
  columnTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#C9A53A",
    letterSpacing: "0.5px",
  },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#c8d5c8",
    textDecoration: "none",
    fontSize: "0.9rem",
    lineHeight: "2",
    transition: "color 0.2s",
  },
  contactInfo: {
    fontStyle: "normal",
    color: "#c8d5c8",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },
  phone: {
    marginTop: "0.5rem",
  },
  copyright: {
    borderTop: "1px solid rgba(201,165,58,0.2)",
    paddingTop: "1.5rem",
    textAlign: "center",
    color: "#8aab8a",
    fontSize: "0.85rem",
  },
};

export default Footer;