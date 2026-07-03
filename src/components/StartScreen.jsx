import React from 'react';
import { birthdayConfig } from '../data/content';

export default function StartScreen({ onStart }) {
  return (
    <div 
      className="ui-overlay fade-in" 
      style={{ 
        background: 'radial-gradient(circle at center, rgba(10, 5, 30, 0.55) 0%, rgba(3, 0, 20, 1) 100%)',
        pointerEvents: 'auto',
        zIndex: 20 
      }}
    >
      <div 
        style={{
          maxWidth: '650px',
          width: '90%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Subtle uppercase monospaced tag */}
          <span 
            style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '0.72rem', 
              letterSpacing: '0.35em', 
              textTransform: 'uppercase', 
              color: 'var(--text-muted)'
            }}
          >
            A Little Space For
          </span>
          <h1 
            style={{ 
              fontSize: '3.5rem', 
              margin: 0, 
              fontWeight: '400',
              lineHeight: '1.15',
              color: 'var(--text-white)'
            }}
          >
            Một Vũ Trụ Nhỏ
            <br />
            Dành Cho <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: '#ec4899' }}>Ân</span>
          </h1>
        </div>

        <p 
          style={{ 
            fontSize: '1rem', 
            color: 'var(--text-muted)', 
            margin: 0,
            maxWidth: '460px',
            lineHeight: '1.8'
          }}
        >
          {birthdayConfig.intro.subtitle}
        </p>

        <button 
          className="btn-glow" 
          onClick={onStart}
          style={{ marginTop: '12px' }}
        >
          {birthdayConfig.intro.buttonText}
        </button>
      </div>
    </div>
  );
}
