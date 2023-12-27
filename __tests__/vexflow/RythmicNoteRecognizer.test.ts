import { NoteDuration } from 'app/domain/services/MusicScoreBuilder';
import { Notes } from 'app/domain/services/Notes';
import { RhytmicNoteRecognizer } from 'app/vexflow/RhytmicNoteRecognizer';

describe('RhytmicNoteRecognizer', () => {
  it('Only quarter', () => {
    const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

    const result = rhytmicNoteRecognizer.toRhytmicNote({
      notes: [createNote(4), createNote(4)],
    });

    expect(result).toStrictEqual([[0], [1]]);
  });

  it('half-dotted eighth-dotted-double', () => {
    const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

    const result = rhytmicNoteRecognizer.toRhytmicNote({
      notes: [createNote(3), createNote(12), createNote(16)],
    });

    expect(result).toStrictEqual([[0], [1, 2]]);
  });

  it('1 quarter and 1 double-eighth', () => {
    const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

    const result = rhytmicNoteRecognizer.toRhytmicNote({
      notes: [createNote(4), createNote(8), createNote(8)],
    });

    expect(result).toStrictEqual([[0], [1, 2]]);
  });

  it('2 double-eighth', () => {
    const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

    const result = rhytmicNoteRecognizer.toRhytmicNote({
      notes: [createNote(8), createNote(8), createNote(8), createNote(8)],
    });

    expect(result).toStrictEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it('quarter-dotted-eighth and eighth-dotted-double', () => {
    const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

    const result = rhytmicNoteRecognizer.toRhytmicNote({
      notes: [createNote(6), createNote(8), createNote(12), createNote(16)],
    });

    expect(result).toStrictEqual([
      [0, 1],
      [2, 3],
    ]);
  });

  it('four-sixteenth, double-eighth, four-sixteenth and eighth-dotted-double', () => {
    const rhytmicNoteRecognizer = new RhytmicNoteRecognizer();

    const result = rhytmicNoteRecognizer.toRhytmicNote({
      notes: [
        createNote(16),
        createNote(16),
        createNote(16),
        createNote(16),
        createNote(8),
        createNote(8),
        createNote(12),
        createNote(16),
        createNote(16),
        createNote(16),
        createNote(16),
        createNote(16),
      ],
    });

    expect(result).toStrictEqual([
      [0, 1, 2, 3],
      [4, 5],
      [6, 7],
      [8, 9, 10, 11],
    ]);
  });
});

function createNote(duration: NoteDuration): Notes {
  return { duration: duration, notehead: 'a', pitch: '4' };
}
