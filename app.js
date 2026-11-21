/**
 * CELESTIA — Core Motion & Interaction Orchestrator
 */

import { SilkSimulation } from './silk.js';
import { SoundEngine } from './sound.js';
import { BookingDrawer } from './booking.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sound Engine
  const sound = new SoundEngine();
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundStatusText = document.getElementById('soundStatusText');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = sound.toggle();
      if (active) {
        soundBtn.classList.add('active');
        if (soundStatusText) soundStatusText.textContent = 'SOUND: ON';
      } else {
        soundBtn.classList.remove('active');
        if (soundStatusText) soundStatusText.textContent = 'SOUND: OFF';
      }
    });
  }

  // 2. Initialize Interactive Silk Simulation
  const silkCanvas = document.getElementById('silkCanvas');
  if (silkCanvas) {
    new SilkSimulation('silkCanvas');
  }

  // 3. Initialize Booking Drawer
  const booking = new BookingDrawer(sound);

  // 4. Custom Magnetic Cursor
  initMagneticCursor(sound);

  // 5. Scroll Header & Reveal Animations
  initScrollEffects();

  // 6. Interactive Olfactory Pyramid
  initOlfactoryPyramid(sound);

  // 7. Interactive Sensory Toggle in "Begin with the feeling"
  initSensoryToggle(sound);

  // 8. Smooth Anchor Navigation
  initAnchorNav(sound);
});

/**
 * Magnetic Cursor Engine with Lerp
 */
function initMagneticCursor(sound) {
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customCursorFollower');
  if (!cursor || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Interactive targets hover state
  const interactives = document.querySelectorAll('a, button, .pillar-card, .service-chip, .time-chip, .pyramid-level');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      if (sound) sound.playClick(1500);
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/**
 * Scroll Header Behavior & IntersectionObserver
 */
function initScrollEffects() {
  const header = document.querySelector('.header');
  const reveals = document.querySelectorAll('.reveal-up');

  // Header shrink on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Staggered reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/**
 * Interactive Olfactory Pyramid
 */
function initOlfactoryPyramid(sound) {
  const levels = document.querySelectorAll('.pyramid-level');
  const detailsEl = document.getElementById('pyramidActiveDetail');
  if (!levels.length || !detailsEl) return;

  const notesInfo = {
    top: 'First Impression: Calabrian Bergamot, Morning Aldehydes, Crushed Petitgrain — bright, buoyant, awakening the senses with the crispness of dawn light.',
    heart: 'Core Character: White Peony, Sheer Florentine Iris, Silk Chiffon Accord — intimate, powdered florals that settle close to the skin with quiet confidence.',
    base: 'Lasting Presence: Smoked Mysore Sandalwood, Clear Ambergris, Cashmere Musk — warm, enduring resonance that remains long after you have moved on.'
  };

  levels.forEach(lvl => {
    lvl.addEventListener('click', () => {
      levels.forEach(l => l.classList.remove('active'));
      lvl.classList.add('active');
      const tier = lvl.dataset.tier;
      if (notesInfo[tier]) {
        detailsEl.style.opacity = '0';
        setTimeout(() => {
          detailsEl.textContent = notesInfo[tier];
          detailsEl.style.opacity = '1';
        }, 150);
      }
      if (sound) sound.playClick(1300);
    });
  });
}

/**
 * Interactive Sensory Switcher
 */
function initSensoryToggle(sound) {
  const sensoryBtn = document.getElementById('sensoryToggleBtn');
  const sensoryLabel = document.getElementById('sensoryLabel');
  const sensorySpec = document.getElementById('sensorySpec');
  if (!sensoryBtn || !sensoryLabel || !sensorySpec) return;

  let isFabric = true;
  sensoryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isFabric = !isFabric;
    if (sound) sound.playClick(1100);

    sensoryLabel.style.opacity = '0';
    sensorySpec.style.opacity = '0';

    setTimeout(() => {
      if (isFabric) {
        sensoryLabel.textContent = 'SIGNATURE FABRIC SPECIFICATION';
        sensorySpec.textContent = '320gsm Italian milled virgin wool blended with mulberry silk. Fluid, unstructured silhouette cut to drape naturally in stride.';
        sensoryBtn.querySelector('span').textContent = 'SWITCH TO OLFACTORY SPEC';
      } else {
        sensoryLabel.textContent = 'EAU DE PARFUM COMPOSITION';
        sensorySpec.textContent = '24% perfume oil concentration. High-extraction Peony, cold-pressed bergamot, steam-distilled iris and aged cedar base.';
        sensoryBtn.querySelector('span').textContent = 'SWITCH TO SILHOUETTE SPEC';
      }
      sensoryLabel.style.opacity = '1';
      sensorySpec.style.opacity = '1';
    }, 200);
  });
}

/**
 * Smooth Anchor Navigation
 */
function initAnchorNav(sound) {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        if (sound) sound.playClick(1000);
      }
    });
  });

  // Track active section for nav highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = '#' + sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
