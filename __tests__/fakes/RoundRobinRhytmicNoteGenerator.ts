import {
  RhytmicNote,
  RhytmicNotes,
  toDuration,
  toRhtymicFigures,
} from 'app/domain/services/RhytmicNote';
import {RandomRhytmicNoteGenerator} from 'app/domain/services/RandomRhytmicNoteGenerator';
import {toBeatValue} from 'app/domain/services/Beat';
import {NoteDuration} from 'app/domain/services/MusicScoreBuilder';

export class RoundRobinRhytmicNoteGenerator
  implements RandomRhytmicNoteGenerator
{
  private current = 0;

  constructor(private pool: RhytmicNote[] = RhytmicNotes.map(_ => _)) {}

  next(maxDuration: number, timeForUnit: NoteDuration): RhytmicNote {
    const possible = this.pool.filter(
      note =>
        (toRhtymicFigures(note)?.reduce(
          (sum, rhytmicFigure) =>
            sum + toBeatValue(toDuration(rhytmicFigure) ?? 1, timeForUnit),
          0,
        ) ?? 0) <= maxDuration,
    );

    let nextValue = this.current++;
    if (this.current >= possible.length) {
      this.current = 0;
    }
    if (nextValue >= possible.length) {
      nextValue = 0;
    }
    return possible[nextValue];
  }
}
