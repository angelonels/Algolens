/**
 * Utility functions to generate specialized arrays for sorting algorithm visualizations
 */
export const generateRandomArray = (length: number, min: number, max: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export const generateNearlySortedArray = (length: number): number[] => {
  const arr = Array.from({ length }, (_, i) => i + 1);
  // Perform a small number of arbitrary swaps to make it nearly sorted
  const swaps = Math.max(1, Math.floor(length / 10));
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * length);
    const idx2 = Math.floor(Math.random() * length);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }
  return arr;
};

export const generateReversedArray = (length: number): number[] => {
  return Array.from({ length }, (_, i) => length - i);
};
