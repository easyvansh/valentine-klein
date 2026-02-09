import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CONFIG } from '../constants';

interface Props {
  onRestart: () => void;
  isDark: boolean;
}

const YesScreen: React.FC<Props> = ({ onRestart, isDark }) => {
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

      gsap.fromTo(
        petal,
        {
          x: startX,
          y: -50,
          rotation: Math.random() * 360,
          opacity: 0,
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
          onUpdate: function () {
            // Floating drift effect
            const time = this.targets()[0]._gsap.time;
            gsap.set(petal, { x: startX + Math.sin(time) * 30 });
          },
        }
      );
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div ref={petalsContainerRef} className="fixed inset-0 pointer-events-none z-0" />

      <div
        className={`z-10 w-full max-w-xl space-y-10 rounded-[3rem] p-10 text-center shadow-2xl backdrop-blur-lg animate-in fade-in slide-in-from-bottom-10 duration-1000 md:p-16 ${
          isDark
            ? "border border-[#2a1414] bg-[#120707]/85 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            : "border border-white/60 bg-white/70"
        }`}
      >
        <div className="relative inline-block">
          <div className="mb-4 text-6xl animate-bounce">💖</div>
          <h2 className={`font-serif text-3xl md:text-5xl ${isDark ? "text-[#f1e7d6]" : "text-rose-600"}`}>
            {CONFIG.yesMessageTitle}
          </h2>
        </div>

        <div className="space-y-4">
          <p
            className={`text-balance text-lg font-light leading-relaxed ${
              isDark ? "text-[#cdbba8]" : "text-gray-700"
            }`}
          >
            {CONFIG.yesMessageBody}
          </p>
          <p className={`pt-2 font-serif text-xl italic ${isDark ? "text-[#b9878c]" : "text-rose-400"}`}>
            {CONFIG.signature}
          </p>
        </div>

        <button
          onClick={onRestart}
          className={`px-6 py-2 transition-colors text-xs uppercase tracking-[0.2em] font-medium border-b border-transparent ${
            isDark
              ? "text-[#cdbba8] hover:text-[#f1e7d6] hover:border-[#5a3030]"
              : "text-gray-400 hover:text-rose-400 hover:border-rose-200"
          }`}
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default YesScreen;
