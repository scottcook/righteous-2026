"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

/**
 * Per-letter optical kerning adjustments (in em).
 * These compensate for the loss of the font's kern table
 * when letters are wrapped in individual inline-block spans.
 * Values are hand-tuned for Canela Black at display size.
 */
const LETTERS: { char: string; kern: number }[] = [
  { char: "R", kern: 0 },
  { char: "i", kern: -0.01 },   // give breathing room from R
  { char: "g", kern: -0.01 },   // slight tighten after i
  { char: "h", kern: -0.02 },   // tighten g→h
  { char: "t", kern: -0.03 },   // tighten h→t
  { char: "e", kern: -0.05 },   // tighten t→e (open crossbar gap)
  { char: "o", kern: -0.035 },  // tighten e→o (round→round)
  { char: "u", kern: -0.015 },  // round→vertical
  { char: "s", kern: -0.02 },   // tighten u→s
];

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
    <div
      ref={containerRef}
      data-hero-wordmark
      className="w-full"
      style={{
        clipPath: "inset(-5% -5% -30% -5%)",
      }}
    >
      <div
        className="flex justify-center whitespace-nowrap"
        style={{
          fontFamily: '"Canela", Georgia, serif',
          fontWeight: 900,
          fontSize: "clamp(80px, 20vw, 400px)",
          lineHeight: 1.15,
        }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) letterRefs.current[i] = el;
            }}
            className="inline-block"
            style={{
              opacity: 0,
              marginLeft: letter.kern !== 0 ? `${letter.kern}em` : undefined,
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>
    </div>
  );
});

export default HeroWordmark;
