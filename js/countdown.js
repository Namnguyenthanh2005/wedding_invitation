/**
 * countdown.js
 * Animated countdown timer to the wedding date.
 * Runs independently and updates every second.
 */

(function () {
  'use strict';

  // ── Wedding date/time (Paris timezone offset handled via Date string) ──────
  const WEDDING_DATE = new Date('2027-02-14T10:00:00+01:00');

  // DOM elements
  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // Previous values for flip animation comparison
  let prevValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };

  /**
   * Pads a number to the given length with leading zeros.
   * @param {number} n
   * @param {number} [len=2]
   * @returns {string}
   */
  function pad(n, len = 2) {
    return String(n).padStart(len, '0');
  }

  /**
   * Triggers the flip animation on a countdown number element.
   * @param {HTMLElement} el
   */
  function triggerFlip(el) {
    el.classList.remove('flip');
    // Force reflow to restart animation
    void el.offsetWidth;
    el.classList.add('flip');
  }

  /**
   * Updates the countdown display.
   */
  function updateCountdown() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      // Wedding day or past — show zeroes and a message
      if (daysEl)    daysEl.textContent    = '000';
      if (hoursEl)   hoursEl.textContent   = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';

      const grid = document.getElementById('countdown-grid');
      if (grid) {
        const msg = document.createElement('p');
        msg.textContent = '🎉 Today is the day! Congratulations!';
        msg.style.cssText = 'color:#c9a96e;font-size:1.4rem;font-family:"Cormorant Garamond",serif;text-align:center;margin-top:24px;';
        grid.appendChild(msg);
      }
      return; // stop updating
    }

    const totalSeconds = Math.floor(diff / 1000);
    const s  = totalSeconds % 60;
    const m  = Math.floor(totalSeconds / 60) % 60;
    const h  = Math.floor(totalSeconds / 3600) % 24;
    const d  = Math.floor(totalSeconds / 86400);

    // Update DOM and trigger flip animation when value changes
    if (daysEl && d !== prevValues.days) {
      daysEl.textContent = pad(d, 3);
      triggerFlip(daysEl);
      prevValues.days = d;
    }
    if (hoursEl && h !== prevValues.hours) {
      hoursEl.textContent = pad(h);
      triggerFlip(hoursEl);
      prevValues.hours = h;
    }
    if (minutesEl && m !== prevValues.minutes) {
      minutesEl.textContent = pad(m);
      triggerFlip(minutesEl);
      prevValues.minutes = m;
    }
    if (secondsEl && s !== prevValues.seconds) {
      secondsEl.textContent = pad(s);
      triggerFlip(secondsEl);
      prevValues.seconds = s;
    }

    setTimeout(updateCountdown, 1000);
  }

  // Start the countdown as soon as the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCountdown);
  } else {
    updateCountdown();
  }

})();
