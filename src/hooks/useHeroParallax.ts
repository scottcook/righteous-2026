"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { ImageHandle } from "@/components/HeroImage";

/**
 * Two-phase parallax for the fixed hero:
 *
 * Phase 1 — "normal scroll": hero translates up at ~100% of scroll speed
 *   so it appears to scroll with the page naturally. This lasts until the
 *   image container reaches the viewport top.
 *
 * Phase 2 — "slow drift": hero continues drifting up but much slower,
 *   creating the parallax depth as the work section slides over it.
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

    // Measure where the image sits within the hero
    const imageRect = image.container.getBoundingClientRect();
    const heroRect = heroEl.getBoundingClientRect();
    const imageOffset = imageRect.top - heroRect.top;

    // Phase 1: translate hero up by imageOffset over the first portion of spacer scroll
    // This makes the hero feel like it's scrolling normally
    const phase1Tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerEl,
        start: "top bottom",
        end: `top top`,
        scrub: true,
      },
    });

    phase1Tl.to(heroEl, {
      y: -imageOffset,
      ease: "none",
    });

    // Phase 2: slow drift after image hits viewport top
    const phase2Tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerEl,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    const imageHeight = imageRect.height;
    phase2Tl.to(heroEl, {
      y: -imageOffset - imageHeight * 0.25,
      ease: "power1.in",
    });

    return () => {
      phase1Tl.kill();
      phase2Tl.kill();
    };
  }, [heroRef, imageRef, spacerRef]);
}
