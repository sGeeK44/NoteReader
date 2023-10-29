import { Signature } from '../value-object/Signature';
import { Measure, NoteDuration } from './MusicScoreBuilder';

export type Beat = 1 | 2 | 3 | 4 | 6 | 9 | 12;

export function toBeatValue(
  noteDurations: NoteDuration,
  timeUnit: NoteDuration,
): number {
  if (timeUnit === noteDurations) {
    return 1;
  }
  if (noteDurations === 3) {
    return toBeatValue(2, timeUnit) + toBeatValue(4, timeUnit);
  }
  if (noteDurations === 6) {
    return toBeatValue(4, timeUnit) + toBeatValue(8, timeUnit);
  }
  if (noteDurations === 12) {
    return toBeatValue(8, timeUnit) + toBeatValue(16, timeUnit);
  }
  if (noteDurations > timeUnit) {
    return toBeatValue(noteDurations, (timeUnit * 2) as NoteDuration) / 2;
  }

  return toBeatValue(noteDurations, (timeUnit / 2) as NoteDuration) * 2;
}

export function countBeatBefore(timeUnit: NoteDuration, measure: Measure, noteIndex: number): number {
  let result = 0;
  for (let i = 0; i < noteIndex; i++) {
    result += toBeatValue(measure.notes[i].duration, timeUnit);
  }
  return result;
}
