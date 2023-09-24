import { describe, it, expect } from '@jest/globals';
import { MusicScoreBuilder } from '../../../src/domain/services/MusicScoreBuilder';
import { FakeRandomNoteGenerator } from '../../fakes/FakeRandomNoteGenerator';

describe('MusicScoreBuilder', () => {
  it('default value', () => {
    const musicScoreBuilder = new MusicScoreBuilder(
      new FakeRandomNoteGenerator(),
    );

    const score = musicScoreBuilder.build();

    expect(score).toStrictEqual({
      clef: 'treble',
      timeSignature: {
        beat: 4,
        duration: 4,
      },
      measures: [
        {
          notes: [
            {
              pitch: '4',
              notehead: 'a',
              duration: 4,
            },
            {
              pitch: '4',
              notehead: 'b',
              duration: 4,
            },
            {
              pitch: '4',
              notehead: 'c',
              duration: 4,
            },
            {
              pitch: '4',
              notehead: 'd',
              duration: 4,
            },
          ],
        },
      ],
    });
  });

  it("Override settings", () => {
    const musicScoreBuilder = new MusicScoreBuilder(
      new FakeRandomNoteGenerator(),
    );

    const score = musicScoreBuilder.build({
      clef: "bass",
      measure: 2,
      timeSignature: {
        beat: 2,
        duration: 2,
      }
    });
    expect(score).toStrictEqual({
      clef: 'bass',
      timeSignature: {
        beat: 2,
        duration: 2,
      },
      measures: [
        {
          notes: [
            {
              pitch: '2',
              notehead: 'a',
              duration: 4,
            },
            {
              pitch: '2',
              notehead: 'b',
              duration: 4,
            },
            {
              pitch: '2',
              notehead: 'c',
              duration: 4,
            },
            {
              pitch: '2',
              notehead: 'd',
              duration: 4,
            },
          ],
        },
        {
          notes: [
            {
              pitch: '2',
              notehead: 'e',
              duration: 4,
            },
            {
              pitch: '2',
              notehead: 'f',
              duration: 4,
            },
            {
              pitch: '2',
              notehead: 'g',
              duration: 4,
            },
            {
              pitch: '2',
              notehead: 'a',
              duration: 4,
            },
          ],
        },
      ],
    });
  });
});
