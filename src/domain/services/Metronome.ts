import {Symbols} from 'app/config/symbols';
import {inject} from 'inversify';
import {SoundPlayer} from './SoundPlayer';

export default class Metronome {
  intervalId: NodeJS.Timeout | undefined;
  tempo: number;

  constructor(@inject(Symbols.SoundPlayer) private soundPlayer: SoundPlayer) {
    this.tempo = 60;
    soundPlayer.init('baguettes.mp3');
  }

  startPlay(): void {
    this.intervalId = setInterval(() => {
      this.soundPlayer.play();
    }, (this.tempo / 60) * 1000);
  }

  stopPlay(): void {
    clearInterval(this.intervalId);
  }

  setNewTempo(tempo: number) {
    this.tempo = tempo;
  }
}
