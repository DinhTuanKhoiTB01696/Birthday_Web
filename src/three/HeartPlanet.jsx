import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HeartPlanet({ activeScene }) {
  const meshRef = useRef();

  // Create the extruded heart shape geometry
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Symmetric heart path centered at (0, 0)
    shape.moveTo(0, 0.4);
    shape.bezierCurveTo(0, 0.75, 0.55, 0.75, 0.55, 0.4);
    shape.bezierCurveTo(0.55, 0.1, 0, -0.3, 0, -0.6); // bottom tip
    shape.bezierCurveTo(0, -0.3, -0.55, 0.1, -0.55, 0.4);
    shape.bezierCurveTo(-0.55, 0.75, 0, 0.75, 0, 0.4);

    const extrudeSettings = {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (activeScene === 6) {
      // Scene 6: Position at center, slowly rotating
      meshRef.current.position.x = 0;
      meshRef.current.position.y = 0.3;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -3.2, 0.05);

      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.4;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    } else if (activeScene === 5) {
      // Scene 5 (Spaceship Journey): Heart Planet starts to appear in the distance
      meshRef.current.position.x = 0;
      meshRef.current.position.y = 0.3;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -18, 0.05);
      meshRef.current.rotation.y += 0.2 * delta;
    } else {
      // Hide
      meshRef.current.position.z = -50;
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        geometry={heartGeometry} 
        position={[0, 0.3, -50]}
      >
        <meshStandardMaterial
          color="#ec4899"
          emissive="#be185d"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Dynamic light inside/behind the heart planet for extra glow aura */}
      {activeScene >= 5 && (
        <pointLight 
          position={[0, 0.3, activeScene === 6 ? -3 : -17]} 
          intensity={activeScene === 6 ? 4 : 1.5} 
          distance={10} 
          color="#ec4899" 
        />
      )}
    </group>
  );
}
