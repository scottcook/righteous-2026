"use client";

import { useRef, useEffect, useState } from "react";
import HeroWordmark, { type WordmarkHandle } from "./HeroWordmark";
import HeroTagline, { type TaglineHandle } from "./HeroTagline";
import HeroImage, { type ImageHandle } from "./HeroImage";
import useHeroAnimation from "@/hooks/useHeroAnimation";
import useScrollExpand from "@/hooks/useScrollExpand";
import useHeroParallax from "@/hooks/useHeroParallax";
import useHeroDarken from "@/hooks/useHeroDarken";

export default function Hero() {
  const wordmarkRef = useRef<WordmarkHandle>(null);
  const taglineRef = useRef<TaglineHandle>(null);
  const imageRef = useRef<ImageHandle>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState("250vh");

  // Dynamically calculate spacer height based on image position
  useEffect(() => {
    const image = imageRef.current;
    if (!image?.container || !heroRef.current) return;

    const imageRect = image.container.getBoundingClientRect();
    const heroRect = heroRef.current.getBoundingClientRect();
    const imageOffset = imageRect.top - heroRect.top;
    const imageHeight = imageRect.height;

    // Spacer = enough to scroll the image to viewport top + enough for the
    // work section to fully cover the hero image
    const totalHeight = imageOffset + imageHeight + window.innerHeight;
    setSpacerHeight(`${totalHeight}px`);
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
        <div className="relative min-h-screen pt-10 lg:pt-12 flex flex-col items-center">
          {/* Wordmark */}
          <HeroWordmark ref={wordmarkRef} />

          {/* Tagline */}
          <div className="mt-6 lg:mt-8 flex justify-center mb-10 lg:mb-12">
            <HeroTagline ref={taglineRef} />
          </div>

          {/* Image */}
          <HeroImage ref={imageRef} />

          {/* Dark overlay for parallax phase */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: 0 }}
          />
        </div>
      </div>

      {/* Spacer — takes up the hero's scroll distance in normal flow */}
      <div
        ref={spacerRef}
        data-hero-spacer
        className="relative z-0 pointer-events-none"
        style={{ height: spacerHeight }}
      />
    </>
  );
}
