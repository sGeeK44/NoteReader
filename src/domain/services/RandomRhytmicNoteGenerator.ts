import {NoteDuration} from './MusicScoreBuilder';
import {RhytmicNote} from './RhytmicNote';

export interface RandomRhytmicNoteGenerator {
  next(maxBeat: number, timeForUnit: NoteDuration): RhytmicNote;
}
