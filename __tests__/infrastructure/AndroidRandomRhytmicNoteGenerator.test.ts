import {RhytmicNotes} from 'app/domain/services/RhytmicNote';
import {AndroidRandomRhytmicNoteGenerator} from 'app/infrastructure/AndroidRandomRhytmicFigureGenerator';

describe('Generate random rhytmic note', () => {
  it('should be include in Rhytmic note', () => {
    const genetator = new AndroidRandomRhytmicNoteGenerator();

    expect(RhytmicNotes.includes(genetator.next(4, 4))).toBeTruthy();
  });
});
