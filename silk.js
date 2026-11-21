/**
 * CELESTIA — Real-time Interactive Silk Simulation
 * Renders ethereal, translucent sheer silk organza in motion
 * Features spring-driven wind dynamics, mouse interaction, and shimmering specular caustics.
 */

export class SilkSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.ribbons = [];
    this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, vx: 0, vy: 0 };
    this.time = 0;
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isHovering = false;
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    const container = this.canvas.parentElement;
    container.addEventListener('mousemove', (e) => this.onMouseMove(e));
    container.addEventListener('mouseenter', () => { this.isHovering = true; });
    container.addEventListener('mouseleave', () => { 
      this.isHovering = false; 
      this.mouse.targetX = -1000;
      this.mouse.targetY = -1000;
    });

    // Touch support
    container.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.targetX = e.touches[0].clientX - rect.left;
        this.mouse.targetY = e.touches[0].clientY - rect.top;
        this.isHovering = true;
      }
    }, { passive: true });

    container.addEventListener('touchend', () => {
      this.isHovering = false;
      this.mouse.targetX = -1000;
      this.mouse.targetY = -1000;
    });

    this.createRibbons();
    this.animate();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.createRibbons();
  }

  createRibbons() {
    this.ribbons = [];
    const ribbonCount = 5; // 5 overlapping sheer silk layers
    const pointsCount = 14;

    for (let r = 0; r < ribbonCount; r++) {
      const points = [];
      const baseY = this.height * (0.35 + r * 0.08);
      const width = this.width;
      
      for (let i = 0; i < pointsCount; i++) {
        const x = (i / (pointsCount - 1)) * (width * 1.3) - width * 0.15;
        // Natural curved sweep from lower-left to upper-center to right
        const arch = Math.sin((i / (pointsCount - 1)) * Math.PI) * (this.height * 0.28);
        const y = baseY - arch + (Math.sin(i * 0.5) * 20);
        
        points.push({
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          mass: 0.8 + (i / pointsCount) * 0.6,
          damping: 0.92,
          speed: 0.0018 + r * 0.0004,
          phase: (i * 0.35) + (r * 1.2),
          amplitude: 28 + r * 8
        });
      }

      // Palette matching the azure sheer silk in the editorial shot
      const palettes = [
        { stroke: 'rgba(195, 222, 245, 0.5)', fill1: 'rgba(215, 235, 252, 0.35)', fill2: 'rgba(190, 218, 240, 0.08)', highlight: 'rgba(255, 255, 255, 0.65)' },
        { stroke: 'rgba(180, 210, 238, 0.45)', fill1: 'rgba(200, 228, 250, 0.28)', fill2: 'rgba(175, 208, 235, 0.05)', highlight: 'rgba(255, 255, 255, 0.55)' },
        { stroke: 'rgba(205, 228, 248, 0.4)',  fill1: 'rgba(225, 240, 255, 0.32)', fill2: 'rgba(195, 220, 242, 0.06)', highlight: 'rgba(255, 255, 255, 0.7)' },
        { stroke: 'rgba(170, 205, 235, 0.35)', fill1: 'rgba(190, 222, 246, 0.22)', fill2: 'rgba(165, 200, 230, 0.04)', highlight: 'rgba(255, 255, 255, 0.5)' },
        { stroke: 'rgba(220, 238, 255, 0.3)',  fill1: 'rgba(230, 244, 255, 0.25)', fill2: 'rgba(200, 225, 245, 0.03)', highlight: 'rgba(255, 255, 255, 0.8)' }
      ];

      this.ribbons.push({
        points,
        color: palettes[r % palettes.length],
        thickness: 45 + r * 15,
        offsetY: r * 12
      });
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.targetX = e.clientX - rect.left;
    this.mouse.targetY = e.clientY - rect.top;
  }

  update() {
    this.time += 0.02;

    // Smooth mouse lerping
    const dx = this.mouse.targetX - this.mouse.x;
    const dy = this.mouse.targetY - this.mouse.y;
    this.mouse.vx = dx * 0.1;
    this.mouse.vy = dy * 0.1;
    this.mouse.x += this.mouse.vx;
    this.mouse.y += this.mouse.vy;

    const mouseDistMax = 180;

    this.ribbons.forEach((ribbon, rIdx) => {
      const pts = ribbon.points;

      for (let i = 0; i < pts.length; i++) {
        const pt = pts[i];

        // 1. Gentle billowing wind wave
        const windX = Math.cos(this.time * pt.speed * 60 + pt.phase) * (pt.amplitude * 0.6);
        const windY = Math.sin(this.time * pt.speed * 80 + pt.phase) * pt.amplitude + 
                      Math.sin(this.time * 0.8 + i * 0.4) * 12;

        const targetX = pt.baseX + windX;
        const targetY = pt.baseY + windY;

        // Spring force towards target wave position
        const fx = (targetX - pt.x) * 0.035;
        const fy = (targetY - pt.y) * 0.035;

        pt.vx += fx;
        pt.vy += fy;

        // 2. Mouse interaction (silky displacement)
        if (this.isHovering) {
          const distToMouse = Math.hypot(pt.x - this.mouse.x, pt.y - this.mouse.y);
          if (distToMouse < mouseDistMax) {
            const force = (1 - distToMouse / mouseDistMax) * 22;
            const angle = Math.atan2(pt.y - this.mouse.y, pt.x - this.mouse.x);
            pt.vx += Math.cos(angle) * force * 0.25;
            pt.vy += Math.sin(angle) * force * 0.25;
          }
        }

        // Apply velocity with damping
        pt.vx *= pt.damping;
        pt.vy *= pt.damping;
        pt.x += pt.vx;
        pt.y += pt.vy;
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Composite mode for sheer organza layering
    this.ctx.globalCompositeOperation = 'source-over';

    this.ribbons.forEach((ribbon, rIdx) => {
      const pts = ribbon.points;
      if (pts.length < 3) return;

      // Draw top edge and bottom edge to create fluid ribbons
      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x, pts[0].y - ribbon.thickness * 0.5);

      for (let i = 1; i < pts.length - 2; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2 - ribbon.thickness * 0.5;
        this.ctx.quadraticCurveTo(pts[i].x, pts[i].y - ribbon.thickness * 0.5, xc, yc);
      }
      this.ctx.quadraticCurveTo(
        pts[pts.length - 2].x, 
        pts[pts.length - 2].y - ribbon.thickness * 0.5, 
        pts[pts.length - 1].x, 
        pts[pts.length - 1].y - ribbon.thickness * 0.5
      );

      // Return along the lower curve
      this.ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y + ribbon.thickness * 0.5);

      for (let i = pts.length - 2; i > 0; i--) {
        const xc = (pts[i].x + pts[i - 1].x) / 2;
        const yc = (pts[i].y + pts[i - 1].y) / 2 + ribbon.thickness * 0.5;
        this.ctx.quadraticCurveTo(pts[i].x, pts[i].y + ribbon.thickness * 0.5, xc, yc);
      }
      this.ctx.quadraticCurveTo(
        pts[1].x, 
        pts[1].y + ribbon.thickness * 0.5, 
        pts[0].x, 
        pts[0].y + ribbon.thickness * 0.5
      );
      this.ctx.closePath();

      // Fluid gradient fill
      const grad = this.ctx.createLinearGradient(0, 0, this.width, this.height);
      grad.addColorStop(0, ribbon.color.fill1);
      grad.addColorStop(0.5, ribbon.color.fill2);
      grad.addColorStop(1, ribbon.color.fill1);
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Subtle edge line
      this.ctx.strokeStyle = ribbon.color.stroke;
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();

      // Delicate silk shimmer spine along center
      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        this.ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      this.ctx.strokeStyle = ribbon.color.highlight;
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();
    });

    // Ambient floating light particles / dust motes
    this.drawMotes();
  }

  drawMotes() {
    if (!this.motes) {
      this.motes = Array.from({ length: 18 }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3 + 0.2,
        speedY: (Math.random() - 0.5) * 0.4 - 0.1,
        alpha: Math.random() * 0.5 + 0.2
      }));
    }

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.motes.forEach(m => {
      m.x += m.speedX;
      m.y += m.speedY;
      if (m.x > this.width) m.x = 0;
      if (m.x < 0) m.x = this.width;
      if (m.y > this.height) m.y = 0;
      if (m.y < 0) m.y = this.height;

      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}
