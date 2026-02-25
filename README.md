# 💍 Wedding Invitation – Anh Hoa & Thêu

A complete, modern wedding invitation website built with **pure HTML, CSS, and Vanilla JavaScript** — no frameworks, no backend, ready to deploy on **GitHub Pages**.

## 🌸 Live Demo

Deploy to GitHub Pages: Settings → Pages → Source: `main` branch / `/ (root)`.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🖥️ Design | Mobile-first, fully responsive romantic design |
| 💌 Invitation Cover | Animated cover with "Open Invitation" button that unlocks scrolling |
| ⏳ Loading Screen | Elegant spinner while assets load |
| 📜 Sections | Intro · Bride & Groom · Love Story Timeline · Wedding Details · Map · Gallery · Countdown · RSVP · Footer |
| 🎵 Music Player | Floating button, playlist (3 songs), fade in/out, prev/next, volume control |
| 🖼️ Photo Gallery | Responsive grid with lightbox effect and keyboard navigation |
| ⏱️ Countdown Timer | Live animated countdown to the wedding date |
| 📝 RSVP Form | Client-side validated form (logs to console, no backend needed) |
| 🎆 Particles | Canvas-based floating heart particles background |
| 📊 Scroll Progress | Linear progress bar at the top of the page |
| 🌊 Parallax | Subtle parallax scrolling on hero and section backgrounds |
| 🔭 Reveal Animations | Intersection Observer scroll-triggered fade/slide/zoom effects |
| ♿ Accessibility | Semantic HTML5, ARIA labels, keyboard navigation |

---

## 📁 Project Structure

```
wedding-invitation/
│
├── index.html              # Main HTML (all sections)
├── css/
│   ├── style.css           # Layout, components, responsive styles
│   └── animations.css      # Keyframes, reveal classes, effects
├── js/
│   ├── main.js             # Core: loading, cover, particles, RSVP, progress bar
│   ├── music.js            # Music player + playlist management
│   ├── countdown.js        # Live countdown timer
│   └── animations.js       # Scroll reveal (IntersectionObserver) + lightbox
└── assets/
    ├── images/             # Add bride.jpg, groom.jpg, gallery photos here
    ├── music/              # Add .mp3 files here (see playlist in music.js)
    └── icons/              # Favicon and icons
```

---

## 🚀 Getting Started

1. **Clone** or download this repository.
2. Open `index.html` directly in a browser — no server required.
3. Replace placeholder images in `assets/images/` with real photos.
4. Add your `.mp3` files to `assets/music/` and update the `PLAYLIST` array in `js/music.js`.
5. Update the wedding date in `js/countdown.js` (`WEDDING_DATE` constant).
6. Update names, dates, and venue information in `index.html`.

---

## 🎵 Adding Music

Edit the `PLAYLIST` array in `js/music.js`:

```js
const PLAYLIST = [
  { title: 'Song Name', artist: 'Artist', src: 'assets/music/song.mp3' },
  // add more songs...
];
```

Place the `.mp3` files in `assets/music/`.

---

## 🖼️ Adding Photos

Replace the gradient placeholders in `index.html` gallery items with real `<img>` tags or background-image URLs. Update the `galleryData` array in `js/animations.js` to match.

---

## 🌐 Deploy to GitHub Pages

1. Push code to the `main` branch.
2. Go to **Settings → Pages**.
3. Set Source to **Deploy from a branch** → `main` → `/ (root)`.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

---

## 🛠️ Customisation

| What | Where |
|---|---|
| Wedding date | `js/countdown.js` → `WEDDING_DATE` |
| Couple names | `index.html` |
| Venue & details | `index.html` → `#details` section |
| Google Maps embed | `index.html` → `#location` section |
| Music playlist | `js/music.js` → `PLAYLIST` |
| Colour scheme | `css/style.css` → `:root` CSS variables |

---

## 📱 Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Gracefully degrades in older browsers — animations are disabled for `prefers-reduced-motion` users.

---

*Made with ❤️ for Anh Hoa & Thêu's special day.*
