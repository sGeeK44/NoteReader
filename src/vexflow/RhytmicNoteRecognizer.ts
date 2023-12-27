import { Notes } from 'app/domain/services/Notes';
import {
  RhytmicFigure,
  RhytmicNoteFigureMap,
  toDuration,
} from 'app/domain/services/RhytmicNote';

export class RhytmicNoteRecognizer {
  toRhytmicNote(notes: Notes[],): number[][] {
    const rhytmicGroup: number[][] = [];
    for (
      let currentNoteIndex = 0;
      currentNoteIndex < notes.length;
      currentNoteIndex++
    ) {
      const [nextIndex, newGroup] = this.findNextRhytmic(
        notes,
        currentNoteIndex,
      );
      rhytmicGroup.push(newGroup);
      currentNoteIndex = nextIndex;
    }
    return rhytmicGroup;
  }

  private findNextRhytmic(
    notes: Notes[],
    currentNoteIndex: number,
  ): [number, number[]] {
    for (const rhytmicNoteMap of RhytmicNoteFigureMap) {
      const [nextNoteIndex, rhtymicFound] = this.checkRhytmic(
        notes,
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
    notes: Notes[],
    rhytmicFigure: RhytmicFigure[],
    currentNoteIndex: number,
  ): [number, number[]] {
    let potentialRhtymic: number[] = [];
    for (let j = 0; j < rhytmicFigure.length; j++) {
      const potentialNextNoteIndex = currentNoteIndex + j;
      const potentialNextNote = notes[potentialNextNoteIndex];

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
