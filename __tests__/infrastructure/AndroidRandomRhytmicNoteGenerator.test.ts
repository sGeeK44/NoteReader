import { RhytmicNotes } from 'app/domain/services/RhytmicNote';
import { AndroidRandomRhytmicNoteGenerator } from 'app/infrastructure/AndroidRandomRhytmicFigureGenerator';

describe('Generate random rhytmic note', () => {
  it('should be include in Rhytmic note pass in constructors', () => {
    const genetator = new AndroidRandomRhytmicNoteGenerator([...RhytmicNotes.values()]);

    expect(RhytmicNotes.includes(genetator.next(4, 4))).toBeTruthy();
  });
});
