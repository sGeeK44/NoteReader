import { AlphabetNotations } from 'app/domain/services/Notation';
import { Notes } from 'app/domain/services/Notes';
import { AndroidRandomNoteGenerator } from 'app/infrastructure/AndroidRandomNoteGenerator';

describe('Generate random note', () => {
  it('min equal max', () => {
    const min: Notes = {
      pitch: '2',
      duration: 4,
      notehead: 'a',
    };
    const max: Notes = {
      pitch: '2',
      duration: 4,
      notehead: 'a',
    };
    const genetator = new AndroidRandomNoteGenerator(min, max);

    const [pitch, notehead] = genetator.next();

    expect(pitch).toStrictEqual('2');
    expect(notehead).toStrictEqual('a');
  });

  it('min different max', () => {
    const min: Notes = {
      pitch: '1',
      duration: 4,
      notehead: 'c',
    };
    const max: Notes = {
      pitch: '6',
      duration: 4,
      notehead: 'b',
    };
    const genetator = new AndroidRandomNoteGenerator(min, max);

    const [pitch, notehead] = genetator.next();

    expect(pitch).toMatch(new RegExp('[1-6]'));
    expect(notehead).toMatch(new RegExp('[a-f]'));
  });
});
