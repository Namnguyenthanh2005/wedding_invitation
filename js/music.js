/**
 * music.js
 * Background music player with playlist, volume control,
 * play/pause, prev/next navigation, and smooth fade in/out.
 *
 * NOTE: For a static GitHub Pages deployment the audio files
 * need to be placed in assets/music/.  The src values below
 * point to royalty-free URLs that can be replaced with local
 * paths (e.g. "assets/music/song1.mp3") once the files are
 * added to the repo.
 */

(function () {
  'use strict';

  // ── Playlist definition ───────────────────────────────────────────────────
  const PLAYLIST = [
    {
      title:  'A Thousand Years',
      artist: 'Christina Perri',
      // Replace with: 'assets/music/a-thousand-years.mp3'
      src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      title:  "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      // Replace with: 'assets/music/cant-help-falling-in-love.mp3'
      src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      title:  'Perfect',
      artist: 'Ed Sheeran',
      // Replace with: 'assets/music/perfect.mp3'
      src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
    {
      title:  'All of Me',
      artist: 'John Legend',
      // Replace with: 'assets/music/all-of-me.mp3'
      src:    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
  ];

  // ── DOM references ────────────────────────────────────────────────────────
  const audio          = document.getElementById('audio-player');
  const toggleBtn      = document.getElementById('music-toggle-btn');
  const musicPanel     = document.getElementById('music-panel');
  const closeBtn       = document.getElementById('music-close-btn');
  const playlistEl     = document.getElementById('playlist');
  const btnPlayPause   = document.getElementById('btn-play-pause');
  const btnPrev        = document.getElementById('btn-prev');
  const btnNext        = document.getElementById('btn-next');
  const volumeSlider   = document.getElementById('volume-slider');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const nowPlayingIcon  = document.getElementById('now-playing-icon');
  const musicIcon       = document.querySelector('.music-icon');

  // ── State ─────────────────────────────────────────────────────────────────
  let currentIndex = 0;
  let isPlaying    = false;
  let isFading     = false;

  const FADE_DURATION  = 800;   // ms for fade transition
  const FADE_STEPS     = 30;

  // ── Core helpers ──────────────────────────────────────────────────────────

  /**
   * Fade the audio volume to a target value over FADE_DURATION ms,
   * then call the optional callback.
   * @param {number}   targetVol  0–1
   * @param {Function} [cb]
   */
  function fadeTo(targetVol, cb) {
    if (isFading) return;
    isFading = true;

    const startVol  = audio.volume;
    const diff      = targetVol - startVol;
    const stepTime  = FADE_DURATION / FADE_STEPS;
    let   step      = 0;

    const interval = setInterval(function () {
      step++;
      const next = startVol + diff * (step / FADE_STEPS);
      audio.volume = Math.max(0, Math.min(1, next));

      if (step >= FADE_STEPS) {
        clearInterval(interval);
        audio.volume = targetVol;
        isFading = false;
        if (cb) cb();
      }
    }, stepTime);
  }

  /** Load and play a track by index with a fade-in. */
  function loadTrack(index, autoPlay) {
    currentIndex = (index + PLAYLIST.length) % PLAYLIST.length;
    const track  = PLAYLIST[currentIndex];

    audio.src    = track.src;
    audio.volume = 0;
    audio.load();

    updatePlaylistUI();
    updateNowPlaying(track);

    if (autoPlay) {
      audio.play().then(function () {
        isPlaying = true;
        fadeTo(parseFloat(volumeSlider.value));
        updatePlayPauseUI();
        animateMusicIcon(true);
      }).catch(function () {
        // Autoplay blocked — user needs to interact
        isPlaying = false;
        updatePlayPauseUI();
      });
    }
  }

  /** Play or resume with fade-in. */
  function play() {
    if (isPlaying) return;
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(currentIndex, true);
      return;
    }
    audio.play().then(function () {
      isPlaying = true;
      fadeTo(parseFloat(volumeSlider.value));
      updatePlayPauseUI();
      animateMusicIcon(true);
    }).catch(function (err) {
      console.warn('[Music] Play failed:', err.message);
    });
  }

  /** Pause with fade-out. */
  function pause() {
    if (!isPlaying) return;
    fadeTo(0, function () {
      audio.pause();
      isPlaying = false;
      updatePlayPauseUI();
      animateMusicIcon(false);
    });
  }

  /** Change track with cross-fade. */
  function changeTrack(index) {
    if (isPlaying) {
      fadeTo(0, function () {
        audio.pause();
        loadTrack(index, true);
      });
    } else {
      loadTrack(index, false);
    }
  }

  // ── UI Updates ────────────────────────────────────────────────────────────

  function updatePlaylistUI() {
    const items = playlistEl.querySelectorAll('.playlist-item');
    items.forEach(function (item, idx) {
      item.classList.toggle('active', idx === currentIndex);
    });
  }

  function updatePlayPauseUI() {
    if (btnPlayPause) {
      btnPlayPause.textContent  = isPlaying ? '⏸' : '▶';
      btnPlayPause.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    }
    if (nowPlayingIcon) {
      nowPlayingIcon.textContent = isPlaying ? '▶' : '■';
    }
  }

  function updateNowPlaying(track) {
    if (nowPlayingTitle) {
      nowPlayingTitle.textContent = track.title + ' — ' + track.artist;
    }
  }

  function animateMusicIcon(playing) {
    if (!musicIcon) return;
    if (playing) {
      musicIcon.classList.add('playing');
    } else {
      musicIcon.classList.remove('playing');
    }
  }

  // ── Panel toggle ──────────────────────────────────────────────────────────

  function openPanel() {
    musicPanel.classList.remove('hidden');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    musicPanel.classList.add('hidden');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  // ── Event Listeners ───────────────────────────────────────────────────────

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const open = !musicPanel.classList.contains('hidden');
      if (open) {
        closePanel();
      } else {
        openPanel();
        // First interaction — start playing if not yet started
        if (!audio.src || audio.src === window.location.href) {
          loadTrack(0, true);
        }
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel);
  }

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', function () {
      if (isPlaying) { pause(); } else { play(); }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      changeTrack(currentIndex - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      changeTrack(currentIndex + 1);
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      if (!isFading) {
        audio.volume = parseFloat(this.value);
      }
    });
  }

  // Playlist item clicks
  if (playlistEl) {
    playlistEl.addEventListener('click', function (e) {
      const item = e.target.closest('.playlist-item');
      if (!item) return;
      const idx = parseInt(item.dataset.index, 10);
      if (!isNaN(idx)) changeTrack(idx);
    });

    // Keyboard navigation for playlist items
    playlistEl.addEventListener('keydown', function (e) {
      const item = e.target.closest('.playlist-item');
      if (!item) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(item.dataset.index, 10);
        if (!isNaN(idx)) changeTrack(idx);
      }
    });
  }

  // Auto-advance to next track when one ends
  if (audio) {
    audio.addEventListener('ended', function () {
      changeTrack(currentIndex + 1);
    });
  }

  // Close panel when clicking outside
  document.addEventListener('click', function (e) {
    if (!musicPanel || musicPanel.classList.contains('hidden')) return;
    const player = document.getElementById('music-player');
    if (player && !player.contains(e.target)) {
      closePanel();
    }
  });

  // ── Public API (used by main.js to trigger first play on interaction) ──────
  window.WeddingMusic = {
    play:        play,
    pause:       pause,
    loadTrack:   loadTrack,
    isPlaying:   function () { return isPlaying; },
    openPanel:   openPanel,
    closePanel:  closePanel,
  };

})();
