/**
 * CELESTIA — Magnetic Cursor Engine
 * Smooth Lerp follower with magnetic pull toward primary buttons and interactive elements.
 */
export class MagneticCursor {
    cursor = null;
    follower = null;
    mouseX = -100;
    mouseY = -100;
    followerX = -100;
    followerY = -100;
    isPointerFine = true;
    soundEngine = null;
    animationFrameId = null;
    constructor(soundEngine) {
        this.soundEngine = soundEngine || null;
        this.isPointerFine = window.matchMedia('(pointer: fine)').matches;
        if (!this.isPointerFine)
            return;
        this.cursor = document.getElementById('customCursor');
        this.follower = document.getElementById('customCursorFollower');
        if (this.cursor && this.follower) {
            this.bindEvents();
            this.startLoop();
        }
    }
    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (this.cursor) {
                this.cursor.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0) translate(-50%, -50%)`;
            }
        }, { passive: true });
        // Interactive element detection
        this.attachInteractiveListeners();
        // Magnetic pull on primary buttons
        this.attachMagneticPull();
    }
    attachInteractiveListeners() {
        const targets = document.querySelectorAll('a, button, .pillar-card, .service-chip, .time-chip, .pyramid-level, .journal-essay-card, [data-open-booking]');
        targets.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
                if (this.soundEngine) {
                    this.soundEngine.playClick(2400);
                }
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }
    attachMagneticPull() {
        const magneticElements = document.querySelectorAll('.btn-primary-blue, .btn-white-pill, .btn-nav-call');
        magneticElements.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.18;
                const deltaY = (e.clientY - centerY) * 0.18;
                btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0, 0, 0)';
            });
        });
    }
    startLoop() {
        const render = () => {
            this.followerX += (this.mouseX - this.followerX) * 0.18;
            this.followerY += (this.mouseY - this.followerY) * 0.18;
            if (this.follower) {
                this.follower.style.transform = `translate3d(${this.followerX}px, ${this.followerY}px, 0) translate(-50%, -50%)`;
            }
            this.animationFrameId = requestAnimationFrame(render);
        };
        render();
    }
    destroy() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}
