import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createParametricHeartGeometry } from '../components/heart/HeartWireframeScene';

export default function HeartPlanet({ activeScene, onHeartClick3Times, isAccepted }) {
  const groupRef = useRef();
  const [clickCount, setClickCount] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);

  // Use the improved parametric heart geometry
  const heartGeometry = useMemo(() => createParametricHeartGeometry(60, 60), []);

  // Sparkle particles orbiting the heart
  const [sparklePositions, sparkleSpeeds] = useMemo(() => {
    const count = 35;
    const pos = new Float32Array(count * 3);
    const speeds = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 0.5 + Math.random() * 1.0;
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * dist;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * dist;
      pos[i * 3 + 2] = Math.cos(phi) * dist * 0.5;
      speeds.push({
        orbitSpeed: 0.3 + Math.random() * 0.5,
        yDrift: 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        radius: dist
      });
    }
    return [pos, speeds];
  }, []);

  const sparklesRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Lerp squishy scale back to normal after click
    setPulseScale((prev) => THREE.MathUtils.lerp(prev, 1, 0.08));

    const baseScale = isAccepted ? 0.92 : 0.82;
    const scaleFactor = baseScale * pulseScale;

    if (activeScene >= 9) {
      // Scene 9+: Heart centered, close up
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.3, 0.05);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -3.2, 0.04);

      groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.15;
      groupRef.current.rotation.x = Math.sin(time * 0.35) * 0.06;
      groupRef.current.rotation.z = Math.sin(time * 0.28) * 0.03;
    } else if (activeScene === 7) {
      // Scene 7 (Spaceship Journey): heart in distance
      groupRef.current.position.x = 0;
      groupRef.current.position.y = 0.3;
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -10, 0.04);
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.18;
      groupRef.current.rotation.x = Math.sin(time * 0.35) * 0.05;
    } else {
      // Hide off-screen
      groupRef.current.position.z = -50;
    }

    groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Animate sparkles
    if (sparklesRef.current) {
      const geo = sparklesRef.current.geometry;
      const posArr = geo.attributes.position.array;
      for (let i = 0; i < sparkleSpeeds.length; i++) {
        const s = sparkleSpeeds[i];
        const angle = time * s.orbitSpeed + s.phase;
        posArr[i * 3] = Math.cos(angle) * s.radius * 0.9;
        posArr[i * 3 + 1] = Math.sin(time * s.yDrift + s.phase) * s.radius * 0.8;
        posArr[i * 3 + 2] = Math.sin(angle) * s.radius * 0.5;
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (activeScene < 7) return;

    setPulseScale(1.25);
    const nextVal = clickCount + 1;
    setClickCount(nextVal);

    if (nextVal === 3 && onHeartClick3Times) {
      onHeartClick3Times();
    }
  };

  return (
    <group ref={groupRef} position={[0, 0.3, -50]}>
      {/* Main solid heart — glossy pink */}
      <mesh geometry={heartGeometry} onClick={handleClick}>
        <meshStandardMaterial
          color="#f9a8d4"
          emissive={isAccepted ? "#f472b6" : "#ec4899"}
          emissiveIntensity={isAccepted ? 2.5 : 1.8}
          roughness={0.06}
          metalness={0.32}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={heartGeometry}>
        <meshBasicMaterial
          color="#ffd1e8"
          transparent
          opacity={activeScene >= 7 ? 0.22 : 0}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sparkle particles orbiting heart */}
      {activeScene >= 7 && (
        <points ref={sparklesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sparklePositions, 3]}
              count={sparklePositions.length / 3}
              array={sparklePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color="#ffd6eb"
            transparent
            opacity={0.75}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Aura light source */}
      {activeScene >= 7 && (
        <pointLight
          position={[0, 0, 0]}
          intensity={isAccepted ? 7 : (activeScene >= 9 ? 3.5 : 1.8)}
          distance={10}
          color="#ec4899"
        />
      )}
    </group>
  );
}
