import {RhytmicNote} from 'app/domain/services/RhytmicNote';
import {RandomRhytmicNoteGenerator} from 'app/domain/services/RandomRhytmicNoteGenerator';

export class FixRandomRhytmicNoteGenerator
  implements RandomRhytmicNoteGenerator
{
  constructor(private rhytmicNote: RhytmicNote) {}
  next(_maxDuration: number): RhytmicNote {
    return this.rhytmicNote;
  }
}
