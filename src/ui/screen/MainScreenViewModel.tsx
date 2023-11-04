import { Dispatch, SetStateAction } from 'react';
import { Clef } from 'app/domain/services/MusicScoreBuilder';
import { Notation } from 'app/domain/services/Notation';
import { RhytmicNote } from 'app/domain/services/RhytmicNote';

export class MainScreenViewModel {
  rhytmics!: RhytmicNote[];
  setRhytmics!: Dispatch<SetStateAction<RhytmicNote[]>>;

  tempo!: string;
  setTempo!: Dispatch<SetStateAction<string>>;

  nbMeasure!: string;
  setNbMeasure!: Dispatch<SetStateAction<string>>;

  clef!: Clef;
  setClef!: Dispatch<SetStateAction<Clef>>;

  notation!: Notation;
  setNotation!: Dispatch<SetStateAction<Notation>>;

  accuracy!: number;
  setAccuracy!: Dispatch<SetStateAction<number>>;

  onTempoChanged(value: string): void {
    const parsed = parseInt(value, 10);
    if (value === '') {
      this.setTempo('');
    }
    if (isNaN(parsed)) {
      return;
    }
    this.setTempo(parsed.toString());
  }

  get notations(): { alphabet: Notation; syllabic: Notation } {
    return {
      alphabet: 'alphabet',
      syllabic: 'syllabic',
    };
  }

  OnNbMeasureChanged(value: string): void {
    const parsed = parseInt(value, 10);
    if (value === '') {
      this.setNbMeasure('');
    }
    if (isNaN(parsed)) {
      return;
    }
    this.setNbMeasure(parsed.toString());
  }

  onSyllabicSelected(): void {
    this.setNotation(this.notations.syllabic);
  }

  get isSyllabicChecked(): 'checked' | 'unchecked' {
    return this.notation === this.notations.syllabic ? 'checked' : 'unchecked';
  }

  onAlphabetSelected(): void {
    this.setNotation(this.notations.alphabet);
  }

  get isAlphabetChecked(): 'checked' | 'unchecked' {
    return this.notation === this.notations.alphabet ? 'checked' : 'unchecked';
  }

  OnRhytmicUnselected(rhytmicNoteFigure: RhytmicNote) {
    const index = this.rhytmics.indexOf(rhytmicNoteFigure);
    this.rhytmics.splice(index, 1);
  }
  OnRhytmicSelected(rhytmicNoteFigure: RhytmicNote) {
    this.rhytmics.push(rhytmicNoteFigure);
  }

  get validTempoOrDefault(): number {
    const parsed = parseInt(this.tempo, 10);
    if (isNaN(parsed)) {
      return 60;
    }
    return parsed;
  }

  get validNbMeasureOrDefault(): number {
    const parsed = parseInt(this.nbMeasure, 10);
    if (isNaN(parsed)) {
      return 6;
    }
    return parsed;
  }

  get validRhytmicsOrDefault(): RhytmicNote[] {
    if (this.rhytmics.length === 0) {
      return ["quarter"];
    }

    return this.rhytmics;
  }
}
