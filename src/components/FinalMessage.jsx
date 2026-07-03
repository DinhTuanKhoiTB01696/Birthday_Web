import React from 'react';
import { birthdayConfig } from '../data/content';

export default function FinalMessage() {
  const { birthdayWish, paragraphs, closing, finalButton } = birthdayConfig.finalMessage;

  return (
    <div 
      className="ui-overlay fade-in" 
      style={{
        background: 'linear-gradient(to top, rgba(3, 0, 20, 0.96) 0%, rgba(3, 0, 20, 0.5) 100%)',
        justifyContent: 'center',
        padding: '30px 15px',
        pointerEvents: 'auto',
        zIndex: 10
      }}
    >
      <div 
        className="glass-panel" 
        style={{
          maxWidth: '580px',
          width: '100%',
          maxHeight: '75vh',
          overflowY: 'auto',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '4px'
        }}
      >
        {/* Wish Header with recipient name highlighted */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h3 
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              fontWeight: '400',
              margin: '0 0 10px 0'
            }}
          >
            {birthdayWish.includes(',') ? birthdayWish.split(',')[0].trim() : birthdayWish}
          </h3>
          {birthdayWish.includes(',') && (
            <h1 
              style={{
                fontSize: '2.4rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: '#ec4899',
                margin: 0,
                fontWeight: '600',
                textShadow: '0 0 20px rgba(236, 72, 153, 0.25)'
              }}
            >
              {birthdayWish.split(',')[1].trim().replace('.', '')}
            </h1>
          )}
        </div>

        {/* Subtle accent divider */}
        <div 
          style={{
            width: '30px',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.15)',
            margin: '0 auto'
          }}
        ></div>

        {/* Confession Paragraphs */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            fontSize: '0.92rem',
            color: 'rgba(248, 250, 252, 0.8)',
            textAlign: 'justify',
            lineHeight: '1.82'
          }}
        >
          {paragraphs.map((p, i) => {
            if (i === 0) {
              // Add a classic drop cap on the very first letter
              const firstLetter = p.charAt(0);
              const remainingText = p.slice(1);
              return (
                <p key={i} style={{ margin: 0, position: 'relative' }}>
                  <span 
                    style={{
                      float: 'left',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '2.8rem',
                      lineHeight: '0.85',
                      paddingRight: '10px',
                      paddingTop: '2px',
                      color: '#ec4899',
                      fontWeight: '600'
                    }}
                  >
                    {firstLetter}
                  </span>
                  {remainingText}
                </p>
              );
            }

            if (p.trim() === "Anh thích em.") {
              // Emphasize the climax confession
              return (
                <p 
                  key={i} 
                  style={{ 
                    fontSize: '1.4rem', 
                    fontWeight: '600', 
                    fontFamily: 'var(--font-serif)', 
                    color: '#ec4899', 
                    textAlign: 'center', 
                    margin: '22px 0',
                    textShadow: '0 0 15px rgba(236, 72, 153, 0.35)',
                    fontStyle: 'italic'
                  }}
                >
                  "{p}"
                </p>
              );
            }

            // Paragraphs after the focal centered text do not need indent
            const needsIndent = i > 0 && paragraphs[i-1].trim() !== "Anh thích em.";

            return (
              <p key={i} style={{ margin: 0, textIndent: needsIndent ? '16px' : '0px' }}>
                {p}
              </p>
            );
          })}
        </div>

        {/* Closing Signature */}
        <div 
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: '16px',
            color: '#f472b6',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.05rem',
            letterSpacing: '0.02em'
          }}
        >
          {closing}
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <a 
            href="#" 
            className="btn-glow"
            onClick={(e) => {
              e.preventDefault();
              alert("Bạn đã chọn: Nhắn cho Khôi! (Sau này Khôi có thể thay thế bằng link Messenger/Zalo thực tế)");
            }}
          >
            {finalButton}
          </a>
        </div>
      </div>
    </div>
  );
}
