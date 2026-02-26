const revealTargets = document.querySelectorAll(".reveal-on-scroll");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealTargets.forEach((target) => observer.observe(target));

const gallerySection = document.querySelector(".gallery");
const galleryLazyImages = document.querySelectorAll(".gallery-lazy[data-src]");

if (gallerySection && galleryLazyImages.length > 0) {
  const loadGalleryImages = () => {
    galleryLazyImages.forEach((img) => {
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.addEventListener(
          "load",
          () => {
            img.classList.add("is-loaded");
          },
          { once: true }
        );
        img.removeAttribute("data-src");
      }
    });
  };

  const galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadGalleryImages();
          galleryObserver.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  galleryObserver.observe(gallerySection);
}
