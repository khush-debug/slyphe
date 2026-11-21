/**
 * CELESTIA — Wardrobe Specification & Material Inspector
 * Typed controller for tactile fabric swatches and sensory specification switches.
 */

import { SoundEngine } from './sound.js';

export interface SensoryDetail {
  label: string;
  spec: string;
  btnText: string;
}

export class WardrobeController {
  private soundEngine: SoundEngine | null = null;
  private toggleBtn: HTMLElement | null = null;
  private labelEl: HTMLElement | null = null;
  private specEl: HTMLElement | null = null;
  private isOlfactory: boolean = false;

  private static readonly SPECS: Record<'fabric' | 'olfactory', SensoryDetail> = {
    fabric: {
      label: 'SIGNATURE FABRIC SPECIFICATION',
      spec: '320gsm Italian milled virgin wool blended with 15% mulberry silk. Fluid, unstructured silhouette cut to drape naturally in stride, with soft canvas construction and hand-finished horn buttons.',
      btnText: 'Switch to Olfactory Spec'
    },
    olfactory: {
      label: 'HAUTE PARFUMERIE SPECIFICATION',
      spec: '24% Extrait concentration. Sunlit Calabrian bergamot, blooming white peony petals, and smoked Mysore sandalwood. Formulated to interact with personal body heat for an intimate, 14-hour skin aura.',
      btnText: 'Switch to Fabric Spec'
    }
  };

  private static readonly SWATCHES: Record<string, string> = {
    'wool-silk': '100% Biella milled virgin wool woven with 15% mulberry silk. Breathable all-season weight (320gsm). Hand-stitched horn buttons, cupro sleeve lining, and double-pleated relaxed trousers.',
    'silk-crepe': '100% Mulberry silk crepe de chine (210gsm). Fluid liquid handfeel, matte luster, washed softly in Lake Como waters for an unlined, effortless drape that floats around the body.',
    'flannel': 'Finely carded virgin wool melange twill (360gsm). Brushed for subtle tactile warmth with structural memory that resists creasing during long travels.'
  };

  constructor(soundEngine?: SoundEngine) {
    this.soundEngine = soundEngine || null;
    this.toggleBtn = document.getElementById('sensoryToggleBtn');
    this.labelEl = document.getElementById('sensoryLabel');
    this.specEl = document.getElementById('sensorySpec');

    this.bindEvents();
    this.bindSwatchEvents();
  }

  private bindEvents(): void {
    this.toggleBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isOlfactory = !this.isOlfactory;
      this.updateView();

      if (this.soundEngine) {
        this.soundEngine.playClick(1750);
      }
    });
  }

  private bindSwatchEvents(): void {
    const swatches = document.querySelectorAll<HTMLButtonElement>('.swatch-btn[data-swatch]');
    const specDetail = document.getElementById('garmentSpecDetail');

    swatches.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-swatch');
        if (!key || !WardrobeController.SWATCHES[key]) return;

        swatches.forEach((b) => {
          b.classList.remove('active');
          b.style.borderColor = 'var(--border-light)';
          b.style.background = 'rgba(255,255,255,0.6)';
        });

        btn.classList.add('active');
        btn.style.borderColor = 'var(--border-active)';
        btn.style.background = '#FFFFFF';

        if (specDetail) {
          specDetail.style.opacity = '0';
          setTimeout(() => {
            specDetail.textContent = WardrobeController.SWATCHES[key];
            specDetail.style.opacity = '1';
          }, 150);
        }

        if (this.soundEngine) {
          this.soundEngine.playClick(2100);
        }
      });
    });
  }

  private updateView(): void {
    const active = this.isOlfactory ? WardrobeController.SPECS.olfactory : WardrobeController.SPECS.fabric;

    if (this.labelEl && this.specEl && this.toggleBtn) {
      this.labelEl.style.opacity = '0';
      this.specEl.style.opacity = '0';

      setTimeout(() => {
        if (this.labelEl && this.specEl && this.toggleBtn) {
          this.labelEl.textContent = active.label;
          this.specEl.textContent = active.spec;
          const span = this.toggleBtn.querySelector('span');
          if (span) span.textContent = active.btnText;

          this.labelEl.style.opacity = '1';
          this.specEl.style.opacity = '1';
        }
      }, 180);
    }
  }
}
