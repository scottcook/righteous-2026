"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { WordmarkHandle } from "@/components/HeroWordmark";
import type { TaglineHandle } from "@/components/HeroTagline";
import type { ImageHandle } from "@/components/HeroImage";

export default function useHeroAnimation(
  wordmark: React.RefObject<WordmarkHandle | null>,
  tagline: React.RefObject<TaglineHandle | null>,
  image: React.RefObject<ImageHandle | null>
) {
  useEffect(() => {
    if (!wordmark.current || !tagline.current || !image.current) return;

    const letters = wordmark.current.letters;
    const taglineEl = tagline.current.element;
    const containerEl = image.current.container;

    if (!letters.length || !taglineEl || !containerEl) return;

    // Build-in animation timeline
    const tl = gsap.timeline({ delay: 0.3 });

    // Letters slide up from below
    tl.fromTo(
      letters,
      { yPercent: 130, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.04,
        duration: 0.6,
        ease: "power3.out",
      }
    );

    // Tagline fades in
    tl.fromTo(
      taglineEl,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2"
    );

    // Image container fades in
    tl.fromTo(
      containerEl,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Re-trigger wordmark + tagline animations when scrolling back into view.
    // Use gsap.ticker instead of ScrollTrigger because the hero is fixed
    // and moves via translateY — ScrollTrigger can't track that accurately.
    const wordmarkContainer = wordmark.current.container;
    let wordmarkHidden = false;
    let taglineHidden = false;

    const checkElements = () => {
      // Wordmark
      if (wordmarkContainer) {
        const rect = wordmarkContainer.getBoundingClientRect();
        const isOffScreen = rect.bottom < 0;

        if (isOffScreen && !wordmarkHidden) {
          wordmarkHidden = true;
          gsap.set(letters, { opacity: 0, yPercent: 130 });
        } else if (!isOffScreen && wordmarkHidden) {
          wordmarkHidden = false;
          gsap.fromTo(
            letters,
            { yPercent: 130, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.6,
              ease: "power3.out",
            }
          );
        }
      }

      // Tagline
      if (taglineEl) {
        const rect = taglineEl.getBoundingClientRect();
        const isOffScreen = rect.bottom < 0;

        if (isOffScreen && !taglineHidden) {
          taglineHidden = true;
          gsap.set(taglineEl, { opacity: 0, y: 20 });
        } else if (!isOffScreen && taglineHidden) {
          taglineHidden = false;
          gsap.fromTo(
            taglineEl,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.5 }
          );
        }
      }
    };

    gsap.ticker.add(checkElements);

    return () => {
      tl.kill();
      gsap.ticker.remove(checkElements);
    };
  }, [wordmark, tagline, image]);
}
