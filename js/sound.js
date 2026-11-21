/**
 * CELESTIA — Typed Web Audio API Synthesizer
 * Subtle, high-end tactile acoustic feedback and generative ambient luxury salon atmosphere.
 */
export class SoundEngine {
    ctx = null;
    isMuted = true;
    masterGain = null;
    ambientGain = null;
    ambientOscillators = [];
    constructor() {
        this.restoreMuteState();
    }
    initContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
                // Ambient Drone Sub-Bus
                this.ambientGain = this.ctx.createGain();
                this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.018, this.ctx.currentTime);
                this.ambientGain.connect(this.masterGain);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    toggle() {
        this.initContext();
        this.isMuted = !this.isMuted;
        this.saveMuteState();
        if (this.masterGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.08, now + 0.3);
        }
        if (!this.isMuted) {
            this.startAmbientAtmosphere();
            this.playChime();
        }
        else {
            this.stopAmbientAtmosphere();
        }
        return !this.isMuted;
    }
    isSoundActive() {
        return !this.isMuted;
    }
    /**
     * Generative atelier ambient bed: warm detuned sine waves evoking an airy, quiet Parisian salon.
     */
    startAmbientAtmosphere() {
        if (!this.ctx || !this.ambientGain || this.isMuted)
            return;
        this.stopAmbientAtmosphere();
        // Harmonics: 108Hz (A2 sub), 216Hz (A3), 324Hz (E4 fifth), 432Hz (Verdi A4 pitch)
        const freqs = [108, 216, 324, 432];
        const now = this.ctx.currentTime;
        freqs.forEach((freq, i) => {
            if (!this.ctx || !this.ambientGain)
                return;
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();
            osc.type = 'sine';
            // Gentle micro-detuning for subtle shimmer
            osc.frequency.setValueAtTime(freq + (i * 0.35 - 0.5), now);
            const level = 0.02 / (i + 1);
            oscGain.gain.setValueAtTime(0, now);
            oscGain.gain.linearRampToValueAtTime(level, now + 2.5);
            osc.connect(oscGain);
            oscGain.connect(this.ambientGain);
            osc.start(now);
            this.ambientOscillators.push(osc);
        });
    }
    stopAmbientAtmosphere() {
        if (this.ambientOscillators.length > 0 && this.ctx) {
            const now = this.ctx.currentTime;
            this.ambientOscillators.forEach(osc => {
                try {
                    osc.stop(now + 0.5);
                }
                catch {
                    // Ignore if already stopped
                }
            });
            this.ambientOscillators = [];
        }
    }
    /**
     * Tactile glass/shutter click for interactive buttons
     */
    playClick(freq = 1800) {
        if (this.isMuted)
            return;
        this.initContext();
        if (!this.ctx || !this.masterGain)
            return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.3, now + 0.035);
            gain.gain.setValueAtTime(0.045, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.04);
        }
        catch {
            // Audio playback safeguard
        }
    }
    /**
     * Crystalline harmonic chime
     */
    playChime() {
        if (this.isMuted)
            return;
        this.initContext();
        if (!this.ctx || !this.masterGain)
            return;
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = this.ctx.currentTime;
        chords.forEach((freq, idx) => {
            if (!this.ctx || !this.masterGain)
                return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            const startAt = now + idx * 0.05;
            osc.frequency.setValueAtTime(freq, startAt);
            gain.gain.setValueAtTime(0.035, startAt);
            gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.45);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(startAt);
            osc.stop(startAt + 0.5);
        });
    }
    /**
     * Play bespoke harmonic note for fragrance and fabric chords
     */
    playTone(envelope) {
        if (this.isMuted)
            return;
        this.initContext();
        if (!this.ctx || !this.masterGain)
            return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = envelope.type;
            osc.frequency.setValueAtTime(envelope.frequency, now);
            const durSec = envelope.durationMs / 1000;
            gain.gain.setValueAtTime(envelope.gain, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + durSec);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + durSec);
        }
        catch {
            // Audio playback safeguard
        }
    }
    saveMuteState() {
        try {
            localStorage.setItem('celestia_sound_active', (!this.isMuted).toString());
        }
        catch {
            // Storage unavailable
        }
    }
    restoreMuteState() {
        try {
            const saved = localStorage.getItem('celestia_sound_active');
            this.isMuted = saved !== 'true';
        }
        catch {
            this.isMuted = true;
        }
    }
}
