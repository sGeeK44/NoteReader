import { toBeatValue, countBeatBefore } from 'app/domain/services/Beat';

describe('Convert note duration to beat value with quarter for time unit ', () => {
  it('whole', () => {
    const result = toBeatValue(1, 4);

    expect(result).toStrictEqual(4);
  });

  it('half', () => {
    const result = toBeatValue(2, 4);

    expect(result).toStrictEqual(2);
  });

  it('half-dotted', () => {
    const result = toBeatValue(3, 4);

    expect(result).toStrictEqual(3);
  });

  it('quarter', () => {
    const result = toBeatValue(4, 4);

    expect(result).toStrictEqual(1);
  });

  it('quarter-dotted', () => {
    const result = toBeatValue(6, 4);

    expect(result).toStrictEqual(1.5);
  });

  it('eighth', () => {
    const result = toBeatValue(8, 4);

    expect(result).toStrictEqual(0.5);
  });

  it('eighth-dotted', () => {
    const result = toBeatValue(12, 4);

    expect(result).toStrictEqual(0.75);
  });

  it('sixteenth', () => {
    const result = toBeatValue(16, 4);

    expect(result).toStrictEqual(0.25);
  });

  it('thirty-seconds', () => {
    const result = toBeatValue(32, 4);

    expect(result).toStrictEqual(0.125);
  });
});

describe('Convert note duration to beat value with half for time unit ', () => {
  it('whole', () => {
    const result = toBeatValue(1, 2);

    expect(result).toStrictEqual(2);
  });
});

describe('Compute beat before note', () => {
  it('First note', () => {
    const result = countBeatBefore(
      4,
      {
        notes: [{ notehead: 'a', duration: 4, pitch: '4' }],
      },
      0,
    );

    expect(result).toStrictEqual(0);
  });

  it('Second shoud return beat value of first', () => {
    const result = countBeatBefore(
      4,
      {
        notes: [
          { notehead: 'a', duration: 4, pitch: '4' },
          { notehead: 'a', duration: 4, pitch: '4' },
        ],
      },
      1,
    );

    expect(result).toStrictEqual(1);
  });

  it('Third should return sum of previous note beat', () => {
    const result = countBeatBefore(
      4,
      {
        notes: [
          { notehead: 'a', duration: 6, pitch: '4' },
          { notehead: 'a', duration: 6, pitch: '4' },
          { notehead: 'a', duration: 8, pitch: '4' },
        ],
      },
      2,
    );

    expect(result).toStrictEqual(3);
  });
});
