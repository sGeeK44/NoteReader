import { RootStackParamList } from "app/App";
import { NavigationProp } from '@react-navigation/native';
import { Clef } from "app/domain/services/MusicScoreBuilder";
import { Notation } from "app/domain/services/Notation";
import { Notes } from "app/domain/services/Notes";

export class DictationScreenViewModel {
    clef: Clef = 'treble';
    notation: Notation = 'syllabic';
    noteRange: [Notes, Notes] = [this.getMinDefaultNote('treble'), this.getMaxDefaultNote('treble')];
    tempo: string = '60';
    nbMeasure: string = '6';

    onValidate(navigation: NavigationProp<RootStackParamList>) {

    }

    onClefChanged(value: Clef) {
        this.clef = value;
    }

    onNoteRangeChange(noteRange: [Notes, Notes]): void {
        this.noteRange = noteRange;
    }

    onSyllabicSelected(): void {
        this.notation = 'syllabic';
    }

    onAlphabetSelected(): void {
        this.notation = 'alphabet';
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

    onTempoChanged(value: string): void {
        this.tempo = value.replace(/[^0-9]/g, '');
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
}
