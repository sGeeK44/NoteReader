import {AlphabetNotations} from 'app/domain/services/Notation';
import {AndroidRandomNoteGenerator} from 'app/infrastructure/AndroidRandomNoteGenerator';

describe('Generate random note', () => {
  it('should be include in alphabet note', () => {
    const genetator = new AndroidRandomNoteGenerator();

    expect(AlphabetNotations.includes(genetator.next())).toBeTruthy();
  });
});
