import React, { useState } from 'react';

export default function AudioToggle({ isPlaying, isMuted, volume, onToggle, onMute, onVolumeChange }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`audio-control ${expanded ? 'expanded' : ''}`}>
      <button
        className="audio-icon-btn"
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      >
        {isPlaying ? '♪' : '▷'}
      </button>
      <button
        className="audio-icon-btn"
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label="Mở điều khiển âm lượng"
      >
        ⋯
      </button>
      {expanded && (
        <div className="audio-popover">
          <button type="button" onClick={onMute}>
            {isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            aria-label="Âm lượng"
          />
        </div>
      )}
    </div>
  );
}
