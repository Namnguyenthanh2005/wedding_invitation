const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const musicStateKey = "wedding-music";

const setPlaying = (isPlaying) => {
  if (!bgMusic || !musicToggle) {
    return;
  }

  if (isPlaying) {
    bgMusic.play().catch(() => {
      localStorage.setItem(musicStateKey, "off");
    });
    musicToggle.classList.add("is-playing");
  } else {
    bgMusic.pause();
    musicToggle.classList.remove("is-playing");
  }

  localStorage.setItem(musicStateKey, isPlaying ? "on" : "off");
};

if (musicToggle && bgMusic) {
  localStorage.removeItem(musicStateKey);
  const savedState = localStorage.getItem(musicStateKey);

  const playOnFirstInteraction = () => {
    const isPlaying = musicToggle.classList.contains("is-playing");
    if (!isPlaying) {
      setPlaying(true);
    }
  };

  if (savedState === null) {
    document.addEventListener("click", playOnFirstInteraction, { once: true });
    document.addEventListener("touchstart", playOnFirstInteraction, { once: true });
    document.addEventListener("keydown", playOnFirstInteraction, { once: true });
  }

  if (savedState === "on") {
    setPlaying(true);
  }

  musicToggle.addEventListener("click", () => {
    const isPlaying = !musicToggle.classList.contains("is-playing");
    setPlaying(isPlaying);
  });
}
