import { NoteHead, Pitch } from 'app/domain/services/MusicScoreBuilder';
import { AlphabetNotations } from 'app/domain/services/Notation';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';

export class FakeRandomNoteGenerator implements RandomNoteGenerator {
  private current = 0;
  next(): [Pitch, NoteHead] {
    const nextValue = this.current++;
    if (this.current >= AlphabetNotations.length) {
      this.current = 0;
    }
    return ["4", AlphabetNotations[nextValue]];
  }
}
