import { useCallback, useEffect, useRef, useState } from 'react';
import { birthdayConfig } from '../data/content';

let sharedAudio = null;
let sharedReady = false;

const getAudio = () => {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio(birthdayConfig.music.path);
    sharedAudio.preload = 'auto';
    sharedAudio.loop = true;
    sharedAudio.playsInline = true;
    sharedAudio.volume = birthdayConfig.music.volume;
    sharedReady = true;
  }
  return sharedAudio;
};

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(birthdayConfig.music.volume);
  const fadeRef = useRef(null);

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return undefined;

    const syncState = () => {
      setIsPlaying(!audio.paused);
      setCurrentTime(audio.currentTime || 0);
      setIsMuted(audio.muted);
      setVolumeState(audio.volume);
    };

    const interval = window.setInterval(() => {
      setCurrentTime(audio.currentTime || 0);
    }, 500);

    audio.addEventListener('play', syncState);
    audio.addEventListener('pause', syncState);
    audio.addEventListener('volumechange', syncState);
    audio.addEventListener('loadedmetadata', syncState);
    syncState();

    return () => {
      window.clearInterval(interval);
      audio.removeEventListener('play', syncState);
      audio.removeEventListener('pause', syncState);
      audio.removeEventListener('volumechange', syncState);
      audio.removeEventListener('loadedmetadata', syncState);
    };
  }, []);

  const fadeToVolume = useCallback((targetVolume, duration = birthdayConfig.music.fadeInDuration) => {
    const audio = getAudio();
    if (!audio) return;
    if (fadeRef.current) window.clearInterval(fadeRef.current);

    const start = audio.volume;
    const startedAt = performance.now();
    fadeRef.current = window.setInterval(() => {
      const progress = Math.min((performance.now() - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = start + (targetVolume - start) * eased;
      if (progress >= 1) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, 50);
  }, []);

  const play = useCallback(async () => {
    const audio = getAudio();
    if (!audio) return;

    try {
      if (sharedReady && audio.currentTime === 0) {
        audio.volume = 0;
      }
      await audio.play();
      fadeToVolume(volume || birthdayConfig.music.volume);
      sharedReady = false;
    } catch (err) {
      console.warn('Audio playback was blocked until the next user gesture.', err);
    }
  }, [fadeToVolume, volume]);

  const pause = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;
    audio.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;
    if (audio.paused) {
      play();
    } else {
      pause();
    }
  }, [pause, play]);

  const toggleMute = useCallback(() => {
    const audio = getAudio();
    if (!audio) return;
    audio.muted = !audio.muted;
  }, []);

  const setVolume = useCallback((nextVolume) => {
    const audio = getAudio();
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, nextVolume));
    audio.volume = clamped;
    setVolumeState(clamped);
  }, []);

  return {
    isPlaying,
    currentTime,
    isMuted,
    volume,
    play,
    pause,
    toggle,
    toggleMute,
    setVolume
  };
};
