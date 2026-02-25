# Assets Directory

This folder contains all static assets for the wedding invitation website.

## Structure

```
assets/
├── images/          — Place wedding photos here (JPG/PNG/WebP)
│                      Replace CSS gradient placeholders in style.css
│                      with: background-image: url('../assets/images/...')
│
├── music/           — Place music files here (MP3/OGG)
│                      Update src paths in js/music.js
│                      e.g. 'assets/music/a-thousand-years.mp3'
│
└── icons/           — Place custom icons, favicon, etc. here
```

## Recommended image names

- `bride.jpg`           — Bride portrait (used in couple section)
- `groom.jpg`           — Groom portrait (used in couple section)
- `gallery-1.jpg`       — First date
- `gallery-2.jpg`       — Paris walk
- `gallery-3.jpg`       — The proposal
- `gallery-4.jpg`       — Engagement
- `gallery-5.jpg`       — Travel together
- `gallery-6.jpg`       — Pre-wedding shoot
- `hero-bg.jpg`         — Hero/intro background image

## Recommended music files

- `a-thousand-years.mp3`
- `cant-help-falling-in-love.mp3`
- `perfect.mp3`
- `all-of-me.mp3`

## Notes

- Images should be optimised for web (max 800KB each recommended)
- WebP format preferred for best performance
- The site uses CSS gradient placeholders when images are not present
- All image `loading="lazy"` is set in HTML for performance
