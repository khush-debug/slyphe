/**
 * CELESTIA — Sound Engine (Decommissioned / Silent Mode)
 * Audio effects and sound triggers permanently disabled per user direction.
 */

import { SoundEnvelope } from './types.js';

export class SoundEngine {
  constructor() {
    // Silent mode: Audio permanently deactivated
  }

  public toggle(): boolean {
    return false;
  }

  public isSoundActive(): boolean {
    return false;
  }

  public playClick(_freq?: number): void {
    // No-op: Sound effects removed
  }

  public playChime(): void {
    // No-op: Sound effects removed
  }

  public playTone(_envelope?: SoundEnvelope): void {
    // No-op: Sound effects removed
  }
}
