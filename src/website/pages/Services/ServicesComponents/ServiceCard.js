// src/Components/ServiceCard.js
import React from 'react';

/*
  Logo palette:
  --dark-green  : #1B3D2F
  --bright-green: #3DBE5C
  --gold        : #C9A53A
  --dark        : #1C1C1C
  --light-gray  : #F2F2EE
*/

const ServiceCard = () => {
  const services = [
    {
      title: 'Executive Search',
      description:
        'We specialize in identifying and placing executive-level leaders who can drive your organization forward. Through our extensive network and targeted headhunting approach, we connect you with visionary leaders who align with your strategic goals.',
      image: 'https://api.iconify.design/mdi:account-tie.svg?color=%231B3D2F',
    },
    {
      title: 'Temporary Staffing',
      description:
        'When you need immediate support or specialized expertise for projects, our temporary staffing solutions deliver rapid access to qualified professionals. Talent that can step in and make an immediate impact—whether for seasonal demand, maternity cover, or project-based needs.',
      image: 'https://api.iconify.design/mdi:clock-fast.svg?color=%231B3D2F',
    },
    {
      title: 'Permanent Placement',
      description:
        'Our permanent placement services are built for long-term success. We invest time in understanding your company culture, team dynamics, and growth trajectory to ensure every candidate is genuinely positioned to thrive and contribute for years to come.',
      image: 'https://api.iconify.design/mdi:handshake.svg?color=%231B3D2F',
    },
    {
      title: 'Background Verification',
      description:
        'Trust and security are paramount. Our comprehensive background verification services provide peace of mind by thoroughly validating candidate credentials, employment history, educational qualifications, and professional references. We conduct rigorous, legally compliant checks to protect your organization.',
      image: 'https://api.iconify.design/mdi:shield-check.svg?color=%231B3D2F',
    },
    {
      title: 'End-to-End Recruitment Process',
      description:
        'We manage the complete recruitment lifecycle—from job analysis and role definition through candidate sourcing, assessment, interviewing, offer negotiation, and onboarding support. This comprehensive approach ensures a seamless, efficient experience that saves you time and delivers superior results.',
      image: 'https://api.iconify.design/mdi:sync.svg?color=%231B3D2F',
    },
    {
      title: 'Customizable Solutions',
      description:
        'No two businesses are alike. Our services are fully adaptable to your specific requirements, industry context, and hiring objectives. Whether you need volume recruitment, niche specialist hiring, or strategic workforce planning, we tailor our approach to deliver the most effective strategy for your unique situation.',
      image: 'https://api.iconify.design/mdi:puzzle.svg?color=%231B3D2F',
    },
    {
      title: 'Industry Specialization',
      description:
        'We focus exclusively on Engineering, Construction, Mining, FMCG (Fast-Moving Consumer Goods), Architecture, Supply Chain, and Logistics. Our deep sector expertise means we understand the technical competencies, safety requirements, regulatory frameworks, and market dynamics unique to your field.',
      image: 'https://api.iconify.design/mdi:factory.svg?color=%231B3D2F',
    },
  ];

  const styles = {
    servicesSection: {
      padding: '0 5% 80px',
      backgroundColor: '#F2F2EE',
    },
    sectionHeading: {
      textAlign: 'center',
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1B3D2F',
      marginBottom: '60px',
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    serviceCard: {
      background: 'linear-gradient(145deg, #e8ede8, #d4e0d4)',
      borderRadius: '15px',
      padding: '40px',
      boxShadow: '0 15px 35px rgba(27,61,47,0.12)',
      transition: 'all 0.3s ease',
      borderBottom: '4px solid #C9A53A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    serviceIcon: {
      width: '80px',
      height: '80px',
      marginBottom: '25px',
      background: '#ffffff',
      borderRadius: '12px',
      padding: '15px',
      boxSizing: 'border-box',
      boxShadow: '0 8px 20px rgba(27,61,47,0.15)',
    },
    serviceTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#1B3D2F',
    },
    serviceText: {
      color: '#2e4a38',
      lineHeight: '1.8',
      margin: 0,
      fontWeight: '400',
    },
  };

  return (
    <section style={styles.servicesSection}>
      <h2 style={styles.sectionHeading}>Our Service Lines</h2>
      <div style={styles.servicesGrid}>
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card"
            style={styles.serviceCard}
          >
            <img
              src={service.image}
              alt={service.title}
              style={styles.serviceIcon}
            />
            <h3 style={styles.serviceTitle}>{service.title}</h3>
            <p style={styles.serviceText}>{service.description}</p>
          </div>
        ))}
      </div>

      <style>{`
        .service-card:hover {
          background: linear-gradient(145deg, #dde8dd, #c8d8c8) !important;
          transform: translateY(-8px);
          box-shadow: 0 30px 50px rgba(27,61,47,0.20) !important;
          border-bottom-color: #b8922e;
        }
      `}</style>
    </section>
  );
};

export default ServiceCard;