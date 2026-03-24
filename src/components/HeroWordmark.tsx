"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import WORDMARK_PATHS from "./wordmark-paths";

export interface WordmarkHandle {
  container: HTMLDivElement | null;
  letters: SVGPathElement[];
}

const HeroWordmark = forwardRef<WordmarkHandle>(function HeroWordmark(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<SVGPathElement[]>([]);

  useImperativeHandle(ref, () => ({
    get container() {
      return containerRef.current;
    },
    get letters() {
      return letterRefs.current;
    },
  }));

  return (
    <div ref={containerRef} className="w-full px-4 lg:px-8">
      <svg
        viewBox="-5 -155 875 200"
        className="w-full h-auto"
        overflow="hidden"
        preserveAspectRatio="xMidYMid meet"
      >
        <clipPath id="wordmark-clip">
          <rect x="-5" y="-155" width="875" height="200" />
        </clipPath>
        <g clipPath="url(#wordmark-clip)">
          {WORDMARK_PATHS.map((d, i) => (
            <path
              key={i}
              ref={(el) => {
                if (el) letterRefs.current[i] = el;
              }}
              d={d}
              fill="currentColor"
              style={{ opacity: 0 }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

export default HeroWordmark;
