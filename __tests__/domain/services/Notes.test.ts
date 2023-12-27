import { Notes, getAbsoluteIndex, getNoteFromAbsoluteIndex, getRange } from "app/domain/services/Notes";


describe('Notes', () => {
  describe('getRange', () => {
    it('min equal max', () => {
      const note: Notes = {
        pitch: "1", duration: 4, notehead: "c"
      };
      const result = getRange(note, note);

      expect(result).toStrictEqual([
        { pitch: "1", duration: 4, notehead: "c" }
      ]);
    });

    it('same pitch max follow min', () => {
      const min: Notes = {
        pitch: "1", duration: 4, notehead: "c"
      };
      const max: Notes = {
        pitch: "1", duration: 4, notehead: "d"
      };
      const result = getRange(min, max);

      expect(result).toStrictEqual([
        { pitch: "1", duration: 4, notehead: "c" },
        { pitch: "1", duration: 4, notehead: "d" }
      ]);
    });

    it('not same pitch', () => {
      const min: Notes = {
        pitch: "1", duration: 4, notehead: "c"
      };
      const max: Notes = {
        pitch: "2", duration: 4, notehead: "c"
      };
      const result = getRange(min, max);

      expect(result).toStrictEqual([
        { pitch: "1", duration: 4, notehead: "c" },
        { pitch: "1", duration: 4, notehead: "d" },
        { pitch: "1", duration: 4, notehead: "e" },
        { pitch: "1", duration: 4, notehead: "f" },
        { pitch: "1", duration: 4, notehead: "g" },
        { pitch: "1", duration: 4, notehead: "a" },
        { pitch: "1", duration: 4, notehead: "b" },
        { pitch: "2", duration: 4, notehead: "c" }
      ]);
    });
  });

  describe('getNoteAbsoluteIndex', () => {
    it('min note, min pitch', () => {
      const note: Notes = {
        pitch: "1", duration: 4, notehead: "c"
      };
      const result = getAbsoluteIndex(note);

      expect(result).toStrictEqual(1);
    });

    it('max note, max pitch', () => {
      const note: Notes = {
        pitch: "6", duration: 4, notehead: "b"
      };
      const result = getAbsoluteIndex(note);

      expect(result).toStrictEqual(42);
    });

    it('first note, max pitch', () => {
      const note: Notes = {
        pitch: "6", duration: 4, notehead: "c"
      };
      const result = getAbsoluteIndex(note);

      expect(result).toStrictEqual(36);
    });

    it('last note, min pitch', () => {
      const note: Notes = {
        pitch: "1", duration: 4, notehead: "b"
      };
      const result = getAbsoluteIndex(note);

      expect(result).toStrictEqual(7);
    });

    it('first note , pitch 2', () => {
      const note: Notes = { pitch: "2", duration: 4, notehead: "c" };
      const result = getAbsoluteIndex(note);

      expect(result).toStrictEqual(8);
    });
  });

  describe('getFromAbsoluteIndex', () => {
    it('min note, min pitch', () => {
      const result = getNoteFromAbsoluteIndex(1);

      expect(result).toStrictEqual({
        pitch: "1", duration: 4, notehead: "c"
      });
    });

    it('max note, max pitch', () => {
      const result = getNoteFromAbsoluteIndex(42);

      expect(result).toStrictEqual({
        pitch: "6", duration: 4, notehead: "b"
      });
    });

    it('first note, max pitch', () => {
      const result = getNoteFromAbsoluteIndex(36);

      expect(result).toStrictEqual({
        pitch: "6", duration: 4, notehead: "c"
      });
    });

    it('last note, min pitch', () => {
      const result = getNoteFromAbsoluteIndex(7);

      expect(result).toStrictEqual({
        pitch: "1", duration: 4, notehead: "b"
      });
    });

    it('first note , pitch 2', () => {
      const result = getNoteFromAbsoluteIndex(8);

      expect(result).toStrictEqual({ pitch: "2", duration: 4, notehead: "c" });
    });
  });
});
