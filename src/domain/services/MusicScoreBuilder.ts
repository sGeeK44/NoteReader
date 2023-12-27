import { Signature } from '../value-object/Signature';
import { Beat, toBeatValue } from './Beat';
import { AlphabetNotations } from './Notation';
import { Notes } from './Notes';
import { RandomNoteGenerator } from './RandomNoteGenerator';
import { RandomRhytmicNoteGenerator } from './RandomRhytmicNoteGenerator';
import { toDuration, toRhtymicFigures } from './RhytmicNote';

export type Pitch = '1' | '2' | '3' | '4' | '5' | '6';
export type NoteHead = (typeof AlphabetNotations)[number];
export type NoteDuration = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 32;
export type Clef = 'treble' | 'bass';
export interface MusicScore {
  clef: Clef;
  timeSignature: Signature;
  measures: Measure[];
}

export interface Measure {
  notes: Notes[];
}

export interface Settings {
  clef: Clef;
  measure: number;
  timeSignature: {
    beat: Beat;
    duration: NoteDuration;
  };
}

export class MusicScoreBuilder {
  constructor(
    private randomNoteGenerator: RandomNoteGenerator,
    private randomRhytmicNoteGenerator: RandomRhytmicNoteGenerator,
  ) { }

  build(settings: Settings): MusicScore {
    const measureBuilder = new MeasureBuilder(
      this.randomNoteGenerator,
      this.randomRhytmicNoteGenerator,
    );

    return {
      clef: settings.clef,
      timeSignature: {
        beat: settings.timeSignature.beat,
        duration: settings.timeSignature.duration,
      },
      measures: [...Array(settings.measure)].map(() =>
        measureBuilder.build(settings.timeSignature),
      ),
    };
  }
}

export class MeasureBuilder {
  constructor(
    private randomNoteGenerator: RandomNoteGenerator,
    private randomRhytmicNoteGenerator: RandomRhytmicNoteGenerator,
  ) { }

  build(signature: { beat: Beat; duration: NoteDuration }): Measure {
    const result = {
      notes: [] as Notes[],
    };
    let total = 0;
    do {
      const notes = this.buidlNote(signature.beat - total, signature);
      result.notes.push(...notes);
      total += this.sumDuration(notes, signature);
    } while (total < signature.beat);

    return result;
  }

  private sumDuration(notes: Notes[], signature: Signature): number {
    return notes.reduce(
      (sum, note) => sum + toBeatValue(note.duration, signature.duration),
      0,
    );
  }

  private buidlNote(beatRemaining: number, signature: Signature): Notes[] {
    const rhytmicNote = this.randomRhytmicNoteGenerator.next(
      beatRemaining,
      signature.duration,
    );

    return (
      toRhtymicFigures(rhytmicNote)?.map(rhytmicFigure => {
        return {
          pitch: '4',
          notehead: this.randomNoteGenerator.next(),
          duration: toDuration(rhytmicFigure) ?? 1,
        } as Notes;
      }) ?? []
    );
  }
}
