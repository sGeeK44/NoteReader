import { Clef } from 'app/domain/services/MusicScoreBuilder';
import { Notation } from 'app/domain/services/Notation';
import { RhytmicNote } from 'app/domain/services/RhytmicNote';
import { Notes } from 'app/domain/services/Notes';
import { NavigationProp } from '@react-navigation/core';
import { RootStackParamList } from 'app/App';

export class ReadScreenViewModel {
  clef: Clef = 'treble';
  tempo: string = '60';
  nbMeasure: string = '6';
  notation: Notation = 'syllabic';
  accuracy: number = 500;
  rhytmics: RhytmicNote[] = [];
  noteRange: [Notes, Notes] = [this.getMinDefaultNote('treble'), this.getMaxDefaultNote('treble')];

  onNoteRangeChange(noteRange: [Notes, Notes]): void {
    this.noteRange = noteRange;
  }

  onValidate(navigation: NavigationProp<RootStackParamList>) {
    navigation.navigate('TrainScreen', {
      tempo: this.validTempoOrDefault,
      nbMeasure: this.validNbMeasureOrDefault,
      clef: this.clef,
      notation: this.notation,
      accuracy: this.accuracy,
      rhytmics: this.validRhytmicsOrDefault,
      noteRange: this.noteRange
    });
  }

  onAccuracyChanged(value: number) {
    this.accuracy = value;
  }

  onClefChanged(value: Clef) {
    this.clef = value;
  }

  onTempoChanged(value: string): void {
    this.tempo = value.replace(/[^0-9]/g, '');
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
      this.nbMeasure = '';
    }
    if (isNaN(parsed)) {
      return;
    }
    this.nbMeasure = parsed.toString();
  }

  onSyllabicSelected(): void {
    this.notation = 'syllabic';
  }

  get isSyllabicChecked(): 'checked' | 'unchecked' {
    return this.notation === this.notations.syllabic ? 'checked' : 'unchecked';
  }

  onAlphabetSelected(): void {
    this.notation = 'alphabet';
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

  getMinDefaultNote(clef: Clef): Notes {
    return {
      pitch: clef == 'treble' ? '4' : '2',
      duration: 4,
      notehead: clef == 'treble' ? 'c' : 'd'
    }
  }

  getMaxDefaultNote(clef: Clef): Notes {
    return {
      pitch: clef == 'treble' ? '5' : '4',
      duration: 4,
      notehead: clef == 'treble' ? 'b' : 'c'
    }
  }
}
