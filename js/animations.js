/**
 * animations.js – Scroll-triggered reveal animations
 * Uses Intersection Observer API for performance
 */

(function () {
  'use strict';

  /* ---- Intersection Observer for .reveal elements ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---- Parallax scrolling effect ---- */
  function initParallax() {
    const parallaxEls = document.querySelectorAll('.parallax-bg');
    if (!parallaxEls.length) return;

    function updateParallax() {
      parallaxEls.forEach((el) => {
        const parent = el.parentElement;
        const rect   = parent.getBoundingClientRect();
        const speed  = parseFloat(el.dataset.speed) || 0.3;

        // Only update when section is near viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = rect.top * speed;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ---- Floating hearts on click ---- */
  function initFloatingHearts() {
    document.addEventListener('click', (e) => {
      createHeart(e.clientX, e.clientY);
    });
  }

  function createHeart(x, y) {
    const hearts   = ['❤', '💕', '💗', '💖', '🌹'];
    const heart    = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x - 10}px`;
    heart.style.top  = `${y - 10}px`;
    heart.style.fontSize = `${Math.random() * 0.8 + 0.8}rem`;
    heart.style.animationDuration = `${Math.random() * 1.5 + 2.5}s`;
    document.body.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }

  /* ---- Gallery lightbox ---- */
  const galleryData = [
    { bg: 'linear-gradient(135deg, #f8b4c8, #f6d0e0)', emoji: '📸', caption: 'A beautiful moment together' },
    { bg: 'linear-gradient(135deg, #c8e6c9, #a5d6a7)', emoji: '🌸', caption: 'Spring blossoms and laughter' },
    { bg: 'linear-gradient(135deg, #bbdefb, #90caf9)', emoji: '💑',  caption: 'Our hearts as one' },
    { bg: 'linear-gradient(135deg, #ffe0b2, #ffcc80)', emoji: '🌹', caption: 'Love in full bloom' },
    { bg: 'linear-gradient(135deg, #e1bee7, #ce93d8)', emoji: '💐', caption: 'Flowers for the bride' },
    { bg: 'linear-gradient(135deg, #fce4ec, #f48fb1)', emoji: '💍', caption: 'The ring that started it all' },
  ];

  let currentLightboxIndex = 0;

  function initLightbox() {
    const lightbox       = document.getElementById('lightbox');
    const lightboxClose  = document.getElementById('lightbox-close');
    const lightboxPrev   = document.getElementById('lightbox-prev');
    const lightboxNext   = document.getElementById('lightbox-next');
    const lightboxDisplay= document.getElementById('lightbox-display');
    const lightboxCaption= document.getElementById('lightbox-caption');
    const backdrop       = document.getElementById('lightbox-backdrop');

    if (!lightbox) return;

    function openLightbox(index) {
      currentLightboxIndex = index;
      showLightboxItem(index);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }

    function showLightboxItem(index) {
      const item = galleryData[index];
      if (!item) return;
      lightboxDisplay.innerHTML = `
        <div class="lb-content" style="background:${item.bg}; font-size:6rem;">
          ${item.emoji}
        </div>`;
      lightboxCaption.textContent = item.caption;
    }

    // Gallery items click
    document.querySelectorAll('.gallery-item').forEach((el) => {
      el.addEventListener('click', () => openLightbox(parseInt(el.dataset.index, 10)));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(parseInt(el.dataset.index, 10));
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    lightboxPrev.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
      showLightboxItem(currentLightboxIndex);
    });

    lightboxNext.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
      showLightboxItem(currentLightboxIndex);
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev.click();
      if (e.key === 'ArrowRight') lightboxNext.click();
    });
  }

  /* ---- Initialise everything ---- */
  function init() {
    initReveal();
    initParallax();
    initFloatingHearts();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
