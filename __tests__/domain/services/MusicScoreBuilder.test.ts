import {describe, it, expect} from '@jest/globals';
import {
  MeasureBuilder,
  MusicScoreBuilder,
} from '../../../src/domain/services/MusicScoreBuilder';
import {FakeRandomNoteGenerator} from '../../fakes/FakeRandomNoteGenerator';
import {FixRandomRhytmicNoteGenerator} from '../../fakes/FixRandomRhytmicNoteGenerator';
import {RoundRobinRhytmicNoteGenerator} from '../../fakes/RoundRobinRhytmicNoteGenerator';

describe('MusicScoreBuilder', () => {
  it('default value', () => {
    const musicScoreBuilder = new MusicScoreBuilder(
      new FakeRandomNoteGenerator(),
      new FixRandomRhytmicNoteGenerator('quarter'),
    );
    const score = musicScoreBuilder.build({
      clef: 'treble',
      measure: 1,
      timeSignature: {
        beat: 4,
        duration: 4,
      },
    });
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

  it('', () => {
    const measureBuilder = new MeasureBuilder(
      new FakeRandomNoteGenerator(),
      new RoundRobinRhytmicNoteGenerator(['quarter', 'half']),
    );
    const score = measureBuilder.build({
      beat: 4,
      duration: 4,
    });
    expect(score).toStrictEqual({
      notes: [
        {
          pitch: '4',
          notehead: 'a',
          duration: 4,
        },
        {
          pitch: '4',
          notehead: 'b',
          duration: 2,
        },
        {
          pitch: '4',
          notehead: 'c',
          duration: 4,
        },
      ],
    });
  });

  it('', () => {
    const measureBuilder = new MeasureBuilder(
      new FakeRandomNoteGenerator(),
      new RoundRobinRhytmicNoteGenerator(['quarter', 'double-eighth']),
    );
    const score = measureBuilder.build({
      beat: 3,
      duration: 4,
    });
    expect(score).toStrictEqual({
      notes: [
        {
          pitch: '4',
          notehead: 'a',
          duration: 4,
        },
        {
          pitch: '4',
          notehead: 'b',
          duration: 8,
        },
        {
          pitch: '4',
          notehead: 'c',
          duration: 8,
        },
        {
          pitch: '4',
          notehead: 'd',
          duration: 4,
        },
      ],
    });
  });

  it('If take half it will be mor than timesignature beat. Should skip it', () => {
    const measureBuilder = new MeasureBuilder(
      new FakeRandomNoteGenerator(),
      new RoundRobinRhytmicNoteGenerator(['quarter', 'half']),
    );
    const score = measureBuilder.build({
      beat: 2,
      duration: 4,
    });

    expect(score).toStrictEqual({
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
      ],
    });
  });
});
