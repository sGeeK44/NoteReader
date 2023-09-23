export const AlphabetNotation = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
export const SyllabicNotation = ['do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'];
export const AlphaSyllaMap = new Map<string, string>([
  ['a', 'la'],
  ['b', 'si'],
  ['c', 'do'],
  ['d', 'ré'],
  ['e', 'mi'],
  ['f', 'fa'],
  ['g', 'sol'],
]);
export const SyllaAlphaMap = new Map<string, string>([
  ['do', 'c'],
  ['ré', 'd'],
  ['mi', 'e'],
  ['fa', 'f'],
  ['sol', 'g'],
  ['la', 'a'],
  ['si', 'b'],
]);
export type Notation = 'syllabic' | 'alphabet';

export const toWords = (notation: Notation): string => {
  if (notation === 'alphabet') {
    return '["a", "b", "c", "d", "e", "f", "g"]';
  }

  return '["do", "ré", "mi", "fa", "sol", "la", "si"]';
};
