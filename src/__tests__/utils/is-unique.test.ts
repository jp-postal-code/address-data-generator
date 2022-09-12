import { isUniqueFactory } from '@/lib/utils/is-unique';
import { expect, test } from '@jest/globals';

test('unique', () => {
  const isUnique = isUniqueFactory();

  expect(isUnique('a')).toBe(true);
  expect(isUnique('a')).toBe(false);
  expect(isUnique('b')).toBe(true);
  expect(isUnique('b')).toBe(false);
  expect(isUnique('b')).toBe(false);
});
