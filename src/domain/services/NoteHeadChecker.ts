import {NoteHead} from './MusicScoreBuilder';
import {
  SyllabicNotations,
  SyllabicNotation,
  AlphabetNotations,
  AlphabetNotation,
  SyllaAlphaMap,
} from './Notation';

export class NoteHeadChecker {
  isRigthNote(receive: string, expected: NoteHead) {
    if (this.isAlphabet(receive)) {
      return receive === expected;
    }

    if (!this.isSyllabic(receive)) {
      return false;
    }

    const index = SyllabicNotations.indexOf(receive as SyllabicNotation);
    const alphabetNote = SyllaAlphaMap.get(SyllabicNotations[index]);

    return alphabetNote === expected;
  }

  isAlphabet(value: string): boolean {
    return AlphabetNotations.includes(value as AlphabetNotation);
  }

  isSyllabic(value: string): boolean {
    return SyllabicNotations.includes(value as SyllabicNotation);
  }
}
