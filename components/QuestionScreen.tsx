import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { CONFIG, TEASING_MICROCOPY } from "../constants";
import { sendEmailNotification } from "../services/emailService";

interface Props {
  onYes: () => void;
  isDark: boolean;
}

const QuestionScreen: React.FC<Props> = ({ onYes, isDark }) => {
  const [noAttempts, setNoAttempts] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const teaseCooldown = useRef(false);

  const handleYes = () => {
    if (CONFIG.emailMode === "emailjs") {
      sendEmailNotification().catch((err) =>
        console.error("Email failed:", err),
      );
    }
    onYes();
  };

  const moveNoButton = useCallback(() => {
    if (!noButtonRef.current || !containerRef.current) return;

    const btn = noButtonRef.current;
    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = mousePos.current.x - btnCenterX;
    const dy = mousePos.current.y - btnCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const triggerRadius = 250;
    if (distance < triggerRadius) {
      // Tease increment with cooldown (so it doesn't jump to the end)
      if (!teaseCooldown.current) {
        teaseCooldown.current = true;
        setNoAttempts((prev) => prev + 1);
        setTimeout(() => (teaseCooldown.current = false), 150);
      }

    
      // Calculate flee vector (away from mouse)
      const angle = Math.atan2(dy, dx);
      const fleeDistance = 180;

      let newX = noPos.x - Math.cos(angle) * fleeDistance;
      let newY = noPos.y - Math.sin(angle) * fleeDistance;

      // Clamping within viewport with padding
      const padding = 80;
      const vWidth = window.innerWidth;
      const vHeight = window.innerHeight;

      // We need absolute screen positions to clamp properly
      const absX = rect.left + (newX - noPos.x);
      const absY = rect.top + (newY - noPos.y);

      if (absX < padding) newX += (padding - absX);
      if (absX > vWidth - rect.width - padding) newX -= (absX - (vWidth - rect.width - padding));
      if (absY < padding) newY += (padding - absY);
      if (absY > vHeight - rect.height - padding) newY -= (absY - (vHeight - rect.height - padding));

      gsap.to(btn, {
        x: newX,
        y: newY,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => setNoPos({ x: newX, y: newY })
      });
    }
  }, [noPos]);

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     mousePos.current = { x: e.clientX, y: e.clientY };
  //     moveNoButton();
  //   };

  //   const handleTouch = (e: TouchEvent) => {
  //     mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  //     moveNoButton();
  //   };

  //   window.addEventListener('mousemove', handleMouseMove);
  //   window.addEventListener('touchstart', handleTouch);
  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //     window.removeEventListener('touchstart', handleTouch);
  //   };
  // }, [moveNoButton]);


  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      moveNoButton();
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [moveNoButton]);

  const microcopy =
    TEASING_MICROCOPY[Math.min(noAttempts, TEASING_MICROCOPY.length - 1)];

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center space-y-16 animate-in fade-in zoom-in duration-1000"
    >
      <div
        className={`p-10 md:p-16 rounded-3xl text-center space-y-12 w-full backdrop-blur-md ${
          isDark
            ? "bg-[#120707]/85 border border-[#2a1414] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            : "bg-white/40 border border-white/120 shadow-xl"
        }`}
      >
        <div className="space-y-4">
          <h1
            className={`font-serif text-4xl md:text-5xl leading-tight ${
              isDark ? "text-[#f1e7d6]" : "text-gray-800"
            }`}
          >
            {CONFIG.questionTitle}
          </h1>
          <p
            className={`font-light max-w-sm mx-auto ${
              isDark ? "text-[#cdbba8]" : "text-gray-500"
            }`}
          >
            {CONFIG.subtext}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
          <button
            onClick={handleYes}
            className={`w-full md:w-auto px-24 py-12 rounded-full text-2xl md:text-3xl font-semibold shadow-lg active:scale-95 transition-all duration-400 z-50 ${
              isDark
                ? "bg-[#c10015] border-[#7f0a14] text-white hover:bg-[#a80012] hover:scale-105"
                : "bg-rose-500 border-red-600 text-white hover:bg-rose-700 hover:scale-105"
            }`}
          >
            Yes, I will
          </button>
          <button
            ref={noButtonRef}
            type="button"
            aria-disabled="true"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerEnter={() => {
              // Force a move the moment they get close (pre-click)
              moveNoButton();
            }}
            className={`w-full md:w-auto px-12 py-6 rounded-full font-medium select-none ${
              isDark
                ? "bg-[#111517] text-[#cdbba8] border border-[#2b2f33]"
                : "bg-gray-100 text-gray-500 border border-gray-700"
            }`}
          >
            No
          </button>

          {/* <button
            ref={noButtonRef}
            className="w-full md:w-auto px-12 py-6 bg-gray-100 text-gray-500 rounded-full font-medium border border-gray-700 cursor-default"
          >
            No
          </button> */}
        </div>
        {noAttempts > 0 && (
          <p
            key={noAttempts}
            className={`text-xs font-medium italic tracking-wide transition-all duration-500 opacity-100 ${
              isDark ? "text-[#b9878c]" : "text-rose-400"
            }`}
          >
            {microcopy}
          </p>
)}

      </div>
    </div>
  );
};

export default QuestionScreen;
