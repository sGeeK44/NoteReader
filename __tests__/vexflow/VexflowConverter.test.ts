import {describe, it, expect} from '@jest/globals';
import {Notes} from 'app/domain/services/MusicScoreBuilder';
import {VexflowConverter} from 'app/vexflow/VexfloxConverter';

describe('', () => {
  it('', () => {
    const score: Notes[] = [
      {duration: 2, notehead: 'g', pitch: '4'},
      {duration: 8, notehead: 'a', pitch: '4'},
      {duration: 8, notehead: 'g', pitch: '4'},
    ];

    const vexflow = new VexflowConverter();
    vexflow.createStave(
      {clef: 'treble', measures: [], timeSignature: {beat: 3, duration: 4}},
      score,
      0,
      0,
      100,
    );

    // Expect not throw
  });

  it('', () => {
    const score: Notes[] = [
      {duration: 3, notehead: 'g', pitch: '4'},
      {duration: 12, notehead: 'a', pitch: '4'},
      {duration: 16, notehead: 'g', pitch: '4'},
    ];

    const vexflow = new VexflowConverter();
    vexflow.createStave(
      {clef: 'treble', measures: [], timeSignature: {beat: 4, duration: 4}},
      score,
      0,
      0,
      0,
    );

    // Expect not throw
  });
});

describe('', () => {
  it('', () => {
    const vexflow = new VexflowConverter();

    const result = vexflow.toBasicRhytm(1);

    expect(result).toStrictEqual(1);
  });
  it('', () => {
    const vexflow = new VexflowConverter();

    const result = vexflow.toBasicRhytm(2);

    expect(result).toStrictEqual(2);
  });
  it('', () => {
    const vexflow = new VexflowConverter();

    const result = vexflow.toBasicRhytm(3);

    expect(result).toStrictEqual(2);
  });

  it('', () => {
    const vexflow = new VexflowConverter();

    const result = vexflow.toBasicRhytm(4);

    expect(result).toStrictEqual(4);
  });

  it('', () => {
    const vexflow = new VexflowConverter();

    const result = vexflow.toBasicRhytm(6);

    expect(result).toStrictEqual(4);
  });
  it('', () => {
    const vexflow = new VexflowConverter();

    const result = vexflow.toBasicRhytm(12);

    expect(result).toStrictEqual(8);
  });
});
