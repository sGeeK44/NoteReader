import { Checker } from 'app/domain/services/Checker';
import { FakeTimeProvider } from '../../fakes/FakeTimeProvider';
import { Tempo } from 'app/domain/services/Tempo';
import { MusicScore } from 'app/domain/services/MusicScoreBuilder';

describe('Validate speech against music score and time', () => {
  it('First note can be spell at any time !', () => {
    const timeProvider = new FakeTimeProvider();
    const checker = new Checker(
      timeProvider,
      {
        clef: 'treble',
        timeSignature: {
          beat: 4,
          duration: 4,
        },
        measures: [
          {
            notes: [
              { notehead: 'a', duration: 4, pitch: '4' },
              { notehead: 'a', duration: 4, pitch: '4' },
            ],
          },
        ],
      },
      new Tempo(60),
      400,
    );

    const result = checker.start('a');

    expect(result).toStrictEqual('GOOD');
  });
  it('Spell to early !', () => {
    const timeProvider = new FakeTimeProvider();
    const checker = new Checker(
      timeProvider,
      {
        clef: 'treble',
        timeSignature: {
          beat: 4,
          duration: 4,
        },
        measures: [
          {
            notes: [
              { notehead: 'a', duration: 4, pitch: '4' },
              { notehead: 'a', duration: 4, pitch: '4' },
            ],
          },
        ],
      },
      new Tempo(60),
      400,
    );

    checker.start('a');

    timeProvider.setNow(500);
    const result = checker.next('a');

    expect(result).toStrictEqual('BAD');
  });

  it('Spell to late !', () => {
    const timeProvider = new FakeTimeProvider();
    const checker = new Checker(
      timeProvider,
      {
        clef: 'treble',
        timeSignature: {
          beat: 4,
          duration: 4,
        },
        measures: [
          {
            notes: [
              { notehead: 'a', duration: 4, pitch: '4' },
              { notehead: 'a', duration: 4, pitch: '4' },
            ],
          },
        ],
      },
      new Tempo(60),
      400,
    );

    checker.start('a');

    timeProvider.setNow(1500);
    const result = checker.next('a');

    expect(result).toStrictEqual('BAD');
  });

  it('Spell all right :)', () => {
    const timeProvider = new FakeTimeProvider();
    const score: MusicScore = {
      clef: 'treble',
      timeSignature: {
        beat: 4,
        duration: 4,
      },
      measures: [
        {
          notes: [
            { notehead: 'a', duration: 4, pitch: '4' },
            { notehead: 'b', duration: 4, pitch: '4' },
            { notehead: 'c', duration: 4, pitch: '4' },
            { notehead: 'd', duration: 4, pitch: '4' },
          ],
        },
        {
          notes: [
            { notehead: 'e', duration: 4, pitch: '4' },
            { notehead: 'f', duration: 4, pitch: '4' },
            { notehead: 'g', duration: 4, pitch: '4' },
            { notehead: 'a', duration: 4, pitch: '4' },
          ],
        },
      ],
    };
    const checker = new Checker(timeProvider, score, new Tempo(60), 400);

    expect(checker.start('a')).toStrictEqual('GOOD');

    timeProvider.setNow(1000);
    expect(checker.next('b')).toStrictEqual('GOOD');

    timeProvider.setNow(2000);
    expect(checker.next('c')).toStrictEqual('GOOD');

    timeProvider.setNow(3000);
    expect(checker.next('d')).toStrictEqual('GOOD');

    timeProvider.setNow(4000);
    expect(checker.next('e')).toStrictEqual('GOOD');

    timeProvider.setNow(5000);
    expect(checker.next('f')).toStrictEqual('GOOD');

    timeProvider.setNow(6000);
    expect(checker.next('g')).toStrictEqual('GOOD');

    timeProvider.setNow(7000);
    expect(checker.next('a')).toStrictEqual('WIN');
  });

  it('Spell with syllabic note at right time', () => {
    const timeProvider = new FakeTimeProvider();
    const score: MusicScore = {
      clef: 'treble',
      timeSignature: {
        beat: 4,
        duration: 4,
      },
      measures: [
        {
          notes: [
            {
              notehead: 'c',
              duration: 4,
              pitch: '4',
            },
          ],
        },
      ],
    };
    const checker = new Checker(timeProvider, score, new Tempo(60), 400);

    const result = checker.start('do');

    expect(result).toStrictEqual('GOOD');
  });

  it('Spell bad note at right time :(', () => {
    const timeProvider = new FakeTimeProvider();
    const score: MusicScore = {
      clef: 'treble',
      timeSignature: {
        beat: 4,
        duration: 4,
      },
      measures: [
        {
          notes: [
            {
              notehead: 'a',
              duration: 4,
              pitch: '4',
            },
          ],
        },
      ],
    };
    const checker = new Checker(timeProvider, score, new Tempo(60), 400);

    const result = checker.start('d');

    expect(result).toStrictEqual('BAD');
  });
});

describe('Has mistake', () => {
  let checker: Checker;
  let timeProvider: FakeTimeProvider;

  beforeEach(() => {
    timeProvider = new FakeTimeProvider();
    checker = new Checker(
      timeProvider,
      {
        clef: 'treble',
        timeSignature: {
          beat: 4,
          duration: 4,
        },
        measures: [
          {
            notes: [
              { notehead: 'a', duration: 4, pitch: '4' },
              { notehead: 'b', duration: 4, pitch: '4' },
              { notehead: 'c', duration: 4, pitch: '4' },
              { notehead: 'd', duration: 4, pitch: '4' },
            ],
          },
          {
            notes: [
              { notehead: 'e', duration: 4, pitch: '4' },
              { notehead: 'f', duration: 4, pitch: '4' },
              { notehead: 'g', duration: 4, pitch: '4' },
              { notehead: 'a', duration: 4, pitch: '4' },
            ],
          },
        ],
      },
      new Tempo(60),
      400,
    );
  });


  describe("Time should be restarted", () => {

    it('Fail in second measure', () => {
      checker.start('a');
      timeProvider.setNow(1000);
      checker.next('b');
      timeProvider.setNow(2000);
      checker.next('c');
      timeProvider.setNow(3000);
      checker.next('d');
      timeProvider.setNow(4000);
      checker.next('d');


      timeProvider.setNow(10000);
      expect(checker.start('e')).toStrictEqual('GOOD');
      timeProvider.setNow(11000);
      expect(checker.next('f')).toStrictEqual('GOOD');
    });
  });

  describe("Restart at the current measure begining", () => {

    it('Fail in first measure first note', () => {
      checker.start('b');

      expect(checker.currentMeasureIndex).toStrictEqual(0);
      expect(checker.currentNoteIndex).toStrictEqual(0);
      expect(checker.timeChecker.elapse)
    });

    it('Fail in first measuren third note', () => {
      checker.start('a');
      timeProvider.setNow(1000);
      checker.next('b');
      timeProvider.setNow(2000);
      checker.next('a');
      timeProvider.setNow(3000);

      expect(checker.currentMeasureIndex).toStrictEqual(0);
      expect(checker.currentNoteIndex).toStrictEqual(0);
    });

    it('Fail in second measuren first note', () => {
      checker.start('a');
      timeProvider.setNow(1000);
      checker.next('b');
      timeProvider.setNow(2000);
      checker.next('c');
      timeProvider.setNow(3000);
      checker.next('d');
      timeProvider.setNow(5000);
      checker.next('d');


      expect(checker.currentMeasureIndex).toStrictEqual(1);
      expect(checker.currentNoteIndex).toStrictEqual(0);
    });

    it('Fail in second measuren third note', () => {
      checker.start('a');
      timeProvider.setNow(1000);
      checker.next('b');
      timeProvider.setNow(2000);
      checker.next('c');
      timeProvider.setNow(3000);
      checker.next('d');
      timeProvider.setNow(4000);
      checker.next('e');
      timeProvider.setNow(5000);
      checker.next('f');
      timeProvider.setNow(6000);
      checker.next('d');

      expect(checker.currentMeasureIndex).toStrictEqual(1);
      expect(checker.currentNoteIndex).toStrictEqual(0);
    });
  });
})

describe('Listen result.', () => {
  it('When spell bad note to early', () => {
    const timeProvider = new FakeTimeProvider();
    const checker = new Checker(
      timeProvider,
      {
        clef: 'treble',
        timeSignature: {
          beat: 2,
          duration: 4,
        },
        measures: [
          {
            notes: [
              { notehead: 'a', duration: 4, pitch: '4' },
              { notehead: 'b', duration: 4, pitch: '4' },
            ],
          },
        ],
      },
      new Tempo(60),
      400,
    );

    expect(checker.start('a')).toStrictEqual('GOOD');
    timeProvider.setNow(500);
    checker.onBadNote(
      (
        _measure: number,
        _note: number,
        result: 'TO_EARLY' | 'TO_LATE' | 'BAD_NOTE',
      ) => {
        expect(result).toStrictEqual('BAD_NOTE');
      },
    );
    checker.next('a');
  });

  it('When spell bad note to late', () => {
    const timeProvider = new FakeTimeProvider();
    const checker = new Checker(
      timeProvider,
      {
        clef: 'treble',
        timeSignature: {
          beat: 2,
          duration: 4,
        },
        measures: [
          {
            notes: [
              { notehead: 'a', duration: 4, pitch: '4' },
              { notehead: 'b', duration: 4, pitch: '4' },
            ],
          },
        ],
      },
      new Tempo(60),
      400,
    );



    expect(checker.start('a')).toStrictEqual('GOOD');
    timeProvider.setNow(1500);
    checker.onBadNote(
      (
        _measure: number,
        _note: number,
        result: 'TO_EARLY' | 'TO_LATE' | 'BAD_NOTE',
      ) => {
        expect(result).toStrictEqual('BAD_NOTE');
      },
    );
    checker.next('a');
  });
});

describe('With different duration', () => {
  it('Only whole', () => {
    const timeProvider = new FakeTimeProvider();
    const checker = new Checker(
      timeProvider,
      {
        clef: 'treble',
        timeSignature: {
          beat: 4,
          duration: 4,
        },
        measures: [
          {
            notes: [{ notehead: 'a', duration: 1, pitch: '1' }],
          },
          {
            notes: [{ notehead: 'a', duration: 1, pitch: '1' }],
          },
        ],
      },
      new Tempo(60),
      400,
    );

    checker.start('a');

    timeProvider.setNow(4000);
    expect(checker.next('a')).toStrictEqual('WIN');
  });

  it('xx', () => {
    const timeProvider = new FakeTimeProvider();
    const checker = new Checker(
      timeProvider,
      {
        clef: 'treble',
        timeSignature: {
          beat: 4,
          duration: 4,
        },
        measures: [
          {
            notes: [
              { notehead: 'a', duration: 6, pitch: '1' },
              { notehead: 'a', duration: 8, pitch: '1' },
              { notehead: 'a', duration: 12, pitch: '1' },
              { notehead: 'a', duration: 16, pitch: '1' },
              { notehead: 'a', duration: 12, pitch: '1' },
              { notehead: 'a', duration: 16, pitch: '1' },
            ],
          },
        ],
      },
      new Tempo(60),
      400,
    );

    checker.start('a');

    timeProvider.setNow(1500);
    expect(checker.next('a')).toStrictEqual('GOOD');
  });
});

