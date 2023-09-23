import { injectable } from 'inversify';
import {
  NoteHead,
  AlphabetNotation,
} from 'app/domain/services/MusicScoreBuilder';
import { RandomNoteGenerator } from 'app/domain/services/RandomNoteGenerator';

@injectable()
export class AndroidRandomNoteGenerator implements RandomNoteGenerator {
  next(): NoteHead {
    const random = Math.floor(Math.random() * AlphabetNotation.length);
    return AlphabetNotation[random];
  }
}
