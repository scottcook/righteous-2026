"use client";

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

const HERO_IMAGES = [
  { src: "/images/adobe-2.jpg", alt: "Adobe project" },
  { src: "/images/army-1.jpg", alt: "Army project" },
  { src: "/images/chipotle-1.jpg", alt: "Chipotle project" },
  { src: "/images/domino-s-ev-fleet-1.jpg", alt: "Domino's EV Fleet project" },
  { src: "/images/mercedes-2.jpg", alt: "Mercedes project" },
  { src: "/images/mitsubishi-electric-3.jpg", alt: "Mitsubishi Electric project" },
  { src: "/images/momocon-1.jpg", alt: "MomoCon project" },
  { src: "/images/old-spice-1.jpg", alt: "Old Spice project" },
  { src: "/images/reebok-2.jpg", alt: "Reebok project" },
  { src: "/images/reebok-3.jpg", alt: "Reebok project" },
];

const INTERVAL_MS = 1200;

export interface ImageHandle {
  container: HTMLDivElement | null;
  wrapper: HTMLDivElement | null;
}

const HeroImage = forwardRef<ImageHandle>(function HeroImage(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const prevIndexRef = useRef(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useImperativeHandle(ref, () => ({
    get container() {
      return containerRef.current;
    },
    get wrapper() {
      return wrapperRef.current;
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imgs = container.querySelectorAll("img");
    if (imgs.length === 0) return;

    // Show the first image on top
    imgs[0].style.opacity = "1";
    imgs[0].style.zIndex = "10";

    intervalRef.current = setInterval(() => {
      const prev = indexRef.current;
      const next = (prev + 1) % HERO_IMAGES.length;
      const oldPrev = prevIndexRef.current;

      // Hide the image from 2 steps ago (keep previous visible as safety net)
      if (oldPrev >= 0) {
        imgs[oldPrev].style.opacity = "0";
        imgs[oldPrev].style.zIndex = "1";
      }

      // Previous image stays visible at z-5 as fallback
      imgs[prev].style.zIndex = "5";

      // New image appears on top
      imgs[next].style.opacity = "1";
      imgs[next].style.zIndex = "10";

      prevIndexRef.current = prev;
      indexRef.current = next;
    }, INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="w-full" style={{ padding: "0 8vw" }}>
      <div
        ref={containerRef}
        className="relative overflow-hidden opacity-0 w-full"
        style={{ aspectRatio: "16 / 9", borderRadius: "12px" }}
      >
        {HERO_IMAGES.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 10 : 1 }}
            loading="eager"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
});

export default HeroImage;
