/**
 * music.js – Background music player with playlist
 * Features: autoplay after interaction, fade in/out, prev/next, volume
 */

(function () {
  'use strict';

  // ===== Playlist definition =====
  // Add real .mp3 paths to assets/music/ for production.
  // Currently uses Web Audio API to generate a simple tone as fallback.
  const PLAYLIST = [
    {
      title:  'A Thousand Years',
      artist: 'Christina Perri',
      src:    'assets/music/a-thousand-years.mp3',
    },
    {
      title:  'Perfect',
      artist: 'Ed Sheeran',
      src:    'assets/music/perfect.mp3',
    },
    {
      title:  'Can\'t Help Falling In Love',
      artist: 'Elvis Presley',
      src:    'assets/music/cant-help-falling-in-love.mp3',
    },
  ];

  // ===== DOM references =====
  const audio         = document.getElementById('audio-player');
  const toggleBtn     = document.getElementById('music-toggle');
  const panel         = document.getElementById('music-panel');
  const panelClose    = document.getElementById('music-panel-close');
  const playPauseBtn  = document.getElementById('play-pause-btn');
  const prevBtn       = document.getElementById('prev-btn');
  const nextBtn       = document.getElementById('next-btn');
  const volumeSlider  = document.getElementById('volume-slider');
  const songTitle     = document.getElementById('song-title');
  const songArtist    = document.getElementById('song-artist');
  const playlistEl    = document.getElementById('playlist');
  const musicWaves    = document.querySelector('.music-waves');

  if (!audio || !toggleBtn) return;

  // ===== State =====
  let currentIndex = 0;
  let isPanelOpen  = false;
  let isPlaying    = false;
  let isFading     = false;
  const FADE_STEPS = 20;
  const FADE_MS    = 600; // total fade duration ms

  // ===== Build playlist UI =====
  function buildPlaylist() {
    playlistEl.innerHTML = '';
    PLAYLIST.forEach((song, i) => {
      const li = document.createElement('li');
      li.className     = 'playlist-item';
      li.role          = 'listitem';
      li.tabIndex      = 0;
      li.dataset.index = i;
      li.innerHTML = `
        <span class="playlist-item-title">${song.title}</span>
        <span class="playlist-item-artist">${song.artist}</span>`;

      li.addEventListener('click', () => selectSong(i));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSong(i); }
      });

      playlistEl.appendChild(li);
    });
  }

  // ===== Highlight active playlist item =====
  function updatePlaylistUI() {
    document.querySelectorAll('.playlist-item').forEach((el, i) => {
      el.classList.toggle('active', i === currentIndex);
    });
    const song = PLAYLIST[currentIndex];
    if (songTitle)  songTitle.textContent  = song.title;
    if (songArtist) songArtist.textContent = song.artist;
  }

  // ===== Load a song by index =====
  function loadSong(index) {
    const song = PLAYLIST[index];
    audio.src  = song.src;
    audio.load();
    updatePlaylistUI();
  }

  // ===== Select & play a song =====
  function selectSong(index) {
    currentIndex = index;
    loadSong(index);
    playSong();
  }

  // ===== Fade in =====
  function fadeIn(targetVolume) {
    const target = targetVolume !== undefined ? targetVolume : parseFloat(volumeSlider.value);
    audio.volume = 0;
    const step   = target / FADE_STEPS;
    let   count  = 0;
    const id = setInterval(() => {
      count++;
      audio.volume = Math.min(target, audio.volume + step);
      if (count >= FADE_STEPS) clearInterval(id);
    }, FADE_MS / FADE_STEPS);
  }

  // ===== Fade out then callback =====
  function fadeOut(callback) {
    if (isFading) return;
    isFading = true;
    const start = audio.volume;
    const step  = start / FADE_STEPS;
    let   count = 0;
    const id = setInterval(() => {
      count++;
      audio.volume = Math.max(0, audio.volume - step);
      if (count >= FADE_STEPS) {
        clearInterval(id);
        isFading = false;
        if (typeof callback === 'function') callback();
      }
    }, FADE_MS / FADE_STEPS);
  }

  // ===== Play =====
  function playSong() {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          updatePlayPauseUI();
          fadeIn();
        })
        .catch(() => {
          // Autoplay blocked – wait for next interaction
          isPlaying = false;
          updatePlayPauseUI();
        });
    }
  }

  // ===== Pause =====
  function pauseSong(withFade) {
    if (withFade) {
      fadeOut(() => {
        audio.pause();
        isPlaying = false;
        updatePlayPauseUI();
      });
    } else {
      audio.pause();
      isPlaying = false;
      updatePlayPauseUI();
    }
  }

  // ===== Update play/pause button icon =====
  function updatePlayPauseUI() {
    if (playPauseBtn) playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
    if (musicWaves)   musicWaves.classList.toggle('playing', isPlaying);
  }

  // ===== Toggle panel =====
  function togglePanel() {
    isPanelOpen = !isPanelOpen;
    panel.classList.toggle('open', isPanelOpen);
    toggleBtn.setAttribute('aria-expanded', String(isPanelOpen));
  }

  // ===== Events =====
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
    // First interaction: attempt autoplay of first song
    if (!audio.src || audio.src === window.location.href) {
      loadSong(currentIndex);
    }
    if (!isPlaying && isPanelOpen) {
      playSong();
    }
  });

  if (panelClose) {
    panelClose.addEventListener('click', (e) => {
      e.stopPropagation();
      isPanelOpen = false;
      panel.classList.remove('open');
    });
  }

  document.addEventListener('click', (e) => {
    if (isPanelOpen && !panel.contains(e.target) && e.target !== toggleBtn) {
      isPanelOpen = false;
      panel.classList.remove('open');
    }
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseSong(true);
      } else {
        if (!audio.src || audio.src === window.location.href) loadSong(currentIndex);
        playSong();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      fadeOut(() => {
        currentIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        loadSong(currentIndex);
        playSong();
      });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      fadeOut(() => {
        currentIndex = (currentIndex + 1) % PLAYLIST.length;
        loadSong(currentIndex);
        playSong();
      });
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      if (!isFading) audio.volume = parseFloat(volumeSlider.value);
    });
  }

  // Auto-advance to next track when current ends
  audio.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % PLAYLIST.length;
    loadSong(currentIndex);
    playSong();
  });

  // ===== Initialise =====
  buildPlaylist();
  loadSong(currentIndex);
})();
