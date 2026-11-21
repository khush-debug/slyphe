/**
 * CELESTIA — Interactive Tactile Fabric Physics Simulation
 * Real-time canvas physics simulating Italian virgin wool & mulberry silk weave deformation,
 * ripple response on drag/hover, and specular thread luster.
 */
export class FabricSimulator {
    canvas = null;
    ctx = null;
    animId = null;
    cols = 28;
    rows = 18;
    points = [];
    mouseX = -1000;
    mouseY = -1000;
    isMouseDown = false;
    activeFabricType = 'wool-silk';
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas)
            return;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx)
            return;
        this.resize();
        this.initPoints();
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
    initPoints() {
        if (!this.canvas)
            return;
        const rect = this.canvas.getBoundingClientRect();
        const cellW = rect.width / (this.cols - 1);
        const cellH = rect.height / (this.rows - 1);
        this.points = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * cellW;
                const y = r * cellH;
                this.points.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
            }
        }
    }
    setFabricType(type) {
        this.activeFabricType = type;
        // Agitate points on change to show tactile reaction
        this.points.forEach((p, i) => {
            p.vx += (Math.random() - 0.5) * 8;
            p.vy += (Math.random() - 0.5) * 8;
        });
    }
    bindEvents() {
        if (!this.canvas)
            return;
        window.addEventListener('resize', () => {
            this.resize();
            this.initPoints();
        });
        const getPos = (e) => {
            if (!this.canvas)
                return { x: 0, y: 0 };
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };
        this.canvas.addEventListener('mousemove', (e) => {
            const pos = getPos(e);
            this.mouseX = pos.x;
            this.mouseY = pos.y;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
            this.isMouseDown = false;
        });
        this.canvas.addEventListener('mousedown', () => {
            this.isMouseDown = true;
        });
        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const pos = getPos(e.touches[0]);
                this.mouseX = pos.x;
                this.mouseY = pos.y;
            }
        }, { passive: true });
    }
    animate = () => {
        if (!this.ctx || !this.canvas)
            return;
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        // Physics parameters based on fabric type
        const spring = this.activeFabricType === 'silk-crepe' ? 0.08 : 0.12;
        const friction = this.activeFabricType === 'silk-crepe' ? 0.88 : 0.84;
        const forceRadius = this.isMouseDown ? 120 : 75;
        const forcePower = this.isMouseDown ? 18 : 6;
        // Update point positions with elastic spring mechanics
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            const dx = this.mouseX - p.x;
            const dy = this.mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < forceRadius && dist > 0) {
                const angle = Math.atan2(dy, dx);
                const push = ((forceRadius - dist) / forceRadius) * forcePower;
                p.vx -= Math.cos(angle) * push;
                p.vy -= Math.sin(angle) * push;
            }
            // Spring to original weave lattice
            const oxDiff = p.ox - p.x;
            const oyDiff = p.oy - p.y;
            p.vx += oxDiff * spring;
            p.vy += oyDiff * spring;
            p.vx *= friction;
            p.vy *= friction;
            p.x += p.vx;
            p.y += p.vy;
        }
        // Render woven threads with subtle silk sheen
        const isNocturne = document.documentElement.getAttribute('data-theme') === 'dark';
        const warpColor = isNocturne ? 'rgba(235, 222, 216, 0.22)' : 'rgba(26, 26, 24, 0.15)';
        const weftColor = isNocturne ? 'rgba(235, 222, 216, 0.12)' : 'rgba(26, 26, 24, 0.08)';
        this.ctx.lineWidth = 1;
        // Draw warp (horizontal lines)
        for (let r = 0; r < this.rows; r++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = warpColor;
            for (let c = 0; c < this.cols; c++) {
                const p = this.points[r * this.cols + c];
                if (c === 0) {
                    this.ctx.moveTo(p.x, p.y);
                }
                else {
                    this.ctx.lineTo(p.x, p.y);
                }
            }
            this.ctx.stroke();
        }
        // Draw weft (vertical lines)
        for (let c = 0; c < this.cols; c++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = weftColor;
            for (let r = 0; r < this.rows; r++) {
                const p = this.points[r * this.cols + c];
                if (r === 0) {
                    this.ctx.moveTo(p.x, p.y);
                }
                else {
                    this.ctx.lineTo(p.x, p.y);
                }
            }
            this.ctx.stroke();
        }
        // Draw luminous drape nodes at key intersections
        this.ctx.fillStyle = isNocturne ? 'rgba(255, 240, 230, 0.45)' : 'rgba(40, 83, 195, 0.4)';
        for (let i = 0; i < this.points.length; i += 3) {
            const p = this.points[i];
            const speed = Math.abs(p.vx) + Math.abs(p.vy);
            if (speed > 0.4) {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, Math.min(speed * 0.8, 3.5), 0, Math.PI * 2);
                this.ctx.fill();
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
