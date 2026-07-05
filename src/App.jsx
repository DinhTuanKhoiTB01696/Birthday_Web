import React, { useCallback, useEffect, useMemo, useState } from 'react';
import UniverseScene from './components/UniverseScene';
import StartScreen from './components/StartScreen';
import TypingIntro from './components/TypingIntro';
import ConstellationMap from './components/ConstellationMap';
import InteractiveLetter from './components/InteractiveLetter';
import ProposalChoice from './components/ProposalChoice';
import LockedGate from './components/LockedGate';
import AudioToggle from './components/AudioToggle';
import Confetti from './components/Confetti';
import StoryMap from './components/StoryMap';
import JourneyControls from './components/JourneyControls';
import HeartReveal from './components/HeartReveal';
import { useAudio } from './hooks/useAudio';
import { birthdayConfig } from './data/content';
import './styles/global.css';

const STORAGE_KEY = 'birthday_web_journey_v2';

const clampScene = (scene) => Math.max(1, Math.min(11, scene));

const getReadableDuration = (text, min = 4200, max = 9000) => {
  const value = (text?.length || 80) * 62 + 1500;
  return Math.max(min, Math.min(max, value));
};

export default function App() {
  const [gateUnlocked, setGateUnlocked] = useState(true);
  const [scene, setSceneState] = useState(1);
  const [maxSceneReached, setMaxSceneReached] = useState(1);
  const [activeCapsule, setActiveCapsule] = useState(null);
  const [openedCapsules, setOpenedCapsules] = useState([]);
  const [openedConstellations, setOpenedConstellations] = useState([]);
  const [letterPage, setLetterPage] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);

  const [easterEggText, setEasterEggText] = useState('');
  const [popupMessage, setPopupMessage] = useState(null);
  const [isBirthdayMode, setIsBirthdayMode] = useState(false);
  const [isAfterBirthday, setIsAfterBirthday] = useState(false);
  const [sceneTime, setSceneTime] = useState(0);
  const [isTunnelActive, setIsTunnelActive] = useState(false);

  const { isPlaying, isMuted, volume, play, toggle, toggleMute, setVolume } = useAudio();

  const setScene = useCallback((nextScene) => {
    const normalized = clampScene(nextScene);
    setSceneState(normalized);
    setMaxSceneReached((prev) => Math.max(prev, normalized));
    setIsTunnelActive(false); // Reset tunnel when navigating scenes
  }, []);

  const resetJourney = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSceneState(1);
    setMaxSceneReached(1);
    setActiveCapsule(null);
    setOpenedCapsules([]);
    setOpenedConstellations([]);
    setLetterPage(0);
    setIsAccepted(false);
  }, []);

  useEffect(() => {
    setSceneTime(0);
    const interval = window.setInterval(() => {
      setSceneTime((prev) => prev + 0.1);
    }, 100);
    return () => window.clearInterval(interval);
  }, [scene]);

  useEffect(() => {
    const isLocked = birthdayConfig.unlock.enabled &&
      Date.now() < new Date(birthdayConfig.unlock.softUnlockAt).getTime() &&
      localStorage.getItem('dev_bypass_lock') !== 'true';
    setGateUnlocked(!isLocked);

    const today = new Date();
    setIsBirthdayMode(today.getMonth() === 6 && today.getDate() === 10);

    const bdayTime = new Date(birthdayConfig.unlock.birthdayAt).getTime();
    setIsAfterBirthday(Date.now() > bdayTime);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const char = e.key.toUpperCase();
      setEasterEggText((prev) => {
        const next = (prev + char).slice(-2);
        if (next === 'AN' || next === 'ÂN') {
          setPopupMessage('Tui gửi riêng một vì sao nhỏ cho Ân. Bà thấy chưa, nó sáng hơn mấy vì sao còn lại đó.');
        }
        return next;
      });
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    let timer;
    if (scene === 3) {
      const total = birthdayConfig.universeCaptions.reduce((sum, caption) => sum + getReadableDuration(caption), 0);
      timer = window.setTimeout(() => setScene(4), total + 900);
    } else if (scene === 6) {
      timer = window.setTimeout(() => setScene(7), 6800);
    } else if (scene === 7) {
      const total = birthdayConfig.journeyCaptions.reduce((sum, caption) => sum + getReadableDuration(caption, 5200, 8600), 0);
      timer = window.setTimeout(() => setScene(8), total + 900);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [scene, setScene]);

  useEffect(() => {
    if (scene !== 5) return undefined;
    setActiveCapsule(0);
    setOpenedCapsules((prev) => (prev.includes(0) ? prev : [...prev, 0]));

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      if (index >= birthdayConfig.photos.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setActiveCapsule(null);
          setScene(6);
        }, 2200);
        return;
      }
      setActiveCapsule(index);
      setOpenedCapsules((prev) => (prev.includes(index) ? prev : [...prev, index]));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [scene, setScene]);

  const startJourney = () => {
    resetJourney();
    play();
    setScene(2);
  };



  const goBack = () => {
    if (scene === 5) {
      setActiveCapsule(null);
      setScene(4);
      return;
    }
    if (scene === 8) {
      setScene(7);
      return;
    }
    if (scene === 10) {
      setScene(9);
      return;
    }
    if (scene === 11) {
      setScene(10);
      return;
    }
    setScene(scene - 1);
  };

  const goNext = () => {
    if (scene === 7) {
      setScene(8);
      return;
    }
    if (scene === 8) return;
    if (scene === 9) {
      setScene(10);
      return;
    }
    setScene(scene + 1);
  };

  const handleHeartClick = () => {
    if (isTunnelActive) return;
    setIsTunnelActive(true);
    // Smooth fade transition, then load Scene 9 (Letter)
    setTimeout(() => {
      setScene(9);
    }, 400);
  };

  const currentUniverseCaption = useMemo(() => {
    if (scene !== 3) return '';
    let elapsed = sceneTime * 1000;
    for (const caption of birthdayConfig.universeCaptions) {
      const duration = getReadableDuration(caption);
      if (elapsed <= duration) return caption;
      elapsed -= duration;
    }
    return birthdayConfig.universeCaptions.at(-1);
  }, [scene, sceneTime]);

  const currentJourneyCaption = useMemo(() => {
    if (scene !== 7) return '';
    let elapsed = sceneTime * 1000;
    for (const caption of birthdayConfig.journeyCaptions) {
      const duration = getReadableDuration(caption, 5200, 8600);
      if (elapsed <= duration) return caption;
      elapsed -= duration;
    }
    return birthdayConfig.journeyCaptions.at(-1);
  }, [scene, sceneTime]);

  if (!gateUnlocked) {
    return <LockedGate onUnlock={() => setGateUnlocked(true)} />;
  }

  return (
    <main className={`app-shell scene-${scene}`}>
      <UniverseScene
        activeScene={scene}
        activeCapsule={activeCapsule}
        setActiveCapsule={() => {}}
        openedCapsules={openedCapsules}
        isAccepted={isAccepted}
        onHeartClick3Times={() => setPopupMessage('Có những điều nhỏ thôi, nhưng tui đã nhớ rất lâu.')}
      />

      {(isAccepted || isBirthdayMode) && <Confetti active={true} duration={0} />}

      {scene === 1 && <StartScreen onStart={startJourney} />}
      {scene === 2 && <TypingIntro onComplete={() => setScene(3)} />}

      {scene === 3 && currentUniverseCaption && (
        <section className="ui-overlay caption-overlay fade-in">
          <div className="caption-panel glass-panel">
            <p>{currentUniverseCaption}</p>
          </div>
        </section>
      )}

      {scene === 4 && (
        <ConstellationMap
          onProgress={setOpenedConstellations}
          onComplete={() => setScene(5)}
        />
      )}

      {scene === 5 && (
        <section className="ui-overlay memory-overlay fade-in">
          <div className="memory-card glass-panel">
            <span className="memory-kicker">Ký ức {Math.min((activeCapsule ?? 0) + 1, birthdayConfig.photos.length)} / {birthdayConfig.photos.length}</span>
            <div className="memory-image-wrap">
              <img
                key={activeCapsule}
                className="memory-photo-fade"
                src={birthdayConfig.photos[activeCapsule ?? 0]?.cleanSrc || birthdayConfig.photos[activeCapsule ?? 0]?.src}
                alt="Kỷ niệm của Ân"
                style={
                  activeCapsule === 4
                    ? { objectFit: 'contain', background: '#0a0518', width: '100%', height: '100%' }
                    : activeCapsule === 0
                    ? { transform: 'scale(2.0) translateX(25%)', transformOrigin: 'center', objectFit: 'cover' }
                    : { objectFit: 'cover' }
                }
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <p>"{birthdayConfig.photos[activeCapsule ?? 0]?.caption}"</p>
            <div className="memory-auto-progress">
              <div className="memory-auto-bar" key={`bar-${activeCapsule}`} />
            </div>
            <span className="memory-auto-hint">đang tự chuyển...</span>
          </div>
        </section>
      )}

      {scene === 6 && (
        <section className="ui-overlay caption-overlay fade-in">
          <div className="caption-panel glass-panel">
            <p>"Có những khoảnh khắc nhỏ thôi, nhưng lại khiến tui nhớ rất lâu."</p>
          </div>
        </section>
      )}

      {scene === 7 && currentJourneyCaption && (
        <section className="ui-overlay caption-overlay fade-in">
          <div className="caption-panel glass-panel">
            <p>{currentJourneyCaption}</p>
          </div>
        </section>
      )}

      {scene === 8 && (
        <HeartReveal onOpenLetter={handleHeartClick} />
      )}

      {scene === 9 && (
        <InteractiveLetter
          initialPage={letterPage}
          onPageChange={setLetterPage}
          onBackScene={() => setScene(8)}
          onComplete={() => setScene(10)}
        />
      )}

      {scene === 10 && (
        <ProposalChoice
          onAccept={() => {
            setIsAccepted(true);
            setScene(11);
          }}
        />
      )}

      {scene === 11 && (
        <section className="ui-overlay final-overlay fade-in">
          <div className="glass-panel final-panel">
            {isAccepted ? (
              <>
                <span className="final-icon">♡</span>
                <h2>Cảm ơn bà vì đã đồng ý</h2>
                <p>{birthdayConfig.proposal.acceptedText}</p>
              </>
            ) : (
              <>
                <span className="final-icon">✦</span>
                <h2>Cảm ơn bà đã lắng nghe</h2>
                <p>Dù thế nào, tui vẫn rất trân trọng vì bà đã đọc hết món quà nhỏ này.</p>
              </>
            )}

            {isBirthdayMode && (
              <div className="birthday-badge">
                Hôm nay là ngày 10/07/2026, sinh nhật chính thức của Ân.
              </div>
            )}
            {isAfterBirthday && !isBirthdayMode && (
              <div className="birthday-badge muted">
                Món quà này đã được mở vào dịp sinh nhật 10/07/2026.
              </div>
            )}

            <p className="final-note">{birthdayConfig.contact.finalText}</p>

            <img className="final-meme-sticker" src="/assets/images/memes/camera-cat.png" alt="" />

            <div className="contact-actions">
              {birthdayConfig.contact.zaloUrl && (
                <a href={birthdayConfig.contact.zaloUrl} target="_blank" rel="noreferrer" className="btn-glow">
                  Nhắn Zalo cho tui
                </a>
              )}
              {birthdayConfig.contact.messengerUrl && (
                <a href={birthdayConfig.contact.messengerUrl} target="_blank" rel="noreferrer" className="btn-glow">
                  Nhắn Messenger cho tui
                </a>
              )}
            </div>

            <button className="btn-glow ghost compact" type="button" onClick={resetJourney}>
              Xem lại từ đầu
            </button>
          </div>
        </section>
      )}

      {scene > 1 && (
        <>
          <StoryMap scene={scene} maxSceneReached={maxSceneReached} onJump={setScene} />
          <JourneyControls
            canGoBack={scene > 3 && scene !== 9}
            canGoNext={[3, 6, 7, 10].includes(scene)}
            onBack={goBack}
            onNext={goNext}
            nextLabel={scene === 10 ? 'Đi tới kết' : 'Tiếp tục'}
          />
          <AudioToggle
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            onToggle={toggle}
            onMute={toggleMute}
            onVolumeChange={setVolume}
          />
        </>
      )}



      {popupMessage && (
        <section className="ui-overlay popup-overlay fade-in">
          <div className="glass-panel popup-panel">
            <h4>Lời thì thầm từ tinh cầu</h4>
            <p>"{popupMessage}"</p>
            <button className="btn-glow compact" onClick={() => setPopupMessage(null)}>
              Đóng lại
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
