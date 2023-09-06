import {SoundPlayer} from '../../src/domain/services/SoundPlayer';

export class FakeSoundPlayer implements SoundPlayer {
  init(_name: string): void {
    // do nothing.
  }
  play(): void {
    // do nothing.
  }
}
