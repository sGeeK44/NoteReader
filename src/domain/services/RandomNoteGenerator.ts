import { NoteHead, Pitch } from './MusicScoreBuilder';

export interface RandomNoteGenerator {
  next(): [Pitch, NoteHead];
}
