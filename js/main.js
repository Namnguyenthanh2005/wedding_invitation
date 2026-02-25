/**
 * main.js
 * Core application logic:
 *   - Loading screen
 *   - Scroll lock / open invitation
 *   - Floating particles canvas
 *   - RSVP form validation & submission
 *   - Music autoplay after first interaction
 */

(function () {
  'use strict';

  // ── Loading Screen ────────────────────────────────────────────────────────
  const loadingScreen = document.getElementById('loading-screen');

  function hideLoading() {
    if (loadingScreen) {
      loadingScreen.classList.add('loaded');
      // Remove from DOM after transition
      setTimeout(function () {
        loadingScreen.remove();
      }, 700);
    }
  }

  // Hide loading after page fully loads
  window.addEventListener('load', function () {
    setTimeout(hideLoading, 600);
  });

  // Fallback: hide after 3 seconds even if load event delayed
  setTimeout(hideLoading, 3000);

  // ── Scroll Lock & Open Invitation ────────────────────────────────────────
  const openBtn      = document.getElementById('open-invitation-btn');
  const mainContent  = document.getElementById('main-content');
  const body         = document.body;

  function openInvitation() {
    // Unlock scroll
    body.classList.remove('scroll-locked');

    // Show main content
    mainContent.style.display = 'block';
    mainContent.classList.add('revealed');

    // Trigger animation observers on newly revealed elements
    if (window.WeddingAnimations) {
      // Small delay to let layout settle
      setTimeout(window.WeddingAnimations.observeRevealElements, 100);
    }

    // Scroll to couple section
    setTimeout(function () {
      const couple = document.getElementById('couple');
      if (couple) {
        couple.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);

    // Autoplay music after user interaction
    if (window.WeddingMusic && !window.WeddingMusic.isPlaying()) {
      window.WeddingMusic.loadTrack(0, true);
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }

  // ── Floating Particles Canvas ─────────────────────────────────────────────
  const canvas = document.getElementById('particles-canvas');
  let   ctx, particles;

  if (canvas) {
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Particle class
    function Particle() {
      this.reset();
    }

    Particle.prototype.reset = function () {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.size  = Math.random() * 4 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = Math.random() * -0.6 - 0.2;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      this.lifespan = Math.random() * 0.005 + 0.002; // opacity decay per frame
    };

    const PARTICLE_COLORS = [
      'rgba(201,169,110,',  // gold
      'rgba(212,160,160,',  // rose
      'rgba(232,213,196,',  // blush
      'rgba(255,255,255,',  // white
    ];

    const PARTICLE_COUNT = 60;
    particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new Particle();
      // Randomise initial position across full canvas
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= p.lifespan;

        // Draw particle as a soft circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();

        // Reset when faded out or out of view
        if (p.opacity <= 0 || p.y < -20) {
          p.reset();
          p.y = canvas.height + 10; // start from bottom
        }
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // ── RSVP Form ─────────────────────────────────────────────────────────────
  const rsvpForm    = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');

  /**
   * Simple email validation.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Sets or clears a field's error message.
   * @param {HTMLElement} field
   * @param {string}      errorId
   * @param {string}      message
   */
  function setError(field, errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (message) {
      field.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
    } else {
      field.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
    }
  }

  /**
   * Validates the RSVP form.
   * @returns {boolean} true if valid
   */
  function validateRSVP() {
    let valid = true;

    const nameField  = document.getElementById('guest-name');
    const emailField = document.getElementById('guest-email');

    // Name
    if (!nameField || !nameField.value.trim()) {
      setError(nameField, 'error-name', 'Please enter your full name.');
      valid = false;
    } else {
      setError(nameField, 'error-name', '');
    }

    // Email
    if (!emailField || !emailField.value.trim()) {
      setError(emailField, 'error-email', 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(emailField.value.trim())) {
      setError(emailField, 'error-email', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(emailField, 'error-email', '');
    }

    return valid;
  }

  if (rsvpForm) {
    // Live validation on blur
    const nameField  = document.getElementById('guest-name');
    const emailField = document.getElementById('guest-email');

    if (nameField) {
      nameField.addEventListener('blur', function () {
        if (!this.value.trim()) {
          setError(this, 'error-name', 'Please enter your full name.');
        } else {
          setError(this, 'error-name', '');
        }
      });
    }

    if (emailField) {
      emailField.addEventListener('blur', function () {
        if (!this.value.trim()) {
          setError(this, 'error-email', 'Please enter your email address.');
        } else if (!isValidEmail(this.value.trim())) {
          setError(this, 'error-email', 'Please enter a valid email address.');
        } else {
          setError(this, 'error-email', '');
        }
      });
    }

    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateRSVP()) return;

      // Collect form data
      const formData = new FormData(rsvpForm);
      const data = {
        name:       formData.get('name'),
        email:      formData.get('email'),
        guests:     formData.get('guests'),
        attendance: formData.get('attendance'),
        meal:       formData.get('meal'),
        message:    formData.get('message'),
        submittedAt: new Date().toISOString(),
      };

      // Log submission (front-end only, no backend)
      console.log('[RSVP Submission]', data);

      // Show success state
      rsvpForm.classList.add('hidden');
      if (rsvpSuccess) {
        rsvpSuccess.classList.remove('hidden');
        rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // ── Keyboard accessibility: close lightbox etc. on Escape ─────────────────
  // (handled in animations.js)

  // ── Music: start on first user interaction if not yet playing ─────────────
  let musicStarted = false;

  function startMusicOnInteraction() {
    if (musicStarted) return;
    // Only autoplay after the invitation is opened
    const isLocked = document.body.classList.contains('scroll-locked');
    if (!isLocked && window.WeddingMusic && !window.WeddingMusic.isPlaying()) {
      window.WeddingMusic.loadTrack(0, true);
      musicStarted = true;
    }
  }

  ['click', 'touchstart', 'keydown'].forEach(function (evt) {
    document.addEventListener(evt, startMusicOnInteraction, { once: false, passive: true });
  });

})();
