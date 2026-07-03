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
  ctx.font = '500 16px sans-serif'; // Clean sans-serif, non-italic to prevent Vietnamese diacritic split bugs on canvas
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

function PhotoCard({ photo, index, activeScene, activeCapsule, setActiveCapsule, openedCapsules = [] }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  // Fallback state if load fails
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      photo.src,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        console.warn(`Photo [${index}] not found: ${photo.src}. Using custom Polaroid canvas texture fallback.`);
        setTexture(createFallbackTexture(photo.caption));
      }
    );
  }, [photo.src, photo.caption, index]);

  // Initial random positions for capsules distributed in a Ring
  const initialPosition = useMemo(() => {
    const angle = (index / 5) * Math.PI * 2;
    const radius = 2.4;
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * 0.4 + 0.2,
      -4.4
    ];
  }, [index]);

  const isActive = activeCapsule === index;
  const isAnyActive = activeCapsule !== null;

  useFrame((state, delta) => {
    if (!meshRef.current || !texture) return;
    const time = state.clock.getElapsedTime();

    if (activeScene === 5) {
      // Scene 5: Memory Capsules interactive mode
      if (isActive) {
        // Morph to focused Polaroid card in front of camera
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.08);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.2, 0.08);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -2.4, 0.08);

        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.08);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.08);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.08);
        
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.25, 0.08);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.25, 0.08);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.25, 0.08);
      } else if (isAnyActive) {
        // Hide other cards when one is open
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 0, 0.08);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 0, 0.08);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 0, 0.08);
      } else {
        // Ambient floating capsule (glowing sphere)
        const isUnlocked = index === 0 || openedCapsules.includes(index - 1);
        const isNext = index === openedCapsules.length;
        const pulse = isNext ? (1 + Math.sin(time * 6) * 0.08) : 1;
        const targetScale = isUnlocked ? (0.45 * pulse) : 0.28;

        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, initialPosition[0], 0.06);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, initialPosition[1] + Math.sin(time + index) * 0.1, 0.06);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, initialPosition[2], 0.06);

        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, time * 0.2 + index, 0.06);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, time * 0.3, 0.06);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.06);

        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.06);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.06);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.06);
      }
    } else if (activeScene === 6) {
      // Scene 6: Climax mode. Cards rotate in a gorgeous circular ring
      const radius = 3.5;
      const speed = 0.5;
      const angle = (index / 5) * Math.PI * 2 + time * speed;

      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(time * 0.5 + index) * 0.2;
      const targetZ = Math.sin(angle) * radius - 4.5;

      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08);

      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = -angle + Math.PI / 2;
      meshRef.current.rotation.z = 0;

      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 0.8, 0.08);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 0.8, 0.08);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 0.8, 0.08);
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
    
    // Check if this specific capsule is unlocked
    const isUnlocked = index === 0 || openedCapsules.includes(index - 1);
    if (!isUnlocked) return;

    if (isActive) {
      setActiveCapsule(null);
    } else {
      setActiveCapsule(index);
    }
  };

  return (
    <mesh ref={meshRef} onClick={handleClick}>
      {isActive ? (
        <planeGeometry args={[1.8, 2.2]} />
      ) : (
        <sphereGeometry args={[0.6, 32, 32]} />
      )}

      {isActive ? (
        <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
      ) : (
        (() => {
          const isUnlocked = index === 0 || openedCapsules.includes(index - 1);
          return (
            <meshStandardMaterial 
              color={isUnlocked ? "#ec4899" : "#4b5563"} 
              emissive={isUnlocked ? "#ec4899" : "#1f2937"} 
              emissiveIntensity={isUnlocked ? 2.5 : 0.15} 
              roughness={0.1}
              metalness={0.8}
            />
          );
        })()
      )}
    </mesh>
  );
}

export default function PhotoCards({ activeScene, activeCapsule, setActiveCapsule, openedCapsules = [] }) {
  return (
    <group>
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
