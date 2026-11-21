/**
 * CELESTIA — Application Orchestrator
 * High-Fashion & Haute Parfumerie typed architecture.
 */

import { BookingDrawer } from './booking.js';
import { MagneticCursor } from './cursor.js';
import { NavigationController } from './navigation.js';
import { OlfactoryController } from './olfactory.js';
import { SoundEngine } from './sound.js';
import { ThemeInspector } from './theme-inspector.js';
import { ThemeController } from './theme.js';
import { WardrobeController } from './wardrobe.js';

class CelestiaApp {
  public readonly sound: SoundEngine;
  public readonly theme: ThemeController;
  public readonly themeInspector: ThemeInspector;
  public readonly cursor: MagneticCursor;
  public readonly booking: BookingDrawer;
  public readonly navigation: NavigationController;
  public readonly olfactory: OlfactoryController;
  public readonly wardrobe: WardrobeController;

  constructor() {
    // 1. Initialize Typed Sound Synthesizer
    this.sound = new SoundEngine();

    // 2. Initialize Look & Feel CSS Token Engine
    this.theme = new ThemeController();

    // 3. Initialize Interactive Design Token Studio
    this.themeInspector = new ThemeInspector(this.theme);

    // 4. Initialize Magnetic Motion & Cursor Follower
    this.cursor = new MagneticCursor(this.sound);

    // 5. Initialize Atelier Consultation Drawer & State Machine
    this.booking = new BookingDrawer(this.sound);

    // 6. Initialize Global Navigation & Viewport Scroll Effects
    this.navigation = new NavigationController(this.sound);

    // 7. Initialize Interactive Fragrance & Wardrobe Modules
    this.olfactory = new OlfactoryController(this.sound);
    this.wardrobe = new WardrobeController(this.sound);

    console.info('Celestia motion & look system initialized with TypeScript.');
  }
}

// Bootstrap once the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    (window as unknown as { celestia: CelestiaApp }).celestia = new CelestiaApp();
  });
} else {
  (window as unknown as { celestia: CelestiaApp }).celestia = new CelestiaApp();
}
