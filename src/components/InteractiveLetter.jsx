import React, { useEffect, useMemo, useState } from 'react';
import { birthdayConfig } from '../data/content';

export default function InteractiveLetter({ onComplete, initialPage = 0, onPageChange, onBackScene }) {
  const [paraIndex, setParaIndex] = useState(initialPage);
  const { paragraphs, nextButton, backButton, autoDelayMs } = birthdayConfig.letter;

  const visibleParagraphs = useMemo(() => paragraphs.slice(0, paraIndex + 1), [paragraphs, paraIndex]);

  useEffect(() => {
    onPageChange?.(paraIndex);
  }, [onPageChange, paraIndex]);

  useEffect(() => {
    if (paraIndex >= paragraphs.length - 1) return undefined;
    const textLength = paragraphs[paraIndex]?.length || 80;
    const delay = Math.max(autoDelayMs, textLength * 52 + 1300);
    const timer = window.setTimeout(() => {
      setParaIndex((prev) => Math.min(prev + 1, paragraphs.length - 1));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [autoDelayMs, paraIndex, paragraphs]);

  const handleNext = () => {
    if (paraIndex < paragraphs.length - 1) {
      setParaIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (paraIndex > 0) {
      setParaIndex((prev) => prev - 1);
    } else {
      onBackScene?.();
    }
  };

  const renderParagraphText = (text) => {
    if (!text.includes('*')) return text;
    return text.split('*').map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <section className="ui-overlay letter-scene fade-in">
      <article className="classic-letter-paper fade-in-scale" aria-live="polite">
        <span className="paper-tape top" />
        <span className="paper-tape side" />
        <img className="classic-sticker top-right" src="/assets/images/memes/bouquet-cat.png" alt="" />
        <img className="classic-sticker bottom-left" src="/assets/images/memes/letter-cat.png" alt="" />
        <span className="classic-doodle flower" aria-hidden="true">🌸</span>

        <div className="classic-letter-scroll">
          <header className="classic-letter-header">
            <h2>Gửi Ân thương mến... 🌸</h2>
          </header>

          <div className="classic-letter-body">
            {visibleParagraphs.map((paragraph, idx) => {
              const isConfession = paragraph.trim() === 'Tui thích bà.';

              if (idx === 0) {
                return (
                  <div className="classic-dedication" key={`${paragraph}-${idx}`}>
                    <p>Chúc mừng sinh nhật tuổi 18,</p>
                    <strong>Trần Phạm Hồng Ân 💕</strong>
                  </div>
                );
              }

              const isFinal = idx === paragraphs.length - 1;

              if (isFinal) {
                return (
                  <div className="classic-letter-final-wrapper" key={`${paragraph}-${idx}`}>
                    <p className="classic-letter-final-text">
                      Một vũ trụ nhỏ này, <br />
                      <strong>Khôi dành tặng cho Ân.</strong>
                    </p>
                    
                    <div className="classic-letter-signature">
                      <img
                        id="sig-img"
                        src="/assets/images/signature.jpg"
                        alt="Chữ ký"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fb = document.getElementById('sig-fallback');
                          if (fb) fb.style.display = 'block';
                        }}
                      />
                      <span id="sig-fallback" className="signature-fallback-text" style={{ display: 'none' }}>
                        Khôi
                      </span>
                    </div>
                    <div className="signature-name-sub">Đinh Tuấn Khôi</div>
                  </div>
                );
              }

              return (
                <React.Fragment key={`${paragraph}-${idx}`}>
                  <p className={isConfession ? 'classic-confession' : ''}>
                    {isConfession ? `"${paragraph}"` : renderParagraphText(paragraph)}
                  </p>

                  {idx === 3 && (
                    <figure className="an-photo-polaroid">
                      <span className="pink-tape" />
                      <div className="an-photo-slot">
                        <img
                          src="/assets/images/anh_an/35.jpg"
                          alt="Ảnh của Ân"
                          onError={(event) => {
                            event.currentTarget.style.opacity = '0';
                          }}
                        />
                        <span>Để ảnh Ân ở đây</span>
                      </div>
                      <figcaption>Ân 18 tuổi 🌸</figcaption>
                      <img className="polaroid-meme" src="/assets/images/memes/heart-cat.png" alt="" />
                    </figure>
                  )}

                  {idx === 7 && (
                    <img className="inline-meme-sticker" src="/assets/images/memes/flower-cat.png" alt="" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <footer className="classic-letter-footer">
          <div className="letter-progress" aria-label={`Đoạn thư ${paraIndex + 1} trên ${paragraphs.length}`}>
            {paragraphs.map((_, idx) => (
              <span key={idx} className={idx <= paraIndex ? 'active' : ''} />
            ))}
          </div>

          <div className="letter-actions">
            <button type="button" className="paper-btn secondary" onClick={handleBack}>
              {backButton}
            </button>
            <button type="button" className="paper-btn" onClick={handleNext}>
              {paraIndex < paragraphs.length - 1 ? nextButton : 'Xem câu trả lời...'}
            </button>
          </div>
        </footer>
      </article>
    </section>
  );
}
