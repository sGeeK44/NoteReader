import {
  NoteHead,
  AlphabetNoteHead,
  SyllabicNoteHead,
  SyllaAlphaMap,
} from './MusicScoreBuilder';

export class NoteHeadChecker {
  isRigthNote(receive: string, expected: NoteHead) {
    if (this.isAlphabet(receive)) {
      return receive === expected;
    }

    const index = SyllabicNoteHead.indexOf(receive);
    const alphabetNote = SyllaAlphaMap.get(SyllabicNoteHead[index]);

    return alphabetNote === expected;
  }

  isAlphabet(value: string): boolean {
    return AlphabetNoteHead.indexOf(value) > -1;
  }
}
