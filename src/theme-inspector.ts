/**
 * CELESTIA — Interactive Look & Feel Studio
 * Visual interface demonstrating how CSS variables dynamically control button colors, sizes, and padding.
 */

import { ThemeController } from './theme.js';
import { ButtonPalette, ButtonRadius, ButtonSize } from './types.js';

export class ThemeInspector {
  private controller: ThemeController;
  private container: HTMLElement | null = null;
  private isOpen: boolean = false;

  constructor(controller: ThemeController) {
    this.controller = controller;
    this.createDOM();
    this.bindEvents();
  }

  private createDOM(): void {
    const root = document.createElement('div');
    root.id = 'themeInspectorRoot';
    root.className = 'theme-inspector-root';

    root.innerHTML = `
      <!-- Floating Trigger Button -->
      <button class="theme-inspector-trigger" id="themeTriggerBtn" aria-label="Toggle Look & CSS Controls">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a7 7 0 0 0 7 7c0 2-2 3-2 3s.5 1 .5 2-1 2-2 2-2-1-2-2"></path>
        </svg>
        <span>Looks & Sizing</span>
      </button>

      <!-- Slide-Up / Floating Studio Panel -->
      <div class="theme-inspector-panel" id="themeInspectorPanel" aria-hidden="true">
        <div class="theme-panel-header">
          <div>
            <div class="theme-panel-tag">CSS Design Tokens</div>
            <h4 class="theme-panel-title">Button Looks & Sizing</h4>
          </div>
          <button class="theme-panel-close" id="themeCloseBtn" aria-label="Close Look Controls">✕</button>
        </div>

        <div class="theme-panel-body">
          <p class="theme-panel-intro">
            Interactive demonstration of how CSS custom properties control the visual weight, color scheme, and metrics of buttons across Celestia.
          </p>

          <!-- Palette Section -->
          <div class="theme-control-group">
            <div class="theme-control-label">
              <span>Primary Button Color</span>
              <code id="activeColorCode">var(--btn-primary-bg)</code>
            </div>
            <div class="theme-palette-swatches">
              ${Object.entries(ThemeController.COLOR_PALETTES).map(([key, item]) => `
                <button type="button" 
                        class="theme-color-pill ${this.controller.getActivePalette() === key ? 'active' : ''}" 
                        data-palette="${key}" 
                        title="${item.label}">
                  <span class="color-dot" style="background-color: ${item.bgRoyal};"></span>
                  <span class="color-name">${item.label.split(' ')[0]}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Sizing Section -->
          <div class="theme-control-group">
            <div class="theme-control-label">
              <span>Button Dimension & Padding</span>
              <code id="activeSizeCode">var(--btn-height)</code>
            </div>
            <div class="theme-chips-row">
              ${Object.entries(ThemeController.SIZING_PRESETS).map(([key, item]) => `
                <button type="button" 
                        class="theme-chip ${this.controller.getActiveSize() === key ? 'active' : ''}" 
                        data-size="${key}">
                  ${item.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Radius Section -->
          <div class="theme-control-group">
            <div class="theme-control-label">
              <span>Corner Architectural Radius</span>
              <code id="activeRadiusCode">var(--btn-radius)</code>
            </div>
            <div class="theme-chips-row">
              ${Object.entries(ThemeController.RADIUS_PRESETS).map(([key, item]) => `
                <button type="button" 
                        class="theme-chip ${this.controller.getActiveRadius() === key ? 'active' : ''}" 
                        data-radius="${key}">
                  ${item.label}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Live CSS Code Preview -->
          <div class="theme-code-block">
            <div class="theme-code-header">
              <span>Live Generated CSS</span>
              <button type="button" id="copyCssBtn" class="theme-copy-btn">Copy CSS</button>
            </div>
            <pre><code id="liveCssOutput">${this.controller.generateCSSSnippet()}</code></pre>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    this.container = root;
  }

  private bindEvents(): void {
    if (!this.container) return;

    const trigger = this.container.querySelector('#themeTriggerBtn');
    const panel = this.container.querySelector('#themeInspectorPanel');
    const close = this.container.querySelector('#themeCloseBtn');
    const liveCss = this.container.querySelector('#liveCssOutput');
    const copyBtn = this.container.querySelector('#copyCssBtn');

    trigger?.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      panel?.classList.toggle('open', this.isOpen);
      panel?.setAttribute('aria-hidden', String(!this.isOpen));
      trigger.classList.toggle('active', this.isOpen);
    });

    close?.addEventListener('click', () => {
      this.isOpen = false;
      panel?.classList.remove('open');
      panel?.setAttribute('aria-hidden', 'true');
      trigger?.classList.remove('active');
    });

    // Palette change
    const swatches = this.container.querySelectorAll<HTMLButtonElement>('[data-palette]');
    swatches.forEach(btn => {
      btn.addEventListener('click', () => {
        const pal = btn.getAttribute('data-palette') as ButtonPalette;
        if (pal) {
          this.controller.setButtonPalette(pal);
          swatches.forEach(b => b.classList.toggle('active', b === btn));
        }
      });
    });

    // Size change
    const sizeBtns = this.container.querySelectorAll<HTMLButtonElement>('[data-size]');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-size') as ButtonSize;
        if (size) {
          this.controller.setButtonSize(size);
          sizeBtns.forEach(b => b.classList.toggle('active', b === btn));
        }
      });
    });

    // Radius change
    const radiusBtns = this.container.querySelectorAll<HTMLButtonElement>('[data-radius]');
    radiusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const radius = btn.getAttribute('data-radius') as ButtonRadius;
        if (radius) {
          this.controller.setButtonRadius(radius);
          radiusBtns.forEach(b => b.classList.toggle('active', b === btn));
        }
      });
    });

    // Copy CSS button
    copyBtn?.addEventListener('click', () => {
      const code = this.controller.generateCSSSnippet();
      navigator.clipboard?.writeText(code).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          if (copyBtn) copyBtn.textContent = 'Copy CSS';
        }, 1800);
      });
    });

    // Listen for custom event updates from the controller
    window.addEventListener('celestia:theme-changed', ((e: CustomEvent) => {
      if (liveCss) {
        liveCss.textContent = e.detail.css;
      }
    }) as EventListener);
  }
}
