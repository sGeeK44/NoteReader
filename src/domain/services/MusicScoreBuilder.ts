import { Symbols } from 'app/config/symbols';
import { inject } from 'inversify';
import { MusicScoreView } from 'app/ui/component/MusicScoreView';
import { Signature } from '../value-object/Signature';
import { RandomNoteGenerator } from './RandomNoteGenerator';

export type Pitch = '4';
export const NoteHeadValues = ["a", "b", "c", "d", "f", "e", "g"] as const;
export type NoteHead = (typeof NoteHeadValues)[number];
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
  notes: Notes[];
}

export interface Settings {
  clef?: Clef,
  measure?: number,
  timeSignature?: {
    beat?: Beat,
    duration?: NoteDuration
  },
}

export class MusicScoreBuilder {

  constructor(private randomNoteGenerator: RandomNoteGenerator) {
  }

  build(settings?: Settings): MusicScore {
    const trustedSettings = {
      clef: settings?.clef ?? 'treble',
      measure: settings?.measure ?? 1,
      timeSignature: {
        beat: settings?.timeSignature?.beat ?? 4,
        duration: settings?.timeSignature?.duration ?? 4
      },
    }

    return {
      clef: 'treble',
      timeSignature: {
        beat: trustedSettings.timeSignature.beat,
        duration: trustedSettings.timeSignature.duration
      },
      notes: [...Array(trustedSettings.measure * 4)].map(() => {
        return {
          pitch: '4',
          notehead: this.randomNoteGenerator.next(),
          duration: 4,
        }
      }
      )
    };
  }
}
