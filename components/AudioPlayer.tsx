
import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../constants'; // adjust path if needed

interface Props {
  src: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const AudioPlayer: React.FC<Props> = ({ src, isEnabled, onToggle }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showHint, setShowHint] = useState(false);
  const loopStart = CONFIG.audioLoop?.start ?? 0;
  const loopEnd = CONFIG.audioLoop?.end ?? null;
  
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
        .then(() => setShowHint(false))
        .catch(() => {
          // Autoplay blocked until a user gesture
          setShowHint(true);
        });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isEnabled, loopStart]);

  return (
    <div className="fixed top-8 right-8 z-[100] flex items-center gap-4">
      {showHint && isEnabled && (
        <span className="text-[10px] text-rose-300 font-medium uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm animate-pulse hidden md:inline">
          Toggle to enable sound
        </span>
      )}

      <button
        onClick={() => {
          setShowHint(false);
          onToggle();
        }}
        className={`w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border border-pink-50 transition-all active:scale-90 ${isEnabled ? 'text-rose-500' : 'text-gray-300'}`}
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

      {/* IMPORTANT: remove "loop" because we are doing segment looping */}
      <audio ref={audioRef} src={src} preload="auto" playsInline />
    </div>
  );
};

export default AudioPlayer;
