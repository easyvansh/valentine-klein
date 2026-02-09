import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONFIG } from "./constants";
import { ScreenState } from "./types";
import IntroScreen from "./components/IntroScreen";
import QuestionScreen from "./components/QuestionScreen";
import YesScreen from "./components/YesScreen";
import AudioPlayer from "./components/AudioPlayer";

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: "blur(3px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(3px)" },
};

const pageTransition = {
  duration: 0.75, // slow
  ease: [0.22, 1, 0.36, 1], // smooth
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>("intro");
  const [isAudioEnabled, setIsAudioEnabled] = useState(() => {
    const saved = localStorage.getItem("valentine-audio-enabled");
    return saved === null ? true : saved === "true";
  });
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("valentine-dark-mode");
    return saved === null ? false : saved === "true";
  });
  const defaultTrack = CONFIG.audioTracks[CONFIG.defaultAudioKey];
  const [audioSrc, setAudioSrc] = useState(defaultTrack.src);
  const [audioLoopStart, setAudioLoopStart] = useState(defaultTrack.start);
  const [audioLoopEnd, setAudioLoopEnd] = useState<number | null>(defaultTrack.end);

  const handleStart = useCallback(() => {
    const questionTrack = CONFIG.audioTracks.pp;
    setAudioSrc(questionTrack.src);
    setAudioLoopStart(questionTrack.start);
    setAudioLoopEnd(questionTrack.end);
    setIsAudioEnabled(true);
    localStorage.setItem("valentine-audio-enabled", "true");
    setScreen("question");
  }, []);
  const handleYes = useCallback(() => {
    const yesTrack = CONFIG.audioTracks.kmph;
    setAudioSrc(yesTrack.src);
    setAudioLoopStart(yesTrack.start);
    setAudioLoopEnd(yesTrack.end);
    setIsAudioEnabled(true);
    localStorage.setItem("valentine-audio-enabled", "true");
    setScreen("yes");
  }, []);
  const handleRestart = useCallback(() => {
    const baseTrack = CONFIG.audioTracks[CONFIG.defaultAudioKey];
    setAudioSrc(baseTrack.src);
    setAudioLoopStart(baseTrack.start);
    setAudioLoopEnd(baseTrack.end);
    setIsAudioEnabled(true);
    localStorage.setItem("valentine-audio-enabled", "true");
    setScreen("intro");
  }, []);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const newVal = !prev;
      localStorage.setItem("valentine-audio-enabled", String(newVal));
      return newVal;
    });
  }, []);
  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const newVal = !prev;
      localStorage.setItem("valentine-dark-mode", String(newVal));
      return newVal;
    });
  }, []);

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ${
        isDark ? "bg-[#2b0b0b] text-[#f1e7d6]" : "bg-[#fcf9f7]"
      }`}
    >
      {/* Decorative Background Elements */}
      <div
        className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 ${
          isDark ? "opacity-100" : "opacity-20"
        }`}
      >
        {isDark && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(61,16,16,0.9)_0%,_rgba(16,6,6,0.98)_70%)]" />
        )}
        {/* <div className="absolute top-10 left-10 w-64 h-64 bg-pink-100 rounded-full blur-3xl animate-pulse" /> */}
        {/* <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-50 rounded-full blur-3xl animate-pulse" /> */}
      </div>

      {/* Global Controls */}
      <AudioPlayer
        src={audioSrc}
        loopStart={audioLoopStart}
        loopEnd={audioLoopEnd}
        isEnabled={isAudioEnabled}
        onToggle={toggleAudio}
        isDark={isDark}
        onToggleDark={toggleDark}
      />

      {/* Screens (Animated) */}
      <main className="relative z-10 w-full max-w-2xl px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            style={{ willChange: "transform, opacity, filter" }}
          >
            {screen === "intro" && <IntroScreen onComplete={handleStart} isDark={isDark} />}
            {screen === "question" && <QuestionScreen onYes={handleYes} isDark={isDark} />}
            {screen === "yes" && <YesScreen onRestart={handleRestart} isDark={isDark} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal Footer */}
      <footer
        className={`absolute bottom-6 text-[10px] uppercase tracking-widest pointer-events-none ${
          isDark ? "text-rose-200/70" : "text-gray-400"
        }`}
      >
        Made with love
      </footer>
    </div>
  );
};

export default App;
