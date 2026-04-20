import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { getJob } from './api';
import { MdLocationOn } from 'react-icons/md';

export default function JobTemplateGenerator() {
  const { id }                    = useParams();
  const [job, setJob]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [imgSize, setImgSize]     = useState({ width: 0, height: 0 });
  const [titleFontScale, setTitleFontScale] = useState(1);
  const templateRef               = useRef();
  const measureRef                = useRef();

  useEffect(() => {
    getJob(id).then(res => setJob(res.data)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const img = new Image();
    img.src = '/template.png';
    img.onload = () => setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  useEffect(() => {
    if (job && imgSize.width && measureRef.current) {
      const previewScale   = Math.min(1, 240 / imgSize.width);
      const dW             = Math.round(imgSize.width * previewScale);
      const availableWidth = dW * 0.73;                       // ~73% of preview width
      const measuredWidth  = measureRef.current.offsetWidth;  // title at base font size
      setTitleFontScale(Math.min(1, availableWidth / measuredWidth));
    }
  }, [job, imgSize]);

  const getImageBlob = async () => {
    const dataUrl = await toPng(templateRef.current, {
      quality: 0.95,
      pixelRatio: imgSize.width / templateRef.current.offsetWidth,
    });
    const res = await fetch(dataUrl);
    return { blob: await res.blob(), dataUrl };
  };

  const handleSave = async () => {
    if (!templateRef.current) return;
    const { dataUrl } = await getImageBlob();
    const link = document.createElement('a');
    link.download = `${job.title.replace(/\s+/g, '-')}-template.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (!templateRef.current) return;
    const { blob } = await getImageBlob();
    const file = new File([blob], `${job.title.replace(/\s+/g, '-')}-template.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: job.title });
    } else {
      alert('Sharing is not supported on this device/browser.');
    }
  };

  const handleCopy = async () => {
    if (!templateRef.current) return;
    const { blob } = await getImageBlob();
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      alert('Image copied to clipboard!');
    } catch {
      alert('Copy not supported on this browser.');
    }
  };

  if (loading)        return <p>Loading…</p>;
  if (!job)           return <p>Job not found.</p>;
  if (!imgSize.width) return <p>Loading template…</p>;

  const keyRequirements = job.requirements
    ? job.requirements.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 4)
    : [];

  const PREVIEW_MAX_WIDTH = 240;
  const scale  = Math.min(1, PREVIEW_MAX_WIDTH / imgSize.width);
  const displayW = Math.round(imgSize.width  * scale);
  const displayH = Math.round(imgSize.height * scale);
  const fs = (px) => `${Math.round(px * scale)}px`;

  // Gradient text helper styles
  const gradientTitle = {
    background: 'linear-gradient(135deg, #1B3D2F 0%, #2d6649 40%, #C9A53A 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0px 2px 4px rgba(201,165,58,0.25))',
  };

  const gradientSubtitle = {
    background: 'linear-gradient(90deg, #C9A53A 0%, #e8c96a 50%, #C9A53A 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0px 1px 3px rgba(201,165,58,0.3))',
  };

  const whiteOutlineFilter = [
    'drop-shadow(0px 0px 4px rgba(255,255,255,1))',
    'drop-shadow(0px 0px 6px rgba(255,255,255,0.9))',
    'drop-shadow(0px 2px 3px rgba(255,255,255,0.8))',
  ].join(' ');

  return (
    <div>
      <h2 style={{ color: '#1B3D2F', marginBottom: '20px' }}>Social Media Template</h2>

      <div
        style={{
          display: 'inline-block',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          marginBottom: '20px',
          lineHeight: 0,
        }}
      >
        {/* Hidden measuring element */}
        <div
          ref={measureRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'nowrap',
            fontSize: fs(85),
            fontWeight: '900',
            textTransform: 'uppercase',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            color: '#2d6649',
          }}
        >
          {job.title}
        </div>

        <div
          ref={templateRef}
          style={{
            position: 'relative',
            width: displayW,
            height: displayH,
            backgroundImage: 'url(/template.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {/* Left-side gradient overlay for text readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '55%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.18) 70%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Title + Requirements container */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '2%',
              zIndex: 1,
            }}
          >
            {/* JOB TITLE */}
            <div
              style={{
                height: fs(150),
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <h1
                style={{
                  ...gradientTitle,
                  fontSize: `${Math.round(85 * titleFontScale * scale)}px`,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: '1px',
                  whiteSpace: 'nowrap',
                }}
              >
                {job.title}
              </h1>
            </div>

            {/* KEY REQUIREMENTS SECTION */}
            {keyRequirements.length > 0 && (
              <>
                {/* Subheading */}
                <div style={{ position: 'relative', display: 'inline-block', margin: `${fs(48)} 0 0 0` }}>
                  <h2
                    style={{
                      ...gradientSubtitle,
                      fontSize: fs(62),
                      fontWeight: '800',
                      margin: 0,
                      letterSpacing: '1px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Key Requirements
                  </h2>
                  {/* Gold underline bar */}
                  <div style={{
                    height: fs(3),
                    background: 'linear-gradient(90deg, #C9A53A, #f5d98b, transparent)',
                    borderRadius: '2px',
                    marginTop: fs(4),
                    width: '90%',
                  }} />
                </div>

                {/* Requirements list */}
                <ul
                  style={{
                    margin: `${fs(60)} 0 0 ${fs(20)}`,
                    paddingLeft: 0,
                    listStyle: 'none',
                    color: '#1B3D2F',
                    fontSize: fs(42),
                    lineHeight: '1.6',
                    fontWeight: '800',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {keyRequirements.map((req, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: fs(10) }}>
                      {/* Diamond bullet */}
                      <span style={{
                        display: 'inline-block',
                        width: fs(12),
                        height: fs(12),
                        minWidth: fs(12),
                        background: 'linear-gradient(135deg, #C9A53A, #f5d98b)',
                        transform: 'rotate(45deg)',
                        borderRadius: fs(2),
                        boxShadow: `0 0 ${fs(4)} rgba(201,165,58,0.6)`,
                        flexShrink: 0,
                      }} />
                      <span style={{
                        background: 'linear-gradient(90deg, #1B3D2F 0%, #2d6649 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: whiteOutlineFilter,
                      }}>
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* LOCATION */}
          <div
            style={{
              position: 'absolute',
              bottom: '21%',
              left: '2%',
              color: '#2d6649',
              fontSize: fs(40),
              fontWeight: '600',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2em',
              zIndex: 1,
              textShadow: '0 1px 3px rgba(255,255,255,0.7)',
            }}
          >
            <MdLocationOn style={{ color: '#8B5A2B', filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.6))' }} />
            <span>{job.location}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={handleSave}  style={styles.btn}>💾 Save</button>
        <button onClick={handleShare} style={styles.btn}>↗ Share</button>
        <button onClick={handleCopy} style={styles.btn}>📋 Copy</button>
      </div>
    </div>
  );
}

const styles = {
  btn: {
    background: '#C9A53A',
    color: '#1B3D2F',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 700,
  },
};