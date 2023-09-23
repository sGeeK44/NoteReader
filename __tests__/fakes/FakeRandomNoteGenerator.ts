import {
  NoteHead,
  AlphabetNotation,
} from 'app/domain/services/MusicScoreBuilder';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';

export class FakeRandomNoteGenerator implements RandomNoteGenerator {
  private current = 0;
  next(): NoteHead {
    const nextValue = this.current++;
    if (this.current >= AlphabetNotation.length) {
      this.current = 0;
    }
    return AlphabetNotation[nextValue];
  }
}
