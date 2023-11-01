import {Dispatch, SetStateAction} from 'react';
import {Clef} from 'app/domain/services/MusicScoreBuilder';
import {Notation} from 'app/domain/services/Notation';
import {RhytmicNote} from 'app/domain/services/RhytmicNote';

export class MainScreenViewModel {
  rhytmics!: RhytmicNote[];
  setRhytmics!: Dispatch<SetStateAction<RhytmicNote[]>>;

  tempo: number | undefined;
  setTempo!: Dispatch<SetStateAction<number | undefined>>;

  nbMeasure!: number;
  setNbMeasure!: Dispatch<SetStateAction<number>>;

  clef!: Clef;
  setClef!: Dispatch<SetStateAction<Clef>>;

  notation!: Notation;
  setNotation!: Dispatch<SetStateAction<Notation>>;

  accuracy!: number;
  setAccuracy!: Dispatch<SetStateAction<number>>;

  onTempoChanged(value: string): void {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      this.setTempo(undefined);
      return;
    }
    this.setTempo(parsed);
  }

  get notations(): {alphabet: Notation; syllabic: Notation} {
    return {
      alphabet: 'alphabet',
      syllabic: 'syllabic',
    };
  }

  OnNbMeasureChanged(value: string): void {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      return;
    }
    this.setNbMeasure(parsed);
  }

  onSyllabicSelected(): void {
    this.setNotation(this.notations.syllabic);
  }

  get isSyllabicChecked(): 'checked' | 'unchecked' {
    return this.notation === this.notations.syllabic ? 'checked' : 'unchecked';
  }

  onAlphabetSelected(): void {
    console.log(this.notation);
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
}
