/**
 * CELESTIA — Sound Engine (Decommissioned / Silent Mode)
 * Audio effects and sound triggers permanently disabled per user direction.
 */
export class SoundEngine {
    constructor() {
        // Silent mode: Audio permanently deactivated
    }
    toggle() {
        return false;
    }
    isSoundActive() {
        return false;
    }
    playClick(_freq) {
        // No-op: Sound effects removed
    }
    playChime() {
        // No-op: Sound effects removed
    }
    playTone(_envelope) {
        // No-op: Sound effects removed
    }
}
