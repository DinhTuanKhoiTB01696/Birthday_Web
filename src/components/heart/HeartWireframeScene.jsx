import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Create a high-fidelity 3D heart surface using the standard parametric heart curve
 * with spherical depth mapping for a beautiful, symmetric, pillow-like shape.
 * 
 * The classic 2D heart curve:
 *   x = sin³(t)
 *   y = (13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)) / 16
 *
 * Extended to 3D by revolving around the y-axis with a smooth depth envelope.
 */
export const createParametricHeartGeometry = (uSegments = 80, vSegments = 80) => {
  const vertices = [];
  const indices = [];
  const uvs = [];

  const scale = 0.055;

  for (let i = 0; i <= uSegments; i++) {
    const u = (i / uSegments) * Math.PI * 2; // 0 → 2π

    for (let j = 0; j <= vSegments; j++) {
      const v = (j / vSegments) * Math.PI; // 0 → π

      // Mathematical 3D parametric heart surface
      const x = Math.sin(v) * (15 * Math.sin(u) - 4 * Math.sin(3 * u)) * scale;
      const y = Math.sin(v) * (15 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) * scale;
      const z = 6.2 * Math.cos(v) * scale;

      vertices.push(x, y, z);
      uvs.push(i / uSegments, j / vSegments);
    }
  }

  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = (i + 1) * (vSegments + 1) + j;
      const c = (i + 1) * (vSegments + 1) + j + 1;
      const d = i * (vSegments + 1) + j + 1;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};

export default function HeartWireframeScene({ opacity = 1.0 }) {
  const groupRef = useRef();
  const dustRef = useRef();

  const heartGeo = useMemo(() => createParametricHeartGeometry(80, 80), []);

  // Ambient sparkle particles floating around the heart
  const [dustPositions, dustSpeeds] = useMemo(() => {
    const count = 55;
    const pos = new Float32Array(count * 3);
    const speeds = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 0.6 + Math.random() * 1.4;

      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * dist;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * dist;
      pos[i * 3 + 2] = Math.cos(phi) * dist * 0.6;

      speeds.push({
        ySpeed: 0.08 + Math.random() * 0.15,
        xDrift: (Math.random() - 0.5) * 0.02,
        phase: Math.random() * Math.PI * 2,
        amp: 0.03 + Math.random() * 0.08
      });
    }
    return [pos, speeds];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Rotate and decelerate smoothly to land perfectly facing front (360 degrees / 2*PI)
      let rotationY = 0;
      const damp = time < 3.8 ? 1 : Math.max(0, 1 - (time - 3.8) / 2.0);

      if (time < 3.8) {
        rotationY = time * 1.35;
      } else if (time < 5.8) {
        const progress = (time - 3.8) / 2.0; // 0 to 1
        const easeOut = 1 - Math.pow(1 - progress, 3); // cubic ease out
        const startVal = 3.8 * 1.35; // ~5.13 radians
        const targetVal = 2 * Math.PI; // ~6.28 radians
        rotationY = startVal + (targetVal - startVal) * easeOut;
      } else {
        rotationY = 2 * Math.PI;
      }

      groupRef.current.rotation.y = rotationY;
      groupRef.current.rotation.x = Math.sin(time * 0.45) * 0.08 * damp;
      groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.03 * damp;

      // Double-beat heartbeat pulse
      const pulseCycle = (time * 1.2) % Math.PI;
      const heartbeat = Math.pow(Math.sin(pulseCycle), 12) * 0.06 +
        Math.pow(Math.sin(pulseCycle + 0.35), 18) * 0.025;
      const currentScale = (0.78 + heartbeat) * opacity;
      groupRef.current.scale.set(currentScale, currentScale, currentScale);
    }

    // Animate sparkles
    if (dustRef.current) {
      const geo = dustRef.current.geometry;
      const posArr = geo.attributes.position.array;
      for (let i = 0; i < dustSpeeds.length; i++) {
        const s = dustSpeeds[i];
        posArr[i * 3 + 1] += s.ySpeed * 0.004;
        posArr[i * 3] += Math.sin(time + s.phase) * s.amp * 0.008 + s.xDrift;
        if (posArr[i * 3 + 1] > 1.8) {
          posArr[i * 3 + 1] = -1.4;
          posArr[i * 3] = (Math.random() - 0.5) * 1.6;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* Primary wireframe — soft white-pink grid lines */}
      <mesh geometry={heartGeo}>
        <meshStandardMaterial
          color="#fff0f5"
          emissive="#f9a8d4"
          emissiveIntensity={1.8}
          transparent={true}
          opacity={0.72 * opacity}
          wireframe={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer glow wireframe layer */}
      <mesh geometry={heartGeo} scale={[1.018, 1.018, 1.018]}>
        <meshBasicMaterial
          color="#fbb6ce"
          transparent={true}
          opacity={0.18 * opacity}
          wireframe={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner soft solid core for depth illusion */}
      <mesh geometry={heartGeo} scale={[0.97, 0.97, 0.97]}>
        <meshStandardMaterial
          color="#fce4ec"
          emissive="#f48fb1"
          emissiveIntensity={0.6}
          transparent={true}
          opacity={0.12 * opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sparkle particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
            count={dustPositions.length / 3}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color="#ffd6eb"
          transparent={true}
          opacity={0.7 * opacity}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central glow light */}
      <pointLight distance={4} intensity={2.5 * opacity} color="#f48fb1" position={[0, 0, 0]} />
    </group>
  );
}
