document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      galleryItems.forEach((item) => {
        item.classList.toggle('hidden', category !== 'all' && item.dataset.category !== category);
      });
    });
  });

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('[data-full-image]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = button.dataset.fullImage;
      lightboxImage.alt = button.querySelector('strong')?.textContent || 'Image agrandie';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      lightboxClose?.focus();
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
});

// Fine barre de progression de lecture : légère et désactivable sans effet sur la navigation.
(() => {
  const bar = document.querySelector('.reading-progress');
  if (!bar) return;
  let pending = false;
  function update() {
    const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = `${Math.min(100, Math.max(0, window.scrollY / maximum * 100))}%`;
    pending = false;
  }
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
