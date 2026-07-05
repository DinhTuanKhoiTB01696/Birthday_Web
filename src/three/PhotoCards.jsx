import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { birthdayConfig } from '../data/content';

// Draw custom polaroid card fallback texture using 2D canvas context if image fails to load
const createFallbackTexture = (captionText) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  // Background gradient fill
  const grad = ctx.createLinearGradient(0, 0, 512, 640);
  grad.addColorStop(0, '#31105e');
  grad.addColorStop(1, '#0e031a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 640);

  // Border frame (Polaroid border)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(20, 20, 472, 472);
  
  // Outer line glow
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 492, 620);

  // White base for caption
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(20, 505, 472, 115);

  // Draw star icon
  ctx.fillStyle = '#fdbaf8';
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨', 256, 256);

  // Polaroid Caption Text
  ctx.fillStyle = '#f8fafc';
  ctx.font = '500 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Wrap caption text
  const words = (captionText || 'A Memory').split(' ');
  let line = '';
  let y = 545;
  const maxWidth = 420;
  const lineHeight = 26;

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, 256, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 256, y);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// ─── Solar system planet configs ───
// Each planet corresponds to one memory capsule / photo
const PLANET_CONFIGS = [
  { name: 'Mercury',  color: '#b0b0b8', emissive: '#6b6b73', intensity: 0.6,  radius: 0.18, roughness: 0.9, metalness: 0.15, orbitRadius: 1.4,  orbitSpeed: 1.6,  orbitTilt: 0.02 },
  { name: 'Venus',    color: '#e8c547', emissive: '#a67c00', intensity: 1.2,  radius: 0.24, roughness: 0.5, metalness: 0.35, orbitRadius: 2.0,  orbitSpeed: 1.15, orbitTilt: -0.04 },
  { name: 'Earth',    color: '#4d9de0', emissive: '#1a5fb4', intensity: 1.5,  radius: 0.26, roughness: 0.35, metalness: 0.25, orbitRadius: 2.7,  orbitSpeed: 0.85, orbitTilt: 0.06 },
  { name: 'Mars',     color: '#d45d3c', emissive: '#8b2500', intensity: 1.3,  radius: 0.20, roughness: 0.75, metalness: 0.1,  orbitRadius: 3.4,  orbitSpeed: 0.65, orbitTilt: -0.03 },
  { name: 'Saturn',   color: '#e8c97a', emissive: '#6d4c00', intensity: 1.0,  radius: 0.38, roughness: 0.4, metalness: 0.45, orbitRadius: 4.4,  orbitSpeed: 0.38, orbitTilt: 0.05 },
];

// ─── Glowing Sun component ───
function Sun() {
  const sunRef = useRef();

  useFrame((state) => {
    if (!sunRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle pulsing glow
    const scale = 0.55 + Math.sin(t * 1.5) * 0.03;
    sunRef.current.scale.setScalar(scale);
    sunRef.current.rotation.y = t * 0.15;
  });

  return (
    <group>
      {/* Core sun sphere */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ffd54f"
          emissive="#ff8f00"
          emissiveIntensity={4.0}
          roughness={0.2}
          metalness={0.0}
        />
      </mesh>
      {/* Point light emanating from sun */}
      <pointLight position={[0, 0, 0]} intensity={3.5} color="#ffb74d" distance={18} decay={1.8} />
      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshBasicMaterial color="#fff3e0" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

// ─── Orbital path ring ───
function OrbitRing({ radius, tilt, isUnlocked }) {
  return (
    <mesh rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <ringGeometry args={[radius - 0.012, radius + 0.012, 128]} />
      <meshBasicMaterial
        color={isUnlocked ? '#6d6d80' : '#2a2a3a'}
        transparent
        opacity={isUnlocked ? 0.35 : 0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Saturn rings sub-component ───
function SaturnRings({ parentRef, planetRadius, isUnlocked }) {
  const ringRef = useRef();

  useFrame(() => {
    if (!ringRef.current || !parentRef.current) return;
    ringRef.current.position.copy(parentRef.current.position);
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2.3, Math.PI / 8, 0]}>
      <ringGeometry args={[planetRadius * 1.4, planetRadius * 2.4, 64]} />
      <meshStandardMaterial
        color={isUnlocked ? '#c9a642' : '#1f2937'}
        transparent
        opacity={isUnlocked ? 0.7 : 0.15}
        side={THREE.DoubleSide}
        emissive={isUnlocked ? '#6d4c00' : '#000000'}
        emissiveIntensity={isUnlocked ? 0.6 : 0}
      />
    </mesh>
  );
}

// ─── Single planet card ───
function PhotoCard({ photo, index, activeScene, activeCapsule, setActiveCapsule, openedCapsules = [] }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  const config = PLANET_CONFIGS[index] || PLANET_CONFIGS[0];

  // Load photo texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      photo.src,
      (loadedTexture) => {
        // If it's the first photo (IMG_4822.JPG), it has a black bar on the left (screenshot).
        // Crop it to show only the right 50% containing An's photo.
        if (index === 0) {
          loadedTexture.repeat.set(0.5, 1);
          loadedTexture.offset.set(0.5, 0);
        }
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        console.warn(`Photo [${index}] not found: ${photo.src}. Using fallback.`);
        setTexture(createFallbackTexture(photo.caption));
      }
    );
  }, [photo.src, photo.caption, index]);

  const isActive = activeCapsule === index;
  const isAnyActive = activeCapsule !== null;

  useFrame((state) => {
    if (!meshRef.current || !texture) return;
    const time = state.clock.getElapsedTime();

    if (activeScene === 5) {
      // Scene 5: Memory Capsules (solar system orbiting)
      if (isActive) {
        // Zoom to center as a Polaroid card
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.08);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.2, 0.08);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 2.5, 0.08);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.08);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.08);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.08);
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1.25, 0.08));
      } else if (isAnyActive) {
        // Shrink other planets when one is open
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 0, 0.08));
      } else {
        // Orbit the Sun — direct position for smooth continuous circular motion
        const isUnlocked = index === 0 || openedCapsules.includes(index - 1);
        const isNext = index === openedCapsules.length;
        const pulse = isNext ? (1 + Math.sin(time * 4) * 0.12) : 1;
        const targetScale = isUnlocked ? (1.0 * pulse) : 0.6;

        const angle = time * config.orbitSpeed;
        meshRef.current.position.x = Math.cos(angle) * config.orbitRadius;
        meshRef.current.position.y = Math.sin(angle) * config.orbitTilt * 0.5;
        meshRef.current.position.z = Math.sin(angle) * config.orbitRadius;

        // Planets self-rotate
        meshRef.current.rotation.y += 0.02;

        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.06));
      }
    } else if (activeScene === 6) {
      // Scene 6: Continue orbiting in the solar system
      const angle = time * config.orbitSpeed * 0.8;
      meshRef.current.position.x = Math.cos(angle) * config.orbitRadius;
      meshRef.current.position.y = Math.sin(angle) * config.orbitTilt * 0.5;
      meshRef.current.position.z = Math.sin(angle) * config.orbitRadius;

      meshRef.current.rotation.y += 0.015;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 0.9, 0.08));
    } else {
      // Slide away for other scenes
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, (index % 2 === 0 ? -15 : 15), 0.06);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -30, 0.06);
    }
  });

  if (!texture) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    if (activeScene !== 5) return;
    
    const isUnlocked = index === 0 || openedCapsules.includes(index - 1);
    if (!isUnlocked) return;

    if (isActive) {
      setActiveCapsule(null);
    } else {
      setActiveCapsule(index);
    }
  };

  const isUnlocked = index === 0 || openedCapsules.includes(index - 1);
  const planetColor = isUnlocked ? config.color : '#374151';
  const planetEmissive = isUnlocked ? config.emissive : '#111827';
  const planetIntensity = isUnlocked ? config.intensity : 0.08;

  return (
    <group>
      <mesh ref={meshRef} onClick={handleClick}>
        {isActive ? (
          <planeGeometry args={[1.8, 2.2]} />
        ) : (
          <sphereGeometry args={[config.radius, 32, 32]} />
        )}

        {isActive ? (
          <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial 
            color={planetColor} 
            emissive={planetEmissive} 
            emissiveIntensity={planetIntensity} 
            roughness={config.roughness}
            metalness={config.metalness}
          />
        )}
      </mesh>

      {/* Saturn's 3D tilted rings */}
      {index === 4 && !isActive && (
        <SaturnRings parentRef={meshRef} planetRadius={config.radius} isUnlocked={isUnlocked} />
      )}
    </group>
  );
}

// ─── Main exported component: Solar System ───
export default function PhotoCards({ activeScene, activeCapsule, setActiveCapsule, openedCapsules = [] }) {
  // Center everything around z = -5 (the solar system center)
  const systemCenter = useMemo(() => [0, 0, -5], []);

  return (
    <group position={systemCenter}>
      {/* The Sun at the center */}
      <Sun />

      {/* Orbital path rings */}
      {PLANET_CONFIGS.map((config, i) => {
        const isUnlocked = i === 0 || openedCapsules.includes(i - 1);
        return (
          <OrbitRing key={`orbit-${i}`} radius={config.orbitRadius} tilt={config.orbitTilt} isUnlocked={isUnlocked} />
        );
      })}

      {/* Planets */}
      {birthdayConfig.photos.map((photo, index) => (
        <PhotoCard 
          key={index} 
          photo={photo} 
          index={index} 
          activeScene={activeScene}
          activeCapsule={activeCapsule}
          setActiveCapsule={setActiveCapsule}
          openedCapsules={openedCapsules}
        />
      ))}
    </group>
  );
}
