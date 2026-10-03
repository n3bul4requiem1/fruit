import { SoundTheme } from '../types/calculator';

class AeroSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.55;
  private soundTheme: SoundTheme = 'calm';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setTheme(theme: SoundTheme) {
    this.soundTheme = theme;
  }

  public getTheme(): SoundTheme {
    return this.soundTheme;
  }

  private triggerHaptic(type: 'tap' | 'result' | 'error' = 'tap') {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'tap') {
          navigator.vibrate?.(10);
        } else if (type === 'result') {
          navigator.vibrate?.([15, 30, 25, 40]);
        } else if (type === 'error') {
          navigator.vibrate?.([30, 30]);
        }
      } catch {
        // Ignore vibration errors if not supported
      }
    }
  }

  /**
   * Sound for number keys (0-9, .):
   * Soft, peaceful, gentle water drop ("calminho")
   */
  public playNumber(digit?: string) {
    this.triggerHaptic('tap');
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, t);
    masterGain.connect(this.ctx.destination);

    if (this.soundTheme === 'calm') {
      // Very gentle, warm, rounded, calming water droplet (lowpass filtered, soft attack, zero harshness)
      const baseFreq = 340 + (digit ? (parseInt(digit, 10) || 5) * 16 : Math.random() * 80);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.85, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, t + 0.05);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, t);
      filter.Q.setValueAtTime(1.5, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.65, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + 0.095);
    } else if (this.soundTheme === 'aqua') {
      // Natural water drop / bubble pop
      const baseFreq = 420 + (digit ? (parseInt(digit, 10) || 5) * 26 : Math.random() * 120);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.75, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, t + 0.045);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 1.1, t);
      filter.Q.setValueAtTime(3.0, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.7, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(t);
      osc.stop(t + 0.085);
    } else if (this.soundTheme === 'vista') {
      // Crisp Aero glass tick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(500, t + 0.04);

      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.05);
    } else {
      // Y2K Soft pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const freq = 550 + Math.random() * 60;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.setValueAtTime(freq * 1.35, t + 0.02);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  /**
   * Sound for operators (+, -, *, /, %, sqrt):
   * Calm, soft, gentle wooden/glass kalimba tap
   */
  public playOperator() {
    this.triggerHaptic('tap');
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, t);
    masterGain.connect(this.ctx.destination);

    if (this.soundTheme === 'calm') {
      // Gentle warm kalimba chime (soft harmonic sine waves, warm decay)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, t); // D5
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.0, t); // A5

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.6, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.19);
      osc2.stop(t + 0.19);
    } else if (this.soundTheme === 'aqua' || this.soundTheme === 'vista') {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1760, t);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2640, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.7, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.12);
      osc2.stop(t + 0.12);
    } else {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(780, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.06);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.085);
    }
  }

  /**
   * Sound for Result (=):
   * Deeply calming, serene, peaceful ambient water harp / Rhodes chime chord!
   */
  public playResult() {
    this.triggerHaptic('result');
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.45, t);
    masterGain.connect(this.ctx.destination);

    if (this.soundTheme === 'calm') {
      // Warm, tranquil, peaceful water chord: C4, G4, C5, E5, G5, B5
      // Meditative, soft attack, long tranquil resonance
      const notes = [261.63, 392.0, 523.25, 659.25, 783.99, 987.77];
      const delays = [0, 0.05, 0.1, 0.15, 0.2, 0.25];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteT = t + delays[idx];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteT);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, noteT);

        const duration = 0.7 + idx * 0.1;

        gain.gain.setValueAtTime(0.0001, noteT);
        gain.gain.linearRampToValueAtTime(0.32, noteT + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteT + duration);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(masterGain);

        osc.start(noteT);
        osc.stop(noteT + duration + 0.02);
      });
    } else {
      // Crystal water arpeggio
      const notes = [1046.5, 1318.51, 1567.98, 1975.53, 2093.0];
      const delays = [0, 0.04, 0.08, 0.12, 0.16];

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteTime = t + delays[i];
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        const decayTime = 0.45 + i * 0.08;

        noteGain.gain.setValueAtTime(0.001, noteTime);
        noteGain.gain.linearRampToValueAtTime(0.4, noteTime + 0.006);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + decayTime);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(noteTime);
        osc.stop(noteTime + decayTime + 0.02);
      });
    }
  }

  /**
   * Sound for Clear (C / AC):
   * Soft calming water stream
   */
  public playClear() {
    this.triggerHaptic('tap');
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, t);
    masterGain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.55, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  /**
   * Sound for Backspace:
   * Gentle mini water drop
   */
  public playBackspace() {
    this.triggerHaptic('tap');
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.3, t);
    masterGain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.04);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Sound for Error
   */
  public playError() {
    this.triggerHaptic('error');
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, t);
    masterGain.connect(this.ctx.destination);

    [0, 0.08].forEach((delay, idx) => {
      if (!this.ctx) return;
      const noteT = t + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 190 : 160, noteT);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, noteT);

      gain.gain.setValueAtTime(0.4, noteT);
      gain.gain.exponentialRampToValueAtTime(0.001, noteT + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(noteT);
      osc.stop(noteT + 0.08);
    });
  }

  public playBubblePop(combo: number = 0) {
    this.triggerHaptic('tap');
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.38, t);
    masterGain.connect(this.ctx.destination);

    // Pentatonic scale pitch steps for combos (C5, D5, E5, G5, A5, C6...)
    const comboPitches = [1, 1.12, 1.25, 1.4, 1.6, 1.8, 2.0];
    const pitchMul = comboPitches[Math.min(combo, comboPitches.length - 1)] || 1;

    // 1. Primary aquatic suction "bloop/pop"
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const baseFreq = (460 + Math.random() * 80) * pitchMul;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 0.75, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.1, t + 0.038);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq * 1.3, t);
    filter.Q.setValueAtTime(2.2, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.65, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.07);

    // 2. Secondary crystalline glass sparkle glint (Aqua sheen)
    const sparkleOsc = this.ctx.createOscillator();
    const sparkleGain = this.ctx.createGain();

    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(baseFreq * 3.2, t);
    sparkleOsc.frequency.exponentialRampToValueAtTime(baseFreq * 4.5, t + 0.03);

    sparkleGain.gain.setValueAtTime(0.18, t);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(masterGain);

    sparkleOsc.start(t);
    sparkleOsc.stop(t + 0.055);
  }

  public playMemory() {
    this.triggerHaptic('tap');
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.3, t);
    masterGain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t); // E5
    osc.frequency.setValueAtTime(880.0, t + 0.03); // A5

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.095);
  }
}

export const soundEngine = new AeroSoundEngine();
