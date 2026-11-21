/**
 * CELESTIA — Global Navigation, Parallax Depth & Atmosphere Controller
 * Handles header elevation, active route detection, Day/Nocturne salon themes,
 * interactive image tilt parallax, and smooth page transition wipes.
 */
export class NavigationController {
    header = null;
    soundEngine = null;
    soundToggleBtn = null;
    soundStatusText = null;
    themeToggleBtn = null;
    isDark = false;
    constructor(soundEngine) {
        this.soundEngine = soundEngine || null;
        this.header = document.querySelector('.header');
        this.soundToggleBtn = document.getElementById('soundToggleBtn');
        this.soundStatusText = document.getElementById('soundStatusText');
        this.themeToggleBtn = document.getElementById('themeModeToggleBtn');
        this.initHeaderScroll();
        this.initActiveRoute();
        this.initSoundToggle();
        this.initNocturneMode();
        this.initHeroParallax();
        this.initRevealObserver();
        this.initBackToTop();
        this.initSmoothPageTransitions();
    }
    initHeaderScroll() {
        if (!this.header)
            return;
        const onScroll = () => {
            if (window.scrollY > 30) {
                this.header?.classList.add('scrolled');
            }
            else {
                this.header?.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
    initActiveRoute() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href)
                return;
            const isCurrent = (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '')) ||
                (href !== 'index.html' && currentPath.includes(href.replace('.html', '')));
            if (isCurrent) {
                link.classList.add('active');
            }
            else {
                link.classList.remove('active');
            }
        });
    }
    initSoundToggle() {
        if (!this.soundToggleBtn || !this.soundEngine)
            return;
        const isActive = this.soundEngine.isSoundActive();
        if (isActive) {
            this.soundToggleBtn.classList.add('active');
            if (this.soundStatusText)
                this.soundStatusText.textContent = 'SOUND: ON';
        }
        else {
            this.soundToggleBtn.classList.remove('active');
            if (this.soundStatusText)
                this.soundStatusText.textContent = 'SOUND: OFF';
        }
        this.soundToggleBtn.addEventListener('click', () => {
            if (!this.soundEngine)
                return;
            const nowActive = this.soundEngine.toggle();
            if (nowActive) {
                this.soundToggleBtn?.classList.add('active');
                if (this.soundStatusText)
                    this.soundStatusText.textContent = 'SOUND: ON';
            }
            else {
                this.soundToggleBtn?.classList.remove('active');
                if (this.soundStatusText)
                    this.soundStatusText.textContent = 'SOUND: OFF';
            }
        });
    }
    /**
     * Day (Alabaster) vs Nocturne (Midnight Salon) theme switch
     */
    initNocturneMode() {
        try {
            const savedTheme = localStorage.getItem('celestia_salon_theme');
            this.isDark = savedTheme === 'dark';
            document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
        }
        catch {
            this.isDark = false;
        }
        if (this.themeToggleBtn) {
            this.updateThemeButton();
            this.themeToggleBtn.addEventListener('click', () => {
                this.isDark = !this.isDark;
                document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
                try {
                    localStorage.setItem('celestia_salon_theme', this.isDark ? 'dark' : 'light');
                }
                catch {
                    // Storage safeguard
                }
                this.updateThemeButton();
                if (this.soundEngine)
                    this.soundEngine.playClick(2200);
            });
        }
    }
    updateThemeButton() {
        if (!this.themeToggleBtn)
            return;
        const textEl = this.themeToggleBtn.querySelector('.mode-text');
        if (textEl) {
            textEl.textContent = this.isDark ? 'Nocturne' : 'Alabaster';
        }
    }
    /**
     * Interactive 3D Perspective Tilt on Hero Visual Stage
     */
    initHeroParallax() {
        const stage = document.querySelector('.hero-image-frame, .hero-visual-stage');
        if (!stage || !window.matchMedia('(pointer: fine)').matches)
            return;
        const img = stage.querySelector('img');
        if (!img)
            return;
        stage.addEventListener('mousemove', (e) => {
            const rect = stage.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            img.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        stage.addEventListener('mouseleave', () => {
            img.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
        });
    }
    initRevealObserver() {
        const reveals = document.querySelectorAll('.reveal-up');
        if (!reveals.length)
            return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.08 });
        reveals.forEach((el) => observer.observe(el));
    }
    initBackToTop() {
        const backBtn = document.querySelector('.back-to-top-btn');
        backBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    /**
     * Cinematic editorial page transitions (wipe transition on internal link click)
     */
    initSmoothPageTransitions() {
        const links = document.querySelectorAll('a[href$=".html"]');
        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#') || link.target === '_blank')
                    return;
                // Ensure we don't block modifier keys (Cmd, Ctrl, Shift)
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
                    return;
                e.preventDefault();
                document.body.classList.add('page-transitioning');
                if (this.soundEngine)
                    this.soundEngine.playClick(1700);
                setTimeout(() => {
                    window.location.href = href;
                }, 220);
            });
        });
    }
}
