import { NoteHead, Pitch } from 'app/domain/services/MusicScoreBuilder';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';
import { Notes, getRange } from 'app/domain/services/Notes';

export class AndroidRandomNoteGenerator implements RandomNoteGenerator {
  constructor(private min: Notes, private max: Notes) {
  }

  next(): [Pitch, NoteHead] {
    const range = getRange(this.min, this.max);
    const random = Math.floor(Math.random() * range.length);
    const note = range[random];
    return [note.pitch, note.notehead];
  }
}
