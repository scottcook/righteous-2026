/* ================================================================
 * Righteous 2026 — Webflow hosted animation bundle
 *
 * Depends on: gsap, ScrollTrigger, Lenis being loaded (bootstrap
 * inline script in Webflow registers the CDN tags before this).
 *
 * Ports the following from the Next.js source verbatim:
 *   - HeroWordmark letter kerning
 *   - HeroImage cross-fade rotation (1200ms)
 *   - useHeroAnimation initial timeline + re-trigger on re-enter
 *   - useScrollExpand padding/border-radius scrub
 *   - useHeroParallax two-phase scrub
 *   - useHeroDarken overlay opacity scrub
 *   - HeroNav header wordmark show/hide
 *   - Menu open/close timeline + Lenis stop/start
 *   - SmoothScroll (Lenis) init
 * ================================================================ */

(function () {
  'use strict';

  // ---- Constants -------------------------------------------------

  var ASSET_BASE = 'https://righteous-2026-3l2o.vercel.app';
  var HERO_ASPECT_RATIO = 16 / 9;
  var IMAGE_INTERVAL_MS = 1200;

  var HERO_IMAGES = [
    { src: '/images/adobe-2.jpg', alt: 'Adobe project' },
    { src: '/images/army-1.jpg', alt: 'Army project' },
    { src: '/images/chipotle-1.jpg', alt: 'Chipotle project' },
    { src: '/images/domino-s-ev-fleet-1.jpg', alt: "Domino's EV Fleet project" },
    { src: '/images/mercedes-2.jpg', alt: 'Mercedes project' },
    { src: '/images/mitsubishi-electric-3.jpg', alt: 'Mitsubishi Electric project' },
    { src: '/images/momocon-1.jpg', alt: 'MomoCon project' },
    { src: '/images/old-spice-1.jpg', alt: 'Old Spice project' },
    { src: '/images/reebok-2.jpg', alt: 'Reebok project' },
    { src: '/images/reebok-3.jpg', alt: 'Reebok project' }
  ];

  // Hand-tuned kerning for Canela Black at display size (em units).
  var LETTERS = [
    { c: 'R', k: 0 },
    { c: 'i', k: -0.01 },
    { c: 'g', k: -0.01 },
    { c: 'h', k: -0.02 },
    { c: 't', k: -0.03 },
    { c: 'e', k: -0.05 },
    { c: 'o', k: -0.035 },
    { c: 'u', k: -0.015 },
    { c: 's', k: -0.02 }
  ];

  // Righteous wordmark SVG (viewBox 0 0 196 43). Pulled from HeroNav.tsx.
  var WORDMARK_SVG = [
    '<svg viewBox="0 0 196 43" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">',
    '<path d="M193.59 17.47l-.42.08c-.72-.89-1.37-1.68-1.95-2.37a24 24 0 00-1.58-1.71 7 7 0 00-1.46-1.04 4.2 4.2 0 00-1.54-.37c-.72 0-1.37.2-1.95.62-.59.42-.88 1.03-.88 1.83 0 .58.15 1.08.46 1.5.3.39.7.73 1.2 1.04.53.3 1.11.6 1.75.87.67.25 1.35.53 2.04.83.72.33 1.43.71 2.12 1.12.72.39 1.36.88 1.91 1.46.56.58 1 1.28 1.33 2.08.33.78.5 1.7.5 2.79 0 1.25-.25 2.32-.75 3.2-.47.86-1.12 1.57-1.95 2.12-.81.53-1.76.9-2.87 1.12a16.4 16.4 0 01-3.45.37c-1.33 0-2.62-.12-3.87-.37a14.7 14.7 0 01-3.29-1l-.62-6.07.42-.08c1.5 2.05 2.94 3.7 4.33 4.95 1.39 1.22 2.81 1.83 4.28 1.83.92 0 1.55-.22 1.92-.67.39-.44.58-.97.58-1.58 0-.58-.15-1.08-.46-1.5-.28-.42-.65-.79-1.12-1.12-.47-.33-1.03-.64-1.66-.92-.61-.28-1.25-.57-1.92-.87-.75-.33-1.48-.71-2.2-1.12a8.2 8.2 0 01-1.96-1.5 6.7 6.7 0 01-1.37-2.08c-.36-.8-.54-1.76-.54-2.87 0-1.19.23-2.22.71-3.08.47-.86 1.12-1.55 1.95-2.08a8.4 8.4 0 012.91-1.21 16 16 0 013.62-.37c.94 0 1.86.06 2.75.17.89.11 1.7.26 2.45.46l.58 5.53z" fill="currentColor"/>',
    '<path d="M167.38 28.87h-.25c-.17.31-.44.7-.83 1.17-.36.47-.83.93-1.41 1.37-.59.44-1.27.82-2.04 1.12-.75.33-1.6.5-2.54.5-1.83 0-3.26-.58-4.28-1.75-1-1.16-1.5-2.72-1.5-4.66V16.93c0-.67-.04-1.23-.12-1.71-.06-.47-.15-.89-.29-1.25a4.5 4.5 0 00-.46-.96 8 8 0 00-.58-.91v-.17h9.44v15.14c0 .28.03.56.08.83.08.28.2.54.33.79.17.22.39.42.67.58.28.14.62.21 1.04.21.55 0 1.04-.17 1.45-.5.42-.36.78-.79 1.08-1.29V16.85c0-.67-.04-1.23-.12-1.71-.06-.47-.15-.89-.29-1.25a4.5 4.5 0 00-.46-.96 8 8 0 00-.58-.91v-.17h9.44v10.98c0 1.19.04 2.19.12 3 .08.8.21 1.5.37 2.08.17.58.39 1.08.67 1.5.28.42.61.85 1 1.29v.08l-9.94 2.17v-4.16z" fill="currentColor"/>',
    '<path d="M141.58 33.03c-1.55 0-3.02-.29-4.41-.87a12.2 12.2 0 01-3.66-2.33 11.6 11.6 0 01-2.46-3.45 10.4 10.4 0 01-.91-4.2c0-1.47.3-2.86.91-4.16a11.7 11.7 0 012.46-3.5 12.2 12.2 0 013.66-2.37 11.3 11.3 0 014.41-.87c1.58 0 3.07.29 4.45.87a12.2 12.2 0 013.62 2.37 11.7 11.7 0 012.5 3.5c.61 1.3.91 2.69.91 4.16 0 1.47-.3 2.87-.91 4.2a11.6 11.6 0 01-2.5 3.45 12.2 12.2 0 01-3.62 2.33c-1.39.58-2.87.87-4.45.87zm.04-.75c1.17 0 2.01-.89 2.54-2.66.53-1.78.79-4.26.79-7.45 0-3.19-.28-5.67-.83-7.45-.53-1.8-1.37-2.7-2.54-2.7-1.17 0-2.01.9-2.54 2.7-.53 1.78-.79 4.26-.79 7.45 0 3.19.26 5.67.79 7.45.55 1.77 1.43 2.66 2.58 2.66z" fill="currentColor"/>',
    '<path d="M128.06 26.25c-.58 2.08-1.68 3.73-3.29 4.95-1.61 1.22-3.66 1.83-6.16 1.83-1.66 0-3.15-.26-4.45-.79a9.8 9.8 0 01-3.29-2.25 10.4 10.4 0 01-2.04-3.37 11.4 11.4 0 01-.71-4.12c0-1.61.25-3.09.75-4.45a10.8 10.8 0 012.12-3.58 10.4 10.4 0 013.37-2.33 10.7 10.7 0 014.37-.87c1.58 0 2.95.28 4.12.83a7.9 7.9 0 012.95 2.12c.78.86 1.36 1.85 1.75 2.95.39 1.08.58 2.19.58 3.33l-11.86-.12c.11 1.47.35 2.68.71 3.62.39.94.87 1.69 1.46 2.25.58.55 1.25.94 2 1.16.75.19 1.52.29 2.33.29.75 0 1.41-.07 2-.21.61-.14 1.12-.29 1.54-.46.41-.17.75-.33 1-.5.25-.19.43-.33.54-.41l.21.12zm-11.82-6.74l4.29-.04v-2.16c0-1.91-.21-3.27-.62-4.08-.39-.8-.88-1.2-1.46-1.2-.36 0-.68.19-.96.58-.28.36-.51.86-.71 1.5-.16.64-.3 1.37-.41 2.21-.08.83-.12 1.69-.12 2.58v.62z" fill="currentColor"/>',
    '<path d="M101.06 33.03c-1.91 0-3.44-.49-4.58-1.46-1.11-.97-1.66-2.54-1.66-4.7V12.94h-2.37v-.42l9.86-5.49h.5v4.91h4.7v1h-4.7v13.73c0 .69.08 1.26.25 1.7.19.44.43.79.71 1.04.28.25.6.43.96.54.36.08.72.12 1.08.12.39 0 .71-.03.96-.08.28-.08.51-.17.71-.25.22-.11.4-.24.54-.37l.12.12c-.22.42-.54.83-.96 1.25-.39.42-.87.79-1.46 1.12-.58.33-1.27.61-2.08.83-.78.22-1.64.33-2.58.33z" fill="currentColor"/>',
    '<path d="M68.82 32.41v-.08c.14-.47.27-.93.38-1.36.14-.47.25-.96.33-1.46.11-.53.19-1.11.25-1.75.06-.64.08-1.4.08-2.29V9.82c0-.83-.04-1.59-.12-2.19a12 12 0 00-.33-1.37 7.5 7.5 0 00-.54-1.62 12 12 0 00-1.08-1.58v-.08L77.84 0v15.35c.19-.39.47-.82.83-1.29.39-.47.87-.92 1.46-1.33.61-.42 1.32-.79 2.12-1.07.8-.28 1.72-.42 2.75-.42.89 0 1.72.14 2.5.42.78.25 1.46.62 2.04 1.12.58.47 1.04 1.07 1.37 1.79.33.69.5 1.47.5 2.33v8.53c0 .83.03 1.58.08 2.25.06.64.12 1.22.21 1.75.08.53.18 1.03.29 1.5.14.44.28.9.42 1.37v.08H82.38v-.08c.17-.47.31-.93.42-1.37.14-.47.25-.97.33-1.5.11-.53.18-1.11.21-1.75.05-.64.08-1.37.08-2.21v-8.53c0-.72-.19-1.29-.58-1.7-.39-.42-.97-.62-1.75-.62-.72 0-1.37.21-1.96.62-.55.39-.98.85-1.29 1.37v8.82c0 .83.03 1.57.08 2.21.06.64.13 1.22.21 1.75.11.53.22 1.03.33 1.5.14.44.28.9.42 1.37v.08H68.82z" fill="currentColor"/>',
    '<path d="M54.34 25.13c.72 0 1.23-.54 1.54-1.62.3-1.11.46-2.75.46-4.91 0-2.16-.15-3.8-.46-4.91-.3-1.11-.82-1.66-1.58-1.66s-1.26.55-1.54 1.66c-.28 1.11-.42 2.75-.42 4.91 0 2.16.15 3.8.46 4.91.3 1.08.82 1.62 1.54 1.62zm12.31 9.74c0 1.16-.3 2.19-.91 3.08-.59.89-1.45 1.64-2.58 2.25-1.11.64-2.47 1.11-4.08 1.41-1.58.33-3.38.5-5.41.5-3.22 0-5.7-.35-7.45-1.04-1.72-.69-2.58-1.64-2.58-2.83 0-.83.37-1.53 1.12-2.08.78-.56 1.69-.97 2.75-1.25-1.22-.44-2.09-1.05-2.62-1.83-.53-.78-.79-1.68-.79-2.71 0-.86.15-1.61.46-2.25.3-.67.68-1.23 1.12-1.71.47-.47.97-.85 1.5-1.12.53-.31 1.03-.54 1.5-.71-1.25-.64-2.22-1.48-2.91-2.54-.67-1.05-1-2.2-1-3.45 0-1.03.22-1.98.67-2.87.47-.92 1.12-1.69 1.95-2.33a9.2 9.2 0 013-1.54 12.8 12.8 0 013.91-.58c1.25 0 2.39.14 3.41.42 1.05.28 1.98.67 2.79 1.16l6.03-3.79.08.08v5.2h-.17l-5.08-.87c.8.64 1.43 1.4 1.87 2.29.44.86.67 1.8.67 2.83 0 1.05-.24 2.02-.71 2.91-.44.89-1.09 1.65-1.95 2.29a10 10 0 01-3.04 1.54c-1.16.36-2.45.54-3.87.54-1-.01-1.87-.08-2.7-.25-.83-.19-1.61-.44-2.33-.75a2.4 2.4 0 00-.25.54 2 2 0 00-.08.71c0 .31.04.58.12.83.11.25.3.46.55.62.28.17.65.31 1.12.42.47.11 1.07.18 1.79.21l3.45.21c7.1.42 10.65 2.57 10.65 6.45zm-11.69 6.32c2.14 0 3.77-.26 4.91-.79 1.14-.53 1.71-1.25 1.71-2.17 0-.36-.11-.68-.33-1-.19-.28-.55-.51-1.08-.71-.53-.19-1.22-.35-2.08-.46-.78-.11-1.85-.21-3.13-.29l-3.91-.25c-1.08-.08-1.98-.22-2.71-.41a2.6 2.6 0 00-.37.83 3.5 3.5 0 00-.12.83c0 .78.19 1.41.58 1.91.39.53.92.94 1.58 1.25.67.33 1.43.56 2.29.67.89.14 1.8.21 2.75.21z" fill="currentColor"/>',
    '<path d="M41.02 5.24c0 .58-.11 1.14-.33 1.66-.22.5-.53.94-.92 1.33-.39.36-.84.65-1.37.87-.53.19-1.08.29-1.66.29-.58 0-1.12-.1-1.62-.29a4.5 4.5 0 01-1.29-.87 4.3 4.3 0 01-.87-1.33 4.2 4.2 0 01-.29-1.66c0-1.14.39-2.11 1.16-2.91A3.9 3.9 0 0136.74 1.12c.58 0 1.14.11 1.66.33.53.22.98.53 1.37.92.39.36.69.79.92 1.29.22.5.33 1.03.33 1.58zm-8.45 27.08c.14-.47.28-.93.37-1.37.14-.47.25-.94.33-1.5.11-.53.19-1.11.25-1.75.06-.67.08-1.41.08-2.25v-4.58c0-.83-.04-1.57-.12-2.2a8 8 0 00-.33-1.83 7 7 0 00-.67-1.62 11 11 0 00-1.08-1.58v-.08l10.19-2.5v14.44c0 .83.03 1.57.08 2.21.06.64.12 1.22.21 1.75.11.53.22 1.03.33 1.5.14.44.28.9.42 1.37v.08H32.58v-.08z" fill="currentColor"/>',
    '<path d="M12.02 2.91c-.22 0-.46.01-.71.04-.25 0-.51 0-.79 0v14.6h1.75c1.08 0 1.97-.24 2.66-.71.72-.47 1.29-1.08 1.71-1.83.44-.75.75-1.58.92-2.5.17-.92.25-1.83.25-2.75 0-.92-.1-1.77-.29-2.58a5.7 5.7 0 00-.92-2.2 4.8 4.8 0 00-1.79-1.5c-.75-.39-1.68-.58-2.79-.58zM0 32.33c.28-.78.53-1.5.75-2.16.22-.67.4-1.35.54-2.04.14-.69.24-1.44.29-2.25.08-.83.12-1.8.12-2.91V11.4c0-1.11-.04-2.07-.12-2.87-.06-.83-.15-1.6-.29-2.29a13 13 0 00-.54-2c-.22-.67-.47-1.4-.75-2.2v-.08h14.31c2.39 0 4.38.18 6 .54 1.61.36 2.9.87 3.86 1.54 1 .67 1.68 1.47 2.07 2.41.42.94.62 1.98.62 3.12 0 1.58-.4 3.07-1.21 4.45-.8 1.39-2.17 2.48-4.12 3.29l4.54 9.49c.3.67.6 1.28.87 1.83.3.53.61 1.01.92 1.45.33.44.71.85 1.12 1.21.42.36.9.71 1.46 1.04v.08H19.14l-6.32-13.81h-2.29v4.42c0 1.05.03 1.98.08 2.79.08.8.19 1.57.33 2.27.14.69.31 1.39.5 2.08.22.67.47 1.39.75 2.16v.08H0v-.08z" fill="currentColor"/>',
    '</svg>'
  ].join('');

  // Small rotating disc SVG for the header logo.
  var DISC_SVG = [
    '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="width:100%;height:100%">',
    '<circle cx="16" cy="16" r="15" stroke="currentColor" stroke-width="1.5"/>',
    '<circle cx="16" cy="16" r="2" fill="currentColor"/>',
    '<line x1="16" y1="1" x2="16" y2="6" stroke="currentColor" stroke-width="1.5"/>',
    '</svg>'
  ].join('');

  // ---- Helpers ---------------------------------------------------

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---- Injection -------------------------------------------------

  function injectHeroLetters() {
    var host = $('[data-hero-wordmark]');
    if (!host) return [];
    host.innerHTML = '';
    var letters = [];
    for (var i = 0; i < LETTERS.length; i++) {
      var L = LETTERS[i];
      var span = document.createElement('span');
      span.className = 'hero-letter';
      span.textContent = L.c;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(130%)';
      if (L.k !== 0) span.style.marginLeft = L.k + 'em';
      host.appendChild(span);
      letters.push(span);
    }
    return letters;
  }

  function injectHeroImages() {
    var container = $('[data-hero-image-container]');
    if (!container) return [];
    var overlay = $('[data-hero-overlay]', container);
    // Remove any pre-existing images (no-op on first run).
    $$('img', container).forEach(function (img) { img.remove(); });
    var imgs = [];
    HERO_IMAGES.forEach(function (meta, i) {
      var img = document.createElement('img');
      img.src = ASSET_BASE + meta.src;
      img.alt = meta.alt;
      img.loading = 'eager';
      img.decoding = 'async';
      img.style.opacity = i === 0 ? '1' : '0';
      img.style.zIndex = i === 0 ? '10' : '1';
      container.insertBefore(img, overlay || null);
      imgs.push(img);
    });
    return imgs;
  }

  function injectHeaderLogo() {
    var disc = $('[data-logo-disc]');
    if (disc) disc.innerHTML = DISC_SVG;
    var slot = $('[data-header-wordmark]');
    if (!slot) return null;
    slot.innerHTML = WORDMARK_SVG;
    var svg = $('svg', slot);
    if (svg) {
      svg.style.height = '24px';
      svg.style.width = 'auto';
      svg.style.display = 'block';
      svg.style.color = 'currentColor';
      svg.style.transform = 'translateY(-200%)';
    }
    return svg;
  }

  // ---- Lenis smooth scroll --------------------------------------

  function initLenis() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true
    });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return lenis;
  }

  // ---- Initial hero build-in + re-entry --------------------------

  function initHeroAnimation(letters, taglineEl, containerEl, wordmarkEl) {
    var tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(letters,
      { yPercent: 130, opacity: 0 },
      { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power3.out' }
    );
    tl.fromTo(taglineEl,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );
    tl.fromTo(containerEl,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    var wordmarkHidden = false;
    var taglineHidden = false;

    function check() {
      if (wordmarkEl) {
        var rect = wordmarkEl.getBoundingClientRect();
        var off = rect.bottom < 0;
        if (off && !wordmarkHidden) {
          wordmarkHidden = true;
          gsap.set(letters, { opacity: 0, yPercent: 130 });
        } else if (!off && wordmarkHidden) {
          wordmarkHidden = false;
          gsap.fromTo(letters,
            { yPercent: 130, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'power3.out' }
          );
        }
      }
      if (taglineEl) {
        var tr = taglineEl.getBoundingClientRect();
        var toff = tr.bottom < 0;
        if (toff && !taglineHidden) {
          taglineHidden = true;
          gsap.set(taglineEl, { opacity: 0, y: 20 });
        } else if (!toff && taglineHidden) {
          taglineHidden = false;
          gsap.fromTo(taglineEl,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.5 }
          );
        }
      }
    }
    gsap.ticker.add(check);
  }

  // ---- Hero image cross-fade rotation ---------------------------

  function initHeroImageRotation(imgs) {
    if (!imgs.length) return;
    var index = 0;
    var prevIndex = -1;
    setInterval(function () {
      var prev = index;
      var next = (prev + 1) % imgs.length;
      var oldPrev = prevIndex;
      if (oldPrev >= 0) {
        imgs[oldPrev].style.opacity = '0';
        imgs[oldPrev].style.zIndex = '1';
      }
      imgs[prev].style.zIndex = '5';
      imgs[next].style.opacity = '1';
      imgs[next].style.zIndex = '10';
      prevIndex = prev;
      index = next;
    }, IMAGE_INTERVAL_MS);
  }

  // ---- Scroll-driven timelines (rebuildable on resize) -----------

  function buildScrollExpand(wrapperEl, containerEl, spacerEl) {
    var imageHeightAtFullWidth = window.innerWidth / HERO_ASPECT_RATIO;
    var expandEnd = imageHeightAtFullWidth * 0.8;
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerEl,
        start: 'top bottom',
        end: '+=' + expandEnd + 'px',
        scrub: true
      }
    });
    tl.to(wrapperEl, { paddingLeft: 0, paddingRight: 0, ease: 'none' })
      .to(containerEl, { borderRadius: '0px', ease: 'none' }, '<');
    return tl;
  }

  function buildHeroParallax(heroEl, containerEl, spacerEl) {
    var imageRect = containerEl.getBoundingClientRect();
    var heroRect = heroEl.getBoundingClientRect();
    var imageOffset = imageRect.top - heroRect.top;
    var imageHeight = imageRect.height;
    var drift = imageHeight * 0.7;
    var vh = window.innerHeight;
    var spacerHeight = spacerEl.offsetHeight;
    var totalRange = spacerHeight + vh;
    var imageHeightAtFullWidth = window.innerWidth / HERO_ASPECT_RATIO;
    var phase1Ratio = imageHeightAtFullWidth / totalRange;
    var headerEl = $('[data-header]');
    var headerHeight = headerEl ? headerEl.offsetHeight : 56;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacerEl,
        start: 'top bottom',
        end: 'bottom+=' + vh + 'px top',
        scrub: true
      }
    });
    tl.to(heroEl, { y: -(imageOffset + headerHeight), ease: 'none', duration: phase1Ratio });
    tl.to(heroEl, { y: -(imageOffset + headerHeight) - drift, ease: 'none', duration: 1 - phase1Ratio });
    return tl;
  }

  function buildHeroDarken(overlayEl, spacerEl) {
    return ScrollTrigger.create({
      trigger: spacerEl,
      start: '40% top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: function (self) { gsap.set(overlayEl, { opacity: self.progress * 0.3 }); }
    });
  }

  // ---- Header wordmark show/hide --------------------------------

  function initHeaderWordmark(svg) {
    if (!svg) return;
    var visible = false;
    function check() {
      var wordmark = $('[data-hero-wordmark]');
      if (!wordmark) return;
      var rect = wordmark.getBoundingClientRect();
      var shouldShow = rect.bottom < 0;
      if (shouldShow !== visible) {
        visible = shouldShow;
        gsap.to(svg, {
          y: shouldShow ? 0 : '-200%',
          duration: 0.4,
          ease: 'power2.out',
          overwrite: true
        });
      }
    }
    ScrollTrigger.addEventListener('scrollEnd', check);
    gsap.ticker.add(check);
  }

  // ---- Header theme switcher ------------------------------------

  function initHeaderTheme() {
    var header = $('[data-header]');
    if (!header) return;
    function check() {
      var headerMid = header.getBoundingClientRect().top + header.offsetHeight / 2;
      var sections = $$('[data-theme]');
      var isDark = false;
      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.top <= headerMid && rect.bottom >= headerMid) {
          isDark = section.getAttribute('data-theme') === 'dark';
        }
      });
      header.style.color = isDark ? '#ffffff' : '#151515';
    }
    gsap.ticker.add(check);
    ScrollTrigger.addEventListener('scrollEnd', check);
    check();
  }

  // ---- Off-canvas menu ------------------------------------------

  function initMenu() {
    var toggleBtn = $('[data-menu-toggle]');
    var overlay = $('[data-menu-overlay]');
    var panel = $('[data-menu-panel]');
    if (!toggleBtn || !overlay || !panel) return;

    var linksWrap = $('[data-menu-links]', panel);
    var links = linksWrap ? $$('a', linksWrap) : [];
    var footer = $('[data-menu-footer]', panel);

    var tl = gsap.timeline({ paused: true });
    tl.set(panel, { display: 'flex' })
      .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.inOut' })
      .fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power3.out' }, '<0.1')
      .fromTo(links,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' },
        '-=0.2')
      .fromTo(footer,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.2');

    var open = false;
    function setOpen(next) {
      if (next === open) return;
      open = next;
      toggleBtn.textContent = open ? 'Close' : 'Menu';
      toggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      overlay.style.pointerEvents = open ? 'auto' : 'none';
      panel.style.pointerEvents = open ? 'auto' : 'none';
      var lenis = window.__lenis;
      if (open) {
        if (lenis && lenis.stop) lenis.stop();
        tl.play();
      } else {
        if (lenis && lenis.start) lenis.start();
        tl.reverse();
      }
    }
    toggleBtn.addEventListener('click', function () { setOpen(!open); });
    overlay.addEventListener('click', function () { setOpen(false); });
    links.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  }

  // ---- Orchestration --------------------------------------------

  var scrollExpandTl = null;
  var parallaxTl = null;
  var darkenSt = null;

  function rebuildScrollScenes(refs) {
    if (scrollExpandTl) { scrollExpandTl.kill(); scrollExpandTl = null; }
    if (parallaxTl) { parallaxTl.kill(); parallaxTl = null; }
    if (darkenSt) { darkenSt.kill(); darkenSt = null; }

    // Reset styles to their "unstarted" state before rebuilding,
    // matching useScrollExpand / useHeroParallax cleanup.
    gsap.set(refs.wrapper, { paddingLeft: '8vw', paddingRight: '8vw' });
    gsap.set(refs.container, { borderRadius: '12px' });
    gsap.set(refs.hero, { y: 0 });

    scrollExpandTl = buildScrollExpand(refs.wrapper, refs.container, refs.spacer);
    parallaxTl = buildHeroParallax(refs.hero, refs.container, refs.spacer);
    darkenSt = buildHeroDarken(refs.overlay, refs.spacer);
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    var letters = injectHeroLetters();
    var imgs = injectHeroImages();
    var headerSvg = injectHeaderLogo();

    var refs = {
      hero: $('[data-hero]'),
      wrapper: $('[data-hero-image-wrap]'),
      container: $('[data-hero-image-container]'),
      overlay: $('[data-hero-overlay]'),
      spacer: $('[data-hero-spacer]'),
      wordmark: $('[data-hero-wordmark]'),
      tagline: $('[data-hero-tagline]')
    };

    if (refs.container) gsap.set(refs.container, { opacity: 0 });

    initLenis();
    initHeroAnimation(letters, refs.tagline, refs.container, refs.wordmark);
    initHeroImageRotation(imgs);
    if (refs.hero && refs.wrapper && refs.container && refs.overlay && refs.spacer) {
      rebuildScrollScenes(refs);
    }
    initHeaderWordmark(headerSvg);
    initHeaderTheme();
    initMenu();

    var debounceTimer;
    window.addEventListener('resize', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        if (refs.hero && refs.wrapper && refs.container && refs.overlay && refs.spacer) {
          rebuildScrollScenes(refs);
        }
        ScrollTrigger.refresh(true);
      }, 200);
    });
  }

  // Wait for dependencies (CDN scripts) before booting.
  function boot() {
    if (typeof window.gsap === 'undefined' ||
        typeof window.ScrollTrigger === 'undefined' ||
        typeof window.Lenis === 'undefined') {
      setTimeout(boot, 30);
      return;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  }
  boot();
})();
