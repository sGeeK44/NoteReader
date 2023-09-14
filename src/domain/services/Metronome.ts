import { Symbols } from 'app/config/symbols';
import { inject } from 'inversify';
import { SoundPlayer } from './SoundPlayer';
import { Tempo } from './Tempo';

export default class Metronome {
  intervalId: NodeJS.Timeout | undefined;
  tempo: Tempo;

  constructor(@inject(Symbols.SoundPlayer) private soundPlayer: SoundPlayer) {
    this.tempo = new Tempo(60);
    soundPlayer.init('baguettes.mp3');
  }

  startPlay(): void {
    this.intervalId = setInterval(() => {
      this.soundPlayer.play();
    }, this.tempo.toBpMs());
  }

  stopPlay(): void {
    clearInterval(this.intervalId);
  }

  setNewTempo(tempo: Tempo) {
    this.tempo = tempo;
  }
}
