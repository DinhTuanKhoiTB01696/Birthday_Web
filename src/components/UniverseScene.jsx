import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import StarField from '../three/StarField';
import Planets from '../three/Planets';
import PhotoCards from '../three/PhotoCards';
import Spaceship from '../three/Spaceship';
import HeartPlanet from '../three/HeartPlanet';

function CameraController({ activeScene }) {
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera }) => {
    let targetPos = new THREE.Vector3(0, 0, 6);
    let targetLook = new THREE.Vector3(0, 0, 0);

    switch (activeScene) {
      case 1: // Start Screen
      case 2: // Typing Intro
        targetPos.set(0, 0, 75); // pulled far away in the galaxy
        targetLook.set(0, 0, 0);
        break;
      case 3: // Universe captions drift
        targetPos.set(0, 0.4, 5.5);
        targetLook.set(0, 0.1, -1);
        break;
      case 4: // Constellation Map
        targetPos.set(0, 0, 4.8);
        targetLook.set(0, 0, 0);
        break;
      case 5: // Memory Capsules interaction
        targetPos.set(0, 0.3, 4.2);
        targetLook.set(0, 0.1, -2);
        break;
      case 6: // Warp Climax
        targetPos.set(0, 0, 3.6);
        targetLook.set(0, 0, -2);
        break;
      case 7: // Spaceship Journey
        targetPos.set(0, 0.8, 3.8); // slight offset overhead follow
        targetLook.set(0, 0, -3);
        break;
      case 8: // YouTube video scene
      case 9: // Interactive Letter
      case 10: // Proposal Choice
      case 11: // Contact & Final accepted
        targetPos.set(0, 0.35, 2.2); // zoom close to heart planet
        targetLook.set(0, 0.35, -2);
        break;
      default:
        break;
    }

    camera.position.lerp(targetPos, 0.04);
    lookTarget.current.lerp(targetLook, 0.04);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

export default function UniverseScene({ activeScene, activeCapsule, setActiveCapsule, openedCapsules = [], isAccepted, onHeartClick3Times }) {
  // Speed multiplier dynamic mappings based on cues
  const starSpeed = activeScene === 6 ? 4.5 : (activeScene === 7 ? 9 : 1);

  return (
    <div 
      className="canvas-container" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 75], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <CameraController activeScene={activeScene} />

        {/* Ambient lighting */}
        <ambientLight intensity={isAccepted ? 0.7 : 0.4} />

        {/* Primary light source */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={isAccepted ? 1.8 : 1.0} 
          color={isAccepted ? "#fdbaf8" : "#ffffff"} 
        />

        {/* Side cosmic bleed lights */}
        <pointLight position={[-8, 4, -5]} intensity={1.5} color={isAccepted ? "#db2777" : "#6d28d9"} />
        <pointLight position={[8, -4, -5]} intensity={1.5} color={isAccepted ? "#f472b6" : "#2563eb"} />

        {/* Star Field */}
        <StarField speedMultiplier={starSpeed} />

        {/* Rotating ambient cosmic planets */}
        {activeScene >= 3 && activeScene <= 5 && <Planets />}

        {/* Floating memory capsules (PhotoCards) */}
        {activeScene >= 5 && activeScene <= 6 && (
          <PhotoCards 
            activeScene={activeScene} 
            activeCapsule={activeCapsule} 
            setActiveCapsule={setActiveCapsule} 
            openedCapsules={openedCapsules}
          />
        )}

        {/* Flying spaceship */}
        {activeScene === 7 && <Spaceship activeScene={activeScene} />}

        {/* Confession Heart shape planet */}
        {activeScene >= 7 && (
          <HeartPlanet 
            activeScene={activeScene} 
            isAccepted={isAccepted} 
            onHeartClick3Times={onHeartClick3Times} 
          />
        )}
      </Canvas>
    </div>
  );
}
