import React, { useState } from 'react';
import { birthdayConfig } from '../data/content';

export default function ProposalChoice({ onAccept }) {
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  const { acceptText, rejectText } = birthdayConfig.proposal;

  const handleEvasion = (e) => {
    e.preventDefault();
    
    // Calculate a random direction and distance to dodge the cursor/tap
    const minDistance = 90;
    const maxDistance = 220;
    const angle = Math.random() * Math.PI * 2;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    const newX = Math.cos(angle) * distance;
    const newY = Math.sin(angle) * distance;

    setBtnOffset({ x: newX, y: newY });
  };

  return (
    <section className="ui-overlay final-overlay fade-in">
      <div className="glass-panel final-panel">
        <h2>Một câu hỏi nhỏ cuối cùng</h2>
        <p>Ân có đồng ý để tui tìm hiểu bà nhiều hơn không?</p>

        <div className="contact-actions" style={{ position: 'relative' }}>
          <button
            className="btn-glow"
            type="button"
            onClick={onAccept}
            style={{ background: '#ec4899', borderColor: '#ec4899', zIndex: 5 }}
          >
            {acceptText}
          </button>

          <button
            className="btn-glow ghost"
            type="button"
            onMouseEnter={handleEvasion}
            onTouchStart={handleEvasion}
            onClick={handleEvasion}
            style={{
              transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
              transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
              cursor: 'not-allowed',
              zIndex: 10
            }}
          >
            {rejectText}
          </button>
        </div>
      </div>
    </section>
  );
}
