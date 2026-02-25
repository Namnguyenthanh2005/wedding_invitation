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
  const savedState = localStorage.getItem(musicStateKey);

  if (savedState === null || savedState === "on") {
    setPlaying(true);
  }

  musicToggle.addEventListener("click", () => {
    const isPlaying = !musicToggle.classList.contains("is-playing");
    setPlaying(isPlaying);
  });
}
