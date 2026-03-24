"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import HeroNav from "./HeroNav";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const nav = navRef.current;
    if (!overlay || !nav) return;

    const links = nav.querySelectorAll("[data-nav-link]");
    const footer = nav.querySelector("[data-nav-footer]");

    const tl = gsap.timeline({ paused: true });

    tl.set(nav, { display: "flex" })
      .fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.inOut" }
      )
      .fromTo(
        nav,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.5, ease: "power3.out" },
        "<0.1"
      )
      .fromTo(
        links,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        footer,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (open) {
      document.body.style.overflow = "hidden";
      tlRef.current.play();
    } else {
      document.body.style.overflow = "";
      tlRef.current.reverse();
    }
  }, [open]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40 pointer-events-none opacity-0"
        onClick={toggle}
        style={{ pointerEvents: open ? "auto" : "none" }}
      />

      {/* Header bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <HeroNav />
        <button
          className="flex items-center gap-2 text-sm font-medium cursor-pointer"
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="transition-transform duration-300"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </header>

      {/* Navigation panel */}
      <nav
        ref={navRef}
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-[#1a1a1a] text-white flex-col justify-between px-12 py-16 hidden"
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-6 lg:right-12 flex items-center gap-2 text-sm font-medium cursor-pointer text-white/70 hover:text-white transition-colors"
          onClick={toggle}
          aria-label="Close menu"
        >
          <span>Close</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        {/* Nav links */}
        <div className="flex flex-col gap-6 mt-20">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="overflow-hidden">
              <a
                data-nav-link
                href={link.href}
                className="block text-4xl lg:text-5xl font-semibold tracking-tight text-white/90 hover:text-white transition-colors"
                onClick={toggle}
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div data-nav-footer className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <a href="#" className="text-sm text-white/50 hover:text-white/80 transition-colors">Instagram</a>
            <a href="#" className="text-sm text-white/50 hover:text-white/80 transition-colors">LinkedIn</a>
          </div>
          <div className="flex items-center justify-between text-xs text-white/30">
            <span>©2026 Righteous</span>
            <span>Creative · Tech</span>
          </div>
        </div>
      </nav>
    </>
  );
}
