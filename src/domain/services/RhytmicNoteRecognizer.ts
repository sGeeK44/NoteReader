import {Measure, Notes} from 'app/domain/services/MusicScoreBuilder';
import {
  RhytmicNoteFigureMap,
  toDuration,
} from 'app/domain/services/RhytmicNote';

export class RhytmicNoteRecognizer {
  toRhytmicNote(measure: Measure): Notes[][] {
    const result: Notes[][] = [];
    for (let i = 0; i < measure.notes.length; i++) {
      let potentialRhtymic: Notes[] = [];
      RhytmicNoteFigureMap.forEach(_ => {
        for (let j = 0; j < _.length; j++) {
          const note = measure.notes[i + j];
          if (note.duration === toDuration(_[j])) {
            potentialRhtymic.push(note);
          } else {
            potentialRhtymic = [];
            break;
          }
        }
        if (potentialRhtymic.length > 0) {
          i += _.length - 1;
          result.push(potentialRhtymic);
        }
      });
    }
    return result;
  }
}
