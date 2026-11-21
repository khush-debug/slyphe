/**
 * CELESTIA — Signature Presence Atelier
 * Interactive bespoke suiting and fragrance pairing experience.
 */
export class PresenceStudio {
    sound = null;
    container = null;
    currentSilhouette = 'biella-ivory';
    currentAccord = 'peony-silk';
    currentAmbience = 'golden-hour';
    static SILHOUETTES = {
        'biella-ivory': {
            id: 'biella-ivory',
            name: 'The Biella Double-Breasted Suit',
            fabric: '320gsm Italian Virgin Wool & 15% Mulberry Silk',
            origin: 'Lanificio Biella, Italy',
            image: 'public/images/card_form.jpg',
            notes: 'Structured peak lapel, soft natural canvas shoulder, fluid drape in stride.',
            silhouette: 'Architectural Suiting'
        },
        'chiffon-trench': {
            id: 'chiffon-trench',
            name: 'The Fluid Silk Trench & Trousers',
            fabric: '210gsm Lake Como Washed Silk Crepe',
            origin: 'Como, Italy',
            image: 'public/images/hero_editorial.jpg',
            notes: 'Unlined, weightless motion, semi-translucent sky blue silk veil.',
            silhouette: 'Kinetic Movement'
        },
        'midnight-barathea': {
            id: 'midnight-barathea',
            name: 'The Midnight Barathea Tuxedo',
            fabric: '360gsm Fine English Wool Barathea with Silk Grosgrain',
            origin: 'Savile Row Mills',
            image: 'public/images/model_standing.jpg',
            notes: 'Shawl collar in silk grosgrain, high-waisted pleated evening trouser.',
            silhouette: 'Nocturne Evening'
        }
    };
    static ACCORDS = {
        'bergamot-dawn': {
            id: 'bergamot-dawn',
            name: 'Aura I · Bergamot & Morning Air',
            descriptor: 'Crisp, buoyant, awakening with dawn light',
            pyramid: 'Calabrian Bergamot · Petitgrain · Clean Ozone',
            concentration: '22% Extrait de Parfum'
        },
        'peony-silk': {
            id: 'peony-silk',
            name: 'Aura II · White Peony & Silk Chiffon',
            descriptor: 'Velvety, intimate, skin-warmed floral textile',
            pyramid: 'Dewy Peony · French Orris · Silk Chiffon Accord',
            concentration: '24% Extrait de Parfum'
        },
        'sandalwood-smoke': {
            id: 'sandalwood-smoke',
            name: 'Aura III · Smoked Sandalwood & Cashmere',
            descriptor: 'Deep, comforting, anchoring 14-hour sillage',
            pyramid: 'Mysore Sandalwood · Cashmere Musk · White Ambergris',
            concentration: '28% Extrait de Parfum'
        }
    };
    constructor(sound) {
        this.sound = sound || null;
        this.container = document.getElementById('presenceStudioSection');
        if (this.container) {
            this.bindEvents();
            this.updateView();
        }
    }
    bindEvents() {
        if (!this.container)
            return;
        // Silhouette selector buttons
        const silBtns = this.container.querySelectorAll('[data-select-silhouette]');
        silBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-select-silhouette');
                if (!id || !PresenceStudio.SILHOUETTES[id])
                    return;
                silBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSilhouette = id;
                this.updateView();
                if (this.sound)
                    this.sound.playClick(1900);
            });
        });
        // Fragrance accord selector buttons
        const accordBtns = this.container.querySelectorAll('[data-select-accord]');
        accordBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-select-accord');
                if (!id || !PresenceStudio.ACCORDS[id])
                    return;
                accordBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentAccord = id;
                this.updateView();
                if (this.sound)
                    this.sound.playClick(2300);
            });
        });
        // Ambience buttons
        const ambBtns = this.container.querySelectorAll('[data-select-ambience]');
        ambBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-select-ambience');
                if (!id)
                    return;
                ambBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentAmbience = id;
                this.updateView();
                if (this.sound)
                    this.sound.playClick(1600);
            });
        });
        // Book curation button
        const bookBtn = this.container.querySelector('#bookCuratedPairBtn');
        bookBtn?.addEventListener('click', () => {
            const sil = PresenceStudio.SILHOUETTES[this.currentSilhouette];
            const acc = PresenceStudio.ACCORDS[this.currentAccord];
            const noteInput = document.getElementById('clientNotes');
            const select = document.getElementById('interestSelect');
            if (select)
                select.value = 'combined';
            if (noteInput && sil && acc) {
                noteInput.value = `Selected Curation:\n• Silhouette: ${sil.name} (${sil.fabric})\n• Fragrance: ${acc.name} (${acc.pyramid})\n• Mood: ${this.currentAmbience}`;
            }
            const modal = document.getElementById('bookingModal');
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
            }
            if (this.sound)
                this.sound.playChime();
        });
    }
    updateView() {
        if (!this.container)
            return;
        const sil = PresenceStudio.SILHOUETTES[this.currentSilhouette];
        const acc = PresenceStudio.ACCORDS[this.currentAccord];
        const previewImg = this.container.querySelector('#curatedPreviewImg');
        const titleEl = this.container.querySelector('#curatedTitle');
        const fabricEl = this.container.querySelector('#curatedFabric');
        const accordEl = this.container.querySelector('#curatedAccord');
        const notesEl = this.container.querySelector('#curatedNotes');
        if (previewImg && sil) {
            previewImg.style.opacity = '0.3';
            setTimeout(() => {
                previewImg.src = sil.image;
                previewImg.alt = `${sil.name} paired with ${acc?.name}`;
                previewImg.style.opacity = '1';
            }, 140);
        }
        if (titleEl && sil)
            titleEl.textContent = sil.name;
        if (fabricEl && sil)
            fabricEl.textContent = `${sil.fabric} · ${sil.origin}`;
        if (accordEl && acc)
            accordEl.textContent = `${acc.name} (${acc.concentration})`;
        if (notesEl && acc && sil)
            notesEl.textContent = `Presence Note: ${sil.notes} Blended with ${acc.descriptor}.`;
    }
}
