/**
 * main.js – Core functionality
 * Handles: loading screen, invitation cover, scroll lock,
 *          scroll progress bar, particles canvas, smooth nav, RSVP form
 */

(function () {
  'use strict';

  /* ============================================================
     1. LOADING SCREEN
     ============================================================ */
  const loadingScreen = document.getElementById('loading-screen');

  function hideLoading() {
    if (!loadingScreen) return;
    loadingScreen.classList.add('hidden');
    // Remove from DOM after transition completes
    setTimeout(() => loadingScreen.remove(), 700);
  }

  window.addEventListener('load', () => {
    setTimeout(hideLoading, 1200); // show loading screen for at least 1.2 s
  });

  /* ============================================================
     2. INVITATION COVER & SCROLL LOCK
     ============================================================ */
  const cover     = document.getElementById('invitation-cover');
  const openBtn   = document.getElementById('open-invitation-btn');
  const mainContent = document.getElementById('main-content');

  // Lock scroll on start
  document.body.classList.add('scroll-locked');

  function openInvitation() {
    if (!cover) return;

    // Unlock scroll
    document.body.classList.remove('scroll-locked');

    // Unlock main content interactions
    if (mainContent) {
      mainContent.classList.remove('locked');
      mainContent.removeAttribute('aria-hidden');
    }

    // Hide cover with fade
    cover.classList.add('hidden');

    // Scroll smoothly to top of main content after cover gone
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);

    // Trigger hero animations
    triggerHeroAnimations();
  }

  if (openBtn) openBtn.addEventListener('click', openInvitation);

  function triggerHeroAnimations() {
    // These elements already have CSS animation classes;
    // they were paused waiting for the cover to open.
    const heroAnimEls = document.querySelectorAll(
      '.hero-sub, .hero-names, .hero-ampersand, .hero-date, .hero-divider, .hero-invite, .scroll-hint'
    );
    heroAnimEls.forEach((el, i) => {
      el.style.animationPlayState = 'running';
      el.style.animationDelay    = `${i * 0.18}s`;
    });
  }

  /* ============================================================
     3. SCROLL PROGRESS BAR
     ============================================================ */
  const progressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop  = window.scrollY || document.documentElement.scrollTop;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = `${pct}%`;
    progressBar.setAttribute('aria-valuenow', pct);
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ============================================================
     4. SMOOTH ANCHOR NAVIGATION
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ============================================================
     5. PARTICLES CANVAS
     ============================================================ */
  const canvas = document.getElementById('particles-canvas');

  function initParticles() {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function resize() {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() { this.reset(true); }

      reset(randomY) {
        this.x     = Math.random() * width;
        this.y     = randomY ? Math.random() * height : height + 10;
        this.size  = Math.random() * 4 + 2;
        this.speedX= (Math.random() - 0.5) * 0.5;
        this.speedY= -(Math.random() * 0.6 + 0.3);
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = this.pickColor();
        this.wobble= Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
      }

      pickColor() {
        const colors = [
          'rgba(181,72,91,',
          'rgba(201,169,110,',
          'rgba(232,213,176,',
          'rgba(212,119,138,',
          'rgba(255,182,193,',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.wobble += this.wobbleSpeed;
        this.x      += this.speedX + Math.sin(this.wobble) * 0.3;
        this.y      += this.speedY;
        this.alpha  -= 0.001;

        if (this.y < -10 || this.alpha <= 0) this.reset(false);
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle   = `${this.color}${ctx.globalAlpha})`;

        // Draw a small heart shape
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + s * 0.3);
        ctx.bezierCurveTo(
          this.x - s, this.y - s * 0.5,
          this.x - s * 2, this.y + s * 0.5,
          this.x, this.y + s * 1.5
        );
        ctx.bezierCurveTo(
          this.x + s * 2, this.y + s * 0.5,
          this.x + s, this.y - s * 0.5,
          this.x, this.y + s * 0.3
        );
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticlesArray() {
      particles = Array.from({ length: 50 }, () => new Particle());
    }

    let animFrame;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => { p.update(); p.draw(); });
      animFrame = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resize();
      initParticlesArray();
    });

    resize();
    initParticlesArray();
    animate();

    // Pause animation when tab hidden to save CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        animate();
      }
    });
  }

  /* ============================================================
     6. RSVP FORM
     ============================================================ */
  function initRSVP() {
    const form       = document.getElementById('rsvp-form');
    const successMsg = document.getElementById('rsvp-success');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // --- Client-side validation ---
      let valid = true;

      const nameEl  = form.querySelector('[name="name"]');
      const emailEl = form.querySelector('[name="email"]');
      const attends = form.querySelector('[name="attendance"]:checked');

      clearErrors(form);

      if (!nameEl.value.trim()) {
        showError('error-name', 'Please enter your name.');
        nameEl.classList.add('error');
        valid = false;
      }

      if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        showError('error-email', 'Please enter a valid email address.');
        emailEl.classList.add('error');
        valid = false;
      }

      if (!attends) {
        showError('error-attendance', 'Please select whether you will attend.');
        valid = false;
      }

      if (!valid) return;

      // --- Simulate submission ---
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Collect data
      const data = {
        name:       nameEl.value.trim(),
        email:      emailEl.value.trim(),
        phone:      form.querySelector('[name="phone"]')?.value.trim() || '',
        attendance: attends.value,
        guests:     form.querySelector('[name="guests"]')?.value || '1',
        dietary:    form.querySelector('[name="dietary"]')?.value.trim() || '',
        message:    form.querySelector('[name="message"]')?.value.trim() || '',
        timestamp:  new Date().toISOString(),
      };

      console.log('%c💌 RSVP Submission:', 'color:#b5485b; font-weight:bold; font-size:14px;', data);

      // Fake async delay
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        form.style.display = 'none';
        if (successMsg) successMsg.hidden = false;
      }, 1200);
    });

    // Clear errors on input
    form.querySelectorAll('.form-input').forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-error').forEach((el) => { el.textContent = ''; });
    form.querySelectorAll('.form-input').forEach((el) => el.classList.remove('error'));
  }

  /* ============================================================
     7. HERO ANIMATION PAUSE (wait until cover opens)
     ============================================================ */
  function pauseHeroAnimations() {
    document.querySelectorAll(
      '.hero-sub, .hero-names, .hero-ampersand, .hero-date, .hero-divider, .hero-invite, .scroll-hint'
    ).forEach((el) => {
      el.style.animationPlayState = 'paused';
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    pauseHeroAnimations();
    initParticles();
    initRSVP();
    updateScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
