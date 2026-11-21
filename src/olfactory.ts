/**
 * CELESTIA — Interactive Olfactory Pyramid & Accords Explorer
 * Typed controller for exploring fragrance tiers with real-time sillage particle diffusion.
 */

import { SillageSimulator } from './sillage-sim.js';
import { SoundEngine } from './sound.js';
import { OlfactoryNoteData, OlfactoryTier } from './types.js';

export class OlfactoryController {
  private soundEngine: SoundEngine | null = null;
  private container: HTMLElement | null = null;
  private detailText: HTMLElement | null = null;
  private sillageSim: SillageSimulator | null = null;

  public static readonly NOTES: Record<OlfactoryTier, OlfactoryNoteData> = {
    top: {
      tier: 'top',
      title: 'Top Note · First Aura',
      subtitle: 'Sunlit Bergamot & Morning Air',
      notes: ['Calabrian Bergamot', 'Morning Air Accord', 'Crushed Petitgrain', 'Neroli Mist'],
      accord: 'Crisp Citrus / Ethereal Ozone',
      concentrationPct: 22,
      description: 'First Impression: Bright, buoyant, awakening the senses with the crispness of dawn light through sheer silk curtains. Lingers for the first 20 minutes.'
    },
    heart: {
      tier: 'heart',
      title: 'Heart Note · The Silhouette',
      subtitle: 'White Peony & Silk Chiffon',
      notes: ['Dewy White Peony', 'Silk Chiffon Accord', 'French Orris Butter', 'Freesia'],
      accord: 'Tactile Floral / Clean Textile',
      concentrationPct: 48,
      description: 'The Identity: A blooming, velvety softness reminiscent of freshly ironed silk garments against warm skin. Blossoms between 30 minutes and 4 hours.'
    },
    base: {
      tier: 'base',
      title: 'Base Note · The Resonance',
      subtitle: 'Smoked Sandalwood & Cashmere Musk',
      notes: ['Smoked Mysore Sandalwood', 'Cashmere Musk', 'White Ambergris', 'Cedarwood'],
      accord: 'Warm Wood / Second-Skin Mineral',
      concentrationPct: 30,
      description: 'The Memory: Deep, comforting, tactile resonance that anchors to your natural skin chemistry for up to 14 hours. The quiet mark that stays behind.'
    }
  };

  constructor(soundEngine?: SoundEngine) {
    this.soundEngine = soundEngine || null;
    this.container = document.querySelector('.olfactory-pyramid');
    this.detailText = document.getElementById('pyramidActiveDetail');

    if (document.getElementById('sillageCanvas')) {
      this.sillageSim = new SillageSimulator('sillageCanvas');
    }

    if (this.container) {
      this.bindEvents();
    }
    this.bindSillageSlider();
  }

  private bindEvents(): void {
    const levels = this.container?.querySelectorAll<HTMLElement>('.pyramid-level');
    if (!levels) return;

    levels.forEach((level) => {
      level.addEventListener('click', () => {
        const tier = level.getAttribute('data-tier') as OlfactoryTier;
        if (!tier || !OlfactoryController.NOTES[tier]) return;

        levels.forEach((l) => l.classList.remove('active'));
        level.classList.add('active');

        if (this.sillageSim) {
          this.sillageSim.setTier(tier);
        }

        this.updateDetail(tier);

        if (this.soundEngine) {
          const freqs: Record<OlfactoryTier, number> = { top: 2200, heart: 1600, base: 900 };
          this.soundEngine.playClick(freqs[tier] || 1500);
        }
      });
    });
  }

  private bindSillageSlider(): void {
    const slider = document.getElementById('sillageIntensitySlider') as HTMLInputElement | null;
    const valueDisplay = document.getElementById('sillageValueDisplay');

    slider?.addEventListener('input', () => {
      const val = parseFloat(slider.value);
      if (this.sillageSim) {
        this.sillageSim.setIntensity(val);
      }
      if (valueDisplay) {
        const labels: Record<number, string> = {
          1: 'Intimate Skin Aura (0.5m)',
          2: 'Conversational Sillage (1.5m)',
          3: 'Room-Filling Presence (3.0m)'
        };
        valueDisplay.textContent = labels[Math.round(val)] || `${val.toFixed(1)}x Diffusion`;
      }
    });
  }

  private updateDetail(tier: OlfactoryTier): void {
    const data = OlfactoryController.NOTES[tier];
    if (!this.detailText || !data) return;

    this.detailText.style.opacity = '0';
    setTimeout(() => {
      if (this.detailText) {
        this.detailText.innerHTML = `<strong>${data.title} (${data.accord}):</strong> ${data.description}`;
        this.detailText.style.opacity = '1';
      }
    }, 160);
  }
}
