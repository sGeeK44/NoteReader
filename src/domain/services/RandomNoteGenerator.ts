import { NoteHead } from "./MusicScoreBuilder";


export interface RandomNoteGenerator {
    next(): NoteHead
}
