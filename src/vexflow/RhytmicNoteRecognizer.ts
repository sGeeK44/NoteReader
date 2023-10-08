import {Measure} from 'app/domain/services/MusicScoreBuilder';
import {
  RhytmicFigure,
  RhytmicNoteFigureMap,
  toDuration,
} from 'app/domain/services/RhytmicNote';

export class RhytmicNoteRecognizer {
  toRhytmicNote(measure: Measure): number[][] {
    const rhytmicGroup: number[][] = [];
    for (
      let currentNoteIndex = 0;
      currentNoteIndex < measure.notes.length;
      currentNoteIndex++
    ) {
      const [nextIndex, newGroup] = this.findNextRhytmic(
        measure,
        currentNoteIndex,
      );
      rhytmicGroup.push(newGroup);
      currentNoteIndex = nextIndex;
    }
    return rhytmicGroup;
  }

  private findNextRhytmic(
    measure: Measure,
    currentNoteIndex: number,
  ): [number, number[]] {
    for (const rhytmicNoteMap of RhytmicNoteFigureMap) {
      const [nextNoteIndex, rhtymicFound] = this.checkRhytmic(
        measure,
        rhytmicNoteMap[1],
        currentNoteIndex,
      );
      if (nextNoteIndex !== -1) {
        return [nextNoteIndex, rhtymicFound];
      }
    }
    throw new Error('Rhytmic not found. How are you arrived there ?');
  }

  private checkRhytmic(
    measure: Measure,
    rhytmicFigure: RhytmicFigure[],
    currentNoteIndex: number,
  ): [number, number[]] {
    let potentialRhtymic: number[] = [];
    for (let j = 0; j < rhytmicFigure.length; j++) {
      const potentialNextNoteIndex = currentNoteIndex + j;
      const potentialNextNote = measure.notes[potentialNextNoteIndex];

      const nextNoteMatch =
        potentialNextNote.duration === toDuration(rhytmicFigure[j]);
      if (nextNoteMatch) {
        potentialRhtymic.push(potentialNextNoteIndex);
      } else {
        potentialRhtymic = [];
        break;
      }
    }

    const nextNoteIndex =
      potentialRhtymic.length !== 0
        ? currentNoteIndex + rhytmicFigure.length - 1
        : -1;
    return [nextNoteIndex, potentialRhtymic];
  }
}
