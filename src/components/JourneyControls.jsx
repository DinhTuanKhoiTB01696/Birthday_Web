import React from 'react';

export default function JourneyControls({
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  nextLabel = 'Tiếp tục',
  backLabel = 'Quay lại'
}) {
  if (!canGoBack && !canGoNext) return null;

  return (
    <div className="journey-controls" aria-label="Điều hướng hành trình">
      {canGoBack && (
        <button type="button" className="journey-control-btn" onClick={onBack}>
          {backLabel}
        </button>
      )}
      {canGoNext && (
        <button type="button" className="journey-control-btn primary" onClick={onNext}>
          {nextLabel}
        </button>
      )}
    </div>
  );
}
