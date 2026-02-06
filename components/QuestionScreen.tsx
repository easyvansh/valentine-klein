import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { CONFIG, TEASING_MICROCOPY } from "../constants";
import { sendEmailNotification } from "../services/emailService";

interface Props {
  onYes: () => void;
}

const QuestionScreen: React.FC<Props> = ({ onYes }) => {
  const [noAttempts, setNoAttempts] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  
  const handleYes = () => {
    if (CONFIG.emailMode === "emailjs") {
      sendEmailNotification().catch((err) =>
        console.error("Email failed:", err),
    );
  }
  onYes();
};
const teaseCooldown = useRef(false);

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
      <div className="bg-white/40 backdrop-blur-md p-10 md:p-16 rounded-3xl border border-white/120 shadow-xl text-center space-y-12 w-full">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-800 leading-tight">
            {CONFIG.questionTitle}
          </h1>
          <p className="text-gray-500 font-light max-w-sm mx-auto">
            {CONFIG.subtext}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
          <button
            onClick={handleYes}
            className="w-full md:w-auto px-24 py-12 bg-rose-500 border-red-600 text-white rounded-full font-medium shadow-lg hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all duration-400 z-50"
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
            className="w-full md:w-auto px-12 py-6 bg-gray-100 text-gray-500 rounded-full font-medium border border-gray-700  select-none"
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
    className="text-xs text-rose-400 font-medium italic tracking-wide transition-all duration-500 opacity-100"
  >
    {microcopy}
  </p>
)}

      </div>
    </div>
  );
};

export default QuestionScreen;
