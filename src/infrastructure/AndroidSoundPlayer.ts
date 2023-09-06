import {SoundPlayer} from 'app/domain/services/SoundPlayer';
import {injectable} from 'inversify';
import Sound from 'react-native-sound';

@injectable()
export default class AndroidSoundPlayer implements SoundPlayer {
  sound: Sound | undefined;

  constructor() {
    Sound.setCategory('Playback');
  }

  init(name: string): void {
    this.sound = new Sound(name, Sound.MAIN_BUNDLE);
  }

  play(): void {
    this.sound?.play();
  }
}
