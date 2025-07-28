import { add, nestedConditions, longFunction } from '../src/utils';

it('add 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

it('nestedConditions should not throw error for valid input', () => {
  expect(() => nestedConditions(true)).not.toThrow();
});

it('longFunction should execute without errors', () => {
  expect(() => longFunction()).not.toThrow();
});
