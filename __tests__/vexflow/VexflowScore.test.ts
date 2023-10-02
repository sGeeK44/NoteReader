import {describe, it, expect} from '@jest/globals';
import {VexflowScore} from 'app/vexflow/VexfloxConverter';
import {StaveNote} from 'vexflow';

describe('Beams note toogether', () => {
  it('No beams note', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '2'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '2'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '2'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([]);
  });

  it('Only two note that should be beam', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([notes]);
  });

  it('Two note beams followed by two other normal', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([[notes[0], notes[1]]]);
  });

  it('Two note beams after by two other normal', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([[notes[2], notes[3]]]);
  });

  it('Two groups of two note beams separated by one normal', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([
      [notes[0], notes[1]],
      [notes[3], notes[4]],
    ]);
  });

  it('One note should not be beams', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([]);
  });

  it('Beams maximum of 4 eighth toogether', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);
    console.log(result.length, result[0].length);
    expect(result).toStrictEqual([
      [notes[0], notes[1], notes[2], notes[3]],
      [notes[4], notes[5]],
    ]);
  });
});
