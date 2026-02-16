import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const algorithms = [
  { name: 'Binary Search', path: '/binary-search', tag: 'Search', desc: 'O(log n) — Divide and conquer on sorted arrays' },
  { name: 'Bubble Sort', path: '/bubble-sort', tag: 'Sort', desc: 'O(n²) — Adjacent pair comparison and swap' },
  { name: 'Insertion Sort', path: '/insertion-sort', tag: 'Sort', desc: 'O(n²) — Build sorted array one element at a time' },
  { name: 'Merge Sort', path: '/merge-sort', tag: 'Sort', desc: 'O(n log n) — Recursive divide, merge sorted halves' },
  { name: 'Quick Sort', path: '/quick-sort', tag: 'Sort', desc: 'O(n log n) — Partition around pivot element' },
  { name: 'Euclidean GCD', path: '/gcd', tag: 'Math', desc: 'O(log min(a,b)) — Greatest common divisor' },
  { name: 'Matrix Traversal', path: '/matrix-traversal', tag: 'Matrix', desc: 'Row-major, column-major, and diagonal walks' },
  { name: "Dijkstra's Path", path: '/dijkstra', tag: 'Graph', desc: 'O((V+E) log V) — Shortest path in weighted graphs' },
  { name: 'BFS Grid Search', path: '/bfs', tag: 'Graph', desc: 'O(V+E) — Layer-by-layer shortest path on grids' },
  { name: 'DFS Grid Search', path: '/dfs', tag: 'Graph', desc: 'O(V+E) — Stack-based depth-first exploration with backtracking' },
  { name: 'K-Means Clustering', path: '/kmeans', tag: 'ML', desc: 'O(nki) — Unsupervised partitioning into k clusters' },
  { name: 'Edit Distance (DP)', path: '/edit-distance', tag: 'DP', desc: 'O(mn) — Minimum operations to transform one string into another' }
]

export default function Home() {
  return (
    <div style={{
      padding: '100px 40px 60px',
      maxWidth: '1100px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '56px' }}
      >
        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: '#0a0a0a',
          marginBottom: '16px'
        }}>
          Algorithm<br />
          <span style={{ color: '#e63312' }}>Visualizer</span>
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          lineHeight: 1.6,
          color: '#6b6b60',
          maxWidth: '440px'
        }}>
          Step through searching, sorting, and graph algorithms
          with interactive, real-time visual explanations.
        </p>
      </motion.div>

      {/* ── Divider ── */}
      <div style={{
        borderTop: '1px solid #d4d0c8',
        marginBottom: '32px'
      }} />

      {/* ── Section Label ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#6b6b60',
          marginBottom: '20px'
        }}
      >
        {algorithms.length} Algorithms Available
      </motion.div>

      {/* ── Algorithm Grid ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '0px'
        }}
      >
        {algorithms.map((algo, index) => (
          <Link
            key={algo.path}
            to={algo.path}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35 + index * 0.04,
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                padding: '20px 24px',
                background: '#ffffff',
                border: '1px solid #d4d0c8',
                marginTop: '-1px',
                marginLeft: '-1px',
                cursor: 'pointer',
                transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e63312'
                e.currentTarget.style.zIndex = '1'
                e.currentTarget.style.position = 'relative'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d4d0c8'
                e.currentTarget.style.zIndex = '0'
                e.currentTarget.style.position = 'relative'
              }}
            >
              <div>
                {/* Tag */}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#e63312',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  {algo.tag}
                </span>
                {/* Name */}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0a0a0a',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  {algo.name}
                </span>
                {/* Description */}
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  color: '#6b6b60',
                  lineHeight: 1.4
                }}>
                  {algo.desc}
                </span>
              </div>
              {/* Arrow */}
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '18px',
                color: '#d4d0c8',
                flexShrink: 0,
                marginTop: '4px',
                transition: 'color 150ms'
              }}>
                →
              </span>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
