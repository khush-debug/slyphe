/**
 * CELESTIA — Global Navigation & Scroll Motion Controller
 * Handles header elevation, active route detection, and viewport entrance animations.
 */

import { SoundEngine } from './sound.js';

export class NavigationController {
  private header: HTMLElement | null = null;
  private soundEngine: SoundEngine | null = null;
  private soundToggleBtn: HTMLElement | null = null;
  private soundStatusText: HTMLElement | null = null;

  constructor(soundEngine?: SoundEngine) {
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

  private initHeaderScroll(): void {
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

  private initActiveRoute(): void {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

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

  private initSoundToggle(): void {
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

  private initRevealObserver(): void {
    const reveals = document.querySelectorAll<HTMLElement>('.reveal-up');
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

  private initBackToTop(): void {
    const backBtn = document.querySelector<HTMLElement>('.back-to-top-btn');
    backBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
