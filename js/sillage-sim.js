/**
 * CELESTIA — Interactive Sillage & Olfactory Diffusion Simulation
 * Canvas particle physics simulating fragrance particle dispersion, atmospheric air currents,
 * and sillage projection radius.
 */
export class SillageSimulator {
    canvas = null;
    ctx = null;
    animId = null;
    particles = [];
    mouseX = -1000;
    mouseY = -1000;
    intensity = 1.0;
    currentTier = 'top';
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas)
            return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx)
            return;
        this.resize();
        this.bindEvents();
        this.animate();
    }
    resize() {
        if (!this.canvas)
            return;
        const rect = this.canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        if (this.ctx) {
            this.ctx.scale(dpr, dpr);
        }
    }
    setTier(tier) {
        this.currentTier = tier;
    }
    setIntensity(val) {
        this.intensity = Math.max(0.2, Math.min(val, 2.5));
    }
    spawnParticle() {
        if (!this.canvas)
            return;
        const rect = this.canvas.getBoundingClientRect();
        const cx = rect.width * 0.5;
        const cy = rect.height * 0.65;
        // Hues: Top = golden citrus sun, Heart = pale peony rose, Base = warm sandalwood amber
        const colors = {
            top: 'rgba(235, 195, 120, ',
            heart: 'rgba(240, 185, 190, ',
            base: 'rgba(195, 140, 95, ',
        };
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.3 + Math.random() * 0.8) * this.intensity;
        const spread = (Math.random() - 0.5) * 80;
        this.particles.push({
            x: cx + spread,
            y: cy + (Math.random() - 0.5) * 40,
            vx: Math.cos(angle) * speed * 0.5 + (Math.random() - 0.5) * 0.4,
            vy: -Math.abs(Math.sin(angle) * speed) - 0.4, // Ascend upward like warm vapor
            size: 1.5 + Math.random() * 3.5,
            alpha: 0,
            life: 0,
            maxLife: 120 + Math.random() * 100,
            hue: colors[this.currentTier] || colors.top,
        });
    }
    bindEvents() {
        if (!this.canvas)
            return;
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
        });
    }
    animate = () => {
        if (!this.ctx || !this.canvas)
            return;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        // Spawn rate proportional to intensity
        if (this.particles.length < 120 * this.intensity && Math.random() < 0.65 * this.intensity) {
            this.spawnParticle();
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life++;
            // Fade in then fade out gently
            const progress = p.life / p.maxLife;
            if (progress < 0.25) {
                p.alpha = progress / 0.25;
            }
            else {
                p.alpha = Math.max(0, 1 - (progress - 0.25) / 0.75);
            }
            // Cursor turbulence: part around the mouse
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80 && dist > 0) {
                const force = ((80 - dist) / 80) * 1.8;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
            // Gentle natural Brownian air wobble
            p.vx += (Math.random() - 0.5) * 0.08;
            p.x += p.vx;
            p.y += p.vy;
            // Render glowing soft aura particle
            this.ctx.beginPath();
            const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
            grad.addColorStop(0, `${p.hue}${p.alpha * 0.7})`);
            grad.addColorStop(1, `${p.hue}0)`);
            this.ctx.fillStyle = grad;
            this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            if (p.life >= p.maxLife) {
                this.particles.splice(i, 1);
            }
        }
        this.animId = requestAnimationFrame(this.animate);
    };
    destroy() {
        if (this.animId) {
            cancelAnimationFrame(this.animId);
        }
    }
}
