/**
 * Utility functions to strictly validate user inputs before running algorithms.
 * Prevents visualizer crashes on bad states.
 */

export const isValidNumberArray = (arr: any[]): arr is number[] => {
  if (!Array.isArray(arr)) return false;
  return arr.every(item => typeof item === 'number' && !isNaN(item));
};

export const isValidMatrix = (matrix: any[][]): boolean => {
  if (!Array.isArray(matrix) || matrix.length === 0) return false;
  const pivot = matrix[0].length;
  return matrix.every(row => Array.isArray(row) && row.length === pivot);
};

export const clampMatrixDimensions = (rows: number, cols: number, maxRes: number = 100): [number, number] => {
  return [
    Math.max(1, Math.min(rows, maxRes)),
    Math.max(1, Math.min(cols, maxRes))
  ];
};
