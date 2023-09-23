import { Signature } from '../value-object/Signature';
import { AlphabetNotation } from './Notation';
import { RandomNoteGenerator } from './RandomNoteGenerator';

export type Pitch = '1' | '2' | '3' | '4' | '5' | '6';
export type NoteHead = (typeof AlphabetNotation)[number];
export type NoteDuration = 1 | 2 | 4 | 8 | 16 | 32;
export type Clef = 'treble' | 'bass';
export type Beat = 1 | 2 | 3 | 4 | 6 | 9 | 12;

export interface Notes {
  pitch: Pitch;
  notehead: NoteHead;
  duration: NoteDuration;
}

export interface MusicScore {
  clef: Clef;
  timeSignature: Signature;
  measures: Measure[];
}

export interface Measure {
  notes: Notes[];
}

export interface Settings {
  clef?: Clef;
  measure?: number;
  timeSignature?: {
    beat?: Beat;
    duration?: NoteDuration;
  };
}

export class MusicScoreBuilder {
  constructor(private randomNoteGenerator: RandomNoteGenerator) { }

  build(settings?: Settings): MusicScore {
    const trustedSettings = {
      clef: settings?.clef ?? 'treble',
      measures: settings?.measure ?? 1,
      timeSignature: {
        beat: settings?.timeSignature?.beat ?? 4,
        duration: settings?.timeSignature?.duration ?? 4,
      },
    };

    return {
      clef: trustedSettings.clef,
      timeSignature: {
        beat: trustedSettings.timeSignature.beat,
        duration: trustedSettings.timeSignature.duration,
      },
      measures: [...Array(trustedSettings.measures)].map(() => {
        return {
          notes: [...Array(4)].map(() => {
            return {
              pitch: trustedSettings.clef == 'treble' ? '4' : '2',
              notehead: this.randomNoteGenerator.next(),
              duration: 4,
            };
          }),
        };
      }),
    };
  }
}
