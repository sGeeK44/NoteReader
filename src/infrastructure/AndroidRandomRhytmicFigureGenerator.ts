import { injectable } from 'inversify';
import {
  RhytmicNote,
  toDuration,
  toRhtymicFigures,
} from 'app/domain/services/RhytmicNote';
import { RandomRhytmicNoteGenerator } from 'app/domain/services/RandomRhytmicNoteGenerator';
import { NoteDuration } from 'app/domain/services/MusicScoreBuilder';
import { toBeatValue } from 'app/domain/services/Beat';

@injectable()
export class AndroidRandomRhytmicNoteGenerator
  implements RandomRhytmicNoteGenerator {
  constructor(private available: RhytmicNote[]) {
  }

  next(maxDuration: number, timeForUnit: NoteDuration): RhytmicNote {
    const possible = this.available.filter(
      note =>
        (toRhtymicFigures(note)?.reduce(
          (sum, rhytmicFigure) =>
            sum + toBeatValue(toDuration(rhytmicFigure) ?? 1, timeForUnit),
          0,
        ) ?? 0) <= maxDuration,
    );
    const random = Math.floor(Math.random() * possible.length);
    return possible[random];
  }
}
