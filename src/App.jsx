import React, { useState, useEffect } from 'react';
import UniverseScene from './components/UniverseScene';
import StartScreen from './components/StartScreen';
import TypingIntro from './components/TypingIntro';
import MemoryGallery from './components/MemoryGallery';
import FinalMessage from './components/FinalMessage';
import AudioToggle from './components/AudioToggle';
import { useAudio } from './hooks/useAudio';
import { birthdayConfig } from './data/content';
import './styles/global.css';

export default function App() {
  const [scene, setScene] = useState(1);
  const [starSpeed, setStarSpeed] = useState(1);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);

  // Custom audio loop controller
  const { isPlaying, play, toggle } = useAudio();

  // Active overlay caption trackers
  const [universeCaptionIndex, setUniverseCaptionIndex] = useState(0);
  const [journeyCaptionIndex, setJourneyCaptionIndex] = useState(0);

  const startJourney = () => {
    play();
    setScene(2);
  };

  const completeIntro = () => {
    // Warp-speed transition flash effect
    setStarSpeed(8);
    setScene(3);
    
    // Slow decay from warp speed back to normal drift speed
    setTimeout(() => {
      let speed = 8;
      const decayInterval = setInterval(() => {
        speed -= 0.5;
        if (speed <= 1) {
          setStarSpeed(1);
          clearInterval(decayInterval);
        } else {
          setStarSpeed(speed);
        }
      }, 80);
    }, 800);
  };

  // Scene 3: Universe Captions cycle interval
  useEffect(() => {
    if (scene === 3) {
      const count = birthdayConfig.universeCaptions.length;
      const interval = setInterval(() => {
        setUniverseCaptionIndex((prev) => {
          if (prev < count - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Move to Memory Gallery
            setScene(4);
            return prev;
          }
        });
      }, 4200);
      return () => clearInterval(interval);
    }
  }, [scene]);

  // Scene 4: Memory Gallery focused index sync with captions
  useEffect(() => {
    if (scene === 4) {
      const count = birthdayConfig.photos.length;
      const interval = setInterval(() => {
        setFocusedCardIndex((prev) => {
          if (prev < count - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [scene]);

  // Scene 5: Spaceship flight time transition and caption cycle
  useEffect(() => {
    if (scene === 5) {
      setStarSpeed(5.5); // constant warp-like speed during spaceship flight
      const count = birthdayConfig.journeyCaptions.length;
      const interval = setInterval(() => {
        setJourneyCaptionIndex((prev) => {
          if (prev < count - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Transition to Final scene
            setScene(6);
            setStarSpeed(0.4); // slow down star movements at the heart planet
            return prev;
          }
        });
      }, 3800);
      return () => clearInterval(interval);
    }
  }, [scene]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Three.js/R3F background rendering layer */}
      <UniverseScene 
        activeScene={scene} 
        focusedIndex={focusedCardIndex}
        starSpeed={starSpeed}
      />

      {/* HTML overlay panels */}
      {scene === 1 && (
        <StartScreen onStart={startJourney} />
      )}

      {scene === 2 && (
        <TypingIntro onComplete={completeIntro} />
      )}

      {scene === 3 && (
        <div 
          className="ui-overlay animate-fadeIn" 
          style={{
            justifyContent: 'flex-end',
            paddingBottom: '100px',
            background: 'linear-gradient(to top, rgba(3, 0, 20, 0.75) 0%, rgba(3, 0, 20, 0) 100%)'
          }}
        >
          <div 
            className="glass-panel fade-in" 
            key={universeCaptionIndex} 
            style={{
              padding: '20px 24px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(109, 40, 217, 0.12)'
            }}
          >
            <p 
              style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                margin: 0,
                color: '#f8fafc'
              }}
            >
              {birthdayConfig.universeCaptions[universeCaptionIndex]}
            </p>
          </div>
        </div>
      )}

      {scene === 4 && (
        <MemoryGallery onNextScene={() => setScene(5)} />
      )}

      {scene === 5 && (
        <div 
          className="ui-overlay" 
          style={{
            justifyContent: 'flex-end',
            paddingBottom: '100px',
            background: 'linear-gradient(to top, rgba(3, 0, 20, 0.75) 0%, rgba(3, 0, 20, 0) 100%)'
          }}
        >
          <div 
            className="glass-panel fade-in" 
            key={journeyCaptionIndex} 
            style={{
              padding: '20px 24px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(236, 72, 153, 0.12)'
            }}
          >
            <p 
              style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                margin: 0,
                color: '#f8fafc'
              }}
            >
              {birthdayConfig.journeyCaptions[journeyCaptionIndex]}
            </p>
          </div>
        </div>
      )}

      {scene === 6 && (
        <FinalMessage />
      )}

      {/* Floating audio control toggles */}
      {scene > 1 && (
        <AudioToggle isPlaying={isPlaying} onToggle={toggle} />
      )}
    </div>
  );
}
