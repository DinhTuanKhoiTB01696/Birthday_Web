import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField({ speedMultiplier = 1 }) {
  const pointsRef = useRef();
  const count = 1500;

  // Generate random positions and velocities
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 60; // Spread along Z
      spd[i] = 0.02 + Math.random() * 0.08;
    }
    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const array = positionsAttr.array;

    for (let i = 0; i < count; i++) {
      // Move stars along Z towards the camera
      array[i * 3 + 2] += speeds[i] * speedMultiplier * delta * 40;

      // If a star goes past the camera, reset it to the back
      if (array[i * 3 + 2] > 30) {
        array[i * 3 + 2] = -90;
        array[i * 3] = (Math.random() - 0.5) * 80;
        array[i * 3 + 1] = (Math.random() - 0.5) * 80;
      }
    }

    positionsAttr.needsUpdate = true;

    // Slow rotation
    pointsRef.current.rotation.z += 0.015 * delta;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#f8fafc"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}
