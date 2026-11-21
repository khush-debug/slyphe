/**
 * CELESTIA — Typed Web Audio API Synthesizer
 * Subtle, high-end tactile acoustic feedback for clicks, hovers, and booking confirmations.
 */
export class SoundEngine {
    ctx = null;
    isMuted = true;
    masterGain = null;
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
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
        }
        if (!this.isMuted) {
            this.playChime();
        }
        return !this.isMuted;
    }
    isSoundActive() {
        return !this.isMuted;
    }
    playClick(freq = 1800) {
        if (this.isMuted)
            return;
        this.initContext();
        if (!this.ctx || !this.masterGain)
            return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + 0.04);
            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.045);
        }
        catch {
            // Audio playback safeguard
        }
    }
    playChime() {
        if (this.isMuted)
            return;
        this.initContext();
        if (!this.ctx || !this.masterGain)
            return;
        const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        chords.forEach((freq, idx) => {
            if (!this.ctx || !this.masterGain)
                return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.06 + 0.45);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(this.ctx.currentTime + idx * 0.06);
            osc.stop(this.ctx.currentTime + idx * 0.06 + 0.5);
        });
    }
    playTone(envelope) {
        if (this.isMuted)
            return;
        this.initContext();
        if (!this.ctx || !this.masterGain)
            return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = envelope.type;
            osc.frequency.setValueAtTime(envelope.frequency, this.ctx.currentTime);
            const durSec = envelope.durationMs / 1000;
            gain.gain.setValueAtTime(envelope.gain, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + durSec);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + durSec);
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
