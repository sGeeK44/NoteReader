import { MusicScore } from 'app/ui/component/MusicScore';
import { Signature } from '../value-object/Signature';

export type Pitch = '4';
export type NoteHead = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
export type NoteDuration = '1' | '2' | '4' | '8' | '16' | '32';
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

export class MusicScoreBuilder {
  build(): MusicScore {
    return {
      clef: 'treble',
      timeSignature: {
        beat: 3,
        duration: '4'
      },
      notes: [
        {
          pitch: '4',
          notehead: 'c',
          duration: '4',
        },
        {
          pitch: '4',
          notehead: 'd',
          duration: '4',
        },
        {
          pitch: '4',
          notehead: 'e',
          duration: '4',
        },
      ],
    };
  }
}
