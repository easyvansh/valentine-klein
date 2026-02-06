
import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { CONFIG } from '../constants';

interface Props {
  onComplete: () => void;
}

const IntroScreen: React.FC<Props> = ({ onComplete }) => {
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
      // Auto advance after 4s on the last line
      const autoTimer = setTimeout(onComplete, 10000);
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
      className="flex flex-col items-center justify-center text-center cursor-pointer min-h-[600px] bg-white/40 backdrop-blur-md p-10 md:p-16 rounded-3xl border border-white/60 shadow-xl space-y-8 w-full"
    >
      
      <div className="space-y-6">
        {CONFIG.introLines.slice(0, currentLineIndex + 1).map((line, idx) => (
          <p 
            key={idx}
            className={`intro-text font-serif text-2xl md:text-3xl text-gray-700 transition-all duration-900 ${
              idx === currentLineIndex ? 'opacity-100' : 'opacity-40 text-xl'
            }`}
          >
            {line}
          </p>
        ))}
      </div>

      <div className={`mt-12 transition-opacity duration-1000 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); onComplete(); }}
          className="px-8 py-3 bg-pink-200 text-gray-700 rounded-full border border-pink-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all active:scale-95 text-sm uppercase tracking-widest font-medium"
        >
        Start
        </button>
      </div>
      
      <p className="fixed bottom-12 text-gray-400 text-xs italic tracking-wider animate-pulse">
        Tap anywhere to skip
      </p>
    </div>
  );
};

export default IntroScreen;
