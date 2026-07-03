import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HeartPlanet({ activeScene, onHeartClick3Times, isAccepted }) {
  const meshRef = useRef();
  const [clickCount, setClickCount] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);

  // Extrude the heart shape using bezier paths
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
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
    const time = state.clock.getElapsedTime();

    // Lerp squishy scale back to normal
    setPulseScale((prev) => THREE.MathUtils.lerp(prev, 1, 0.08));

    // Glow and grow state when accepted
    const baseScale = isAccepted ? 1.55 : 1.0;
    const scaleFactor = baseScale * pulseScale;
    meshRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

    if (activeScene >= 9) {
      // Scene 9+: Heart centered
      meshRef.current.position.x = 0;
      meshRef.current.position.y = 0.35;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -3.2, 0.05);

      meshRef.current.rotation.y = time * 0.35;
      meshRef.current.rotation.x = Math.sin(time * 0.4) * 0.08;
    } else if (activeScene === 7) {
      // Scene 7 (Spaceship Journey): heart moves into view
      meshRef.current.position.x = 0;
      meshRef.current.position.y = 0.3;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -12, 0.04);
      meshRef.current.rotation.y += 0.2 * delta;
    } else {
      // Hide
      meshRef.current.position.z = -50;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (activeScene < 7) return;

    setPulseScale(1.3); // Pulse squish!
    const nextVal = clickCount + 1;
    setClickCount(nextVal);

    if (nextVal === 3 && onHeartClick3Times) {
      onHeartClick3Times();
    }
  };

  return (
    <group>
      <mesh 
        ref={meshRef} 
        geometry={heartGeometry} 
        position={[0, 0.3, -50]}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color="#ec4899"
          emissive={isAccepted ? "#db2777" : "#be185d"}
          emissiveIntensity={isAccepted ? 2.5 : 1.2}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>
      
      {/* Aura Light source */}
      {activeScene >= 7 && (
        <pointLight 
          position={[0, 0.3, activeScene >= 9 ? -3 : -11]} 
          intensity={isAccepted ? 8 : (activeScene >= 9 ? 4 : 1.5)} 
          distance={12} 
          color="#ec4899" 
        />
      )}
    </group>
  );
}
