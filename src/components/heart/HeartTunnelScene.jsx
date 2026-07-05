import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Create perfectly symmetric 2D heart outline points for tunnel rings.
 * Uses the standard mathematical heart curve with proper closure.
 */
const createHeartOutlinePoints = (numPoints = 120) => {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2;
    const x = Math.pow(Math.sin(t), 3) * 1.08;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16 * 1.02;
    points.push(new THREE.Vector3(x, y, 0));
  }
  // Ensure perfect closure — connect back to the first point
  points.push(points[0].clone());
  return points;
};

/**
 * Tunnel ring controller: handles continuous Z-zoom animation.
 * Each ring starts at the back and travels forward past the camera.
 */
function TunnelRingAnimator({ index, lineRef }) {
  const zPos = useRef(-16 + (index * 0.9));

  useFrame((state, delta) => {
    if (!lineRef.current) return;
    const time = state.clock.getElapsedTime();

    const speed = 2.4;
    const startZ = -16;
    const endZ = 2.0;
    const zRange = endZ - startZ;

    zPos.current += speed * delta;
    if (zPos.current > endZ) {
      zPos.current = startZ;
    }

    const progress = (zPos.current - startZ) / zRange;
    // Exponential scale — tiny at back, large near camera
    const scale = 0.02 + Math.pow(progress, 2.8) * 4.5;

    // Opacity: fade in → full → fade out
    let opacity = 0;
    if (progress < 0.15) {
      opacity = progress / 0.15;
    } else if (progress > 0.75) {
      opacity = (1 - progress) / 0.25;
    } else {
      opacity = 1;
    }

    lineRef.current.position.set(0, 0, zPos.current);
    lineRef.current.scale.set(scale, scale, 1);

    // Subtle rotation for organic feel
    lineRef.current.rotation.z = Math.sin(time * 0.15 + index * 0.06) * 0.04;

    if (lineRef.current.material) {
      lineRef.current.material.opacity = Math.max(0, opacity * 0.88);
      // Soft pink hue cycling
      const hue = 0.92 + Math.sin(time * 0.4 + index * 0.03) * 0.025;
      lineRef.current.material.color.setHSL(hue, 0.85, 0.72);
    }
  });

  return null;
}

/**
 * Single tunnel ring component — a heart outline loop.
 */
function TunnelRing({ index, points }) {
  const lineRef = useRef();

  return (
    <lineLoop ref={lineRef}>
      <bufferGeometry attach="geometry" onUpdate={(geo) => geo.setFromPoints(points)} />
      <lineBasicMaterial
        attach="material"
        color="#f48fb1"
        linewidth={2}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      <TunnelRingAnimator index={index} lineRef={lineRef} />
    </lineLoop>
  );
}

/**
 * Light ray sparkles flying through the tunnel.
 */
function TunnelSparkles({ count = 90 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 2.8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -16 + Math.random() * 18;

      const color = new THREE.Color();
      color.setHSL(0.92 + Math.random() * 0.06, 0.9, 0.6 + Math.random() * 0.35);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posArr = geo.attributes.position.array;

    const speed = 9.0;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 2] += speed * delta;

      if (posArr[i * 3 + 2] > 2.0) {
        posArr[i * 3 + 2] = -16 - Math.random() * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.2 + Math.random() * 2.4;
        posArr[i * 3] = Math.cos(angle) * radius;
        posArr[i * 3 + 1] = Math.sin(angle) * radius;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeartTunnelScene({ opacity = 1.0 }) {
  const totalRings = 20;
  const points = useMemo(() => createHeartOutlinePoints(120), []);

  return (
    <group scale={[opacity, opacity, opacity]}>
      {/* Concentric glowing heart rings */}
      {Array.from({ length: totalRings }).map((_, idx) => (
        <TunnelRing key={idx} index={idx} points={points} />
      ))}

      {/* Flying sparkle particles */}
      <TunnelSparkles count={85} />

      {/* Central tunnel glow */}
      <pointLight position={[0, 0, -8]} intensity={4.0 * opacity} distance={18} color="#f48fb1" />
      <pointLight position={[0, 0, -2]} intensity={2.0 * opacity} distance={8} color="#fce4ec" />
    </group>
  );
}
