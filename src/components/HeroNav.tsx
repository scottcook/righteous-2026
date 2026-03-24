"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import WORDMARK_PATHS from "./wordmark-paths";

export default function HeroNav() {
  const logoRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Watch the hero section's scroll progress to determine when the wordmark
    // has left the viewport. The hero is fixed and translated via GSAP, so we
    // use a scroll-based trigger on the spacer.
    const spacer = document.querySelector("[data-hero-spacer]");
    if (!spacer) return;

    const st = ScrollTrigger.create({
      trigger: spacer,
      start: "top top",
      end: "30% top",
      onUpdate: (self) => {
        setVisible(self.progress > 0.5);
      },
    });

    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, {
      yPercent: visible ? 0 : -120,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [visible]);

  return (
    <div ref={logoRef} className="overflow-hidden" style={{ transform: "translateY(-120%)" }}>
      <svg
        viewBox="-5 -155 875 200"
        className="h-5 w-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {WORDMARK_PATHS.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}
