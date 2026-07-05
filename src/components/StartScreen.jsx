import React from 'react';
import { birthdayConfig } from '../data/content';

export default function StartScreen({ onStart }) {
  const urlParams = new URLSearchParams(window.location.search);
  const isFromGift = urlParams.get(birthdayConfig.qr.giftQueryKey) === birthdayConfig.qr.giftQueryValue;

  return (
    <section className="ui-overlay fade-in" style={{
      background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.48) 0%, rgba(3, 0, 20, 0.98) 72%)',
      pointerEvents: 'auto',
      zIndex: 20
    }}>
      <div style={{
        width: 'min(650px, calc(100vw - 32px))',
        maxHeight: 'calc(100svh - 70px)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(18px, 4svh, 28px)'
      }}>
        <div style={{ display: 'grid', gap: '12px' }}>
          <span style={{
            fontSize: '0.72rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: isFromGift ? '#f9a8d4' : 'var(--text-muted)'
          }}>
            {isFromGift ? birthdayConfig.qr.giftIntroText : 'A little space for'}
          </span>
          <h1 style={{
            fontSize: 'clamp(2.25rem, 11vw, 4.4rem)',
            margin: 0,
            fontWeight: 500,
            color: 'var(--text-white)'
          }}>
            Một vũ trụ nhỏ
            <br />
            dành cho <em style={{ color: '#f9a8d4', fontStyle: 'italic' }}>Ân</em>
          </h1>
        </div>

        <p style={{
          fontSize: 'clamp(0.95rem, 3.4vw, 1.08rem)',
          color: 'var(--text-muted)',
          margin: 0,
          maxWidth: '52ch',
          lineHeight: 1.7,
          textWrap: 'balance'
        }}>
          {birthdayConfig.intro.subtitle}
        </p>

        <button className="btn-glow" onClick={onStart}>
          {birthdayConfig.intro.buttonText}
        </button>
      </div>
    </section>
  );
}
