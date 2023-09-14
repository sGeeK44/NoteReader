import { injectable } from 'inversify';
import { NoteHead, AlphabetNoteHead } from "app/domain/services/MusicScoreBuilder";
import { RandomNoteGenerator } from "app/domain/services/RandomNoteGenerator";

@injectable()
export class AndroidRandomNoteGenerator implements RandomNoteGenerator {
    next(): NoteHead {
        const random = Math.floor(Math.random() * AlphabetNoteHead.length);
        return AlphabetNoteHead[random];
    }
}