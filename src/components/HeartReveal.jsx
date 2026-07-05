import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HeartWireframeScene from './heart/HeartWireframeScene';
import HeartTunnelScene from './heart/HeartTunnelScene';
import { birthdayConfig } from '../data/content';

export default function HeartReveal({ onOpenLetter }) {
  const [stage, setStage] = useState('text'); // 'text', 'wireframe', 'tunnel', 'hint', 'warp'
  const [wireOpacity, setWireOpacity] = useState(0);
  const [tunnelOpacity, setTunnelOpacity] = useState(0);

  useEffect(() => {
    // Stage 2: Fade in HeartWireframeScene after 2.6 seconds
    const t1 = setTimeout(() => {
      setStage('wireframe');
      let val = 0;
      const interval = setInterval(() => {
        val += 0.05;
        if (val >= 1.0) {
          setWireOpacity(1.0);
          clearInterval(interval);
        } else {
          setWireOpacity(val);
        }
      }, 30);
    }, 2600);

    // Stage 3: Crossfade to HeartTunnelScene after 6.2 seconds
    const t2 = setTimeout(() => {
      setStage('tunnel');
      let val = 0;
      const interval = setInterval(() => {
        val += 0.04;
        if (val >= 1.0) {
          setWireOpacity(0.45);
          setTunnelOpacity(1.0);
          clearInterval(interval);
        } else {
          setWireOpacity(1.0 - val * 0.55);
          setTunnelOpacity(val);
        }
      }, 30);
    }, 6200);

    // Stage 4: Show hint + envelope after 8.5 seconds
    const t3 = setTimeout(() => {
      setStage('hint');
    }, 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleClick = () => {
    if (stage !== 'hint') return;
    setStage('warp');

    // Fade out both tunnel and wireframe heart smoothly before transitioning to letter
    let val = 1.0;
    const interval = setInterval(() => {
      val -= 0.07;
      if (val <= 0) {
        setTunnelOpacity(0);
        setWireOpacity(0);
        clearInterval(interval);
        onOpenLetter();
      } else {
        setTunnelOpacity(val);
        setWireOpacity(val * 0.45);
      }
    }, 30);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const fov = isMobile ? 55 : 42;

  return (
    <section className={`ui-overlay heart-scene fade-in ${stage === 'warp' ? 'tunnel-active' : ''}`}>
      {/* Confession text */}
      <div className={`heart-copy ${(stage === 'text') ? 'visible' : 'fade-slow'}`}>
        <p>{birthdayConfig.heart.lead}</p>
        <span>{birthdayConfig.heart.sublead}</span>
      </div>

      {/* Fullscreen WebGL 3D Canvas */}
      <div
        className="heart-canvas-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <Canvas
          camera={{ position: [0, 0.05, 2.5], fov }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 4]} intensity={1.2} color="#ffebf5" />
          <pointLight position={[-4, 2, -3]} intensity={0.8} color="#f48fb1" />

          {wireOpacity > 0 && (
            <HeartWireframeScene opacity={wireOpacity} />
          )}

          {tunnelOpacity > 0 && (
            <HeartTunnelScene opacity={tunnelOpacity} />
          )}
        </Canvas>
      </div>

      {/* Envelope button — appears when heart tunnel is ready */}
      <button
        type="button"
        className={`heart-envelope-btn ${stage === 'hint' ? 'visible' : ''}`}
        onClick={handleClick}
        aria-label="Chạm vào bức thư để mở"
      >
        <span className="envelope-icon" aria-hidden="true">
          <span className="envelope-body">
            <span className="envelope-flap" />
            <span className="envelope-heart">♡</span>
          </span>
        </span>
      </button>

      {/* Tap hint text */}
      <p className={`heart-hint ${stage === 'hint' ? 'visible' : ''}`}>
        Chạm vào bức thư để mở điều tui muốn nói...
      </p>

      {/* Cute sticker */}
      <img
        className={`heart-scene-sticker ${stage === 'hint' ? 'visible' : ''}`}
        src="/assets/images/memes/heart-cat.png"
        alt=""
        style={{ zIndex: 5 }}
      />
    </section>
  );
}
