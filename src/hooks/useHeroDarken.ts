"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function useHeroDarken(
  overlayRef: React.RefObject<HTMLDivElement | null>,
  spacerRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const overlay = overlayRef.current;
    const spacerEl = spacerRef.current;
    if (!overlay || !spacerEl) return;

    const st = ScrollTrigger.create({
      trigger: spacerEl,
      start: "40% top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(overlay, { opacity: self.progress * 0.4 });
      },
    });

    return () => st.kill();
  }, [overlayRef, spacerRef]);
}
