import { describe, it, expect } from 'vitest';
import { clamp, lerp, toRadians, getDistance } from '../utils/mathHelpers';
import { isValidNumberArray, isValidMatrix, clampMatrixDimensions } from '../utils/validation';

describe('mathHelpers utilities', () => {
  it('should clamp values correctly within min and max boundaries', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(0, 1, 10)).toBe(1);
    expect(clamp(12, 1, 10)).toBe(10);
  });

  it('should perform linear interpolation (lerp) correctly', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it('should convert degrees to radians correctly', () => {
    expect(toRadians(0)).toBe(0);
    expect(toRadians(180)).toBeCloseTo(Math.PI);
    expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
  });

  it('should calculate Euclidean distance between two points correctly', () => {
    expect(getDistance(0, 0, 3, 4)).toBe(5);
    expect(getDistance(1, 1, 1, 1)).toBe(0);
  });
});

describe('validation utilities', () => {
  it('should validate if an array is a valid number array', () => {
    expect(isValidNumberArray([1, 2, 3])).toBe(true);
    expect(isValidNumberArray([1, '2', 3])).toBe(false);
    expect(isValidNumberArray([1, NaN, 3])).toBe(false);
    expect(isValidNumberArray('not an array' as unknown as unknown[])).toBe(false);
  });

  it('should validate if a matrix is a valid rectangular matrix', () => {
    expect(
      isValidMatrix([
        [1, 2],
        [3, 4],
      ])
    ).toBe(true);
    expect(isValidMatrix([[1, 2], [3]])).toBe(false);
    expect(isValidMatrix([])).toBe(false);
  });

  it('should clamp matrix dimensions correctly', () => {
    expect(clampMatrixDimensions(5, 10)).toEqual([5, 10]);
    expect(clampMatrixDimensions(-1, 200, 100)).toEqual([1, 100]);
  });
});
