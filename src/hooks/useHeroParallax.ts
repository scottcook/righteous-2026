"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { ImageHandle } from "@/components/HeroImage";

/**
 * Two-phase parallax for the fixed hero:
 *
 * Phase 1 — "normal scroll": hero translates up matching scroll speed
 *   throughout the expand animation (1 viewport of scroll).
 * Phase 2 — "slow drift": hero continues drifting up slower as the
 *   work section slides over it.
 */
export default function useHeroParallax(
  heroRef: React.RefObject<HTMLDivElement | null>,
  imageRef: React.RefObject<ImageHandle | null>,
  spacerRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const heroEl = heroRef.current;
    const image = imageRef.current;
    const spacerEl = spacerRef.current;
    if (!heroEl || !image?.container || !spacerEl) return;

    const imageRect = image.container.getBoundingClientRect();
    const heroRect = heroEl.getBoundingClientRect();
    const imageOffset = imageRect.top - heroRect.top;
    const imageHeight = imageRect.height;
    const drift = imageHeight * 0.7;
    const vh = window.innerHeight;

    // Total scroll range: spacer height + one viewport
    // (the extra viewport is for the work section to slide over)
    const spacerHeight = spacerEl.offsetHeight;
    const totalRange = spacerHeight + vh;

    // Phase 1 should span one viewport of scroll (matching the expand duration)
    const phase1Ratio = vh / totalRange;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerEl,
        start: "top bottom",
        end: `bottom+=${vh}px top`,
        scrub: true,
      },
    });

    // Phase 1: move up by imageOffset over 1 viewport of scroll.
    // This keeps the hero scrolling throughout the entire expand animation.
    tl.to(heroEl, {
      y: -imageOffset,
      ease: "none",
      duration: phase1Ratio,
    });

    // Phase 2: slow drift as the work section covers the hero.
    tl.to(heroEl, {
      y: -imageOffset - drift,
      ease: "none",
      duration: 1 - phase1Ratio,
    });

    return () => {
      tl.kill();
    };
  }, [heroRef, imageRef, spacerRef]);
}
