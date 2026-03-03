import { useState, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Link } from 'react-router-dom'
import { STAGGER, EASE_OUT } from '../utils/animationConfig'

interface Algorithm {
  name: string
  path: string
  tag: string
  desc: string
}

const algorithms: Algorithm[] = [
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
  { name: 'Decision Tree', path: '/decision-tree', tag: 'ML', desc: 'Recursive feature-space partitioning with Gini splits' },
]

const TAG_COLORS: Record<string, string> = {
  Sort: '#e63312', Search: '#2563eb', Graph: '#0891b2', Math: '#d97706',
  Matrix: '#7c3aed', DP: '#ea580c', ML: '#16a34a', Race: '#db2777',
}

const categories = ['All', ...Array.from(new Set(algorithms.map(a => a.tag)))]

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let result = algorithms
    if (activeFilter !== 'All') result = result.filter(a => a.tag === activeFilter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeFilter, searchQuery])

  return (
    <div className="relative pt-24 pb-16 px-10 max-w-[1100px] mx-auto min-h-screen">
      {/* Dot grid fade */}
      <div className="absolute top-0 left-0 w-full h-[400px] -z-10 pointer-events-none opacity-20" style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="var(--fg)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      </div>

      {/* Hero */}
      <motion.div
        initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        className="mb-14"
      >
        <motion.div
          variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } } }}
          className="w-12 h-1 bg-[var(--accent)] mb-5 origin-left"
        />
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } } }}
          className="font-mono font-extrabold text-[clamp(3.2rem,7vw,5.5rem)] leading-none tracking-tighter text-[var(--fg)] mb-5"
        >
          Algorithm<br />
          <span className="text-[var(--accent)]">Visualizer</span>
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } } }}
          className="text-[17px] leading-relaxed text-[var(--fg-muted)] max-w-[480px]"
        >
          Step through searching, sorting, and graph algorithms with interactive, real-time visual explanations.
        </motion.p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT }}
        className="border-t border-[var(--border)] mb-6 origin-left"
      />

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35, ease: EASE_OUT }}
        className="flex justify-between items-center flex-wrap gap-3 mb-6"
      >
        <div className="flex gap-1.5 flex-wrap relative">
          <LayoutGroup>
            {categories.map(cat => {
              const isActive = cat === activeFilter
              const color = cat === 'All' ? 'var(--fg)' : (TAG_COLORS[cat] ?? 'var(--fg)')
              return (
                <motion.button
                  key={cat} layout
                  onClick={() => setActiveFilter(cat)}
                  className="font-mono text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 border cursor-pointer transition-all"
                  style={{
                    borderColor: isActive ? 'var(--border-strong)' : 'var(--border)',
                    background: isActive ? color : 'transparent',
                    color: isActive ? '#fff' : 'var(--fg-muted)',
                    boxShadow: isActive ? '2px 2px 0px var(--border-strong)' : 'none',
                    transform: isActive ? 'translate(-2px,-2px)' : 'none',
                  }}
                  whileHover={!isActive ? { borderColor: 'var(--border-strong)', color: 'var(--fg)', y: -2, x: -2, boxShadow: '2px 2px 0px var(--border-strong)' } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  {cat}
                  {isActive && cat !== 'All' && (
                    <span className="ml-1.5 opacity-70 text-[10px]">
                      {algorithms.filter(a => a.tag === cat).length}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </LayoutGroup>
        </div>

        <div className="relative">
          <input
            type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search algorithms…"
            className="font-mono text-xs font-medium py-1.5 pl-8 pr-3.5 border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] w-[220px] outline-none transition-all focus:border-[var(--border-strong)] focus:shadow-[3px_3px_0px_var(--accent)] focus:-translate-x-0.5 focus:-translate-y-0.5"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-[var(--fg-muted)] pointer-events-none">⌕</span>
        </div>
      </motion.div>

      {/* Count */}
      <div className="flex justify-between items-center mb-5">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${activeFilter}-${searchQuery}`}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {filtered.length} {filtered.length === 1 ? 'Algorithm' : 'Algorithms'}
              {activeFilter !== 'All' ? ` in ${activeFilter}` : ' Available'}
            </motion.span>
          </AnimatePresence>
        </span>
        {(activeFilter !== 'All' || searchQuery) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            onClick={() => { setActiveFilter('All'); setSearchQuery('') }}
            className="font-mono text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 border border-[var(--border)] bg-transparent text-[var(--fg-muted)] cursor-pointer transition-all hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
            whileHover={{ x: -2, y: -2, boxShadow: '2px 2px 0px var(--accent)' }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filters ✕
          </motion.button>
        )}
      </div>

      {/* Grid */}
      <motion.div
        layout
        variants={{ hidden: {}, visible: { transition: STAGGER.fast } }}
        initial="hidden" animate="visible"
        className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((algo, i) => (
            <motion.div
              key={algo.path} layout
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE_OUT, delay: i * 0.03 } },
              }}
              initial="hidden" animate="visible"
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ layout: { duration: 0.3, ease: EASE_OUT } }}
            >
              <Link to={algo.path} className="no-underline text-inherit">
                <div
                  className="algo-card relative p-5 bg-[var(--surface)] border border-[var(--border)] -mt-px -ml-px cursor-pointer transition-all flex justify-between items-start gap-4 hover:z-10 hover:border-[var(--border-strong)]"
                  style={{ zIndex: 0 }}
                  onMouseEnter={e => {
                    const c = TAG_COLORS[algo.tag] ?? '#e63312'
                    e.currentTarget.style.boxShadow = `4px 4px 0px ${c}`
                    e.currentTarget.style.transform = 'translate(-4px,-4px)'
                    const arrow = e.currentTarget.querySelector<HTMLElement>('.arrow')
                    if (arrow) { arrow.style.color = c; arrow.style.transform = 'translateX(4px)' }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'none'
                    const arrow = e.currentTarget.querySelector<HTMLElement>('.arrow')
                    if (arrow) { arrow.style.color = 'var(--border)'; arrow.style.transform = 'none' }
                  }}
                >
                  <div>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: TAG_COLORS[algo.tag] ?? 'var(--accent)' }}>
                      {algo.tag}
                    </span>
                    <span className="font-mono text-base font-bold text-[var(--fg)] block mb-1.5">{algo.name}</span>
                    <span className="text-[13px] text-[var(--fg-muted)] leading-snug">{algo.desc}</span>
                  </div>
                  <span className="arrow font-mono text-lg text-[var(--border)] shrink-0 mt-1 transition-all">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="text-center py-20 border border-[var(--border)] bg-[var(--surface)] -mt-px"
          >
            <motion.div
              className="font-mono text-[40px] mb-4 inline-block opacity-30"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >∅</motion.div>
            <div className="font-mono text-sm font-semibold text-[var(--fg)] mb-2">No algorithms found</div>
            <div className="text-[13px] text-[var(--fg-muted)] mb-5">Try adjusting your filters or search query.</div>
            <motion.button
              onClick={() => { setActiveFilter('All'); setSearchQuery('') }}
              className="font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 border border-[var(--border-strong)] bg-[var(--fg)] text-[var(--bg)] cursor-pointer"
              style={{ boxShadow: '2px 2px 0px var(--border-strong)' }}
              whileHover={{ background: '#e63312', color: '#fff', x: -4, y: -4, boxShadow: '4px 4px 0px var(--border-strong)' }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-12 pt-6 border-t border-[var(--border)] text-center"
      >
        <span className="font-mono text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-wider">
          AlgoLens — Interactive Algorithm Visualizer
        </span>
      </motion.div>
    </div>
  )
}
