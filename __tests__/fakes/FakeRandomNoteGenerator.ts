import { NoteHead, NoteHeadValues } from "app/domain/services/MusicScoreBuilder";
import { RandomNoteGenerator } from "app/domain/services/RandomNoteGenerator";

export class FakeRandomNoteGenerator implements RandomNoteGenerator {
    private current: number = 0;
    next(): NoteHead {
        const nextValue = this.current++;
        if (this.current >= NoteHeadValues.length) {
            this.current = 0;
        }
        return NoteHeadValues[nextValue];
    }
}