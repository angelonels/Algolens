import type { ComponentType } from 'react'
import { lazy } from 'react'

// ── Types ──
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface ComplexityMetrics {
  best: string
  average: string
  worst: string
  space: string
}

export interface AlgorithmEntry {
  name: string
  path: string
  tag: string
  desc: string
  difficulty: Difficulty
  complexity: ComplexityMetrics
  stable?: boolean
  inPlace?: boolean
  useCase: string
  learnMore: string
  component: React.LazyExoticComponent<ComponentType>
}

// ── Tag Colors ──
export const TAG_COLORS: Record<string, string> = {
  Sort: '#e63312',
  Search: '#2563eb',
  Graph: '#0891b2',
  Math: '#d97706',
  Matrix: '#7c3aed',
  DP: '#ea580c',
  ML: '#16a34a',
}

// ── Difficulty Colors ──
export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner: '#16a34a',
  Intermediate: '#d97706',
  Advanced: '#dc2626',
}

// ── Algorithm Registry ──
// Single source of truth for all algorithm metadata
export const ALGORITHMS: AlgorithmEntry[] = [
  { name: 'Binary Search', path: '/binary-search', tag: 'Search', difficulty: 'Beginner', desc: 'O(log n) — Divide and conquer on sorted arrays', complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' }, inPlace: true, useCase: 'Fast lookups on sorted data.', learnMore: 'Best when random access is cheap and the input stays ordered.', component: lazy(() => import('../visualizers/BinarySearch')) },
  { name: 'Bubble Sort', path: '/bubble-sort', tag: 'Sort', difficulty: 'Beginner', desc: 'O(n²) — Adjacent pair comparison and swap', complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }, stable: true, inPlace: true, useCase: 'Teaching swaps, inversions, and early exits.', learnMore: 'Simple to reason about, but inefficient on large datasets.', component: lazy(() => import('../visualizers/BubbleSort')) },
  { name: 'Insertion Sort', path: '/insertion-sort', tag: 'Sort', difficulty: 'Beginner', desc: 'O(n²) — Build sorted array one element at a time', complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }, stable: true, inPlace: true, useCase: 'Small arrays or nearly sorted inputs.', learnMore: 'Often used inside hybrid sorts for tiny partitions.', component: lazy(() => import('../visualizers/InsertionSort')) },
  { name: 'Merge Sort', path: '/merge-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(n log n) — Recursive divide, merge sorted halves', complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' }, stable: true, useCase: 'Consistent performance and stable sorting.', learnMore: 'Good default when worst-case guarantees matter more than memory.', component: lazy(() => import('../visualizers/MergeSort')) },
  { name: 'Quick Sort', path: '/quick-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(n log n) — Partition around pivot element', complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' }, inPlace: true, useCase: 'Fast general-purpose sorting with good pivots.', learnMore: 'Excellent average-case performance, but sensitive to pivot strategy.', component: lazy(() => import('../visualizers/QuickSort')) },
  { name: 'Selection Sort', path: '/selection-sort', tag: 'Sort', difficulty: 'Beginner', desc: 'O(n²) — Find minimum and swap into position', complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }, inPlace: true, useCase: 'Teaching minimal-write sorting behavior.', learnMore: 'Makes few swaps, but still pays the full comparison cost.', component: lazy(() => import('../visualizers/SelectionSort')) },
  { name: 'Heap Sort', path: '/heap-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(n log n) — Binary heap extraction sort', complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }, inPlace: true, useCase: 'In-place sorting with strong worst-case bounds.', learnMore: 'Useful when memory is tight and guaranteed O(n log n) is required.', component: lazy(() => import('../visualizers/HeapSort')) },
  { name: 'Counting Sort', path: '/counting-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(n+k) — Non-comparison count-based sort', complexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)' }, stable: true, useCase: 'Integers with a small bounded range.', learnMore: 'Trades extra memory for linear time when value ranges are manageable.', component: lazy(() => import('../visualizers/CountingSort')) },
  { name: 'Radix Sort', path: '/radix-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(d×n) — Non-comparison digit-by-digit sort', complexity: { best: 'O(d·n)', average: 'O(d·n)', worst: 'O(d·n)', space: 'O(n+k)' }, stable: true, useCase: 'Sorting fixed-width numbers or strings.', learnMore: 'Depends on a stable inner pass such as counting sort.', component: lazy(() => import('../visualizers/RadixSort')) },
  { name: 'Euclidean GCD', path: '/gcd', tag: 'Math', difficulty: 'Beginner', desc: 'O(log min(a,b)) — Greatest common divisor', complexity: { best: 'O(1)', average: 'O(log min(a,b))', worst: 'O(log min(a,b))', space: 'O(1)' }, inPlace: true, useCase: 'Reducing fractions and modular arithmetic.', learnMore: 'One of the cleanest examples of repeated reduction by modulo.', component: lazy(() => import('../visualizers/EuclideanGCD')) },
  { name: 'Matrix Traversal', path: '/matrix-traversal', tag: 'Matrix', difficulty: 'Beginner', desc: 'Row-major, column-major, and diagonal walks', complexity: { best: 'O(m×n)', average: 'O(m×n)', worst: 'O(m×n)', space: 'O(1)' }, inPlace: true, useCase: 'Understanding memory order and scan patterns.', learnMore: 'A foundation for image processing, DP tables, and grid problems.', component: lazy(() => import('../visualizers/MatrixTraversal')) },
  { name: "Dijkstra's Path", path: '/dijkstra', tag: 'Graph', difficulty: 'Advanced', desc: 'O((V+E) log V) — Shortest path in weighted graphs', complexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' }, useCase: 'Shortest paths with non-negative edge weights.', learnMore: 'The right baseline before stepping up to A* or more specialized graph methods.', component: lazy(() => import('../visualizers/DijkstraPath')) },
  { name: 'BFS Grid Search', path: '/bfs', tag: 'Graph', difficulty: 'Intermediate', desc: 'O(V+E) — Layer-by-layer shortest path on grids', complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' }, useCase: 'Shortest unweighted paths on grids and graphs.', learnMore: 'Great for showing frontier expansion and level-order exploration.', component: lazy(() => import('../visualizers/BFSGrid')) },
  { name: 'DFS Grid Search', path: '/dfs', tag: 'Graph', difficulty: 'Intermediate', desc: 'O(V+E) — Stack-based depth-first exploration with backtracking', complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' }, useCase: 'Traversal, connectivity, and backtracking intuition.', learnMore: 'Useful for exploration patterns, but not guaranteed shortest paths.', component: lazy(() => import('../visualizers/DFSGrid')) },
  { name: 'K-Means Clustering', path: '/kmeans', tag: 'ML', difficulty: 'Advanced', desc: 'O(nki) — Unsupervised partitioning into k clusters', complexity: { best: 'O(n·k·i)', average: 'O(n·k·i)', worst: 'O(n·k·i)', space: 'O(n+k)' }, useCase: 'Grouping unlabeled points into clusters.', learnMore: 'Sensitive to initialization, so visual iteration counts matter.', component: lazy(() => import('../visualizers/KMeans')) },
  { name: 'Edit Distance (DP)', path: '/edit-distance', tag: 'DP', difficulty: 'Advanced', desc: 'O(mn) — Minimum operations to transform one string into another', complexity: { best: 'O(m×n)', average: 'O(m×n)', worst: 'O(m×n)', space: 'O(m×n)' }, useCase: 'Spell-checking, diffing, and sequence similarity.', learnMore: 'A classic dynamic-programming table where local choices build a global answer.', component: lazy(() => import('../visualizers/EditDistance')) },
  { name: 'Linear Regression', path: '/linear-regression', tag: 'ML', difficulty: 'Intermediate', desc: 'Gradient descent fitting — watch the regression line converge', complexity: { best: 'O(n·e)', average: 'O(n·e)', worst: 'O(n·e)', space: 'O(n)' }, useCase: 'Continuous-value prediction and optimization intuition.', learnMore: 'Connects iterative optimization directly to a visible loss landscape.', component: lazy(() => import('../visualizers/LinearRegression')) },
  { name: 'Logistic Regression', path: '/logistic-regression', tag: 'ML', difficulty: 'Advanced', desc: 'Sigmoid decision boundary with binary classification', complexity: { best: 'O(n·e)', average: 'O(n·e)', worst: 'O(n·e)', space: 'O(n)' }, useCase: 'Binary classification with interpretable decision boundaries.', learnMore: 'Useful for seeing how gradient updates reshape probability estimates.', component: lazy(() => import('../visualizers/LogisticRegression')) },
  { name: 'Decision Tree', path: '/decision-tree', tag: 'ML', difficulty: 'Advanced', desc: 'Recursive feature-space partitioning with Gini splits', complexity: { best: 'O(n·m·log n)', average: 'O(n·m·log n)', worst: 'O(n²·m)', space: 'O(n)' }, useCase: 'Interpretable rule-based classification.', learnMore: 'Highlights how greedy local splits create a globally readable model.', component: lazy(() => import('../visualizers/DecisionTree')) },
]

// ── Derived Data ──

/** All algorithm route paths, in order */
export const ALGO_ROUTES: string[] = ALGORITHMS.map(a => a.path)

/** Unique category tags derived from the registry */
export const CATEGORIES: string[] = ['All', ...Array.from(new Set(ALGORITHMS.map(a => a.tag)))]

/** Navbar-formatted algorithm entries, sorted by [Tag] Name */
export function getNavbarAlgorithms(): { label: string; path: string }[] {
  return ALGORITHMS
    .map(a => ({ label: `[${a.tag}] ${a.name}`, path: a.path }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

/** Difficulty distribution stats */
export function getDifficultyStats(): Record<Difficulty, number> {
  return ALGORITHMS.reduce((acc, a) => {
    acc[a.difficulty] = (acc[a.difficulty] || 0) + 1
    return acc
  }, {} as Record<Difficulty, number>)
}

/** Unique difficulty levels derived from the registry */
export const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced']
