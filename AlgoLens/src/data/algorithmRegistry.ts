import type { ComponentType } from 'react'
import { lazy } from 'react'

// ── Types ──
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export interface AlgorithmEntry {
  name: string
  path: string
  tag: string
  desc: string
  difficulty: Difficulty
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
  { name: 'Binary Search', path: '/binary-search', tag: 'Search', difficulty: 'Beginner', desc: 'O(log n) — Divide and conquer on sorted arrays', component: lazy(() => import('../visualizers/BinarySearch')) },
  { name: 'Bubble Sort', path: '/bubble-sort', tag: 'Sort', difficulty: 'Beginner', desc: 'O(n²) — Adjacent pair comparison and swap', component: lazy(() => import('../visualizers/BubbleSort')) },
  { name: 'Insertion Sort', path: '/insertion-sort', tag: 'Sort', difficulty: 'Beginner', desc: 'O(n²) — Build sorted array one element at a time', component: lazy(() => import('../visualizers/InsertionSort')) },
  { name: 'Merge Sort', path: '/merge-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(n log n) — Recursive divide, merge sorted halves', component: lazy(() => import('../visualizers/MergeSort')) },
  { name: 'Quick Sort', path: '/quick-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(n log n) — Partition around pivot element', component: lazy(() => import('../visualizers/QuickSort')) },
  { name: 'Selection Sort', path: '/selection-sort', tag: 'Sort', difficulty: 'Beginner', desc: 'O(n²) — Find minimum and swap into position', component: lazy(() => import('../visualizers/SelectionSort')) },
  { name: 'Heap Sort', path: '/heap-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(n log n) — Binary heap extraction sort', component: lazy(() => import('../visualizers/HeapSort')) },
  { name: 'Counting Sort', path: '/counting-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(n+k) — Non-comparison count-based sort', component: lazy(() => import('../visualizers/CountingSort')) },
  { name: 'Radix Sort', path: '/radix-sort', tag: 'Sort', difficulty: 'Intermediate', desc: 'O(d×n) — Non-comparison digit-by-digit sort', component: lazy(() => import('../visualizers/RadixSort')) },
  { name: 'Euclidean GCD', path: '/gcd', tag: 'Math', difficulty: 'Beginner', desc: 'O(log min(a,b)) — Greatest common divisor', component: lazy(() => import('../visualizers/EuclideanGCD')) },
  { name: 'Matrix Traversal', path: '/matrix-traversal', tag: 'Matrix', difficulty: 'Beginner', desc: 'Row-major, column-major, and diagonal walks', component: lazy(() => import('../visualizers/MatrixTraversal')) },
  { name: "Dijkstra's Path", path: '/dijkstra', tag: 'Graph', difficulty: 'Advanced', desc: 'O((V+E) log V) — Shortest path in weighted graphs', component: lazy(() => import('../visualizers/DijkstraPath')) },
  { name: 'BFS Grid Search', path: '/bfs', tag: 'Graph', difficulty: 'Intermediate', desc: 'O(V+E) — Layer-by-layer shortest path on grids', component: lazy(() => import('../visualizers/BFSGrid')) },
  { name: 'DFS Grid Search', path: '/dfs', tag: 'Graph', difficulty: 'Intermediate', desc: 'O(V+E) — Stack-based depth-first exploration with backtracking', component: lazy(() => import('../visualizers/DFSGrid')) },
  { name: 'K-Means Clustering', path: '/kmeans', tag: 'ML', difficulty: 'Advanced', desc: 'O(nki) — Unsupervised partitioning into k clusters', component: lazy(() => import('../visualizers/KMeans')) },
  { name: 'Edit Distance (DP)', path: '/edit-distance', tag: 'DP', difficulty: 'Advanced', desc: 'O(mn) — Minimum operations to transform one string into another', component: lazy(() => import('../visualizers/EditDistance')) },
  { name: 'Linear Regression', path: '/linear-regression', tag: 'ML', difficulty: 'Intermediate', desc: 'Gradient descent fitting — watch the regression line converge', component: lazy(() => import('../visualizers/LinearRegression')) },
  { name: 'Logistic Regression', path: '/logistic-regression', tag: 'ML', difficulty: 'Advanced', desc: 'Sigmoid decision boundary with binary classification', component: lazy(() => import('../visualizers/LogisticRegression')) },
  { name: 'Decision Tree', path: '/decision-tree', tag: 'ML', difficulty: 'Advanced', desc: 'Recursive feature-space partitioning with Gini splits', component: lazy(() => import('../visualizers/DecisionTree')) },
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
