import React, { useEffect, useState } from 'react';
import { birthdayConfig } from '../data/content';

export default function MemoryGallery({ onNextScene }) {
  const [captionIndex, setCaptionIndex] = useState(0);
  const captions = birthdayConfig.memoryCaptions;

  useEffect(() => {
    if (captionIndex < captions.length - 1) {
      const timer = setTimeout(() => {
        setCaptionIndex((prev) => prev + 1);
      }, 4000); // 4 seconds cycle
      return () => clearTimeout(timer);
    }
  }, [captionIndex, captions.length]);

  return (
    <div 
      className="ui-overlay" 
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-start', // Asymmetrical left align
        paddingBottom: '80px',
        paddingLeft: '8%', // responsive padding
        background: 'linear-gradient(to top, rgba(3, 0, 20, 0.7) 0%, rgba(3, 0, 20, 0) 100%)',
        zIndex: 10
      }}
    >
      <div 
        className="fade-in" 
        key={captionIndex} 
        style={{
          maxWidth: '500px',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '20px',
          pointerEvents: 'auto'
        }}
      >
        {/* Asymmetric Index Indicator */}
        <span 
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.25em',
            color: 'var(--text-muted)'
          }}
        >
          MEMORIES // 0{captionIndex + 1}_0{captions.length}
        </span>

        {/* Large elegant serif quote */}
        <p 
          style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: '#f8fafc',
            margin: 0,
            lineHeight: '1.65',
            fontWeight: '300'
          }}
        >
          "{captions[captionIndex]}"
        </p>

        {/* Dynamic bottom progress timeline divider */}
        <div 
          style={{
            width: '100%',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
            position: 'relative',
            marginTop: '8px'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${((captionIndex + 1) / captions.length) * 100}%`,
              background: 'var(--accent-glow)',
              transition: 'width 0.4s var(--ease-expo)'
            }}
          ></div>
        </div>

        {captionIndex === captions.length - 1 && (
          <button 
            className="btn-glow fade-in" 
            onClick={onNextScene}
            style={{ marginTop: '12px' }}
          >
            Đi đến điều cuối cùng
          </button>
        )}
      </div>
    </div>
  );
}
