import {injectable} from 'inversify';
import {NoteHead} from 'app/domain/services/MusicScoreBuilder';
import {AlphabetNotations} from 'app/domain/services/Notation';
import {RandomNoteGenerator} from 'app/domain/services/RandomNoteGenerator';

@injectable()
export class AndroidRandomNoteGenerator implements RandomNoteGenerator {
  next(): NoteHead {
    const random = Math.floor(Math.random() * AlphabetNotations.length);
    return AlphabetNotations[random];
  }
}
