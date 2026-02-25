/**
 * animations.js
 * Scroll-triggered animations using Intersection Observer.
 * Handles: reveal effects, parallax scrolling, scroll progress bar,
 * gallery lightbox, and smooth anchor navigation.
 */

(function () {
  'use strict';

  // ── Scroll Progress Bar ───────────────────────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop    = window.scrollY || document.documentElement.scrollTop;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(scrolled, 100) + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ── Intersection Observer — Reveal Animations ─────────────────────────────
  const REVEAL_SELECTORS = [
    '.reveal-up',
    '.reveal-fade',
    '.reveal-left',
    '.reveal-right',
    '.reveal-zoom',
    '.reveal-section',
  ].join(',');

  /**
   * Marks the element as visible and stops observing it.
   */
  function onReveal(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }

  const revealObserver = new IntersectionObserver(onReveal, {
    root:       null,
    rootMargin: '0px 0px -60px 0px',
    threshold:  0.12,
  });

  function observeRevealElements() {
    const elements = document.querySelectorAll(REVEAL_SELECTORS);
    elements.forEach(function (el) {
      // Skip elements already visible (intro section)
      if (!el.closest('.section-intro')) {
        revealObserver.observe(el);
      } else {
        el.classList.add('is-visible');
      }
    });
  }

  // ── Parallax Scrolling ────────────────────────────────────────────────────
  const parallaxEls = document.querySelectorAll('.parallax-bg, .parallax-bg-dark');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(function (el) {
      const rect   = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = center * 0.3;
      el.style.backgroundPositionY = (50 + offset * 0.04) + '%';
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });

  // ── Timeline Connector Reveal ─────────────────────────────────────────────
  const timeline = document.querySelector('.timeline');

  if (timeline) {
    const timelineObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    timelineObserver.observe(timeline);
  }

  // ── Gallery Lightbox ──────────────────────────────────────────────────────
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose  = document.getElementById('lightbox-close');
  const lightboxPrev   = document.getElementById('lightbox-prev');
  const lightboxNext   = document.getElementById('lightbox-next');

  let galleryItems = [];
  let currentIndex  = 0;

  /**
   * Opens the lightbox at the given gallery index.
   * @param {number} index
   */
  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;

    const item       = galleryItems[currentIndex];
    const imgEl      = item.querySelector('.gallery-img');
    const computedBg = window.getComputedStyle(imgEl).backgroundImage;

    // Mirror the gradient/image from the gallery item
    lightboxImg.style.background = computedBg !== 'none'
      ? window.getComputedStyle(imgEl).background
      : imgEl.style.background;

    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function prevPhoto() { openLightbox(currentIndex - 1); }
  function nextPhoto() { openLightbox(currentIndex + 1); }

  function setupGallery() {
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

    galleryItems.forEach(function (item, idx) {
      item.addEventListener('click',   function () { openLightbox(idx); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev)  lightboxPrev.addEventListener('click', prevPhoto);
    if (lightboxNext)  lightboxNext.addEventListener('click', nextPhoto);

    if (lightbox) {
      // Close on backdrop click
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function (e) {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevPhoto();
    if (e.key === 'ArrowRight')  nextPhoto();
  });

  // ── Smooth Anchor Navigation ──────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();

    const targetId = link.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash without jumping
      history.pushState(null, '', '#' + targetId);
    }
  });

  // ── Init on DOM Ready ─────────────────────────────────────────────────────
  function init() {
    observeRevealElements();
    setupGallery();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose re-observe function so main.js can call it after unlocking content
  window.WeddingAnimations = {
    observeRevealElements: observeRevealElements,
  };

})();
