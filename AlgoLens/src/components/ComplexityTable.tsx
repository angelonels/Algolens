import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { EASE_OUT } from '../utils/animationConfig'
import { TAG_COLORS } from '../data/algorithmRegistry'
import { COMPLEXITY_DATA } from '../data/complexityData'
import type { CSSProperties } from 'react'

type SortKey = 'name' | 'tag' | 'difficulty' | 'best' | 'average' | 'worst' | 'space'
type SortDir = 'asc' | 'desc'
type BooleanFilter = 'All' | 'Yes' | 'No'

const COMPLEXITY_RANK: Record<string, number> = {
  'O(1)': 1,
  'O(log n)': 2,
  'O(log min(a,b))': 2.5,
  'O(n)': 3,
  'O(n+k)': 3.5,
  'O(V+E)': 4,
  'O(n log n)': 4.2,
  'O((V+E) log V)': 4.5,
  'O(d·n)': 4.7,
  'O(n·e)': 5,
  'O(n·k·i)': 5.2,
  'O(n·m·log n)': 5.5,
  'O(m×n)': 6,
  'O(n²)': 7,
  'O(n²·m)': 7.5,
}

const DIFFICULTY_RANK: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
}

function getRank(value: string) {
  return COMPLEXITY_RANK[value] ?? 10
}

function getComplexityColor(value: string) {
  const rank = getRank(value)
  if (rank <= 2) return '#16a34a'
  if (rank <= 4.5) return '#2563eb'
  if (rank <= 5.5) return '#d97706'
  if (rank <= 6) return '#ea580c'
  return '#e63312'
}

function matchesBooleanFilter(value: boolean | undefined, filter: BooleanFilter) {
  if (filter === 'All') return true
  if (filter === 'Yes') return value === true
  return value === false
}

export default function ComplexityTable() {
  useDocumentTitle('Algorithm Comparison')
  const [sortKey, setSortKey] = useState<SortKey>('average')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [filterTag, setFilterTag] = useState<string>('All')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All')
  const [stableFilter, setStableFilter] = useState<BooleanFilter>('All')
  const [inPlaceFilter, setInPlaceFilter] = useState<BooleanFilter>('All')
  const [query, setQuery] = useState('')

  const tags = useMemo(
    () => ['All', ...Array.from(new Set(COMPLEXITY_DATA.map((entry) => entry.tag)))],
    [],
  )

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return COMPLEXITY_DATA.filter((entry) => {
      if (filterTag !== 'All' && entry.tag !== filterTag) return false
      if (difficultyFilter !== 'All' && entry.difficulty !== difficultyFilter) return false
      if (!matchesBooleanFilter(entry.stable, stableFilter)) return false
      if (!matchesBooleanFilter(entry.inPlace, inPlaceFilter)) return false
      if (!normalizedQuery) return true

      return [
        entry.name,
        entry.tag,
        entry.difficulty,
        entry.useCase,
        entry.notes,
        entry.best,
        entry.average,
        entry.worst,
        entry.space,
      ].some((value) => value.toLowerCase().includes(normalizedQuery))
    })
  }, [difficultyFilter, filterTag, inPlaceFilter, query, stableFilter])

  const sorted = useMemo(() => {
    const data = [...filtered]

    data.sort((a, b) => {
      let comparison = 0

      if (sortKey === 'name' || sortKey === 'tag') {
        comparison = a[sortKey].localeCompare(b[sortKey])
      } else if (sortKey === 'difficulty') {
        comparison = DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]
      } else {
        comparison = getRank(a[sortKey]) - getRank(b[sortKey])
      }

      return sortDir === 'asc' ? comparison : -comparison
    })

    return data
  }, [filtered, sortDir, sortKey])

  const summary = useMemo(() => {
    const stableCount = filtered.filter((entry) => entry.stable).length
    const inPlaceCount = filtered.filter((entry) => entry.inPlace).length
    const beginnerCount = filtered.filter((entry) => entry.difficulty === 'Beginner').length

    return [
      {
        label: 'Visible Algorithms',
        value: filtered.length,
        note: filterTag === 'All' ? 'Across the full catalog' : `Inside ${filterTag}`,
      },
      {
        label: 'Stable Options',
        value: stableCount,
        note: 'Preserve equal-element order',
      },
      {
        label: 'In-place Options',
        value: inPlaceCount,
        note: 'Low extra-memory choices',
      },
      {
        label: 'Beginner Friendly',
        value: beginnerCount,
        note: 'Best starting points for intuition',
      },
    ]
  }, [filtered, filterTag])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDir('asc')
  }

  const resetFilters = () => {
    setFilterTag('All')
    setDifficultyFilter('All')
    setStableFilter('All')
    setInPlaceFilter('All')
    setQuery('')
  }

  const SortIndicator = ({ column }: { column: SortKey }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === column ? 1 : 0.2, fontSize: 10 }}>
      {sortKey === column ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )

  const headerStyle: CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--fg-muted)',
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '2px solid var(--border)',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  }

  const cellStyle: CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    padding: '12px',
    borderBottom: '1px solid var(--border)',
    verticalAlign: 'top',
  }

  const chipStyle: CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    padding: '6px 10px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--fg-muted)',
  }

  const FilterSelect = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
    options: string[]
  }) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--fg-muted)',
        }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          ...chipStyle,
          minWidth: 150,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )

  const renderComplexity = (value: string) => (
    <span style={{ color: getComplexityColor(value), fontWeight: 700 }}>{value}</span>
  )

  const renderBoolean = (value: boolean | undefined) => {
    if (value === undefined) return '—'
    return value ? 'Yes' : 'No'
  }

  return (
    <div className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-[1280px] mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        style={{ marginBottom: 24 }}
      >
        <Link to="/" className="no-underline">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--fg-muted)',
            }}
          >
            ← Back to Index
          </span>
        </Link>

        <h1
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--fg)',
            marginTop: 16,
            marginBottom: 10,
            lineHeight: 1.05,
          }}
        >
          Algorithm <span style={{ color: 'var(--accent)' }}>Comparison Lab</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', maxWidth: 720, lineHeight: 1.6 }}>
          Compare runtime, memory, stability, and learning context before opening a visualizer.
          This page is now driven from the same registry as the actual routes, so metadata and navigation stay aligned.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45, ease: EASE_OUT }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 18,
        }}
      >
        {summary.map((item) => (
          <div
            key={item.label}
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              padding: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--fg-muted)',
                marginBottom: 12,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--fg)',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {item.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{item.note}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4, ease: EASE_OUT }}
        style={{
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--fg-muted)',
                marginBottom: 6,
              }}
            >
              Filter Stack
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
              Narrow the catalog by category, learning level, or implementation traits.
            </div>
          </div>

          <button
            onClick={resetFilters}
            style={{
              ...chipStyle,
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 2fr) repeat(auto-fit, minmax(150px, 1fr))',
            gap: 12,
            alignItems: 'end',
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--fg-muted)',
              }}
            >
              Search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by algorithm, use case, note, or complexity"
              style={{
                ...chipStyle,
                width: '100%',
                minHeight: 36,
                paddingInline: 12,
              }}
            />
          </label>

          <FilterSelect label="Category" value={filterTag} onChange={setFilterTag} options={tags} />
          <FilterSelect
            label="Difficulty"
            value={difficultyFilter}
            onChange={setDifficultyFilter}
            options={['All', 'Beginner', 'Intermediate', 'Advanced']}
          />
          <FilterSelect
            label="Stable"
            value={stableFilter}
            onChange={(value) => setStableFilter(value as BooleanFilter)}
            options={['All', 'Yes', 'No']}
          />
          <FilterSelect
            label="In-place"
            value={inPlaceFilter}
            onChange={(value) => setInPlaceFilter(value as BooleanFilter)}
            options={['All', 'Yes', 'No']}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.35 }}
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--fg-muted)',
          }}
        >
          Complexity Scale:
        </span>
        {[
          { label: 'Excellent', color: '#16a34a' },
          { label: 'Good', color: '#2563eb' },
          { label: 'Tradeoff', color: '#d97706' },
          { label: 'Heavy', color: '#e63312' },
        ].map((item) => (
          <span
            key={item.label}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fg-muted)' }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.color,
                display: 'inline-block',
              }}
            />
            {item.label}
          </span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.45, ease: EASE_OUT }}
        style={{
          border: '2px solid var(--border)',
          background: 'var(--surface)',
          overflow: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1200 }}>
          <thead>
            <tr>
              <th style={headerStyle} onClick={() => handleSort('name')}>
                Algorithm <SortIndicator column="name" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('tag')}>
                Category <SortIndicator column="tag" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('difficulty')}>
                Difficulty <SortIndicator column="difficulty" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('best')}>
                Best <SortIndicator column="best" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('average')}>
                Average <SortIndicator column="average" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('worst')}>
                Worst <SortIndicator column="worst" />
              </th>
              <th style={headerStyle} onClick={() => handleSort('space')}>
                Space <SortIndicator column="space" />
              </th>
              <th style={{ ...headerStyle, cursor: 'default' }}>Stable</th>
              <th style={{ ...headerStyle, cursor: 'default' }}>In-place</th>
              <th style={{ ...headerStyle, cursor: 'default' }}>Best Fit</th>
              <th style={{ ...headerStyle, cursor: 'default' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {sorted.map((entry, index) => (
                <motion.tr
                  key={entry.path}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: index * 0.015 }}
                  layout
                >
                  <td style={cellStyle}>
                    <Link
                      to={entry.path}
                      style={{
                        color: 'var(--fg)',
                        textDecoration: 'none',
                        fontWeight: 700,
                      }}
                    >
                      {entry.name}
                    </Link>
                  </td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        ...chipStyle,
                        color: TAG_COLORS[entry.tag] ?? 'var(--fg)',
                      }}
                    >
                      {entry.tag}
                    </span>
                  </td>
                  <td style={cellStyle}>{entry.difficulty}</td>
                  <td style={cellStyle}>{renderComplexity(entry.best)}</td>
                  <td style={cellStyle}>{renderComplexity(entry.average)}</td>
                  <td style={cellStyle}>{renderComplexity(entry.worst)}</td>
                  <td style={cellStyle}>{renderComplexity(entry.space)}</td>
                  <td style={cellStyle}>{renderBoolean(entry.stable)}</td>
                  <td style={cellStyle}>{renderBoolean(entry.inPlace)}</td>
                  <td style={{ ...cellStyle, minWidth: 220, whiteSpace: 'normal' }}>{entry.useCase}</td>
                  <td style={{ ...cellStyle, minWidth: 280, whiteSpace: 'normal', color: 'var(--fg-muted)' }}>
                    {entry.notes}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {sorted.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              padding: 32,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--fg)',
                marginBottom: 8,
              }}
            >
              No algorithms match this filter stack
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 18 }}>
              Clear a few filters or broaden the search to see the catalog again.
            </div>
            <button onClick={resetFilters} style={{ ...chipStyle, cursor: 'pointer' }}>
              Reset Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
