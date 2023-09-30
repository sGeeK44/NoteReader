import {describe, it, expect} from '@jest/globals';
import {MusicScore, Notes} from 'app/domain/services/MusicScoreBuilder';
import {RnSvgContext} from 'app/vexflow/RnSvgContext';
import {VexflowConverter, VexflowScore} from 'app/vexflow/VexfloxConverter';
import {Beam, Stave, StaveNote} from 'vexflow';

describe('', () => {
  it('', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '2'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '2'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '2'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([]);
  });

  it('', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([notes]);
  });

  it('', () => {
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

  it('', () => {
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

  it('', () => {
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

  it('', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([]);
  });

  it('', () => {
    const notes: StaveNote[] = [
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '4'}),
      new StaveNote({clef: 'bass', keys: [`a/4`], duration: '8'}),
    ];

    const vexflow = new VexflowScore();
    const result = vexflow.bunchBeamNotes(notes);

    expect(result).toStrictEqual([[notes[0], notes[1]]]);
  });
});
