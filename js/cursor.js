/**
 * CELESTIA — Magnetic Contextual Cursor Engine
 * Smooth Lerp follower with magnetic pull toward interactive elements and contextual cue pills.
 */
export class MagneticCursor {
    dot = null;
    ring = null;
    label = null;
    mouseX = -100;
    mouseY = -100;
    ringX = -100;
    ringY = -100;
    targetX = -100;
    targetY = -100;
    isHovered = false;
    isPointerFine = true;
    soundEngine = null;
    animFrameId = null;
    constructor(soundEngine) {
        this.soundEngine = soundEngine || null;
        this.isPointerFine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
        if (!this.isPointerFine)
            return;
        this.dot = document.getElementById('customCursor') || document.getElementById('cursorDot');
        this.ring = document.getElementById('customCursorFollower') || document.getElementById('cursorRing');
        if (this.ring && !this.ring.querySelector('.cursor-label')) {
            this.label = document.createElement('span');
            this.label.className = 'cursor-label';
            this.ring.appendChild(this.label);
        }
        else if (this.ring) {
            this.label = this.ring.querySelector('.cursor-label');
        }
        if (this.dot && this.ring) {
            this.bindEvents();
            this.startLoop();
        }
    }
    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (!this.isHovered) {
                this.targetX = this.mouseX;
                this.targetY = this.mouseY;
            }
            if (this.dot) {
                this.dot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0) translate(-50%, -50%)`;
            }
        });
        document.addEventListener('mousedown', () => {
            if (this.ring)
                this.ring.classList.add('cursor-press');
            if (this.soundEngine)
                this.soundEngine.playClick(1900);
        });
        document.addEventListener('mouseup', () => {
            if (this.ring)
                this.ring.classList.remove('cursor-press');
        });
        this.bindHoverElements();
    }
    bindHoverElements() {
        const interactables = document.querySelectorAll('a, button, .pillar-card, .interactive-card, .pyramid-level, .swatch-btn, [data-cursor]');
        interactables.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                this.isHovered = true;
                if (this.ring) {
                    this.ring.classList.add('cursor-active');
                }
                const customCue = el.getAttribute('data-cursor');
                if (this.label && customCue) {
                    this.label.textContent = customCue;
                    this.ring?.classList.add('has-label');
                }
                else if (this.label) {
                    if (el.closest('#wardrobe-chapter') || el.classList.contains('swatch-btn')) {
                        this.label.textContent = 'Drape';
                        this.ring?.classList.add('has-label');
                    }
                    else if (el.closest('#fragrance-chapter') || el.classList.contains('pyramid-level')) {
                        this.label.textContent = 'Inhale';
                        this.ring?.classList.add('has-label');
                    }
                    else if (el.classList.contains('pillar-card')) {
                        this.label.textContent = 'Explore';
                        this.ring?.classList.add('has-label');
                    }
                    else {
                        this.ring?.classList.remove('has-label');
                    }
                }
                // Magnetic effect on small buttons
                if (el.tagName === 'BUTTON' || el.classList.contains('btn') || el.classList.contains('btn-nav-call')) {
                    const rect = el.getBoundingClientRect();
                    this.targetX = rect.left + rect.width / 2;
                    this.targetY = rect.top + rect.height / 2;
                }
                if (this.soundEngine && Math.random() > 0.4) {
                    this.soundEngine.playClick(2400);
                }
            });
            el.addEventListener('mouseleave', () => {
                this.isHovered = false;
                this.targetX = this.mouseX;
                this.targetY = this.mouseY;
                if (this.ring) {
                    this.ring.classList.remove('cursor-active', 'has-label');
                }
                if (this.label) {
                    this.label.textContent = '';
                }
            });
        });
    }
    startLoop() {
        const render = () => {
            // Lerp smoothing (0.16 factor for silk response)
            this.ringX += (this.targetX - this.ringX) * 0.16;
            this.ringY += (this.targetY - this.ringY) * 0.16;
            if (this.ring) {
                this.ring.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0) translate(-50%, -50%)`;
            }
            this.animFrameId = requestAnimationFrame(render);
        };
        render();
    }
    destroy() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
    }
}
