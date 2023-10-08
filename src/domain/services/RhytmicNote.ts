import {NoteDuration} from './MusicScoreBuilder';

export const RhytmicFigures = [
  'whole',
  'half',
  'half-dotted',
  'quarter',
  'quarter-dotted',
  'eighth',
  'eighth-dotted',
  'sixteenth',
  'thirty-seconds',
] as const;
export type RhytmicFigure = (typeof RhytmicFigures)[number];
export const RhytmicFigureDurantionMap = new Map<RhytmicFigure, NoteDuration>([
  ['whole', 1],
  ['half', 2],
  ['half-dotted', 3],
  ['quarter', 4],
  ['quarter-dotted', 6],
  ['eighth', 8],
  ['eighth-dotted', 12],
  ['sixteenth', 16],
  ['thirty-seconds', 32],
]);

export const RhytmicNotes = [
  'whole',
  'half',
  'half-dotted',
  'quarter',
  'double-eighth',
  'eighth-dotted-double',
  'four-double-eighth',
  'quarter-dotted-eighth',
] as const;

export type RhytmicNote = (typeof RhytmicNotes)[number];
export const RhytmicNoteFigureMap = new Map<RhytmicNote, RhytmicFigure[]>([
  ['quarter', ['quarter']],
  ['half', ['half']],
  ['half-dotted', ['half-dotted']],
  ['whole', ['whole']],
  ['double-eighth', ['eighth', 'eighth']],
  ['eighth-dotted-double', ['eighth-dotted', 'sixteenth']],
  ['four-double-eighth', ['sixteenth', 'sixteenth', 'sixteenth', 'sixteenth']],
  ['quarter-dotted-eighth', ['quarter-dotted', 'eighth']],
]);

export function toRhtymicFigures(
  rhytmicNote: RhytmicNote,
): RhytmicFigure[] | undefined {
  return RhytmicNoteFigureMap.get(rhytmicNote);
}

export function toDuration(
  rhytmicFigure: RhytmicFigure,
): NoteDuration | undefined {
  return RhytmicFigureDurantionMap.get(rhytmicFigure);
}
