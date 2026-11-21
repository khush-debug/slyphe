/**
 * CELESTIA — Wardrobe Specification & Material Inspector
 * Typed controller for tactile fabric swatches, drape physics, and sensory specification switches.
 */
import { FabricSimulator } from './fabric-sim.js';
export class WardrobeController {
    soundEngine = null;
    toggleBtn = null;
    labelEl = null;
    specEl = null;
    isOlfactory = false;
    fabricSim = null;
    static SPECS = {
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
    static SWATCHES = {
        'wool-silk': {
            desc: '100% Biella milled virgin wool woven with 15% mulberry silk. Breathable all-season weight (320gsm). Hand-stitched horn buttons, cupro sleeve lining, and double-pleated relaxed trousers.',
            metrics: 'Weight: 320gsm · Weave: 2/2 Twill · Drape Factor: 0.82 Fluid'
        },
        'silk-crepe': {
            desc: '100% Mulberry silk crepe de chine (210gsm). Fluid liquid handfeel, matte luster, washed softly in Lake Como waters for an unlined, effortless drape that floats around the body.',
            metrics: 'Weight: 210gsm · Weave: Crepe de Chine · Drape Factor: 0.95 Weightless'
        },
        'flannel': {
            desc: 'Finely carded virgin wool melange twill (360gsm). Brushed for subtle tactile warmth with structural memory that resists creasing during long travels.',
            metrics: 'Weight: 360gsm · Weave: Brushed Flannel · Drape Factor: 0.68 Tailored Structure'
        }
    };
    constructor(soundEngine) {
        this.soundEngine = soundEngine || null;
        this.toggleBtn = document.getElementById('sensoryToggleBtn');
        this.labelEl = document.getElementById('sensoryLabel');
        this.specEl = document.getElementById('sensorySpec');
        if (document.getElementById('fabricPhysicsCanvas')) {
            this.fabricSim = new FabricSimulator('fabricPhysicsCanvas');
        }
        this.bindEvents();
        this.bindSwatchEvents();
    }
    bindEvents() {
        this.toggleBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.isOlfactory = !this.isOlfactory;
            this.updateView();
            if (this.soundEngine) {
                this.soundEngine.playClick(1750);
            }
        });
    }
    bindSwatchEvents() {
        const swatches = document.querySelectorAll('.swatch-btn[data-swatch]');
        const specDetail = document.getElementById('garmentSpecDetail');
        const metricDetail = document.getElementById('garmentMetricDetail');
        swatches.forEach((btn) => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-swatch');
                if (!key || !WardrobeController.SWATCHES[key])
                    return;
                swatches.forEach((b) => {
                    b.classList.remove('active');
                    b.style.borderColor = 'var(--border-light)';
                    b.style.background = 'rgba(255,255,255,0.6)';
                });
                btn.classList.add('active');
                btn.style.borderColor = 'var(--border-active)';
                btn.style.background = '#FFFFFF';
                if (this.fabricSim) {
                    this.fabricSim.setFabricType(key);
                }
                const data = WardrobeController.SWATCHES[key];
                if (specDetail) {
                    specDetail.style.opacity = '0';
                    setTimeout(() => {
                        specDetail.textContent = data.desc;
                        specDetail.style.opacity = '1';
                    }, 140);
                }
                if (metricDetail) {
                    metricDetail.style.opacity = '0';
                    setTimeout(() => {
                        metricDetail.textContent = data.metrics;
                        metricDetail.style.opacity = '1';
                    }, 140);
                }
                if (this.soundEngine) {
                    this.soundEngine.playClick(2100);
                }
            });
        });
    }
    updateView() {
        const active = this.isOlfactory ? WardrobeController.SPECS.olfactory : WardrobeController.SPECS.fabric;
        if (this.labelEl && this.specEl && this.toggleBtn) {
            this.labelEl.style.opacity = '0';
            this.specEl.style.opacity = '0';
            setTimeout(() => {
                if (this.labelEl && this.specEl && this.toggleBtn) {
                    this.labelEl.textContent = active.label;
                    this.specEl.textContent = active.spec;
                    const span = this.toggleBtn.querySelector('span');
                    if (span)
                        span.textContent = active.btnText;
                    this.labelEl.style.opacity = '1';
                    this.specEl.style.opacity = '1';
                }
            }, 160);
        }
    }
}
