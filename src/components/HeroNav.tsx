"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function HeroNav() {
  const logoRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
      <span
        className="text-base font-black leading-none"
        style={{
          fontFamily: '"Canela", Georgia, serif',
          fontWeight: 900,
          letterSpacing: "-0.02em",
        }}
      >
        Righteous
      </span>
    </div>
  );
}
