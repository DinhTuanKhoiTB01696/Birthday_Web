import { useEffect, useRef, useState } from 'react';
import { birthdayConfig } from '../data/content';

// Dynamic background audio hook streaming directly from YouTube
export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const checkTimeIntervalRef = useRef(null);

  // Parse video ID from YouTube URL in config
  const videoUrl = birthdayConfig.music.sourceReference;
  let videoId = 'gJAbDSse5WM'; // default fallback video ID
  try {
    if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
    } else if (videoUrl.includes('v=')) {
      videoId = videoUrl.split('v=')[1].split('&')[0];
    }
  } catch (e) {
    console.error("Failed to parse YouTube ID from config. Using default fallback ID.", e);
  }

  useEffect(() => {
    // 1. Create off-screen container for the background YouTube IFrame
    let playerDiv = document.getElementById('yt-audio-container');
    if (!playerDiv) {
      playerDiv = document.createElement('div');
      playerDiv.id = 'yt-audio-container';
      playerDiv.style.position = 'fixed';
      playerDiv.style.top = '-9999px';
      playerDiv.style.left = '-9999px';
      playerDiv.style.width = '1px';
      playerDiv.style.height = '1px';
      playerDiv.style.opacity = '0';
      playerDiv.style.pointerEvents = 'none';
      playerDiv.style.zIndex = '-9999';
      
      const child = document.createElement('div');
      child.id = 'yt-player-target';
      playerDiv.appendChild(child);
      document.body.appendChild(playerDiv);
    }

    // 2. Dynamically inject the YouTube IFrame Player API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // 3. Initialize background player cued to the video ID
    const initPlayer = () => {
      if (playerRef.current) return;
      
      playerRef.current = new window.YT.Player('yt-player-target', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          loop: 1,
          playlist: videoId,
          playsinline: 1
        },
        events: {
          onReady: (event) => {
            console.log("YouTube background streaming player ready.");
            event.target.setVolume(birthdayConfig.music.volume * 100);
          },
          onStateChange: (event) => {
            // Player states: 1 (playing), 2 (paused), 0 (ended)
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false);
            }
          },
          onError: (err) => {
            console.warn("YouTube stream blocked or failed. Using timer sync fallback.", err);
            setIsFallback(true);
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Global callback hook
      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (originalCallback) originalCallback();
        initPlayer();
      };
    }

    return () => {
      if (checkTimeIntervalRef.current) clearInterval(checkTimeIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [videoId]);

  // Track stream progression timestamps
  useEffect(() => {
    if (isPlaying && !isFallback) {
      checkTimeIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 250);
    } else {
      if (checkTimeIntervalRef.current) clearInterval(checkTimeIntervalRef.current);
    }
    return () => {
      if (checkTimeIntervalRef.current) clearInterval(checkTimeIntervalRef.current);
    };
  }, [isPlaying, isFallback]);

  // Sync animation timer fallback
  useEffect(() => {
    if (isFallback && isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFallback, isPlaying]);

  const play = () => {
    if (isFallback) {
      setIsPlaying(true);
      return;
    }
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
      } catch (err) {
        console.warn("Autoplay block on YouTube iframe. Falling back to silent timer.", err);
        setIsFallback(true);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(true);
      setIsFallback(true);
    }
  };

  const pause = () => {
    if (isFallback) {
      setIsPlaying(false);
      return;
    }
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!isFallback && playerRef.current) {
      if (typeof playerRef.current.mute === 'function') {
        if (nextMuted) playerRef.current.mute();
        else playerRef.current.unMute();
      }
    }
  };

  const setTime = (seconds) => {
    setCurrentTime(seconds);
    if (!isFallback && playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
    }
  };

  return {
    isPlaying,
    currentTime,
    isMuted,
    play,
    pause,
    toggle,
    toggleMute,
    setTime
  };
};
