import {NoteDuration, Notes} from 'app/domain/services/MusicScoreBuilder';
import {RhytmicNoteRecognizer} from 'app/domain/services/RhytmicNoteRecognizer';

describe('RhytmicNoteRecognizer', () => {
  describe('With time signature 2/4', () => {
    it('Only quarter', () => {
      const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

      const result = rhytmicNoteRecognizer.toRhytmicNote({
        notes: [createNote(4), createNote(4)],
      });

      expect(result).toStrictEqual([[createNote(4)], [createNote(4)]]);
    });

    it('1 quarter and 1 double-eighth', () => {
      const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

      const result = rhytmicNoteRecognizer.toRhytmicNote({
        notes: [createNote(4), createNote(8), createNote(8)],
      });

      expect(result).toStrictEqual([
        [createNote(4)],
        [createNote(8), createNote(8)],
      ]);
    });

    it('2 double-eighth', () => {
      const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

      const result = rhytmicNoteRecognizer.toRhytmicNote({
        notes: [createNote(8), createNote(8), createNote(8), createNote(8)],
      });

      expect(result).toStrictEqual([
        [createNote(8), createNote(8)],
        [createNote(8), createNote(8)],
      ]);
    });
  });
});

function createNote(duration: NoteDuration): Notes {
  return {duration: duration, notehead: 'a', pitch: '4'};
}
