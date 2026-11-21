/**
 * CELESTIA — Look & Feel Controller (CSS Variable Token Engine)
 * Controls how CSS styles the appearance, dimensions, and colors of interactive elements.
 */

import { ButtonPalette, ButtonRadius, ButtonSize, ColorSchemeTokens, SizingPresetTokens } from './types.js';

export class ThemeController {
          currentPalette                = 'celestia-blue';
          currentSize             = 'md';
          currentRadius               = 'sharp';

         static          COLOR_PALETTES                                           = {
    'celestia-blue': {
      name: 'celestia-blue',
      label: 'Celestia Cobalt Blue',
      bgRoyal: '#2853C3',
      bgRoyalHover: '#1E44AA',
      accentShadow: 'rgba(40, 83, 195, 0.28)'
    },
    'obsidian-black': {
      name: 'obsidian-black',
      label: 'Obsidian Tailored Black',
      bgRoyal: '#141518',
      bgRoyalHover: '#2A2C32',
      accentShadow: 'rgba(20, 21, 24, 0.3)'
    },
    'mineral-slate': {
      name: 'mineral-slate',
      label: 'Mineral Flacon Slate',
      bgRoyal: '#3D4853',
      bgRoyalHover: '#2A333C',
      accentShadow: 'rgba(61, 72, 83, 0.26)'
    },
    'terracotta-ochre': {
      name: 'terracotta-ochre',
      label: 'Atelier Terracotta',
      bgRoyal: '#995435',
      bgRoyalHover: '#7F4125',
      accentShadow: 'rgba(153, 84, 53, 0.28)'
    },
    'atelier-cream': {
      name: 'atelier-cream',
      label: 'Raw Silk Monochrome',
      bgRoyal: '#373834',
      bgRoyalHover: '#1A1A18',
      accentShadow: 'rgba(55, 56, 52, 0.25)'
    }
  };

         static          SIZING_PRESETS                                         = {
    'sm': {
      size: 'sm',
      label: 'Compact (38px)',
      height: '38px',
      paddingY: '0.55rem',
      paddingX: '1.4rem',
      fontSize: '0.72rem',
      letterSpacing: '0.14em'
    },
    'md': {
      size: 'md',
      label: 'Editorial Standard (48px)',
      height: '48px',
      paddingY: '0.95rem',
      paddingX: '2.2rem',
      fontSize: '0.8rem',
      letterSpacing: '0.18em'
    },
    'lg': {
      size: 'lg',
      label: 'Grandeur Scale (58px)',
      height: '58px',
      paddingY: '1.25rem',
      paddingX: '2.8rem',
      fontSize: '0.88rem',
      letterSpacing: '0.22em'
    }
  };

         static          RADIUS_PRESETS                                                         = {
    'sharp': { label: 'Architectural Sharp (1px)', value: '1px' },
    'soft': { label: 'Subtle Contour (6px)', value: '6px' },
    'pill': { label: 'Flacon Pill (9999px)', value: '9999px' }
  };

  constructor() {
    this.restorePreferences();
    this.applyAllTokens();
  }

  /**
   * Set the primary button color palette in CSS
   */
         setButtonPalette(palette               )       {
    if (!ThemeController.COLOR_PALETTES[palette]) return;
    this.currentPalette = palette;
    this.applyPaletteTokens();
    this.savePreferences();
    this.notifyUpdate();
  }

  /**
   * Set the button size and dimension metrics in CSS
   */
         setButtonSize(size            )       {
    if (!ThemeController.SIZING_PRESETS[size]) return;
    this.currentSize = size;
    this.applySizingTokens();
    this.savePreferences();
    this.notifyUpdate();
  }

  /**
   * Set the button corner radius in CSS
   */
         setButtonRadius(radius              )       {
    if (!ThemeController.RADIUS_PRESETS[radius]) return;
    this.currentRadius = radius;
    this.applyRadiusTokens();
    this.savePreferences();
    this.notifyUpdate();
  }

  /**
   * Directly writes CSS variables to document.documentElement (:root)
   */
          applyAllTokens()       {
    this.applyPaletteTokens();
    this.applySizingTokens();
    this.applyRadiusTokens();
  }

          applyPaletteTokens()       {
    const config = ThemeController.COLOR_PALETTES[this.currentPalette];
    const root = document.documentElement;

    root.style.setProperty('--btn-primary-bg', config.bgRoyal);
    root.style.setProperty('--btn-primary-hover-bg', config.bgRoyalHover);
    root.style.setProperty('--bg-royal', config.bgRoyal);
    root.style.setProperty('--bg-royal-hover', config.bgRoyalHover);
    root.style.setProperty('--btn-primary-shadow', `0 8px 24px ${config.accentShadow}`);
    root.style.setProperty('--btn-primary-shadow-hover', `0 14px 36px ${config.accentShadow}`);
  }

          applySizingTokens()       {
    const preset = ThemeController.SIZING_PRESETS[this.currentSize];
    const root = document.documentElement;

    root.style.setProperty('--btn-height', preset.height);
    root.style.setProperty('--btn-padding-y', preset.paddingY);
    root.style.setProperty('--btn-padding-x', preset.paddingX);
    root.style.setProperty('--btn-font-size', preset.fontSize);
    root.style.setProperty('--btn-letter-spacing', preset.letterSpacing);
  }

          applyRadiusTokens()       {
    const preset = ThemeController.RADIUS_PRESETS[this.currentRadius];
    const root = document.documentElement;

    root.style.setProperty('--btn-radius', preset.value);
  }

          savePreferences()       {
    try {
      const data = {
        palette: this.currentPalette,
        size: this.currentSize,
        radius: this.currentRadius
      };
      localStorage.setItem('celestia_theme_preferences', JSON.stringify(data));
    } catch {
      // Storage unavailable or disabled
    }
  }

          restorePreferences()       {
    try {
      const saved = localStorage.getItem('celestia_theme_preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.palette && ThemeController.COLOR_PALETTES[parsed.palette                 ]) {
          this.currentPalette = parsed.palette                 ;
        }
        if (parsed.size && ThemeController.SIZING_PRESETS[parsed.size              ]) {
          this.currentSize = parsed.size              ;
        }
        if (parsed.radius && ThemeController.RADIUS_PRESETS[parsed.radius                ]) {
          this.currentRadius = parsed.radius                ;
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

         getActivePalette()                {
    return this.currentPalette;
  }

         getActiveSize()             {
    return this.currentSize;
  }

         getActiveRadius()               {
    return this.currentRadius;
  }

         generateCSSSnippet()         {
    const pal = ThemeController.COLOR_PALETTES[this.currentPalette];
    const size = ThemeController.SIZING_PRESETS[this.currentSize];
    const rad = ThemeController.RADIUS_PRESETS[this.currentRadius];

    return `/* CSS variables applied dynamically by TypeScript */
:root {
  --btn-primary-bg: ${pal.bgRoyal};
  --btn-primary-hover-bg: ${pal.bgRoyalHover};
  --btn-height: ${size.height};
  --btn-padding-x: ${size.paddingX};
  --btn-font-size: ${size.fontSize};
  --btn-letter-spacing: ${size.letterSpacing};
  --btn-radius: ${rad.value};
}`;
  }

          notifyUpdate()       {
    window.dispatchEvent(new CustomEvent('celestia:theme-changed', {
      detail: {
        palette: this.currentPalette,
        size: this.currentSize,
        radius: this.currentRadius,
        css: this.generateCSSSnippet()
      }
    }));
  }
}
