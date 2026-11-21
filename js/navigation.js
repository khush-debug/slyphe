/**
 * CELESTIA — Global Navigation & Scroll Motion Controller
 * Handles header elevation, active route detection, and viewport entrance animations.
 */

import { SoundEngine } from './sound.js';

export class NavigationController {
          header                     = null;
          soundEngine                     = null;
          soundToggleBtn                     = null;
          soundStatusText                     = null;

  constructor(soundEngine              ) {
    this.soundEngine = soundEngine || null;
    this.header = document.querySelector('.header');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundStatusText = document.getElementById('soundStatusText');

    this.initHeaderScroll();
    this.initActiveRoute();
    this.initSoundToggle();
    this.initRevealObserver();
    this.initBackToTop();
  }

          initHeaderScroll()       {
    if (!this.header) return;

    const onScroll = () => {
      if (window.scrollY > 40) {
        this.header?.classList.add('scrolled');
      } else {
        this.header?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

          initActiveRoute()       {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll                   ('.nav-link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const isCurrent = 
        (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '')) ||
        (href !== 'index.html' && currentPath.includes(href.replace('.html', '')));

      if (isCurrent) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

          initSoundToggle()       {
    if (!this.soundToggleBtn || !this.soundEngine) return;

    // Set initial UI based on restored engine state
    const isActive = this.soundEngine.isSoundActive();
    if (isActive) {
      this.soundToggleBtn.classList.add('active');
      if (this.soundStatusText) this.soundStatusText.textContent = 'SOUND: ON';
    } else {
      this.soundToggleBtn.classList.remove('active');
      if (this.soundStatusText) this.soundStatusText.textContent = 'SOUND: OFF';
    }

    this.soundToggleBtn.addEventListener('click', () => {
      if (!this.soundEngine) return;
      const nowActive = this.soundEngine.toggle();

      if (nowActive) {
        this.soundToggleBtn?.classList.add('active');
        if (this.soundStatusText) this.soundStatusText.textContent = 'SOUND: ON';
      } else {
        this.soundToggleBtn?.classList.remove('active');
        if (this.soundStatusText) this.soundStatusText.textContent = 'SOUND: OFF';
      }
    });
  }

          initRevealObserver()       {
    const reveals = document.querySelectorAll             ('.reveal-up');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    reveals.forEach((el) => observer.observe(el));
  }

          initBackToTop()       {
    const backBtn = document.querySelector             ('.back-to-top-btn');
    backBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
