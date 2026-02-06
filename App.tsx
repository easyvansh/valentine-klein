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
    return saved === null ? false : saved === "true";
  });

  const handleStart = useCallback(() => setScreen("question"), []);
  const handleYes = useCallback(() => setScreen("yes"), []);
  const handleRestart = useCallback(() => setScreen("intro"), []);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const newVal = !prev;
      localStorage.setItem("valentine-audio-enabled", String(newVal));
      return newVal;
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#fcf9f7]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        {/* <div className="absolute top-10 left-10 w-64 h-64 bg-pink-100 rounded-full blur-3xl animate-pulse" /> */}
        {/* <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-50 rounded-full blur-3xl animate-pulse" /> */}
      </div>

      {/* Global Controls */}
      <AudioPlayer
        src={CONFIG.audioSrc}
        isEnabled={isAudioEnabled}
        onToggle={toggleAudio}
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
            {screen === "intro" && <IntroScreen onComplete={handleStart} />}
            {screen === "question" && <QuestionScreen onYes={handleYes} />}
            {screen === "yes" && <YesScreen onRestart={handleRestart} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal Footer */}
      <footer className="absolute bottom-6 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
        Made with love
      </footer>
    </div>
  );
};

export default App;
