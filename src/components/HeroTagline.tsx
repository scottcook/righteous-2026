"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export interface TaglineHandle {
  element: HTMLParagraphElement | null;
}

const HeroTagline = forwardRef<TaglineHandle>(function HeroTagline(_, ref) {
  const pRef = useRef<HTMLParagraphElement>(null);

  useImperativeHandle(ref, () => ({
    get element() {
      return pRef.current;
    },
  }));

  return (
    <div className="overflow-hidden">
      <p
        ref={pRef}
        className="text-base lg:text-lg font-semibold tracking-tight text-muted text-center leading-relaxed max-w-[320px] lg:max-w-none opacity-0 uppercase font-[family-name:var(--font-hanken)]"
      >
        Your lean, overhead-free creative development partner
        <br className="hidden lg:inline" />
        built for today&apos;s AI-fueled market
      </p>
    </div>
  );
});

export default HeroTagline;
