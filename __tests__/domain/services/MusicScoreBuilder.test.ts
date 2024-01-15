import {
  MeasureBuilder,
  MusicScoreBuilder,
} from '../../../src/domain/services/MusicScoreBuilder';
import { FakeRandomNoteGenerator } from '../../fakes/FakeRandomNoteGenerator';
import { FixRandomRhytmicNoteGenerator } from '../../fakes/FixRandomRhytmicNoteGenerator';
import { RoundRobinRhytmicNoteGenerator } from '../../fakes/RoundRobinRhytmicNoteGenerator';

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
              notehead: 'c',
              duration: 4,
            },
            {
              pitch: '4',
              notehead: 'd',
              duration: 4,
            },
            {
              pitch: '4',
              notehead: 'e',
              duration: 4,
            },
            {
              pitch: '4',
              notehead: 'f',
              duration: 4,
            },
          ],
        },
      ],
    });
  });

  it('With restricted Rhytmic note', () => {
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
          notehead: 'c',
          duration: 4,
        },
        {
          pitch: '4',
          notehead: 'd',
          duration: 2,
        },
        {
          pitch: '4',
          notehead: 'e',
          duration: 4,
        },
      ],
    });
  });

  it('With beat set to 3', () => {
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
          notehead: 'c',
          duration: 4,
        },
        {
          pitch: '4',
          notehead: 'd',
          duration: 8,
        },
        {
          pitch: '4',
          notehead: 'e',
          duration: 8,
        },
        {
          pitch: '4',
          notehead: 'f',
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
          notehead: 'c',
          duration: 4,
        },
        {
          pitch: '4',
          notehead: 'd',
          duration: 4,
        },
      ],
    });
  });
});
