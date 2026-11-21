/**
 * CELESTIA — Application Orchestrator
 * High-Fashion & Haute Parfumerie typed architecture.
 */
import { BookingDrawer } from './booking.js';
import { MagneticCursor } from './cursor.js';
import { NavigationController } from './navigation.js';
import { OlfactoryController } from './olfactory.js';
import { PresenceStudio } from './presence-studio.js';
import { SoundEngine } from './sound.js';
import { ThemeInspector } from './theme-inspector.js';
import { ThemeController } from './theme.js';
import { WardrobeController } from './wardrobe.js';
class CelestiaApp {
    sound;
    theme;
    themeInspector;
    cursor;
    booking;
    navigation;
    olfactory;
    wardrobe;
    presenceStudio;
    constructor() {
        // 1. Initialize Typed Sound Synthesizer
        this.sound = new SoundEngine();
        // 2. Initialize Look & Feel CSS Token Engine
        this.theme = new ThemeController();
        // 3. Initialize Interactive Design Token Studio
        this.themeInspector = new ThemeInspector(this.theme);
        // 4. Initialize Magnetic Motion & Contextual Cursor Follower
        this.cursor = new MagneticCursor(this.sound);
        // 5. Initialize Atelier Consultation Drawer & State Machine
        this.booking = new BookingDrawer(this.sound);
        // 6. Initialize Global Navigation, Parallax & Nocturne Mode
        this.navigation = new NavigationController(this.sound);
        // 7. Initialize Interactive Fragrance & Wardrobe Modules
        this.olfactory = new OlfactoryController(this.sound);
        this.wardrobe = new WardrobeController(this.sound);
        // 8. Initialize Signature Presence Atelier Studio
        this.presenceStudio = new PresenceStudio(this.sound);
        console.info('✨ CELESTIA haute couture & parfumerie motion system ready.');
    }
}
// Bootstrap once the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.celestia = new CelestiaApp();
    });
}
else {
    window.celestia = new CelestiaApp();
}
