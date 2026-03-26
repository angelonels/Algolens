// Complexity metadata for all algorithms in the registry

export interface ComplexityInfo {
  name: string
  path: string
  tag: string
  best: string
  average: string
  worst: string
  space: string
  stable?: boolean
  notes?: string
}

export const COMPLEXITY_DATA: ComplexityInfo[] = [
  // ── Sorting ──
  { name: 'Bubble Sort', path: '/bubble-sort', tag: 'Sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, notes: 'Optimized with early exit on no swaps' },
  { name: 'Insertion Sort', path: '/insertion-sort', tag: 'Sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, notes: 'Efficient for small or nearly sorted arrays' },
  { name: 'Selection Sort', path: '/selection-sort', tag: 'Sort', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false, notes: 'Always makes n²/2 comparisons' },
  { name: 'Merge Sort', path: '/merge-sort', tag: 'Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true, notes: 'Divide and conquer, guaranteed performance' },
  { name: 'Quick Sort', path: '/quick-sort', tag: 'Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false, notes: 'Worst case with bad pivot selection' },
  { name: 'Heap Sort', path: '/heap-sort', tag: 'Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false, notes: 'In-place, uses binary heap' },
  { name: 'Counting Sort', path: '/counting-sort', tag: 'Sort', best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)', stable: true, notes: 'Non-comparison, k = range of input' },
  { name: 'Radix Sort', path: '/radix-sort', tag: 'Sort', best: 'O(d·n)', average: 'O(d·n)', worst: 'O(d·n)', space: 'O(n+k)', stable: true, notes: 'd = number of digits' },

  // ── Searching ──
  { name: 'Binary Search', path: '/binary-search', tag: 'Search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)', notes: 'Requires sorted input' },

  // ── Graph ──
  { name: "Dijkstra's Path", path: '/dijkstra', tag: 'Graph', best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)', notes: 'Min-heap priority queue' },
  { name: 'BFS Grid Search', path: '/bfs', tag: 'Graph', best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)', notes: 'Finds shortest unweighted path' },
  { name: 'DFS Grid Search', path: '/dfs', tag: 'Graph', best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)', notes: 'Uses recursion stack / explicit stack' },

  // ── Math ──
  { name: 'Euclidean GCD', path: '/gcd', tag: 'Math', best: 'O(1)', average: 'O(log min(a,b))', worst: 'O(log min(a,b))', space: 'O(1)', notes: 'Repeated modulo division' },

  // ── Matrix ──
  { name: 'Matrix Traversal', path: '/matrix-traversal', tag: 'Matrix', best: 'O(m×n)', average: 'O(m×n)', worst: 'O(m×n)', space: 'O(1)', notes: 'Row, column, diagonal orders' },

  // ── DP ──
  { name: 'Edit Distance', path: '/edit-distance', tag: 'DP', best: 'O(m×n)', average: 'O(m×n)', worst: 'O(m×n)', space: 'O(m×n)', notes: 'Wagner–Fischer algorithm' },

  // ── ML ──
  { name: 'K-Means Clustering', path: '/kmeans', tag: 'ML', best: 'O(n·k·i)', average: 'O(n·k·i)', worst: 'O(n·k·i)', space: 'O(n+k)', notes: 'i = iterations until convergence' },
  { name: 'Linear Regression', path: '/linear-regression', tag: 'ML', best: 'O(n·e)', average: 'O(n·e)', worst: 'O(n·e)', space: 'O(n)', notes: 'e = gradient descent epochs' },
  { name: 'Logistic Regression', path: '/logistic-regression', tag: 'ML', best: 'O(n·e)', average: 'O(n·e)', worst: 'O(n·e)', space: 'O(n)', notes: 'Sigmoid + gradient descent' },
  { name: 'Decision Tree', path: '/decision-tree', tag: 'ML', best: 'O(n·m·log n)', average: 'O(n·m·log n)', worst: 'O(n²·m)', space: 'O(n)', notes: 'm = features, Gini splits' },
]
