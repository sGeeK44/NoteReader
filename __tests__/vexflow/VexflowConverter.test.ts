import {describe, it, expect} from '@jest/globals';
import {Clef, Measure} from 'app/domain/services/MusicScoreBuilder';
import {Signature} from 'app/domain/value-object/Signature';
import {VexflowConverter} from 'app/vexflow/VexfloxConverter';
import {Beam} from 'vexflow';

describe('', () => {
  it('', () => {
    const measure: Measure = {
      notes: [
        {duration: 2, notehead: 'g', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'g', pitch: '4'},
      ],
    };

    const vexflow = new VexflowConverter();
    vexflow.createStave(
      {clef: 'treble', measures: [], timeSignature: {beat: 3, duration: 4}},
      measure,
      0,
      0,
      100,
    );

    // Expect not throw
  });

  it('', () => {
    const measure: Measure = {
      notes: [
        {duration: 3, notehead: 'g', pitch: '4'},
        {duration: 12, notehead: 'a', pitch: '4'},
        {duration: 16, notehead: 'g', pitch: '4'},
      ],
    };

    const vexflow = new VexflowConverter();
    vexflow.createStave(
      {clef: 'treble', measures: [], timeSignature: {beat: 4, duration: 4}},
      measure,
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

describe('Beams note toogether', () => {
  const clef: Clef = 'treble';
  const vexflow: VexflowConverter = new VexflowConverter();

  const createNotes = (measure: Measure) => {
    return measure.notes.map(note => vexflow.createNote(clef, note));
  };

  it('No beams note', () => {
    const measure: Measure = {
      notes: [
        {duration: 2, notehead: 'a', pitch: '4'},
        {duration: 2, notehead: 'a', pitch: '4'},
        {duration: 2, notehead: 'a', pitch: '4'},
      ],
    };
    const notes = createNotes(measure);

    const beams = vexflow.createBeams(measure, notes);

    expect(beams).toStrictEqual([]);
  });

  it('Only two note that should be beam', () => {
    const measure: Measure = {
      notes: [
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
      ],
    };
    const notes = createNotes(measure);

    const beams = vexflow.createBeams(measure, notes);

    expect(beams).toStrictEqual([notes]);
  });

  it('Two note beams followed by two other normal', () => {
    const measure: Measure = {
      notes: [
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 4, notehead: 'a', pitch: '4'},
        {duration: 4, notehead: 'a', pitch: '4'},
      ],
    };
    const notes = createNotes(measure);

    const beams = vexflow.createBeams(measure, notes);

    expect(beams).toStrictEqual([[notes[0], notes[1]]]);
  });

  it('Two note beams after by two other normal', () => {
    const measure: Measure = {
      notes: [
        {duration: 4, notehead: 'a', pitch: '4'},
        {duration: 4, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
      ],
    };
    const notes = createNotes(measure);

    const beams = vexflow.createBeams(measure, notes);

    expect(beams).toStrictEqual([[notes[2], notes[3]]]);
  });

  it('Two groups of two note beams separated by one normal', () => {
    const measure: Measure = {
      notes: [
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 4, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
      ],
    };
    const notes = createNotes(measure);

    const beams = vexflow.createBeams(measure, notes);

    expect(beams).toStrictEqual([
      [notes[0], notes[1]],
      [notes[3], notes[4]],
    ]);
  });

  it('One note should not be beams', () => {
    const measure: Measure = {
      notes: [
        {duration: 6, notehead: 'a', pitch: '4'},
        {duration: 4, notehead: 'a', pitch: '4'},
      ],
    };
    const notes = createNotes(measure);

    const beams = vexflow.createBeams(measure, notes);

    expect(beams).toStrictEqual([]);
  });

  it('Beams maximum of 4 eighth toogether', () => {
    const measure: Measure = {
      notes: [
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
      ],
    };
    const notes = createNotes(measure);

    const beams = vexflow.createBeams(measure, notes);
    console.log(beams.length);
    expect(beams).toStrictEqual([
      [notes[0], notes[1], notes[2], notes[3]],
      [notes[4], notes[5]],
    ]);
  });

  it('Beams should not denature rythmic note', () => {
    const measure: Measure = {
      notes: [
        {duration: 4, notehead: 'a', pitch: '4'},
        {duration: 8, notehead: 'a', pitch: '4'},
        {duration: 12, notehead: 'a', pitch: '4'},
        {duration: 16, notehead: 'a', pitch: '4'},
      ],
    };
    const notes = createNotes(measure);

    const beams = vexflow.createBeams(measure, notes);

    expect(beams).toStrictEqual([
      [notes[0], notes[1]],
      [notes[2], notes[3]],
    ]);
  });
});
