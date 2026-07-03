import React, { useEffect, useState, useRef } from 'react';
import { birthdayConfig } from '../data/content';

export default function TypingIntro({ onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const terminalEndRef = useRef(null);

  const lines = birthdayConfig.typingLines;

  useEffect(() => {
    if (lineIndex < lines.length) {
      const line = lines[lineIndex];
      if (charIndex < line.length) {
        const timeout = setTimeout(() => {
          setCurrentLineText((prev) => prev + line[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 22);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, line]);
          setCurrentLineText('');
          setLineIndex((prev) => prev + 1);
          setCharIndex(0);
        }, 180);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [lineIndex, charIndex, lines]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLines, currentLineText]);

  return (
    <div 
      className="ui-overlay" 
      style={{
        background: '#030014',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px 15px',
        pointerEvents: 'auto',
        zIndex: 20
      }}
    >
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '380px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '"JetBrains Mono", Courier, monospace',
          color: 'rgba(248, 250, 252, 0.85)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '4px'
        }}
      >
        {/* Sleek Minimal Editor Header */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '10px',
            marginBottom: '18px',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)'
          }}
        >
          <span>console.log("happy_birthday");</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></span>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></span>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></span>
          </div>
        </div>

        {/* Console Output logs */}
        <div 
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.85rem',
            lineHeight: '1.6'
          }}
        >
          {displayedLines.map((line, i) => (
            <div key={i}>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)', marginRight: '12px', fontSize: '0.75rem' }}>[{i + 1}]</span>
              <span style={{ color: line.includes('Found') || line.includes('Launching') ? '#ec4899' : 'rgba(248, 250, 252, 0.85)' }}>
                {line}
              </span>
            </div>
          ))}
          {lineIndex < lines.length && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)', marginRight: '12px', fontSize: '0.75rem' }}>[{lineIndex + 1}]</span>
              <span className="cursor-blink" style={{ color: 'rgba(248, 250, 252, 0.85)' }}>
                {currentLineText}
              </span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
