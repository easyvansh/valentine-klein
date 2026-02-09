
import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { CONFIG } from '../constants';

interface Props {
  onComplete: () => void;
  isDark: boolean;
}

const IntroScreen: React.FC<Props> = ({ onComplete, isDark }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (currentLineIndex < CONFIG.introLines.length) {
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowButton(true);
      // Auto advance after 10s on the last line
      const autoTimer = setTimeout(onComplete, 12000);
      return () => clearTimeout(autoTimer);
    }
  }, [currentLineIndex, onComplete]);

  useEffect(() => {
    gsap.fromTo(
      '.intro-text',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
  }, [currentLineIndex]);

  return (
    <div 
      className={`flex flex-col items-center justify-center text-center cursor-pointer min-h-[600px] p-10 md:p-16 rounded-3xl space-y-8 w-full backdrop-blur-md ${
        isDark
          ? "bg-[#120707]/85 border border-[#2a1414] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          : "bg-white/40 border border-white/60 shadow-xl"
      }`}
    >
      
      <div className="space-y-6">
        {CONFIG.introLines.slice(0, currentLineIndex + 1).map((line, idx) => (
          <p 
            key={idx}
            className={`intro-text font-serif text-2xl md:text-3xl transition-all duration-900 ${
              isDark ? "text-[#f1e7d6]" : "text-gray-700"
            } ${
              idx === currentLineIndex ? "opacity-100" : "opacity-40 text-xl"
            }`}
          >
            {line}
          </p>
        ))}
      </div>

      <div className={`mt-12 transition-opacity duration-1000 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); onComplete(); }}
          className={`px-8 py-3 rounded-full border shadow-sm transition-all active:scale-95 text-sm uppercase tracking-widest font-medium ${
            isDark
              ? "bg-[#6b0f22] text-[#f7e9d8] border-[#4a0c1a] hover:shadow-md"
              : "bg-pink-200 text-gray-700 border-pink-100 hover:shadow-md hover:border-pink-200"
          }`}
        >
        Touch Me
        </button>
      </div>
      
      <p className={`fixed bottom-12 text-xs italic tracking-wider animate-pulse ${isDark ? "text-[#d9c8b2]/70" : "text-gray-400"}`}>
        Tap anywhere to skip
      </p>
    </div>
  );
};

export default IntroScreen;
