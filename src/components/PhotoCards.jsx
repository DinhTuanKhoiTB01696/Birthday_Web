import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { birthdayConfig } from '../data/content';

// Utility to generate a polaroid canvas texture if image is missing
const createFallbackTexture = (captionText) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, 640);
  gradient.addColorStop(0, '#1d1544');
  gradient.addColorStop(0.5, '#6d28d9');
  gradient.addColorStop(1, '#db2777');
  ctx.fillStyle = gradient;
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

function PhotoCard({ photo, index, activeScene, focusedIndex }) {
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

  // Initial random positioning for the universe scene
  const initialPosition = useMemo(() => {
    const angle = (index / birthdayConfig.photos.length) * Math.PI * 2;
    const radius = 6 + Math.random() * 2;
    return [
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 4,
      -8 - index * 5
    ];
  }, [index]);

  const initialRotation = useMemo(() => [
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.3
  ], []);

  useFrame((state, delta) => {
    if (!meshRef.current || !texture) return;

    if (activeScene <= 3) {
      // Scene 3: Floating ambiently in the universe
      // Slow float
      const time = state.clock.getElapsedTime();
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, initialPosition[0], 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, initialPosition[1] + Math.sin(time + index) * 0.15, 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, initialPosition[2], 0.05);
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, initialRotation[0], 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, initialRotation[1] + Math.sin(time * 0.5) * 0.1, 0.05);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, initialRotation[2], 0.05);
    } else if (activeScene === 4) {
      // Scene 4: Gallery mode. Focus the active card
      let targetX = 0;
      let targetY = 0.2;
      let targetZ = -3.5;
      
      let targetRotX = 0;
      let targetRotY = 0;
      let targetRotZ = 0;

      if (index === focusedIndex) {
        // Focused card right in front of the camera
        targetX = 0;
        targetY = 0.2;
        targetZ = -2.8;
      } else if (index < focusedIndex) {
        // Old card slid left
        targetX = -2.5;
        targetY = 0;
        targetZ = -4.5;
        targetRotY = 0.6;
      } else {
        // Upcoming card slid right
        targetX = 2.5;
        targetY = 0;
        targetZ = -4.5;
        targetRotY = -0.6;
      }

      // Smoothly interpolate (lerp) to target position & rotation
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08);

      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.08);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.08);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotZ, 0.08);
    } else {
      // Scene 5 & 6: Slide cards away/back as they are no longer in focus
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, (index % 2 === 0 ? -15 : 15), 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -30, 0.05);
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.8, 2.2]} />
      <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function PhotoCards({ activeScene, focusedIndex }) {
  return (
    <group>
      {birthdayConfig.photos.map((photo, index) => (
        <PhotoCard 
          key={index} 
          photo={photo} 
          index={index} 
          activeScene={activeScene}
          focusedIndex={focusedIndex}
        />
      ))}
    </group>
  );
}
