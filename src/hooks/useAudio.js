import { useEffect, useRef, useState } from 'react';
import { birthdayConfig } from '../data/content';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create new audio instance
    const audio = new Audio(birthdayConfig.musicPath);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audioRef.current = null;
    };
  }, []);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Music file not found or browser blocked autoplay. Experience continues without audio.", err);
        setIsPlaying(false);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return { isPlaying, play, pause, toggle };
};
