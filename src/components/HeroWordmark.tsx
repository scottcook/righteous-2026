"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

const LETTERS = ["R", "i", "g", "h", "t", "e", "o", "u", "s"];

export interface WordmarkHandle {
  container: HTMLDivElement | null;
  letters: HTMLSpanElement[];
}

const HeroWordmark = forwardRef<WordmarkHandle>(function HeroWordmark(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);

  useImperativeHandle(ref, () => ({
    get container() {
      return containerRef.current;
    },
    get letters() {
      return letterRefs.current;
    },
  }));

  return (
    <div ref={containerRef} className="w-full overflow-hidden" style={{ padding: "0 4vw" }}>
      <div
        className="flex justify-center leading-none"
        style={{
          fontFamily: '"Canela", Georgia, serif',
          fontWeight: 900,
          fontSize: "clamp(80px, 13vw, 220px)",
          letterSpacing: "-0.03em",
        }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) letterRefs.current[i] = el;
            }}
            className="inline-block"
            style={{ opacity: 0 }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
});

export default HeroWordmark;
