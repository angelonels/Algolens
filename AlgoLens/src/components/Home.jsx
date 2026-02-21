import { useState, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
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
  { name: 'Algorithm Race', path: '/race', tag: 'Race', desc: 'Pit two sorting algorithms head-to-head on the same array' },
  { name: 'BFS Grid Search', path: '/bfs', tag: 'Graph', desc: 'O(V+E) — Layer-by-layer shortest path on grids' },
  { name: 'DFS Grid Search', path: '/dfs', tag: 'Graph', desc: 'O(V+E) — Stack-based depth-first exploration with backtracking' },
  { name: 'K-Means Clustering', path: '/kmeans', tag: 'ML', desc: 'O(nki) — Unsupervised partitioning into k clusters' },
  { name: 'Edit Distance (DP)', path: '/edit-distance', tag: 'DP', desc: 'O(mn) — Minimum operations to transform one string into another' },
  { name: 'Linear Regression', path: '/linear-regression', tag: 'ML', desc: 'Gradient descent fitting — watch the regression line converge' },
  { name: 'Logistic Regression', path: '/logistic-regression', tag: 'ML', desc: 'Sigmoid decision boundary with binary classification' },
  { name: 'Decision Tree', path: '/decision-tree', tag: 'ML', desc: 'Recursive feature-space partitioning with Gini splits' }
]

const TAG_COLORS = {
  Sort: '#e63312',
  Search: '#2563eb',
  Graph: '#0891b2',
  Math: '#d97706',
  Matrix: '#7c3aed',
  DP: '#ea580c',
  ML: '#16a34a',
  Race: '#db2777'
}

// Derive unique categories from algorithms
const categories = ['All', ...Array.from(new Set(algorithms.map(a => a.tag)))]

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let result = algorithms
    if (activeFilter !== 'All') {
      result = result.filter(a => a.tag === activeFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.tag.toLowerCase().includes(q) ||
          a.desc.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeFilter, searchQuery])

  return (
    <div style={{
      position: 'relative',
      padding: '100px 40px 60px',
      maxWidth: '1100px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {/* ── Animated Background ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '400px',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.2,
        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
      }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#0a0a0a" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      </div>

      {/* ── Hero ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        style={{ marginBottom: '56px', position: 'relative' }}
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
          }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            fontSize: 'clamp(3.2rem, 7vw, 5.5rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: '#0a0a0a',
            marginBottom: '20px',
            textShadow: '3px 3px 0px rgba(0,0,0,0.06)'
          }}
        >
          Algorithm<br />
          <span style={{ color: '#e63312' }}>Visualizer</span>
        </motion.h1>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
          }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#6b6b60',
            maxWidth: '480px'
          }}
        >
          Step through searching, sorting, and graph algorithms
          with interactive, real-time visual explanations.
        </motion.p>
      </motion.div>

      {/* ── Divider ── */}
      <div style={{
        borderTop: '1px solid #d4d0c8',
        marginBottom: '24px'
      }} />

      {/* ── Filter Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          position: 'relative'
        }}>
          <LayoutGroup>
            {categories.map(cat => {
              const isActive = cat === activeFilter
              const catColor = cat === 'All' ? '#0a0a0a' : (TAG_COLORS[cat] || '#0a0a0a')
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  layout
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '7px 14px',
                    border: `1px solid ${isActive ? '#0a0a0a' : '#d4d0c8'}`,
                    borderRadius: '0px',
                    background: isActive ? catColor : 'transparent',
                    color: isActive ? '#ffffff' : '#6b6b60',
                    cursor: 'pointer',
                    transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    boxShadow: isActive ? `2px 2px 0px #0a0a0a` : '0px 0px 0px transparent',
                    transform: isActive ? 'translate(-2px, -2px)' : 'translate(0px, 0px)'
                  }}
                  whileHover={!isActive ? {
                    borderColor: '#0a0a0a',
                    color: '#0a0a0a',
                    y: -2,
                    x: -2,
                    boxShadow: '2px 2px 0px #0a0a0a'
                  } : {
                    y: -3,
                    x: -3,
                    boxShadow: '3px 3px 0px #0a0a0a'
                  }}
                  whileTap={{ scale: 0.97, y: 0, x: 0, boxShadow: '0px 0px 0px transparent' }}
                >
                  {cat}
                  {isActive && cat !== 'All' && (
                    <motion.span
                      layoutId="filterCount"
                      style={{
                        marginLeft: '6px',
                        opacity: 0.7,
                        fontSize: '10px'
                      }}
                    >
                      {algorithms.filter(a => a.tag === cat).length}
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </LayoutGroup>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search algorithms…"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 500,
              padding: '7px 14px 7px 32px',
              border: '1px solid #d4d0c8',
              borderRadius: '0px',
              background: '#ffffff',
              color: '#0a0a0a',
              width: '220px',
              outline: 'none',
              transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0px 0px 0px transparent'
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#0a0a0a'
              e.currentTarget.style.boxShadow = '3px 3px 0px #e63312'
              e.currentTarget.style.transform = 'translate(-2px, -2px)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#d4d0c8'
              e.currentTarget.style.boxShadow = '0px 0px 0px transparent'
              e.currentTarget.style.transform = 'translate(0px, 0px)'
            }}
          />
          {/* Search Icon */}
          <span style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '13px',
            color: '#6b6b60',
            pointerEvents: 'none'
          }}>
            ⌕
          </span>
        </div>
      </motion.div>

      {/* ── Section Label ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#6b6b60'
        }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${activeFilter}-${searchQuery}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {filtered.length} {filtered.length === 1 ? 'Algorithm' : 'Algorithms'}
              {activeFilter !== 'All' ? ` in ${activeFilter}` : ' Available'}
            </motion.span>
          </AnimatePresence>
        </span>
        {activeFilter !== 'All' || searchQuery ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => { setActiveFilter('All'); setSearchQuery('') }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 10px',
              border: '1px solid #d4d0c8',
              borderRadius: '0px',
              background: 'transparent',
              color: '#6b6b60',
              cursor: 'pointer',
              transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            whileHover={{
              borderColor: '#0a0a0a',
              color: '#0a0a0a',
              x: -2,
              y: -2,
              boxShadow: '2px 2px 0px #e63312'
            }}
            whileTap={{ x: 0, y: 0, boxShadow: '0px 0px 0px transparent', scale: 0.95 }}
          >
            Clear Filters ✕
          </motion.button>
        ) : null}
      </motion.div>

      {/* ── Algorithm Grid ── */}
      <motion.div
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '0px'
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((algo) => (
            <motion.div
              key={algo.path}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
                layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              }}
            >
              <Link
                to={algo.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    padding: '20px 24px',
                    background: '#ffffff',
                    border: '1px solid #d4d0c8',
                    marginTop: '-1px',
                    marginLeft: '-1px',
                    cursor: 'pointer',
                    transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    position: 'relative',
                    zIndex: 0
                  }}
                  className="algo-card"
                  onMouseEnter={(e) => {
                    const color = TAG_COLORS[algo.tag] || '#e63312'
                    e.currentTarget.style.borderColor = '#0a0a0a'
                    e.currentTarget.style.zIndex = '1'
                    e.currentTarget.style.boxShadow = `4px 4px 0px ${color}`
                    e.currentTarget.style.transform = 'translate(-4px, -4px)'
                    const arrow = e.currentTarget.querySelector('.algo-arrow')
                    if (arrow) {
                      arrow.style.color = color
                      arrow.style.transform = 'translateX(4px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d4d0c8'
                    e.currentTarget.style.zIndex = '0'
                    e.currentTarget.style.boxShadow = '0px 0px 0px transparent'
                    e.currentTarget.style.transform = 'translate(0px, 0px)'
                    const arrow = e.currentTarget.querySelector('.algo-arrow')
                    if (arrow) {
                      arrow.style.color = '#d4d0c8'
                      arrow.style.transform = 'translateX(0px)'
                    }
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
                      color: TAG_COLORS[algo.tag] || '#e63312',
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
                  <span
                    className="algo-arrow"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '18px',
                      color: '#d4d0c8',
                      flexShrink: 0,
                      marginTop: '4px',
                      transition: 'color 150ms, transform 150ms'
                    }}
                  >
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Empty State ── */}
      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              textAlign: 'center',
              padding: '80px 40px',
              border: '1px solid #d4d0c8',
              background: '#ffffff',
              marginTop: '-1px'
            }}
          >
            <motion.div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '40px',
                marginBottom: '16px',
                opacity: 0.3,
                display: 'inline-block'
              }}
              animate={{ rotate: 180 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              ∅
            </motion.div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              fontWeight: 600,
              color: '#0a0a0a',
              marginBottom: '8px'
            }}>
              No algorithms found
            </div>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: '#6b6b60',
              marginBottom: '20px'
            }}>
              Try adjusting your filters or search query.
            </div>
            <motion.button
              onClick={() => { setActiveFilter('All'); setSearchQuery('') }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '10px 24px',
                border: '1px solid #0a0a0a',
                borderRadius: '0px',
                background: '#0a0a0a',
                color: '#f5f0e8',
                cursor: 'pointer',
                boxShadow: '0px 0px 0px transparent',
                transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              whileHover={{
                background: '#e63312',
                borderColor: '#0a0a0a',
                color: '#ffffff',
                x: -4,
                y: -4,
                boxShadow: '4px 4px 0px #0a0a0a'
              }}
              whileTap={{ scale: 0.95, x: 0, y: 0, boxShadow: '0px 0px 0px transparent' }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
