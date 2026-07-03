import React, { useState } from 'react';
import { birthdayConfig } from '../data/content';

export default function InteractiveLetter({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paraIndex, setParaIndex] = useState(0);
  const [showFullLetter, setShowFullLetter] = useState(false);

  const { paragraphs, openButton, nextButton } = birthdayConfig.letter;

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowFullLetter(true);
    }, 850);
  };

  const handleNextParagraph = () => {
    if (paraIndex < paragraphs.length - 1) {
      setParaIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  // Helper to render *bold* text within paragraphs
  const renderParagraphText = (text) => {
    if (!text.includes('*')) return text;
    const parts = text.split('*');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span 
            key={index} 
            style={{ 
              fontWeight: '700',
              color: '#be185d',
              background: 'linear-gradient(to bottom, transparent 60%, rgba(244, 114, 182, 0.2) 60%)',
              padding: '0 2px'
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div 
      className="ui-overlay fade-in" 
      style={{
        background: 'linear-gradient(to top, rgba(3, 0, 20, 0.98) 0%, rgba(3, 0, 20, 0.6) 100%)',
        justifyContent: 'center',
        padding: '16px',
        pointerEvents: 'auto',
        zIndex: 10
      }}
    >
      {!showFullLetter ? (
        /* ——— Envelope Animation Screen ——— */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
          <h2 
            style={{ 
              fontSize: 'clamp(1.1rem, 4vw, 1.45rem)', 
              fontWeight: '400', 
              fontFamily: 'var(--font-serif)', 
              color: '#f8fafc', 
              margin: 0, 
              textAlign: 'center',
              padding: '0 12px'
            }}
          >
            Có một lá thư gửi cho Ân...
          </h2>
          
          <div 
            className={`envelope-wrapper ${isOpen ? 'open' : ''}`}
            onClick={handleOpenEnvelope}
            style={{ maxWidth: '90vw' }}
          >
            <div className="envelope-flap"></div>
            <div className="envelope-pocket"></div>
            <div className="envelope-seal"></div>
            <div className="envelope-letter">
              <span 
                style={{ 
                  fontSize: '0.95rem', 
                  fontFamily: 'var(--font-serif)',
                  fontWeight: '600',
                  color: '#db2777',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>💌</span>
                <span>{openButton}</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ——— Full Letter Display (Diary / Love Letter style) ——— */
        <div 
          className="fade-in-scale letter-paper" 
          style={{
            maxWidth: '520px',
            width: '100%',
            maxHeight: '88vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(236, 72, 153, 0.08)',
            borderRadius: '12px',
            /* Creamy warm paper with ruled lines */
            background: '#faf6ee',
            backgroundImage: `
              linear-gradient(rgba(236, 72, 153, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100% 32px',
            position: 'relative'
          }}
        >
          {/* Vertical notebook red margin line */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 'clamp(16px, 4vw, 26px)',
              width: '1px',
              height: '100%',
              background: 'rgba(239, 68, 68, 0.18)',
              pointerEvents: 'none'
            }}
          />

          {/* Yellow Washi Tape at top */}
          <div 
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%) rotate(-1.5deg)',
              width: '80px',
              height: '22px',
              background: 'rgba(253, 224, 71, 0.45)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              zIndex: 5
            }}
          />

          {/* Decorative elements */}
          <div style={{ 
            position: 'absolute', top: '12px', right: '12px', 
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', 
            userSelect: 'none', opacity: 0.8 
          }}>☀️</div>
          <div style={{ 
            position: 'absolute', bottom: '12px', left: '10px', 
            fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', 
            userSelect: 'none', opacity: 0.75 
          }}>🎀</div>

          {/* Letter greeting header */}
          <h2 
            style={{ 
              fontFamily: '"Dancing Script", cursive', 
              color: '#db2777', 
              fontSize: 'clamp(1.4rem, 5vw, 2rem)', 
              textAlign: 'center', 
              margin: '0 0 16px 0',
              fontWeight: '700',
              textShadow: 'none',
              paddingLeft: 'clamp(8px, 2vw, 12px)',
              lineHeight: '1.3'
            }}
          >
            Gửi Ân thương mến... 🌸
          </h2>

          {/* Letter body paragraphs */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
              fontFamily: '"Dancing Script", cursive',
              fontSize: 'clamp(1.15rem, 3.8vw, 1.5rem)',
              color: '#292524',
              textAlign: 'left',
              lineHeight: '32px',
              paddingLeft: 'clamp(8px, 2vw, 16px)',
              paddingRight: '4px',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word'
            }}
          >
            {paragraphs.slice(0, paraIndex + 1).map((p, idx) => {
              // Special "Anh thích em." paragraph — big centered highlight
              if (p.trim() === "Anh thích em.") {
                return (
                  <p 
                    key={idx} 
                    style={{ 
                      fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
                      fontWeight: '700', 
                      fontFamily: '"Dancing Script", cursive', 
                      color: '#db2777', 
                      textAlign: 'center', 
                      margin: '20px 0',
                      fontStyle: 'italic',
                      lineHeight: '1.4'
                    }}
                  >
                    "{p}"
                  </p>
                );
              }

              // First paragraph — centered dedication header
              if (idx === 0) {
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      textAlign: 'center',
                      margin: '0 0 28px 0',
                      paddingBottom: '20px',
                      borderBottom: '1px dashed rgba(219, 39, 119, 0.2)'
                    }}
                  >
                    <p style={{ 
                      margin: '0 0 4px 0',
                      color: '#292524',
                      fontFamily: '"Dancing Script", cursive',
                      fontSize: 'clamp(1.2rem, 4vw, 1.55rem)',
                      lineHeight: '1.5',
                      fontWeight: '600'
                    }}>
                      Chúc mừng sinh nhật tuổi 18,
                    </p>
                    <p style={{ 
                      margin: 0,
                      color: '#be185d',
                      fontFamily: '"Dancing Script", cursive',
                      fontSize: 'clamp(1.4rem, 5vw, 1.85rem)',
                      lineHeight: '1.4',
                      fontWeight: '700',
                      whiteSpace: 'nowrap'
                    }}>
                      Trần Phạm Hồng Ân 💕
                    </p>
                  </div>
                );
              }

              const needsIndent = idx > 0 && paragraphs[idx - 1].trim() !== "Anh thích em.";

              return (
                <React.Fragment key={idx}>
                  <p 
                    style={{ 
                      margin: '0 0 24px 0', 
                      textIndent: needsIndent ? '28px' : '0px',
                      color: '#292524',
                      fontFamily: '"Dancing Script", cursive',
                      fontSize: 'clamp(1.15rem, 3.8vw, 1.5rem)',
                      lineHeight: '32px'
                    }}
                  >
                    {renderParagraphText(p)}
                  </p>
                  
                  {/* Polaroid after the 4th paragraph */}
                  {idx === 3 && (
                    <div 
                      style={{
                        alignSelf: 'center',
                        transform: 'rotate(-2deg)',
                        background: '#ffffff',
                        padding: '8px 8px 18px 8px',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        width: 'clamp(120px, 35vw, 160px)',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        margin: '20px auto',
                        position: 'relative'
                      }}
                    >
                      {/* Pink Washi Tape holding the polaroid */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '30%',
                          width: '45px',
                          height: '14px',
                          background: 'rgba(236, 72, 153, 0.25)',
                          transform: 'rotate(10deg)'
                        }}
                      />
                      <div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '0.8rem' }}>🌻</div>
                      
                      <div style={{ width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', overflow: 'hidden' }}>
                        <img 
                          src="/assets/images/an-01.jpg" 
                          alt="Ân" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <span style={{ 
                        fontSize: 'clamp(1rem, 3vw, 1.3rem)', 
                        textAlign: 'center', 
                        fontFamily: '"Dancing Script", cursive', 
                        color: '#4b5563', 
                        fontWeight: 'bold' 
                      }}>
                        Ân 18 tuổi 🌸
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Read Next / Finish button */}
          <div style={{ textAlign: 'center', marginTop: '20px', paddingLeft: 'clamp(8px, 2vw, 16px)' }}>
            <button 
              onClick={handleNextParagraph}
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: 'white',
                border: 'none',
                padding: 'clamp(10px, 2.5vw, 14px) clamp(24px, 6vw, 40px)',
                borderRadius: '24px',
                fontFamily: '"Dancing Script", cursive',
                fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)',
                fontWeight: '700',
                boxShadow: '0 6px 18px rgba(219, 39, 119, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #db2777 0%, #be185d 100%)';
                e.target.style.transform = 'translateY(-2px) scale(1.03)';
                e.target.style.boxShadow = '0 8px 24px rgba(219, 39, 119, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)';
                e.target.style.transform = 'none';
                e.target.style.boxShadow = '0 6px 18px rgba(219, 39, 119, 0.3)';
              }}
            >
              {paraIndex < paragraphs.length - 1 ? nextButton : "Xem câu trả lời..."}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
