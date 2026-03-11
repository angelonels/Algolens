import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const algorithms = [
  // Dynamic Programming
  { label: '[DP] Edit Distance', path: '/edit-distance' },
  // Graph & Pathfinding
  { label: '[Graph] BFS Grid Search', path: '/bfs' },
  { label: '[Graph] DFS Grid Search', path: '/dfs' },
  { label: '[Graph] Dijkstra\'s Path', path: '/dijkstra' },
  // Machine Learning
  { label: '[ML] Decision Tree', path: '/decision-tree' },
  { label: '[ML] K-Means Clustering', path: '/kmeans' },
  { label: '[ML] Linear Regression', path: '/linear-regression' },
  { label: '[ML] Logistic Regression', path: '/logistic-regression' },
  // Math
  { label: '[Math] Euclidean GCD', path: '/gcd' },
  // Matrix
  { label: '[Matrix] Matrix Traversal', path: '/matrix-traversal' },
  // Search
  { label: '[Search] Binary Search', path: '/binary-search' },
  // Sorting
  { label: '[Sort] Bubble Sort', path: '/bubble-sort' },
  { label: '[Sort] Counting Sort', path: '/counting-sort' },
  { label: '[Sort] Heap Sort', path: '/heap-sort' },
  { label: '[Sort] Insertion Sort', path: '/insertion-sort' },
  { label: '[Sort] Merge Sort', path: '/merge-sort' },
  { label: '[Sort] Quick Sort', path: '/quick-sort' },
  { label: '[Sort] Radix Sort', path: '/radix-sort' },
  { label: '[Sort] Selection Sort', path: '/selection-sort' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const isHome = location.pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 px-6 sm:px-10 lg:px-14 flex items-center justify-between border-b border-[var(--border)] backdrop-blur-xl bg-[var(--bg)]/80 supports-[backdrop-filter]:bg-[var(--bg)]/80">
      {/* Left: Logo */}
      <Link to="/" className="no-underline">
        <span className="font-mono text-lg font-bold tracking-tight text-[var(--fg)]">
          ALGO <span className="text-[var(--accent)]">LENS</span>
        </span>
      </Link>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Back to Index */}
        {!isHome && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              to="/"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] no-underline hover:text-[var(--accent)] transition-colors"
            >
              ← Index
            </Link>
          </motion.div>
        )}

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] cursor-pointer hover:border-[var(--border-strong)] transition-colors text-base"
        >
          {isDark ? '☀' : '✦'}
        </motion.button>

        {/* Algorithm Selector */}
        <select
          value={location.pathname}
          onChange={e => navigate(e.target.value)}
          aria-label="Choose an algorithm to visualize"
          title="Choose an algorithm to visualize"
          className="font-mono text-xs font-medium px-3 py-2 border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] cursor-pointer min-w-[200px] hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15 outline-none transition-all"
        >
          <option value="/" disabled={isHome}>Select algorithm…</option>
          {algorithms.map(a => (
            <option key={a.path} value={a.path}>{a.label}</option>
          ))}
        </select>
      </div>
    </nav>
  )
}
