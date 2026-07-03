import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import StarField from '../three/StarField';
import PhotoCards from '../three/PhotoCards';
import Planets from '../three/Planets';
import Spaceship from '../three/Spaceship';
import HeartPlanet from '../three/HeartPlanet';

function CameraController({ activeScene }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const targetPos = new THREE.Vector3(0, 0, 6);
    const targetLook = new THREE.Vector3(0, 0, 0);

    switch (activeScene) {
      case 1:
      case 2:
        const t = state.clock.getElapsedTime();
        // Slow drift movement on landing screens
        targetPos.set(Math.sin(t * 0.15) * 0.4, Math.cos(t * 0.1) * 0.3, 6);
        targetLook.set(0, 0, 0);
        break;
      case 3:
        targetPos.set(0, 0, 4.8);
        targetLook.set(0, 0, 0);
        break;
      case 4:
        // Gallery mode: zoom in closer to inspect the floating cards
        targetPos.set(0, 0.2, 2.2);
        targetLook.set(0, 0.2, -3);
        break;
      case 5:
        // Follow-camera behind/above the spaceship looking forward
        targetPos.set(0, 0.7, -1);
        targetLook.set(0, 0.1, -4.5);
        break;
      case 6:
        // Centered directly on the heart planet
        targetPos.set(0, 0.2, 1.8);
        targetLook.set(0, 0.3, -3.2);
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

export default function UniverseScene({ activeScene, focusedIndex, starSpeed }) {
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
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <CameraController activeScene={activeScene} />

        {/* Ambient base lighting */}
        <ambientLight intensity={0.4} />

        {/* Dynamic primary light */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          color="#ffffff" 
        />

        {/* Colored side lights for cosmic color bleed */}
        <pointLight position={[-8, 4, -5]} intensity={1.5} color="#6d28d9" />
        <pointLight position={[8, -4, -5]} intensity={1.5} color="#2563eb" />

        {/* Star Particle Field */}
        <StarField speedMultiplier={starSpeed} />

        {/* Rotating ambient cosmic planets - only in Scene 3 and 4 */}
        {activeScene >= 3 && activeScene <= 4 && <Planets />}

        {/* Floating gallery cards - appears from Scene 3 onwards, moves away in Scene 5 */}
        {activeScene >= 3 && <PhotoCards activeScene={activeScene} focusedIndex={focusedIndex} />}

        {/* Flying spaceship geometry - only in Scene 5 */}
        {activeScene === 5 && <Spaceship activeScene={activeScene} />}

        {/* Confession Heart shape planet - appears in Scene 5 and focuses in Scene 6 */}
        {activeScene >= 5 && <HeartPlanet activeScene={activeScene} />}
      </Canvas>
    </div>
  );
}
