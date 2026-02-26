const rsvpForm = document.getElementById("rsvpForm");
const rsvpNote = document.getElementById("rsvpNote");

if (rsvpForm && rsvpNote) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    rsvpForm.reset();
    rsvpNote.textContent = "Cảm ơn bạn! Lời chúc đã được ghi nhận trên trình duyệt.";
  });
}

const gallerySlider = document.querySelector(".gallery-slider");

if (gallerySlider) {
  const track = gallerySlider.querySelector(".gallery-track");
  const prevButton = gallerySlider.querySelector(".gallery-nav.prev");
  const nextButton = gallerySlider.querySelector(".gallery-nav.next");
  
  if (!track || !prevButton || !nextButton) {
    return;
  }

  const scrollByAmount = () => track.clientWidth * 0.8;

  const scrollTrack = (direction) => {
    track.scrollBy({ left: direction * scrollByAmount(), behavior: "smooth" });
  };

  prevButton.addEventListener("click", () => scrollTrack(-1));
  nextButton.addEventListener("click", () => scrollTrack(1));
}
