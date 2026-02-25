const rsvpForm = document.getElementById("rsvpForm");
const rsvpNote = document.getElementById("rsvpNote");

if (rsvpForm && rsvpNote) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    rsvpForm.reset();
    rsvpNote.textContent = "Cảm ơn bạn! Lời chúc đã được ghi nhận trên trình duyệt.";
  });
}
