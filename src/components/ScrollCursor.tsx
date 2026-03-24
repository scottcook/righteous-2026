"use client";

import { useEffect, useRef } from "react";

export default function ScrollCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursor.style.transform = `translate(${currentX - 40}px, ${currentY - 40}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[100] pointer-events-none hidden lg:flex items-center justify-center"
      style={{ width: 80, height: 80 }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" className="animate-spin-slow absolute">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#c8e635"
            strokeWidth="1.5"
            strokeDasharray="190 40"
          />
        </svg>
        <span className="text-white text-[10px] font-semibold tracking-widest uppercase">
          Scroll
        </span>
      </div>
    </div>
  );
}
