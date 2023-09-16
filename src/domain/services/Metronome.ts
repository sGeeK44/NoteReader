export interface Metronome {
  init(name: string): void;
  play(tempo: number): void;
  stop(): void;
}
