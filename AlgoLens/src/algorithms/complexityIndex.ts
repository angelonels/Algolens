/**
 * Centralized complexity registry — import all algorithm complexities
 * from a single entry point. Useful for the complexity cheat sheet,
 * algorithm comparison views, and SEO metadata generation.
 */

import { AlgorithmComplexity } from './types'
import { binarySearchComplexity } from './binarySearch'
import { bubbleSortComplexity } from './bubbleSort'
import { insertionSortComplexity } from './insertionSort'
import { selectionSortComplexity } from './selectionSort'
import { mergeSortComplexity } from './mergeSort'
import { quickSortComplexity } from './quickSort'
import { heapSortComplexity } from './heapSort'
import { countingSortComplexity } from './countingSort'
import { radixSortComplexity } from './radixSort'
import { bfsComplexity } from './bfsGrid'
import { dfsComplexity } from './dfsGrid'
import { dijkstraComplexity } from './dijkstra'
import { editDistanceComplexity } from './editDistance'
import { matrixTraversalComplexity } from './matrixTraversal'
import { euclideanGCDComplexity } from './euclideanGCD'
import { kMeansComplexity } from './kMeans'
import { linearRegressionComplexity } from './linearRegression'
import { logisticRegressionComplexity } from './logisticRegression'
import { decisionTreeComplexity } from './decisionTree'

export interface ComplexityEntry {
  name: string
  slug: string
  category: 'sorting' | 'searching' | 'graph' | 'dp' | 'math' | 'ml'
  complexity: AlgorithmComplexity
}

export const complexityRegistry: ComplexityEntry[] = [
  // Sorting
  { name: 'Bubble Sort', slug: 'bubble-sort', category: 'sorting', complexity: bubbleSortComplexity },
  { name: 'Insertion Sort', slug: 'insertion-sort', category: 'sorting', complexity: insertionSortComplexity },
  { name: 'Selection Sort', slug: 'selection-sort', category: 'sorting', complexity: selectionSortComplexity },
  { name: 'Merge Sort', slug: 'merge-sort', category: 'sorting', complexity: mergeSortComplexity },
  { name: 'Quick Sort', slug: 'quick-sort', category: 'sorting', complexity: quickSortComplexity },
  { name: 'Heap Sort', slug: 'heap-sort', category: 'sorting', complexity: heapSortComplexity },
  { name: 'Counting Sort', slug: 'counting-sort', category: 'sorting', complexity: countingSortComplexity },
  { name: 'Radix Sort', slug: 'radix-sort', category: 'sorting', complexity: radixSortComplexity },

  // Searching
  { name: 'Binary Search', slug: 'binary-search', category: 'searching', complexity: binarySearchComplexity },

  // Graph
  { name: 'BFS (Grid)', slug: 'bfs', category: 'graph', complexity: bfsComplexity },
  { name: 'DFS (Grid)', slug: 'dfs', category: 'graph', complexity: dfsComplexity },
  { name: "Dijkstra's Algorithm", slug: 'dijkstra', category: 'graph', complexity: dijkstraComplexity },

  // Dynamic Programming
  { name: 'Edit Distance', slug: 'edit-distance', category: 'dp', complexity: editDistanceComplexity },
  { name: 'Spiral Matrix Traversal', slug: 'matrix-traversal', category: 'dp', complexity: matrixTraversalComplexity },

  // Math
  { name: 'Euclidean GCD', slug: 'euclidean-gcd', category: 'math', complexity: euclideanGCDComplexity },

  // Machine Learning
  { name: 'K-Means Clustering', slug: 'k-means', category: 'ml', complexity: kMeansComplexity },
  { name: 'Linear Regression', slug: 'linear-regression', category: 'ml', complexity: linearRegressionComplexity },
  { name: 'Logistic Regression', slug: 'logistic-regression', category: 'ml', complexity: logisticRegressionComplexity },
  { name: 'Decision Tree', slug: 'decision-tree', category: 'ml', complexity: decisionTreeComplexity },
]

/** Look up complexity by slug */
export function getComplexityBySlug(slug: string): ComplexityEntry | undefined {
  return complexityRegistry.find(e => e.slug === slug)
}

/** Get all algorithms in a given category */
export function getByCategory(category: ComplexityEntry['category']): ComplexityEntry[] {
  return complexityRegistry.filter(e => e.category === category)
}
