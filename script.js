// Loader: fade out once page is loaded AND animation has played its full cycle
(function () {
  const loader = document.getElementById('bisouLoader');
  if (!loader) return;
  const MIN_DISPLAY_MS = 3200; // mark reveal + light sweep before fade out
  const start = performance.now();
  const hide = () => {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
    setTimeout(() => loader.classList.add('is-hidden'), wait);
  };
  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide);
})();

// Nav scroll effect (only on home page where nav is over hero)
const nav = document.getElementById('nav');
if (nav && !nav.classList.contains('solid') && !nav.classList.contains('dark')) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('primary-nav');
if (navToggle && navLinks) {
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  const closeMenu = () => {
    navLinks.classList.remove('open');
    backdrop.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    backdrop.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  backdrop.addEventListener('click', closeMenu);
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// Reveal on scroll — gentle fade + lift, runs once per element
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

const revealSelectors = [
  'section.story',
  'section.menu-teaser',
  'section.events-teaser',
  'section.reservation',
  'section.contact',
  '.events-hero-image',
  '.event-type',
  '.menu-section',
  '.cat',
  '.story-stats > div'
];

document.querySelectorAll(revealSelectors.join(',')).forEach((el, i) => {
  if (prefersReducedMotion) {
    el.classList.add('is-visible');
    return;
  }
  el.classList.add('reveal-on-scroll');
  // small stagger for siblings of the same parent
  const idx = Array.from(el.parentElement?.children || []).indexOf(el);
  el.style.transitionDelay = `${Math.min(idx, 4) * 80}ms`;
  revealObserver.observe(el);
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
