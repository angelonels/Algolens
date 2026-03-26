import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { EASE_OUT, STAGGER } from '../utils/animationConfig'
import { TAG_COLORS } from '../data/algorithmRegistry'
import { COMPLEXITY_DATA, type ComplexityInfo } from '../data/complexityData'

type SortKey = 'name' | 'tag' | 'best' | 'average' | 'worst' | 'space'
type SortDir = 'asc' | 'desc'

// Complexity ranking for sort comparison
const COMPLEXITY_RANK: Record<string, number> = {
  'O(1)': 1, 'O(log n)': 2, 'O(log min(a,b))': 2.5,
  'O(n)': 3, 'O(n+k)': 3.5, 'O(n log n)': 4,
  'O(n·k·i)': 5, 'O(n·e)': 5, 'O(n·m·log n)': 5.5,
  'O(d·n)': 4.5, 'O(m×n)': 6, 'O(n²)': 7, 'O(n²·m)': 7.5,
  'O(V+E)': 4, 'O((V+E) log V)': 4.5,
}

function getRank(val: string): number {
  return COMPLEXITY_RANK[val] ?? 10
}

function getComplexityColor(val: string): string {
  const rank = getRank(val)
  if (rank <= 2) return '#16a34a'    // green — O(1), O(log n)
  if (rank <= 4) return '#2563eb'    // blue — O(n), O(n log n)
  if (rank <= 5.5) return '#d97706'  // amber — O(n·k), O(d·n)
  if (rank <= 6) return '#ea580c'    // orange — O(m×n)
  return '#e63312'                   // red — O(n²)
}

export default function ComplexityTable() {
  useDocumentTitle('Complexity Cheat Sheet')
  const [sortKey, setSortKey] = useState<SortKey>('tag')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filterTag, setFilterTag] = useState<string>('All')

  const tags = useMemo(() => {
    const t = Array.from(new Set(COMPLEXITY_DATA.map(c => c.tag)))
    return ['All', ...t]
  }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    let data = [...COMPLEXITY_DATA]
    if (filterTag !== 'All') data = data.filter(d => d.tag === filterTag)

    data.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name' || sortKey === 'tag') {
        cmp = a[sortKey].localeCompare(b[sortKey])
      } else {
        cmp = getRank(a[sortKey]) - getRank(b[sortKey])
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return data
  }, [sortKey, sortDir, filterTag])

  const SortIndicator = ({ col }: { col: SortKey }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === col ? 1 : 0.2, fontSize: 10 }}>
      {sortKey === col ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )

  const headerStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: 'var(--fg-muted)',
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '2px solid var(--border)',
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
    userSelect: 'none' as const,
    transition: 'color 0.2s',
  }

  const cellStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    padding: '10px 12px',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap' as const,
  }

  const renderComplexity = (val: string) => (
    <span style={{ color: getComplexityColor(val), fontWeight: 600 }}>
      {val}
    </span>
  )

  return (
    <div className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-[1200px] mx-auto min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        style={{ marginBottom: 24 }}
      >
        <Link to="/" className="no-underline">
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
            color: 'var(--fg-muted)',
            transition: 'color 0.2s',
          }}>
            ← Back to Index
          </span>
        </Link>

        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--fg)',
          marginTop: 16,
          marginBottom: 8,
          lineHeight: 1.1,
        }}>
          Complexity{' '}
          <span style={{ color: 'var(--accent)' }}>Cheat Sheet</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', maxWidth: 500 }}>
          Time and space complexity for all {COMPLEXITY_DATA.length} algorithms.
          Click column headers to sort.
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{
          display: 'flex', gap: 16, flexWrap: 'wrap',
          marginBottom: 16, alignItems: 'center',
        }}
      >
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase' as const, letterSpacing: '0.06em',
          color: 'var(--fg-muted)',
        }}>
          Complexity:
        </span>
        {[
          { label: 'Excellent', color: '#16a34a' },
          { label: 'Good', color: '#2563eb' },
          { label: 'Fair', color: '#d97706' },
          { label: 'Poor', color: '#e63312' },
        ].map(l => (
          <span key={l.label} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: 'var(--fg-muted)',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: l.color, display: 'inline-block',
            }} />
            {l.label}
          </span>
        ))}
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35, ease: EASE_OUT }}
        style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}
      >
        {tags.map(tag => {
          const isActive = tag === filterTag
          const color = tag === 'All' ? 'var(--fg)' : (TAG_COLORS[tag] ?? 'var(--fg)')
          return (
            <motion.button
              key={tag}
              onClick={() => setFilterTag(tag)}
              whileHover={!isActive ? { y: -2, boxShadow: '2px 2px 0px var(--border-strong)' } : {}}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                padding: '6px 14px',
                border: `1px solid ${isActive ? 'var(--border-strong)' : 'var(--border)'}`,
                background: isActive ? color : 'transparent',
                color: isActive ? '#fff' : 'var(--fg-muted)',
                cursor: 'pointer',
                boxShadow: isActive ? '2px 2px 0px var(--border-strong)' : 'none',
                transform: isActive ? 'translate(-2px,-2px)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {tag}
            </motion.button>
          )
        })}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: EASE_OUT }}
        style={{
          border: '2px solid var(--border)',
          background: 'var(--surface)',
          overflow: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr>
              <th style={headerStyle} onClick={() => handleSort('name')}>
                Algorithm <SortIndicator col="name" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('tag')}>
                Category <SortIndicator col="tag" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('best')}>
                Best <SortIndicator col="best" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('average')}>
                Average <SortIndicator col="average" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('worst')}>
                Worst <SortIndicator col="worst" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('space')}>
                Space <SortIndicator col="space" />
              </th>
              <th style={{ ...headerStyle, cursor: 'default' }}>
                Stable
              </th>
              <th style={{ ...headerStyle, cursor: 'default' }}>
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {sorted.map((algo: ComplexityInfo, i: number) => (
                <motion.tr
                  key={algo.path}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03 } }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-alt, rgba(0,0,0,0.02))')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={cellStyle}>
                    <Link
                      to={algo.path}
                      style={{
                        color: 'var(--fg)', fontWeight: 600,
                        textDecoration: 'none', borderBottom: '1px dashed var(--border)',
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = 'var(--accent)'
                        e.currentTarget.style.borderColor = 'var(--accent)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--fg)'
                        e.currentTarget.style.borderColor = 'var(--border)'
                      }}
                    >
                      {algo.name}
                    </Link>
                  </td>
                  <td style={cellStyle}>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase' as const, letterSpacing: '0.05em',
                      color: TAG_COLORS[algo.tag] ?? 'var(--fg-muted)',
                    }}>
                      {algo.tag}
                    </span>
                  </td>
                  <td style={cellStyle}>{renderComplexity(algo.best)}</td>
                  <td style={cellStyle}>{renderComplexity(algo.average)}</td>
                  <td style={cellStyle}>{renderComplexity(algo.worst)}</td>
                  <td style={cellStyle}>{renderComplexity(algo.space)}</td>
                  <td style={{ ...cellStyle, textAlign: 'center' as const }}>
                    {algo.stable !== undefined ? (
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: algo.stable ? '#16a34a' : '#e63312',
                      }}>
                        {algo.stable ? '✓' : '✗'}
                      </span>
                    ) : (
                      <span style={{ opacity: 0.3 }}>—</span>
                    )}
                  </td>
                  <td style={{ ...cellStyle, fontSize: 11, color: 'var(--fg-muted)', maxWidth: 200, whiteSpace: 'normal' as const }}>
                    {algo.notes ?? '—'}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: 16, textAlign: 'right' as const,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase' as const, letterSpacing: '0.06em',
          color: 'var(--fg-muted)',
        }}
      >
        {sorted.length} of {COMPLEXITY_DATA.length} algorithms
      </motion.div>
    </div>
  )
}
