/**
 * countdown.js – Animated countdown timer to the wedding date
 */

(function () {
  'use strict';

  // ===== Configure wedding date here =====
  const WEDDING_DATE = new Date('2026-03-15T10:00:00');

  const cdDays    = document.getElementById('cd-days');
  const cdHours   = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const cdMessage = document.getElementById('countdown-message');

  if (!cdDays) return; // element not found – skip

  /**
   * Pad a number to at least 2 digits.
   * @param {number} n
   * @returns {string}
   */
  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  /**
   * Animate the number flip when the value changes.
   * @param {HTMLElement} el – the .countdown-number wrapper
   */
  function animateFlip(el) {
    el.classList.remove('flip');
    // force reflow to restart animation
    void el.offsetWidth;
    el.classList.add('flip');
  }

  // Store previous values to detect changes
  const prev = { days: null, hours: null, minutes: null, seconds: null };

  function update() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      // Wedding day has arrived!
      setDisplay(cdDays,    '00');
      setDisplay(cdHours,   '00');
      setDisplay(cdMinutes, '00');
      setDisplay(cdSeconds, '00');
      if (cdMessage) {
        cdMessage.textContent = '🎉 Today is the big day! Congratulations! 💒';
      }
      return; // stop counting
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days         = Math.floor(totalSeconds / 86400);
    const hours        = Math.floor((totalSeconds % 86400) / 3600);
    const minutes      = Math.floor((totalSeconds % 3600) / 60);
    const seconds      = totalSeconds % 60;

    if (days    !== prev.days)    { setDisplay(cdDays,    pad(days));    animateFlip(cdDays);    prev.days    = days;    }
    if (hours   !== prev.hours)   { setDisplay(cdHours,   pad(hours));   animateFlip(cdHours);   prev.hours   = hours;   }
    if (minutes !== prev.minutes) { setDisplay(cdMinutes, pad(minutes)); animateFlip(cdMinutes); prev.minutes = minutes; }
    if (seconds !== prev.seconds) { setDisplay(cdSeconds, pad(seconds)); animateFlip(cdSeconds); prev.seconds = seconds; }

    // Encouraging messages based on days remaining
    if (cdMessage) {
      if      (days === 0)  cdMessage.textContent = '🌹 The wedding is TODAY!';
      else if (days === 1)  cdMessage.textContent = '💍 Just one more day…';
      else if (days <= 7)   cdMessage.textContent = `✨ Only ${days} days to go!`;
      else if (days <= 30)  cdMessage.textContent = `💕 ${days} days of anticipation!`;
      else                  cdMessage.textContent = `💒 ${days} beautiful days until forever begins`;
    }

    setTimeout(update, 1000);
  }

  /**
   * Set the visible number inside a countdown unit.
   * @param {HTMLElement} el – the .countdown-number div
   * @param {string}      val – display value
   */
  function setDisplay(el, val) {
    const span = el.querySelector('.number-display');
    if (span) span.textContent = val;
  }

  // Start on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
