import React, { useEffect, useState } from 'react';
import { birthdayConfig } from '../data/content';

export default function ConstellationMap({ onComplete, onProgress }) {
  // Start with the first star (index 0) already opened/read
  const [openedStars, setOpenedStars] = useState([0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const stars = birthdayConfig.constellation;
  const activeMessage = stars[activeIndex]?.message;
  const isAllOpened = openedStars.length === stars.length;

  useEffect(() => {
    onProgress?.(openedStars);
  }, [onProgress, openedStars]);

  const handleStarClick = (idx) => {
    setActiveIndex(idx);
    setOpenedStars((prev) => {
      if (prev.includes(idx)) return prev;
      return [...prev, idx].sort((a, b) => a - b);
    });
  };

  return (
    <section className="ui-overlay constellation-scene fade-in">
      <div className="constellation-panel glass-panel">
        <div className="scene-heading">
          <span>Constellation map</span>
          <h2>
            Những điều tui thích ở <em>Ân</em>
          </h2>
          <p>Bấm chọn từng ngôi sao để thắp sáng và đọc những điều nhỏ tui đã thầm để ý nha.</p>
        </div>

        <div className="constellation-sky" aria-label="Chòm sao cảm xúc">
          <svg className="constellation-lines" viewBox="0 0 100 70" aria-hidden="true">
            <polyline points="12,18 35,10 58,22 84,14 72,48 45,58 18,44 12,18" />
            <polyline points="35,10 45,58 58,22" />
          </svg>
          {stars.map((star, idx) => {
            const isOpened = openedStars.includes(idx);
            const isActive = activeIndex === idx;
            return (
              <button
                key={star.title}
                type="button"
                className={`star-node ${isOpened ? 'opened' : ''} ${isActive ? 'active' : ''}`}
                onClick={() => handleStarClick(idx)}
                style={{ '--delay': `${idx * 120}ms` }}
              >
                <span className="star-icon" aria-hidden="true" />
                <span>{star.title}</span>
              </button>
            );
          })}
        </div>

        <div className="constellation-message" aria-live="polite">
          {activeMessage ? `"${activeMessage}"` : "Chờ một ngôi sao sáng lên..."}
        </div>

        <button
          className={`btn-glow compact ${!isAllOpened ? 'disabled-hint' : ''}`}
          type="button"
          onClick={() => {
            if (isAllOpened) {
              onComplete();
            }
          }}
          style={{
            opacity: isAllOpened ? 1 : 0.65,
            cursor: isAllOpened ? 'pointer' : 'not-allowed',
            background: isAllOpened ? '#ec4899' : 'rgba(255, 255, 255, 0.08)',
            borderColor: isAllOpened ? '#ec4899' : 'rgba(255, 255, 255, 0.15)'
          }}
        >
          {isAllOpened ? 'Tiếp tục hành trình' : `Thắp sáng chòm sao (${openedStars.length}/${stars.length})`}
        </button>
      </div>
    </section>
  );
}
