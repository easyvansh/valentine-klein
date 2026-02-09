
import React, { useEffect, useRef, useState } from 'react';
interface Props {
  src: string;
  loopStart: number;
  loopEnd: number | null;
  isEnabled: boolean;
  onToggle: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

const AudioPlayer: React.FC<Props> = ({
  src,
  loopStart,
  loopEnd,
  isEnabled,
  onToggle,
  isDark,
  onToggleDark,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showHint, setShowHint] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  
  
  // Core: enforce looping between start/end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (loopEnd !== null && audio.currentTime >= loopEnd) {
        audio.currentTime = loopStart;
        audio.play().catch(() => {});
      }
    };

    const onEnded = () => {
      audio.currentTime = loopStart;
      audio.play().catch(() => {});
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [loopStart, loopEnd]);

  // Handle enable/disable
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.75;

    if (isEnabled) {
      // Start from the beginning on each enable
      audio.currentTime = loopStart;
      audio
        .play()
        .then(() => {
          setShowHint(false);
          setNeedsGesture(false);
        })
        .catch(() => {
          // Autoplay blocked until a user gesture
          setShowHint(true);
          setNeedsGesture(true);
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isEnabled, loopStart]);

  // Restart playback when the source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Stop previous track immediately on source change
    audio.pause();
    audio.currentTime = loopStart;
    audio.load();
    if (isEnabled) {
      audio
        .play()
        .then(() => {
          setShowHint(false);
          setNeedsGesture(false);
        })
        .catch(() => {
          setShowHint(true);
          setNeedsGesture(true);
        });
    }
  }, [src, isEnabled, loopStart]);

  useEffect(() => {
    if (!needsGesture) return;

    const handleFirstGesture = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (!isEnabled) return;

      audio
        .play()
        .then(() => {
          setShowHint(false);
          setNeedsGesture(false);
        })
        .catch(() => {});
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
    };
  }, [needsGesture, isEnabled]);

  return (
    <div className="fixed top-8 right-8 z-[100] flex items-center gap-4">
      {showHint && isEnabled && (
        <span className="text-[10px] text-rose-300 font-medium uppercase tracking-widest bg-white/90 px-3 py-1 rounded-full shadow-sm animate-pulse hidden md:inline">
          Click here to enable sound
        </span>
      )}

      <div
        className={`flex items-center gap-2 rounded-full px-2 py-2 shadow-lg backdrop-blur-md ${
          isDark ? "border border-white/10 bg-[#1b1412]/80" : "border border-white/40 bg-white/70"
        }`}
      >
        <button
          onClick={() => {
            setShowHint(false);
            onToggle();
          }}
          className={`h-10 w-10 flex items-center justify-center rounded-full transition-all active:scale-90 ${
            isEnabled ? 'text-rose-500 bg-white shadow-md' : 'text-gray-300 bg-white/70'
          }`}
          aria-label="Toggle Sound"
        >
          {isEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.982 5.982 0 0115 10a5.982 5.982 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.982 3.982 0 0013 10a3.982 3.982 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <button
          onClick={onToggleDark}
          className={`h-10 w-10 flex items-center justify-center rounded-full transition-all active:scale-90 ${
            isDark ? 'bg-[#1b1412] text-amber-200 shadow-inner' : 'bg-white text-amber-500 shadow-md'
          }`}
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V4a.75.75 0 01.75-.75zm0 10.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4 9.25a.75.75 0 010 1.5H2.5a.75.75 0 010-1.5H4zm13.5 0a.75.75 0 010 1.5H16a.75.75 0 010-1.5h1.5zM5.636 5.636a.75.75 0 011.061 0l1.061 1.061a.75.75 0 11-1.06 1.061L5.636 6.697a.75.75 0 010-1.061zm7.606 7.606a.75.75 0 011.06 0l1.062 1.061a.75.75 0 11-1.061 1.061l-1.061-1.061a.75.75 0 010-1.061zM14.364 5.636a.75.75 0 010 1.061l-1.061 1.061a.75.75 0 11-1.061-1.06l1.061-1.062a.75.75 0 011.061 0zm-7.606 7.606a.75.75 0 010 1.061l-1.061 1.061a.75.75 0 11-1.061-1.061l1.061-1.061a.75.75 0 011.061 0zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* IMPORTANT: remove "loop" because we are doing segment looping */}
      <audio ref={audioRef} src={src} preload="auto" playsInline />
    </div>
  );
};

export default AudioPlayer;
