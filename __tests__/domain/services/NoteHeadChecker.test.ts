import {describe, it, expect} from '@jest/globals';
import {NoteHeadChecker} from 'app/domain/services/NoteHeadChecker';

describe('NoteHeadChecker', () => {
  it('Unknown note', () => {
    const noteChecker = new NoteHeadChecker();

    const result = noteChecker.isRigthNote('x', 'a');

    expect(result).toBeFalsy();
  });

  it('Good note in alphabet notation', () => {
    const noteChecker = new NoteHeadChecker();

    const result = noteChecker.isRigthNote('a', 'a');

    expect(result).toBeTruthy();
  });

  it('Bad note in alphabet notation', () => {
    const noteChecker = new NoteHeadChecker();

    const result = noteChecker.isRigthNote('b', 'a');

    expect(result).toBeFalsy();
  });

  it('Good note in syllabic notation', () => {
    const noteChecker = new NoteHeadChecker();

    const result = noteChecker.isRigthNote('la', 'a');

    expect(result).toBeTruthy();
  });

  it('Bad note in syllabic notation', () => {
    const noteChecker = new NoteHeadChecker();

    const result = noteChecker.isRigthNote('do', 'a');

    expect(result).toBeFalsy();
  });
});
