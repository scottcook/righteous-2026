"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { ImageHandle } from "@/components/HeroImage";

export default function useScrollExpand(
  imageRef: React.RefObject<ImageHandle | null>,
  spacerRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const image = imageRef.current;
    const spacerEl = spacerRef.current;
    if (!image?.container || !image?.wrapper || !spacerEl) return;

    const containerEl = image.container;
    const wrapperEl = image.wrapper;

    // Expand should complete as the image reaches full width.
    // Use a fixed scroll distance relative to the viewport.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerEl,
        start: "top bottom",
        end: `+=${window.innerHeight}px`,
        scrub: true,
      },
    });

    tl.to(wrapperEl, {
      paddingLeft: 0,
      paddingRight: 0,
      ease: "none",
    }).to(
      containerEl,
      {
        borderRadius: "0px",
        ease: "none",
      },
      "<"
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === spacerEl) st.kill();
      });
    };
  }, [imageRef, spacerRef]);
}
