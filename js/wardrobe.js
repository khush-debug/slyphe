/**
 * CELESTIA — Wardrobe Specification & Material Inspector
 * Typed controller for tactile fabric swatches and sensory specification switches.
 */

import { SoundEngine } from './sound.js';

                                
                
               
                  
 

export class WardrobeController {
          soundEngine                     = null;
          toggleBtn                     = null;
          labelEl                     = null;
          specEl                     = null;
          isOlfactory          = false;

          static          SPECS                                                = {
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

  constructor(soundEngine              ) {
    this.soundEngine = soundEngine || null;
    this.toggleBtn = document.getElementById('sensoryToggleBtn');
    this.labelEl = document.getElementById('sensoryLabel');
    this.specEl = document.getElementById('sensorySpec');

    if (this.toggleBtn && this.labelEl && this.specEl) {
      this.bindEvents();
    }
  }

          bindEvents()       {
    this.toggleBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.isOlfactory = !this.isOlfactory;
      this.updateView();

      if (this.soundEngine) {
        this.soundEngine.playClick(1750);
      }
    });
  }

          updateView()       {
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
