import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Planets() {
  const groupRef = useRef();

  // Create three planets with different sizes, colors, and offsets
  const planetsData = useMemo(() => [
    {
      size: 1.2,
      color: '#6d28d9', // Deep Purple
      emissive: '#4c1d95',
      distance: 14,
      yOffset: 2,
      wireframe: false
    },
    {
      size: 0.8,
      color: '#2563eb', // Blue
      emissive: '#1d4ed8',
      distance: 22,
      yOffset: -3,
      wireframe: true // Tech wireframe planet
    },
    {
      size: 0.5,
      color: '#ec4899', // Pink glow
      emissive: '#be185d',
      distance: 28,
      yOffset: 1,
      wireframe: false
    }
  ], []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Slow orbit rotation
    groupRef.current.rotation.y += 0.03 * delta;

    // Spin individual planets on their axes
    groupRef.current.children.forEach((mesh) => {
      mesh.rotation.y += 0.1 * delta;
    });
  });

  return (
    <group ref={groupRef}>
      {planetsData.map((planet, i) => {
        const angle = (i * Math.PI * 2) / planetsData.length;
        const x = Math.cos(angle) * planet.distance;
        const z = -25 - Math.sin(angle) * 8; // Offset behind the gallery
        
        return (
          <mesh key={i} position={[x, planet.yOffset, z]}>
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.emissive}
              emissiveIntensity={0.6}
              roughness={0.6}
              metalness={0.3}
              wireframe={planet.wireframe}
            />
          </mesh>
        );
      })}
    </group>
  );
}
