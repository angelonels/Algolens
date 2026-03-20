import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Link } from 'react-router-dom'
import { STAGGER, EASE_OUT, STAGGER_TEXT, createTiltHandlers } from '../utils/animationConfig'

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
  { name: 'Selection Sort', path: '/selection-sort', tag: 'Sort', desc: 'O(n²) — Find minimum and swap into position' },
  { name: 'Heap Sort', path: '/heap-sort', tag: 'Sort', desc: 'O(n log n) — Binary heap extraction sort' },
  { name: 'Counting Sort', path: '/counting-sort', tag: 'Sort', desc: 'O(n+k) — Non-comparison count-based sort' },
  { name: 'Radix Sort', path: '/radix-sort', tag: 'Sort', desc: 'O(d×n) — Non-comparison digit-by-digit sort' },
  { name: 'Euclidean GCD', path: '/gcd', tag: 'Math', desc: 'O(log min(a,b)) — Greatest common divisor' },
  { name: 'Matrix Traversal', path: '/matrix-traversal', tag: 'Matrix', desc: 'Row-major, column-major, and diagonal walks' },
  { name: "Dijkstra's Path", path: '/dijkstra', tag: 'Graph', desc: 'O((V+E) log V) — Shortest path in weighted graphs' },
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
  Matrix: '#7c3aed', DP: '#ea580c', ML: '#16a34a',
}

const categories = ['All', ...Array.from(new Set(algorithms.map(a => a.tag)))]

// Staggered word reveal for hero text
function StaggerText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <motion.span
      variants={STAGGER_TEXT.container}
      initial="hidden"
      animate="visible"
      className={className}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.3em' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={STAGGER_TEXT.word}
          style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  // Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const tilt = useMemo(() => createTiltHandlers(8), [])

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

  const handleCardEnter = useCallback((e: React.MouseEvent<HTMLDivElement>, tag: string) => {
    const c = TAG_COLORS[tag] ?? '#e63312'
    e.currentTarget.style.boxShadow = `4px 4px 0px ${c}`
    const arrow = e.currentTarget.querySelector<HTMLElement>('.arrow')
    if (arrow) { arrow.style.color = c; arrow.style.transform = 'translateX(4px)' }
    tilt.handleMouseMove(e)
  }, [tilt])

  const handleCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = 'none'
    const arrow = e.currentTarget.querySelector<HTMLElement>('.arrow')
    if (arrow) { arrow.style.color = 'var(--border)'; arrow.style.transform = 'none' }
    tilt.handleMouseLeave(e)
  }, [tilt])

  return (
    <div className="relative pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-[1200px] mx-auto min-h-screen">
      {/* Dot grid fade */}
      <div className="absolute top-0 left-0 w-full h-[350px] -z-10 pointer-events-none opacity-15" style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dotGrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--fg)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
        </svg>
      </div>

      {/* Hero */}
      <motion.div
        initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        className="mb-16"
      >
        {/* Animated accent bar */}
        <motion.div
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: EASE_OUT } },
          }}
          className="w-10 h-1 bg-[var(--accent)] mb-6 origin-left"
          style={{ animation: 'float 4s ease-in-out infinite' }}
        />

        {/* Title with staggered word reveal */}
        <motion.h1
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.3 } },
          }}
          className="font-mono font-extrabold text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] tracking-tighter text-[var(--fg)] mb-5"
          style={{ perspective: '600px' }}
        >
          <StaggerText text="Algorithm" />
          <br />
          <span className="text-[var(--accent)]">
            <StaggerText text="Visualizer" />
          </span>
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE_OUT } },
          }}
          className="text-base leading-relaxed text-[var(--fg-muted)] max-w-[520px]"
        >
          Step through searching, sorting, and graph algorithms with interactive, real-time visual explanations.
        </motion.p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT }}
        className="border-t border-[var(--border)] mb-8 origin-left"
      />

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35, ease: EASE_OUT }}
        className="flex justify-between items-center flex-wrap gap-4 mb-4"
      >
        <div className="flex gap-2 flex-wrap">
          <LayoutGroup>
            {categories.map(cat => {
              const isActive = cat === activeFilter
              const color = cat === 'All' ? 'var(--fg)' : (TAG_COLORS[cat] ?? 'var(--fg)')
              return (
                <motion.button
                  key={cat} layout
                  onClick={() => setActiveFilter(cat)}
                  className="font-mono text-[11px] font-bold uppercase tracking-widest px-4 py-2 border cursor-pointer transition-all relative overflow-hidden"
                  style={{
                    borderColor: isActive ? 'var(--border-strong)' : 'var(--border)',
                    background: isActive ? color : 'transparent',
                    color: isActive ? '#fff' : 'var(--fg-muted)',
                    boxShadow: isActive ? '2px 2px 0px var(--border-strong)' : 'none',
                    transform: isActive ? 'translate(-2px,-2px)' : 'none',
                  }}
                  whileHover={!isActive ? { borderColor: 'var(--border-strong)', color: 'var(--fg)', y: -2, x: -2, boxShadow: '2px 2px 0px var(--border-strong)' } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                  {isActive && cat !== 'All' && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.7, scale: 1 }}
                      className="ml-1.5 text-[10px]"
                    >
                      {algorithms.filter(a => a.tag === cat).length}
                    </motion.span>
                  )}
                  {/* Active indicator underline */}
                  {isActive && (
                    <motion.div
                      layoutId="filterIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/40"
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </LayoutGroup>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="relative">
            <input
              ref={searchRef}
              type="text" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search algorithms…"
              className="font-mono text-xs font-medium py-2 pl-9 pr-4 border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] w-[240px] outline-none transition-all focus:border-[var(--border-strong)] focus:shadow-[3px_3px_0px_var(--accent)] focus:-translate-x-0.5 focus:-translate-y-0.5"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--fg-muted)] pointer-events-none">⌕</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] text-[var(--fg-muted)] border border-[var(--border)] px-1.5 py-1 rounded opacity-60">⌘K</kbd>
        </div>
      </motion.div>

      {/* Count */}
      <div className="flex justify-between items-center mb-6">
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
            className="font-mono text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 border border-[var(--border)] bg-transparent text-[var(--fg-muted)] cursor-pointer transition-all hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
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
        variants={{ hidden: {}, visible: { transition: STAGGER.cascade } }}
        initial="hidden" animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((algo, i) => (
            <motion.div
              key={algo.path} layout
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.95, filter: 'blur(4px)' },
                visible: {
                  opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                  transition: { duration: 0.45, ease: EASE_OUT, delay: i * 0.04 },
                },
              }}
              initial="hidden" animate="visible"
              exit={{ opacity: 0, scale: 0.94, filter: 'blur(2px)', transition: { duration: 0.25 } }}
              transition={{ layout: { type: 'spring', stiffness: 400, damping: 28 } }}
            >
              <Link to={algo.path} className="no-underline text-inherit block h-full">
                <div
                  className="algo-card relative p-5 lg:p-6 bg-[var(--surface)] border-2 border-[var(--border)] cursor-pointer flex justify-between items-start gap-4 hover:border-[var(--border-strong)] h-full"
                  style={{ zIndex: 0, transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease' }}
                  onMouseMove={e => handleCardEnter(e, algo.tag)}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: TAG_COLORS[algo.tag] ?? 'var(--accent)' }}>
                      {algo.tag}
                    </span>
                    <span className="font-mono text-base font-bold text-[var(--fg)]">{algo.name}</span>
                    <span className="text-[13px] text-[var(--fg-muted)] leading-snug mt-0.5">{algo.desc}</span>
                  </div>
                  <span className="arrow font-mono text-xl text-[var(--border)] shrink-0 mt-2 transition-all">→</span>
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
            className="text-center py-24 border-2 border-[var(--border)] bg-[var(--surface)] mt-4"
          >
            <motion.div
              className="font-mono text-[40px] mb-4 inline-block opacity-30"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, 5, -5, 0],
                y: [0, -6, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >∅</motion.div>
            <div className="font-mono text-sm font-semibold text-[var(--fg)] mb-2">No algorithms found</div>
            <div className="text-[13px] text-[var(--fg-muted)] mb-6">Try adjusting your filters or search query.</div>
            <motion.button
              onClick={() => { setActiveFilter('All'); setSearchQuery('') }}
              className="font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 border border-[var(--border-strong)] bg-[var(--fg)] text-[var(--bg)] cursor-pointer"
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
        className="mt-16 pt-8 border-t border-[var(--border)] text-center flex flex-col gap-1"
      >
        <span className="font-mono text-[11px] font-medium text-[var(--fg-muted)] uppercase tracking-wider">
          AlgoLens — Interactive Algorithm Visualizer
        </span>
        <span className="font-mono text-[10px] text-[var(--fg-muted)] opacity-50">
          Built with React + Vite · © {new Date().getFullYear()}
        </span>
      </motion.div>
    </div>
  )
}
