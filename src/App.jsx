import React, { useState, useEffect } from 'react';
import UniverseScene from './components/UniverseScene';
import StartScreen from './components/StartScreen';
import TypingIntro from './components/TypingIntro';
import ConstellationMap from './components/ConstellationMap';
import InteractiveLetter from './components/InteractiveLetter';
import ProposalChoice from './components/ProposalChoice';
import LockedGate from './components/LockedGate';
import AudioToggle from './components/AudioToggle';
import Confetti from './components/Confetti';
import { useAudio } from './hooks/useAudio';
import { birthdayConfig } from './data/content';
import './styles/global.css';

export default function App() {
  const [gateUnlocked, setGateUnlocked] = useState(true);
  const [scene, setScene] = useState(1);
  const [activeCapsule, setActiveCapsule] = useState(null);
  const [openedCapsules, setOpenedCapsules] = useState([]);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  // Easter egg states
  const [easterEggText, setEasterEggText] = useState("");
  const [popupMessage, setPopupMessage] = useState(null);
  const [isBirthdayMode, setIsBirthdayMode] = useState(false);
  const [isAfterBirthday, setIsAfterBirthday] = useState(false);

  // Scene-specific elapsed timer state to run transitions independently of audio stream state
  const [sceneTime, setSceneTime] = useState(0);

  // Audio Sync Engine hook
  const { isPlaying, currentTime, isMuted, play, pause, toggle, toggleMute, setTime } = useAudio();
  const cues = birthdayConfig.music.cues;

  // Track elapsed seconds since current scene mounted
  useEffect(() => {
    setSceneTime(0);
    const interval = setInterval(() => {
      setSceneTime((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [scene]);

  // Date constraints check
  useEffect(() => {
    const isLocked = birthdayConfig.unlock.enabled &&
      Date.now() < new Date(birthdayConfig.unlock.softUnlockAt).getTime() &&
      localStorage.getItem('dev_bypass_lock') !== 'true';
    setGateUnlocked(!isLocked);

    // Birthday Mode (10 July 2026 check)
    const today = new Date();
    const isJuly10 = today.getMonth() === 6 && today.getDate() === 10;
    setIsBirthdayMode(isJuly10);

    const bdayTime = new Date(birthdayConfig.unlock.birthdayAt).getTime();
    setIsAfterBirthday(Date.now() > bdayTime);
  }, []);

  // Keyboard Easter Egg Key Listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      const char = e.key.toUpperCase();
      setEasterEggText((prev) => {
        const next = (prev + char).slice(-2);
        if (next === "AN" || next === "ÂN") {
          setPopupMessage("Vũ trụ nhỏ bắn tim gửi tới Ân! 💖 (Sao băng hình trái tim đã được kích hoạt)");
        }
        return next;
      });
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Timer-based transitions for automatic story scenes
  useEffect(() => {
    let timer;
    if (scene === 3) {
      timer = setTimeout(() => {
        setScene(4);
      }, 8000); // 8 seconds for Universe captions
    } else if (scene === 6) {
      timer = setTimeout(() => {
        setScene(7);
      }, 5000); // 5 seconds for Climax zoom warp
    } else if (scene === 7) {
      timer = setTimeout(() => {
        if (birthdayConfig.youtube.enabled && birthdayConfig.youtube.embedUrl) {
          setScene(8);
        } else {
          setScene(9);
        }
      }, 10000); // 10 seconds for Spaceship flight journey
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [scene]);

  const startJourney = () => {
    play();
    setScene(2);
  };

  const completeIntro = () => {
    setScene(3);
  };

  // Tracking opened capsules (PhotoCards)
  const handleSelectCapsule = (idx) => {
    if (idx !== null) {
      // Enforce sequential unlocking
      const isUnlocked = idx === 0 || openedCapsules.includes(idx - 1);
      if (!isUnlocked) return;
    }
    setActiveCapsule(idx);
    if (idx !== null && !openedCapsules.includes(idx)) {
      setOpenedCapsules((prev) => [...prev, idx]);
    }
  };

  const proceedFromCapsules = () => {
    setActiveCapsule(null);
    setScene(6);
  };

  const handleHeartClick3Times = () => {
    setPopupMessage("Có những điều nhỏ thôi, nhưng Khôi đã nhớ rất lâu. 🌹");
  };

  // Caption calculations based on scene elapsed time
  let currentUniverseCaption = "";
  if (scene === 3) {
    const count = birthdayConfig.universeCaptions.length;
    const index = Math.min(Math.floor(sceneTime / 2), count - 1); // 2 seconds per caption (total 8 seconds)
    currentUniverseCaption = birthdayConfig.universeCaptions[Math.max(0, index)];
  }

  let currentJourneyCaption = "";
  if (scene === 7) {
    const count = birthdayConfig.journeyCaptions.length;
    const index = Math.min(Math.floor(sceneTime / 5), count - 1); // 5 seconds per caption (total 10 seconds)
    currentJourneyCaption = birthdayConfig.journeyCaptions[Math.max(0, index)];
  }

  // Underlock gate unmount protection
  if (!gateUnlocked) {
    return <LockedGate onUnlock={() => setGateUnlocked(true)} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Canvas Layer */}
      <UniverseScene
        activeScene={scene}
        activeCapsule={activeCapsule}
        setActiveCapsule={handleSelectCapsule}
        openedCapsules={openedCapsules}
        isAccepted={isAccepted}
        onHeartClick3Times={handleHeartClick3Times}
      />

      {/* Confetti generator overlay */}
      {(isAccepted || isBirthdayMode) && <Confetti active={true} duration={0} />}

      {/* Overlay: Start Screen */}
      {scene === 1 && (
        <StartScreen onStart={startJourney} />
      )}

      {/* Overlay: Typing Compiler */}
      {scene === 2 && (
        <TypingIntro onComplete={completeIntro} />
      )}

      {/* Overlay: Scene 3 Universe drift caption display */}
      {scene === 3 && currentUniverseCaption && (
        <div
          className="ui-overlay fade-in"
          style={{
            justifyContent: 'flex-end',
            paddingBottom: '80px',
            background: 'linear-gradient(to top, rgba(3, 0, 20, 0.7) 0%, rgba(3, 0, 20, 0) 100%)',
            pointerEvents: 'none'
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '24px 36px',
              maxWidth: '680px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(109, 40, 217, 0.1)'
            }}
          >
            <p
              style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                margin: 0,
                color: '#f8fafc',
                lineHeight: '1.65',
                textWrap: 'balance'
              }}
            >
              {currentUniverseCaption}
            </p>
          </div>
        </div>
      )}

      {/* Overlay: Scene 4 Constellation Map */}
      {scene === 4 && (
        <ConstellationMap onComplete={() => {
          setTime(cues.memoryGalleryAt);
          setScene(5);
        }} />
      )}

      {/* Overlay: Scene 5 Memory Capsules controller cards */}
      {scene === 5 && (
        <>
          {activeCapsule === null && (
            <div
              className="ui-overlay"
              style={{
                justifyContent: 'flex-end',
                paddingBottom: '70px',
                background: 'linear-gradient(to top, rgba(3, 0, 20, 0.75) 0%, rgba(3, 0, 20, 0) 100%)',
                pointerEvents: 'none'
              }}
            >
              <div
                className="glass-panel fade-in"
                style={{
                  padding: '24px 32px',
                  maxWidth: '680px',
                  width: '90%',
                  textAlign: 'center',
                  boxShadow: '0 0 25px rgba(236, 72, 153, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  alignItems: 'center',
                  pointerEvents: 'auto'
                }}
              >
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Những Khoảnh Khắc Đáng Nhớ
                </span>

                <p
                  style={{
                    fontSize: '1.05rem',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    margin: 0,
                    color: '#f8fafc',
                    lineHeight: '1.65',
                    textWrap: 'balance'
                  }}
                >
                  {openedCapsules.length === 0 && "👉 Nhấp vào ngôi sao đang nhấp nháy hồng để xem Ký ức thứ 1..."}
                  {openedCapsules.length > 0 && openedCapsules.length < birthdayConfig.photos.length && `🌟 Đã mở Ký ức ${openedCapsules.length}/${birthdayConfig.photos.length}. Hãy nhấp tiếp vào ngôi sao đang nhấp nháy hồng...`}
                  {openedCapsules.length === birthdayConfig.photos.length && "💖 Tất cả ký ức đã được mở! Hãy nhấp nút bên dưới để tiếp tục..."}
                </p>

                {openedCapsules.length === birthdayConfig.photos.length && (
                  <div style={{ marginTop: '4px' }}>
                    <button
                      className="btn-glow"
                      onClick={proceedFromCapsules}
                    >
                      Tiếp tục hành trình
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeCapsule !== null && (
            <div
              className="ui-overlay fade-in"
              style={{
                background: 'rgba(3, 0, 20, 0.85)',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'auto',
                zIndex: 20,
                padding: '20px'
              }}
            >
              <div
                className="glass-panel fade-in-scale"
                style={{
                  maxWidth: '360px',
                  width: '100%',
                  padding: '16px 16px 20px 16px',
                  background: '#fcfbf9',
                  color: '#1c1917',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '18px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    background: 'linear-gradient(135deg, #2e1065 0%, #0c0a09 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={birthdayConfig.photos[activeCapsule].src}
                    alt="Memory"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', fontSize: '2.4rem', color: 'rgba(255, 255, 255, 0.2)' }}>✨</div>
                </div>

                <div
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    padding: '8px 4px 8px 4px',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.98rem',
                    fontStyle: 'italic',
                    lineHeight: '1.65',
                    color: '#292524',
                    minHeight: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textWrap: 'balance'
                  }}
                >
                  "{birthdayConfig.photos[activeCapsule].caption}"
                </div>

                <button
                  className="btn-glow"
                  onClick={() => handleSelectCapsule(null)}
                  style={{
                    background: 'rgba(0, 0, 0, 0.05)',
                    color: '#1c1917',
                    borderColor: 'rgba(0, 0, 0, 0.15)',
                    padding: '10px 24px',
                    fontSize: '0.78rem',
                    letterSpacing: '0.1em'
                  }}
                >
                  Quay lại
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Overlay: Scene 6 Climax Warp display */}
      {scene === 6 && (
        <div
          className="ui-overlay fade-in"
          style={{
            justifyContent: 'flex-end',
            paddingBottom: '80px',
            background: 'linear-gradient(to top, rgba(3, 0, 20, 0.7) 0%, rgba(3, 0, 20, 0) 100%)'
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '24px 32px',
              maxWidth: '680px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(236, 72, 153, 0.1)'
            }}
          >
            <p
              style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                margin: 0,
                color: '#f8fafc',
                lineHeight: '1.65',
                textWrap: 'balance'
              }}
            >
              "Có những khoảnh khắc nhỏ thôi... Nhưng lại khiến Khôi nhớ rất lâu."
            </p>
          </div>
        </div>
      )}

      {/* Overlay: Scene 7 Spaceship flight display */}
      {scene === 7 && currentJourneyCaption && (
        <div
          className="ui-overlay fade-in"
          style={{
            justifyContent: 'flex-end',
            paddingBottom: '80px',
            background: 'linear-gradient(to top, rgba(3, 0, 20, 0.7) 0%, rgba(3, 0, 20, 0) 100%)'
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '24px 32px',
              maxWidth: '680px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 0 25px rgba(236, 72, 153, 0.1)'
            }}
          >
            <p
              style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                margin: 0,
                color: '#f8fafc',
                lineHeight: '1.65',
                textWrap: 'balance'
              }}
            >
              {currentJourneyCaption}
            </p>
          </div>
        </div>
      )}

      {/* Overlay: Scene 8 YouTube embed video scene */}
      {scene === 8 && (
        <div
          className="ui-overlay fade-in"
          style={{
            background: 'linear-gradient(to top, rgba(3, 0, 20, 0.96) 0%, rgba(3, 0, 20, 0.7) 100%)',
            justifyContent: 'center',
            padding: '24px 15px',
            pointerEvents: 'auto',
            zIndex: 10
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '4px'
            }}
          >
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: '400', margin: 0 }}>
                {birthdayConfig.youtube.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                {birthdayConfig.youtube.description}
              </p>
            </div>

            <div style={{ position: 'relative', overflow: 'hidden', width: '100%', paddingTop: '56.25%', borderRadius: '2px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={`${birthdayConfig.youtube.embedUrl}?rel=0&modestbranding=1`}
                title="Secret Video Message"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <button
                className="btn-glow"
                onClick={() => {
                  setScene(9);
                }}
              >
                Đọc thư tình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay: Scene 9 Interactive Letter */}
      {scene === 9 && (
        <InteractiveLetter onComplete={() => setScene(10)} />
      )}

      {/* Overlay: Scene 10 Proposal Choice */}
      {scene === 10 && (
        <ProposalChoice
          onAccept={() => {
            setIsAccepted(true);
            setScene(11);
          }}
          onRejectComplete={() => {
            setIsRejected(true);
            setScene(11);
          }}
        />
      )}

      {/* Overlay: Scene 11 Contact Panel */}
      {scene === 11 && (
        <div
          className="ui-overlay fade-in"
          style={{
            background: 'linear-gradient(to top, rgba(3, 0, 20, 0.98) 0%, rgba(3, 0, 20, 0.75) 100%)',
            justifyContent: 'center',
            padding: '30px 15px',
            pointerEvents: 'auto',
            zIndex: 10
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            {isAccepted ? (
              <>
                <span style={{ fontSize: '2.5rem' }}>💝</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '400', fontFamily: 'var(--font-serif)', margin: 0, color: '#ec4899' }}>
                  Cảm ơn Ân vì đã đồng ý!
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0, lineHeight: '1.62' }}>
                  {birthdayConfig.proposal.acceptedText}
                </p>
              </>
            ) : (
              <>
                <span style={{ fontSize: '2.5rem' }}>✨</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '400', fontFamily: 'var(--font-serif)', margin: 0 }}>
                  Cảm ơn Ân đã lắng nghe
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0, lineHeight: '1.62' }}>
                  Dù thế nào, Khôi vẫn rất trân trọng vì Ân đã đọc hết món quà nhỏ này.
                </p>
              </>
            )}

            {/* Custom Time Badge details */}
            {isBirthdayMode && (
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  border: '1px solid rgba(236, 72, 153, 0.25)',
                  borderRadius: '4px',
                  padding: '10px 16px',
                  fontSize: '0.78rem',
                  color: '#f472b6',
                  letterSpacing: '0.05em'
                }}
              >
                🎉 Hôm nay là ngày 10/07/2026 - Sinh nhật chính thức của Ân! 🎉
              </div>
            )}
            {isAfterBirthday && !isBirthdayMode && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  padding: '10px 16px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)'
                }}
              >
                Một món quà đã được mở vào dịp sinh nhật 10/07/2026.
              </div>
            )}

            <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }}></div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              {birthdayConfig.contact.finalText}
            </p>

            {/* Social triggers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              {birthdayConfig.contact.zaloUrl ? (
                <a
                  href={birthdayConfig.contact.zaloUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-glow"
                  style={{ textAlign: 'center' }}
                >
                  Nhắn Zalo cho Khôi
                </a>
              ) : (
                <button className="btn-glow" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  Khôi sẽ thêm link Zalo sau
                </button>
              )}

              {birthdayConfig.contact.messengerUrl ? (
                <a
                  href={birthdayConfig.contact.messengerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-glow"
                  style={{ textAlign: 'center' }}
                >
                  Nhắn Messenger cho Khôi
                </a>
              ) : (
                <button className="btn-glow" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  Khôi sẽ thêm link Messenger sau
                </button>
              )}
            </div>

            <button
              className="btn-glow"
              onClick={() => {
                setIsAccepted(false);
                setIsRejected(false);
                setOpenedCapsules([]);
                setTime(0);
                setScene(1);
              }}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                fontSize: '0.78rem',
                background: 'transparent',
                borderColor: 'rgba(255,255,255,0.08)',
                color: 'var(--text-muted)'
              }}
            >
              Quay lại từ đầu 🛸
            </button>
          </div>
        </div>
      )}

      {/* Floating audio controllers */}
      {scene > 1 && (
        <AudioToggle isPlaying={isPlaying} onToggle={toggle} />
      )}

      {/* Popup Overlay Panels for Easter Eggs */}
      {popupMessage && (
        <div
          className="ui-overlay fade-in"
          style={{
            zIndex: 9999,
            background: 'rgba(3, 0, 20, 0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'auto'
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '420px',
              width: '90%',
              padding: '30px 24px',
              textAlign: 'center',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              boxShadow: '0 0 30px rgba(236, 72, 153, 0.15)',
              borderRadius: '8px'
            }}
          >
            <h4 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', color: '#f472b6', margin: '0 0 12px 0', fontStyle: 'italic' }}>
              Lời thì thầm từ tinh cầu 💫
            </h4>
            <p style={{ margin: '0 0 24px 0', fontSize: '1.02rem', fontFamily: 'var(--font-serif)', color: '#f8fafc', lineHeight: '1.65', fontStyle: 'italic', textWrap: 'balance' }}>
              "{popupMessage}"
            </p>
            <button
              className="btn-glow"
              onClick={() => setPopupMessage(null)}
              style={{ padding: '10px 28px', fontSize: '0.8rem' }}
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
