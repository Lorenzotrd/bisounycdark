// Nav scroll effect (only on home page where nav is over hero)
const nav = document.getElementById('nav');
if (nav && !nav.classList.contains('solid')) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 1s ease, transform 1s ease';
  observer.observe(el);
});

// Menu page tab filter (smooth scroll to section)
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.target;
    if (target) {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Story / teaser sections reveal
document.querySelectorAll('section.story, section.menu-teaser, section.events-teaser, section.contact').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 1s ease, transform 1s ease';
  observer.observe(el);
});

// Resy widget — replace these with values from your Resy partner dashboard
const RESY_CONFIG = {
  venueId: null,        // numeric venue ID (e.g. 1234) — falsy = fallback to Resy URL in new tab
  apiKey: null,         // public widget API key
  fallbackUrl: 'https://resy.com/cities/new-york-ny/venues/bisou'
};

function attachResyWidget() {
  const triggers = document.querySelectorAll('[data-resy]');
  if (!triggers.length) return;

  if (RESY_CONFIG.venueId && RESY_CONFIG.apiKey && window.resyWidget) {
    triggers.forEach(el => {
      window.resyWidget.addButton(el, {
        venueId: RESY_CONFIG.venueId,
        apiKey: RESY_CONFIG.apiKey,
        replace: el.textContent.trim()
      });
    });
    return;
  }

  triggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(RESY_CONFIG.fallbackUrl, 'resy', 'width=720,height=860,resizable,scrollbars');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachResyWidget);
} else {
  attachResyWidget();
}
