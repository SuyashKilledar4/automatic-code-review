import {
  badFunctionName,
  anotherFunction,
  inconsistentSpacing,
  unusedParams,
  unreachableCode,
  magicNumbers,
  missingReturnType,
  multipleIssues
} from '../src/utils';

describe('Linting Test Functions', () => {
  test('badFunctionName should return correct sum', () => {
    expect(badFunctionName()).toBe(15);
  });

  test('anotherFunction should return correct result', () => {
    expect(anotherFunction(3, 4)).toBe(7);
  });

  test('inconsistentSpacing should return correct sum', () => {
    expect(inconsistentSpacing(3, 5)).toBe(8);
  });

  test('unusedParams should ignore unused param and return sum of first two', () => {
    expect(unusedParams(1, 2, 999)).toBe(3);
  });

  test('unreachableCode should return 1', () => {
    expect(unreachableCode()).toBe(1);
  });

  test('magicNumbers should calculate area of circle with radius 5', () => {
    expect(magicNumbers()).toBeCloseTo(78.5);
  });

  test('missingReturnType should subtract correctly', () => {
    expect(missingReturnType(10, 5)).toBe(5);
  });

  test('multipleIssues should return correct sum', () => {
    expect(multipleIssues(5, 6)).toBe(11);
  });
});
