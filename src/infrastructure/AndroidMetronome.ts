import { Metronome as MetronomeService } from 'app/domain/services/Metronome';
import { injectable } from 'inversify';
import { NativeModules } from 'react-native';

const { Metronome } = NativeModules;

@injectable()
export class AndroidMetronome implements MetronomeService {
  init(name: string): void {
    Metronome.load(name);
  }

  play(tempo: number): void {
    Metronome.play(tempo);
  }

  stop() {
    Metronome.stop();
  }
}
