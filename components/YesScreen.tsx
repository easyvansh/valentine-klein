
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CONFIG } from '../constants';

interface Props {
  onRestart: () => void;
}

const YesScreen: React.FC<Props> = ({ onRestart }) => {
  const petalsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Elegant flower petal animation
    if (!petalsContainerRef.current) return;

    const container = petalsContainerRef.current;
    const colors = ['#fe4646ff', '#ff6d7eff', '#fda4af', '#ffbafaff'];

    for (let i = 0; i < 60; i++) {
      const petal = document.createElement('div');
      const size = Math.random() * 15 + 10;
      
      petal.className = 'absolute rounded-full pointer-events-none opacity-0';
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 0.8}px`;
      petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      petal.style.borderRadius = '0% 100% 0% 100% / 0% 100% 0% 100%';
      
      container.appendChild(petal);

      const startX = Math.random() * window.innerWidth;
      const startDelay = Math.random() * 3;

      gsap.fromTo(petal, 
        { 
          x: startX, 
          y: -50, 
          rotation: Math.random() * 360,
          opacity: 0 
        },
        {
          y: window.innerHeight + 50,
          x: startX + (Math.random() - 0.5) * 400,
          rotation: Math.random() * 720,
          opacity: 0.8,
          duration: 4 + Math.random() * 4,
          delay: startDelay,
          repeat: -1,
          ease: 'none',
          onUpdate: function() {
              // Floating drift effect
              const time = this.targets()[0]._gsap.time;
              gsap.set(petal, { x: startX + Math.sin(time) * 30 });
          }
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[1000px] relative">
      <div ref={petalsContainerRef} className="fixed inset-0 pointer-events-none z-0" />

      <div className="z-10 bg-white/60 backdrop-blur-lg p-12 md:p-20 rounded-[3rem] border border-white shadow-2xl text-center space-y-10 max-w-lg w-full transform scale-110 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="relative inline-block">
          <div className="text-6xl mb-4 animate-bounce">💖</div>
          <h2 className="font-serif text-3xl md:text-5xl text-rose-600">
            {CONFIG.yesMessageTitle}
          </h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed font-light">
            {CONFIG.yesMessageBody}
          </p>
          <p className="font-serif text-xl text-rose-400 italic pt-2">
            {CONFIG.signature}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="px-6 py-2 text-gray-400 hover:text-rose-400 transition-colors text-xs uppercase tracking-[0.2em] font-medium border-b border-transparent hover:border-rose-200"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default YesScreen;
