import { Link, useLocation, useNavigate } from 'react-router-dom'

const algorithms = [
  { name: 'Binary Search', path: '/binary-search', tag: 'Search' },
  { name: 'Bubble Sort', path: '/bubble-sort', tag: 'Sort' },
  { name: 'Insertion Sort', path: '/insertion-sort', tag: 'Sort' },
  { name: 'Merge Sort', path: '/merge-sort', tag: 'Sort' },
  { name: 'Quick Sort', path: '/quick-sort', tag: 'Sort' },
  { name: 'Euclidean GCD', path: '/gcd', tag: 'Math' },
  { name: 'Matrix Traversal', path: '/matrix-traversal', tag: 'Matrix' },
  { name: "Dijkstra's Path", path: '/dijkstra', tag: 'Graph' },
  { name: 'BFS Grid Search', path: '/bfs', tag: 'Graph' },
  { name: 'DFS Grid Search', path: '/dfs', tag: 'Graph' },
  { name: 'K-Means Clustering', path: '/kmeans', tag: 'ML' },
  { name: 'Edit Distance (DP)', path: '/edit-distance', tag: 'DP' },
  { name: 'Linear Regression', path: '/linear-regression', tag: 'ML' },
  { name: 'Logistic Regression', path: '/logistic-regression', tag: 'ML' },
  { name: 'Decision Tree', path: '/decision-tree', tag: 'ML' }
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: '52px',
      padding: '0 32px',
      backgroundColor: '#f5f0e8',
      borderBottom: '1px solid #d4d0c8',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Wordmark */}
      <Link
        to="/"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#0a0a0a',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>ALGO</span>
        <span style={{ color: '#e63312' }}>LENS</span>
      </Link>

      {/* Algorithm Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!isHome && (
          <Link
            to="/"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#6b6b60',
              textDecoration: 'none',
              transition: 'color 150ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e63312'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b6b60'}
          >
            ← Index
          </Link>
        )}
        <select
          value={location.pathname}
          onChange={(e) => navigate(e.target.value)}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            fontWeight: 500,
            padding: '6px 10px',
            border: '1px solid #d4d0c8',
            borderRadius: '0px',
            background: '#ffffff',
            color: '#0a0a0a',
            cursor: 'pointer',
            minWidth: '160px'
          }}
        >
          <option value="/" disabled={isHome}>Select algorithm…</option>
          {algorithms.map(algo => (
            <option key={algo.path} value={algo.path}>
              [{algo.tag}] {algo.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  )
}
