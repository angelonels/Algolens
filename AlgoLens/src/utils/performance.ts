/**
 * Utility functions for measuring algorithm execution performance
 */

/**
 * Measure the execution time of a synchronous algorithm
 * @param fn The function to measure
 * @param args The arguments to pass to the function
 * @returns An object containing the result of the function and the execution time in milliseconds
 */
export function measurePerformance<T, A extends unknown[]>(
  fn: (...args: A) => T,
  ...args: A
): { result: T; timeMs: number } {
  const start = performance.now()
  const result = fn(...args)
  const end = performance.now()
  return {
    result,
    timeMs: end - start,
  }
}
