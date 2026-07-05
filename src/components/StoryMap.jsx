import React from 'react';
import { birthdayConfig } from '../data/content';

const getStepIndex = (scene) => {
  const steps = birthdayConfig.storySteps;
  const exact = steps.findIndex((step) => step.id === scene);
  if (exact >= 0) return exact;
  if (scene === 6 || scene === 7) return steps.findIndex((step) => step.id === 5);
  if (scene === 11) return steps.findIndex((step) => step.id === 10);
  return 0;
};

export default function StoryMap({ scene, maxSceneReached, onJump }) {
  const activeIndex = getStepIndex(scene);
  const maxIndex = getStepIndex(maxSceneReached);

  return (
    <nav className="story-map" aria-label="Bản đồ hành trình">
      {birthdayConfig.storySteps.map((step, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex || index <= maxIndex;
        const isUnlocked = index <= maxIndex;

        return (
          <button
            key={step.id}
            type="button"
            className={`story-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
            onClick={() => isUnlocked && onJump(step.id)}
            disabled={!isUnlocked}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`${step.label}${isUnlocked ? '' : ' đang khóa'}`}
            title={step.label}
          >
            <span className="story-dot-core">
              {isUnlocked ? (
                index + 1
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0.65, display: 'block' }}
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </span>
            <span className="story-dot-label">{step.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
