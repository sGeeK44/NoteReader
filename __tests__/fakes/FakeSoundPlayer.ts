import {Metronome} from '../../src/domain/services/Metronome';

export class FakeSoundPlayer implements Metronome {
  init(_name: string): void {
    // do nothing.
  }
  play(_tempo: number): void {
    // do nothing.
  }
  stop(): void {
    // do nothing
  }
}
