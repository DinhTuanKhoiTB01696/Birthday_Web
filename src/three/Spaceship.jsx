import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Spaceship({ activeScene }) {
  const spaceshipRef = useRef();

  useFrame((state, delta) => {
    if (!spaceshipRef.current) return;

    if (activeScene === 5) {
      // Spaceship active scene: oscillate ship flight gently
      const time = state.clock.getElapsedTime();
      
      // Base placement
      spaceshipRef.current.position.x = Math.sin(time * 2.5) * 0.4;
      spaceshipRef.current.position.y = Math.cos(time * 1.8) * 0.25;
      spaceshipRef.current.position.z = -3.2;

      // Pitch, yaw, roll rotation dynamics
      spaceshipRef.current.rotation.z = Math.sin(time * 2.5) * 0.25; // roll
      spaceshipRef.current.rotation.y = Math.PI + Math.sin(time * 2.5) * 0.08; // yaw
      spaceshipRef.current.rotation.x = Math.cos(time * 1.8) * 0.08; // pitch
    } else {
      // Place ship outside viewport when not in flight
      spaceshipRef.current.position.y = -25;
    }
  });

  return (
    <group ref={spaceshipRef} position={[0, -25, -3.2]} rotation={[0, Math.PI, 0]}>
      {/* Ship Central Cylinder Body */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 1, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[0, 0, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.5, 8]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Left Wing */}
      <mesh position={[-0.35, -0.04, 0.15]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.5, 0.04, 0.35]} />
        <meshStandardMaterial color="#6d28d9" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[0.35, -0.04, 0.15]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.5, 0.04, 0.35]} />
        <meshStandardMaterial color="#6d28d9" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Engine Exhaust Flame Cone */}
      <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>

      {/* Thruster Engine Glow Point Light */}
      <pointLight position={[0, 0, 0.8]} intensity={2.5} distance={4} color="#ec4899" />
    </group>
  );
}
