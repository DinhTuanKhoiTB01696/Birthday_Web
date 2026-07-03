import React, { useState } from 'react';
import { birthdayConfig } from '../data/content';

export default function ProposalChoice({ onAccept, onRejectComplete }) {
  const [rejectCount, setRejectCount] = useState(0);
  const [btnPosition, setBtnPosition] = useState({ top: 'auto', left: 'auto', right: '12%', bottom: 'auto' });
  const [showRespectText, setShowRespectText] = useState(false);

  const { acceptText, rejectText, rejectEscapeText, maxRejectEscapes, afterRejectText } = birthdayConfig.proposal;

  const escapeButton = () => {
    if (rejectCount >= maxRejectEscapes) return;

    // Boundary relative sways (5% to 75% viewport bounds)
    const randomX = Math.floor(Math.random() * 65) + 8;
    const randomY = Math.floor(Math.random() * 55) + 15;

    setBtnPosition({
      position: 'fixed',
      left: `${randomX}vw`,
      top: `${randomY}vh`,
      right: 'auto',
      bottom: 'auto'
    });

    setRejectCount((prev) => prev + 1);
  };

  const handleRejectClick = () => {
    if (rejectCount >= maxRejectEscapes) {
      setShowRespectText(true);
    } else {
      escapeButton();
    }
  };

  return (
    <div 
      className="ui-overlay fade-in" 
      style={{
        background: 'linear-gradient(to top, rgba(3, 0, 20, 0.98) 0%, rgba(3, 0, 20, 0.7) 100%)',
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
          padding: '40px 32px',
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
        {!showRespectText ? (
          <>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '400', fontFamily: 'var(--font-serif)', margin: 0 }}>
              Một câu hỏi nhỏ cuối cùng...
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.62' }}>
              Ân có đồng ý để Khôi tìm hiểu Ân nhiều hơn không?
            </p>

            <div 
              className="proposal-btn-container" 
              style={{ position: 'relative', width: '100%', minHeight: '110px', marginTop: '16px' }}
            >
              {/* Accept button - fixed position */}
              <button 
                className="btn-glow" 
                onClick={onAccept}
                style={{
                  position: 'absolute',
                  left: '12%',
                  top: '36px',
                  transform: 'translateY(-50%)',
                  padding: '12px 34px',
                  background: '#ec4899',
                  borderColor: '#ec4899',
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                {acceptText}
              </button>

              {/* Escapable reject button */}
              <button 
                className="btn-glow btn-reject"
                onMouseEnter={escapeButton}
                onTouchStart={escapeButton}
                onClick={handleRejectClick}
                style={{
                  ...btnPosition,
                  position: btnPosition.position || 'absolute',
                  right: btnPosition.right || '12%',
                  top: btnPosition.top || '36px',
                  transform: 'translateY(-50%)',
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-muted)',
                  transition: rejectCount >= maxRejectEscapes ? 'none' : 'top 0.15s cubic-bezier(0.16, 1, 0.3, 1), left 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {rejectCount >= maxRejectEscapes ? rejectEscapeText : rejectText}
              </button>
            </div>
          </>
        ) : (
          /* Climax respect page */
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '400', fontFamily: 'var(--font-serif)', color: '#ec4899', margin: 0 }}>
              Cảm ơn Ân
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0, lineHeight: '1.62' }}>
              {afterRejectText}
            </p>
            <button 
              className="btn-glow" 
              onClick={onRejectComplete}
              style={{ marginTop: '12px' }}
            >
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
