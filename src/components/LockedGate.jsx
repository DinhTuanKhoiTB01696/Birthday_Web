import React, { useState, useEffect } from 'react';
import { birthdayConfig } from '../data/content';

export default function LockedGate({ onUnlock }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [bypassCount, setBypassCount] = useState(0);

  const softUnlockTime = new Date(birthdayConfig.unlock.softUnlockAt).getTime();

  useEffect(() => {
    // If dev bypass key is set, immediately unlock
    if (localStorage.getItem('dev_bypass_lock') === 'true') {
      onUnlock();
      return;
    }

    const checkTime = () => {
      const diff = softUnlockTime - Date.now();
      
      if (diff <= 0) {
        onUnlock();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [softUnlockTime, onUnlock]);

  const handlePadlockClick = () => {
    const nextVal = bypassCount + 1;
    setBypassCount(nextVal);
    if (nextVal >= 5) {
      localStorage.setItem('dev_bypass_lock', 'true');
      onUnlock();
    }
  };

  return (
    <div 
      className="ui-overlay" 
      style={{
        background: '#030014',
        pointerEvents: 'auto',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '24px',
          maxWidth: '440px',
          width: '90%'
        }}
      >
        {/* Glow Padlock Trigger */}
        <div 
          onClick={handlePadlockClick}
          style={{
            cursor: 'pointer',
            padding: '18px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            userSelect: 'none'
          }}
        >
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#ec4899" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 5px rgba(236,72,153,0.35))' }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Header Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 
            style={{ 
              fontSize: '1.4rem', 
              color: 'var(--text-white)', 
              fontWeight: '400',
              fontFamily: 'var(--font-serif)',
              margin: 0
            }}
          >
            Món quà này chưa đến lúc mở…
          </h2>
          <p 
            style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-muted)', 
              margin: 0,
              fontStyle: 'italic'
            }}
          >
            Hẹn Ân vào một khoảnh khắc đặc biệt.
          </p>
        </div>

        {/* Countdown Layout Grid */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            marginTop: '10px',
            width: '100%' 
          }}
        >
          <div className="countdown-segment">
            <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="countdown-label">Ngày</span>
          </div>
          <div className="countdown-segment">
            <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="countdown-label">Giờ</span>
          </div>
          <div className="countdown-segment">
            <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="countdown-label">Phút</span>
          </div>
          <div className="countdown-segment">
            <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="countdown-label">Giây</span>
          </div>
        </div>

        {bypassCount > 0 && bypassCount < 5 && (
          <span 
            style={{ 
              fontSize: '0.62rem', 
              fontFamily: 'monospace', 
              color: 'rgba(255,255,255,0.12)', 
              marginTop: '6px' 
            }}
          >
            Dev bypass in {5 - bypassCount} clicks...
          </span>
        )}
      </div>
    </div>
  );
}
