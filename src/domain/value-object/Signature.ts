import {NoteDuration} from '../services/MusicScoreBuilder';
import {Beat} from '../services/Beat';

export type Signature = {
  beat: Beat;
  duration: NoteDuration;
};

export function toString(signature: Signature): string {
  return `${signature.beat}/${signature.duration}`;
}
