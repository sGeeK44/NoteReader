import { describe, it, expect } from '@jest/globals';
import { MusicScoreBuilder } from '../../../src/domain/services/MusicScoreBuilder';

describe('MusicScoreBuilder', () => {
  it('default value', () => {
    const musicScoreBuilder = new MusicScoreBuilder();

    const score = musicScoreBuilder.build();

    expect(score).toStrictEqual({
      clef: 'treble',
      timeSignature: {
        beat: 3,
        duration: '4',
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
    });
  });
});
