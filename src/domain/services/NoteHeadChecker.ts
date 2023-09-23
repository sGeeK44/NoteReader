import {
  NoteHead,
  AlphabetNotation,
  SyllabicNotation,
  SyllaAlphaMap,
} from './MusicScoreBuilder';

export class NoteHeadChecker {
  isRigthNote(receive: string, expected: NoteHead) {
    if (this.isAlphabet(receive)) {
      return receive === expected;
    }

    const index = SyllabicNotation.indexOf(receive);
    const alphabetNote = SyllaAlphaMap.get(SyllabicNotation[index]);

    return alphabetNote === expected;
  }

  isAlphabet(value: string): boolean {
    return AlphabetNotation.indexOf(value) > -1;
  }
}
