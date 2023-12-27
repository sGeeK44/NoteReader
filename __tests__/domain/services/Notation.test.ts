import { toWords } from 'app/domain/services/Notation';

describe('Convert notation values to grammar', () => {
  it('Syllabic', () => {
    const result = toWords('syllabic');

    expect(result).toStrictEqual('["do", "ré", "mi", "fa", "sol", "la", "si"]');
  });

  it('alphabet', () => {
    const result = toWords('alphabet');

    expect(result).toStrictEqual('["c", "d", "e", "f", "g", "a", "b"]');
  });
});
