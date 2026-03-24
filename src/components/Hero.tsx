"use client";

import { useRef, useEffect, useState } from "react";
import HeroWordmark, { type WordmarkHandle } from "./HeroWordmark";
import HeroTagline, { type TaglineHandle } from "./HeroTagline";
import HeroImage, { type ImageHandle } from "./HeroImage";
import useHeroAnimation from "@/hooks/useHeroAnimation";
import useScrollExpand from "@/hooks/useScrollExpand";
import useHeroParallax from "@/hooks/useHeroParallax";
import useHeroDarken from "@/hooks/useHeroDarken";

/**
 * Hero layout proportions matched to Onbox Creative:
 * - Wordmark: top ~10vh, width ~92vw
 * - Gap wordmark→tagline: ~5vh
 * - Tagline: 16px, weight 500, uppercase
 * - Gap tagline→image: ~5vh
 * - Image: side padding ~8vw, 16:9 aspect, 12px border-radius
 */
export default function Hero() {
  const wordmarkRef = useRef<WordmarkHandle>(null);
  const taglineRef = useRef<TaglineHandle>(null);
  const imageRef = useRef<ImageHandle>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState("150vh");

  // Dynamically calculate spacer height based on image position
  useEffect(() => {
    const image = imageRef.current;
    if (!image?.container || !heroRef.current) return;

    const imageRect = image.container.getBoundingClientRect();
    const heroRect = heroRef.current.getBoundingClientRect();
    const imageOffset = imageRect.top - heroRect.top;
    const imageHeight = imageRect.height;

    // Spacer height = distance to scroll the image to viewport top
    // + the image height (for the work section to cover it)
    const scrollDistance = imageOffset + imageHeight;
    setSpacerHeight(`${scrollDistance}px`);
  }, []);

  // Wire up animations
  useHeroAnimation(wordmarkRef, taglineRef, imageRef);
  useScrollExpand(imageRef, spacerRef);
  useHeroParallax(heroRef, imageRef, spacerRef);
  useHeroDarken(overlayRef, spacerRef);

  return (
    <>
      {/* Fixed hero layer — sits behind everything */}
      <div ref={heroRef} className="fixed inset-0 z-0">
        <div className="relative min-h-screen flex flex-col items-center" style={{ paddingTop: "10vh" }}>
          {/* Wordmark — 92vw wide like Onbox */}
          <HeroWordmark ref={wordmarkRef} />

          {/* Tagline */}
          <div className="flex justify-center" style={{ marginTop: "5vh", marginBottom: "5vh" }}>
            <HeroTagline ref={taglineRef} />
          </div>

          {/* Image — 8vw side padding like Onbox */}
          <HeroImage ref={imageRef} />

          {/* Dark overlay for parallax phase */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: 0 }}
          />
        </div>
      </div>

      {/* Initial viewport spacer — holds the hero's place in document flow.
          The parallax spacer sits below this so ScrollTrigger doesn't fire at scroll 0. */}
      <div className="relative z-0 pointer-events-none" style={{ height: "100vh" }} />

      {/* Parallax spacer — scroll through this drives the expand + parallax animations */}
      <div
        ref={spacerRef}
        data-hero-spacer
        className="relative z-0 pointer-events-none"
        style={{ height: spacerHeight }}
      />
    </>
  );
}
