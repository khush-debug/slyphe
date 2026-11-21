/**
 * CELESTIA — Magnetic Cursor Engine
 * Smooth Lerp follower with magnetic pull toward primary buttons and interactive elements.
 */

import { SoundEngine } from './sound.js';

export class MagneticCursor {
  private cursor: HTMLElement | null = null;
  private follower: HTMLElement | null = null;
  private mouseX: number = -100;
  private mouseY: number = -100;
  private followerX: number = -100;
  private followerY: number = -100;
  private isPointerFine: boolean = true;
  private soundEngine: SoundEngine | null = null;
  private animationFrameId: number | null = null;

  constructor(soundEngine?: SoundEngine) {
    this.soundEngine = soundEngine || null;
    this.isPointerFine = window.matchMedia('(pointer: fine)').matches;

    if (!this.isPointerFine) return;

    this.cursor = document.getElementById('customCursor');
    this.follower = document.getElementById('customCursorFollower');

    if (this.cursor && this.follower) {
      this.bindEvents();
      this.startLoop();
    }
  }

  private bindEvents(): void {
    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (this.cursor) {
        this.cursor.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0) translate(-50%, -50%)`;
      }
    }, { passive: true });

    // Interactive element detection
    this.attachInteractiveListeners();

    // Magnetic pull on primary buttons
    this.attachMagneticPull();
  }

  public attachInteractiveListeners(): void {
    const targets = document.querySelectorAll<HTMLElement>(
      'a, button, .pillar-card, .service-chip, .time-chip, .pyramid-level, .journal-essay-card, [data-open-booking]'
    );

    targets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (this.soundEngine) {
          this.soundEngine.playClick(2400);
        }
      });

      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  private attachMagneticPull(): void {
    const magneticElements = document.querySelectorAll<HTMLElement>('.btn-primary-blue, .btn-white-pill, .btn-nav-call');

    magneticElements.forEach((btn) => {
      btn.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.18;
        const deltaY = (e.clientY - centerY) * 0.18;

        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  private startLoop(): void {
    const render = () => {
      this.followerX += (this.mouseX - this.followerX) * 0.18;
      this.followerY += (this.mouseY - this.followerY) * 0.18;

      if (this.follower) {
        this.follower.style.transform = `translate3d(${this.followerX}px, ${this.followerY}px, 0) translate(-50%, -50%)`;
      }

      this.animationFrameId = requestAnimationFrame(render);
    };

    render();
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
