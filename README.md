# CELESTIA — A Wardrobe for Every Sense

An haute couture and haute parfumerie editorial web experience featuring fluid real-time motion, spring-driven silk cloth dynamics, kinetic typography, and sensory soundscapes.

## Creative Direction & Motion Features

- **Interactive Silk Veil Simulation (`silk.js`)**: Real-time canvas physics simulation of translucent, sheer sky-blue organza billowing in ambient wind and reacting to mouse cursor proximity and touch.
- **Sensory Sound Engine (`sound.js`)**: Web Audio API ambient harmonic sound bed (warm 432Hz drone with soft overtone frequencies and gentle breeze) paired with tactile acoustic micro-clicks for buttons and chapter navigation.
- **Kinetic Typography & Staggered Scroll Triggers (`app.js`, `style.css`)**: Editorial headline line-masking reveals (`transform: translateY(110%)` to `0`), expanding hairlines, and smooth viewport transitions.
- **The Three Pillars (01 FORM, 02 SCENT, 03 RITUAL)**: Interactive collection pillars with subtle card lift, image zoom (1.04x), and animated directional arrows.
- **Interactive Olfactory Notes Pyramid**: Clickable sensory layers (Top: Calabrian Bergamot; Heart: White Peony & Silk Chiffon; Base: Smoked Sandalwood & Cashmere Musk) with real-time olfactory breakdown.
- **Interactive Atelier Booking Drawer (`booking.js`)**: Full-height slide-over drawer with consultation format selection, calendar date/time picker, and confirmation animation.
- **Magnetic Cursor Engine**: Smooth lerped dual-ring custom cursor with contextual hover expansion and difference blend mode.

## Running Locally

Because CELESTIA is built with modern ES modules, semantic HTML5, and vanilla CSS, it has **zero external build dependencies**.

Start a local server with Python:

```bash
python3 -m http.server 3000
```

Then open `http://localhost:3000` in any modern web browser.
