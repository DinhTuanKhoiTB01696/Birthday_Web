import React, { useState } from 'react';
import { birthdayConfig } from '../data/content';

export default function ConstellationMap({ onComplete }) {
  const [openedStars, setOpenedStars] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);

  const stars = birthdayConfig.constellation;

  const handleStarClick = (idx) => {
    if (!openedStars.includes(idx)) {
      setOpenedStars((prev) => [...prev, idx]);
    }
    setActiveMessage(stars[idx].message);
  };

  const isAllOpened = openedStars.length === stars.length;

  return (
    <div 
      className="ui-overlay fade-in" 
      style={{
        background: 'linear-gradient(to top, rgba(3, 0, 20, 0.96) 0%, rgba(3, 0, 20, 0.6) 100%)',
        justifyContent: 'center',
        padding: '30px 15px',
        pointerEvents: 'auto',
        zIndex: 10
      }}
    >
      <div 
        className="glass-panel" 
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '4px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span 
            style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '0.68rem', 
              letterSpacing: '0.25em', 
              textTransform: 'uppercase', 
              color: 'var(--text-muted)'
            }}
          >
            Constellation Map
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '400', margin: 0, fontFamily: 'var(--font-serif)' }}>
            Những Điều Khôi Thích Ở <span style={{ fontStyle: 'italic', color: '#ec4899', fontWeight: '600' }}>Ân</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
            Khám phá từng ngôi sao để mở chòm sao tình cảm...
          </p>
        </div>

        {/* Star Grid Layout */}
        <div className="constellation-container">
          {stars.map((star, idx) => {
            const isOpened = openedStars.includes(idx);
            return (
              <div 
                key={idx}
                className={`star-node ${isOpened ? 'opened' : ''}`}
                onClick={() => handleStarClick(idx)}
              >
                <span style={{ fontSize: '1.3rem' }}>{isOpened ? '⭐' : '✨'}</span>
                <span 
                  style={{ 
                    fontSize: '0.78rem', 
                    color: isOpened ? '#f8fafc' : 'rgba(255, 255, 255, 0.45)',
                    fontWeight: '500'
                  }}
                >
                  {star.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Message Reveal Console */}
        <div 
          style={{
            minHeight: '60px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 18px',
            background: 'rgba(255, 255, 255, 0.01)',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            fontSize: '0.88rem',
            color: activeMessage ? '#f472b6' : 'rgba(255, 255, 255, 0.3)',
            fontStyle: 'italic',
            lineHeight: '1.62'
          }}
        >
          {activeMessage ? `"${activeMessage}"` : "Nhấp một ngôi sao để nghe lời tự sự..."}
        </div>

        {/* Proceed Action Button */}
        {isAllOpened && (
          <button 
            className="btn-glow fade-in" 
            onClick={onComplete}
            style={{ marginTop: '4px' }}
          >
            Tiếp tục hành trình ✨
          </button>
        )}
      </div>
    </div>
  );
}
