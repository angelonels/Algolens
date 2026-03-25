import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { NAVBAR_VARIANTS, EASE_OUT } from '../utils/animationConfig'
import { getNavbarAlgorithms } from '../data/algorithmRegistry'

const algorithms = getNavbarAlgorithms()

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const isHome = location.pathname === '/'

  return (
    <motion.nav
      variants={NAVBAR_VARIANTS}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 h-14 px-6 sm:px-10 lg:px-14 flex items-center justify-between border-b border-[var(--border)] backdrop-blur-xl bg-[var(--bg)]/80 supports-[backdrop-filter]:bg-[var(--bg)]/80"
    >
      {/* Left: Logo */}
      <Link to="/" className="no-underline">
        <motion.span
          className="font-mono text-lg font-bold tracking-tight text-[var(--fg)] inline-block"
          whileHover={{ letterSpacing: '0.05em', transition: { duration: 0.3, ease: EASE_OUT } }}
        >
          ALGO <span className="text-[var(--accent)]">LENS</span>
        </motion.span>
      </Link>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Back to Index */}
        <AnimatePresence>
          {!isHome && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <Link
                to="/"
                className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] no-underline hover:text-[var(--accent)] transition-colors"
              >
                ← Index
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15 }}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] cursor-pointer hover:border-[var(--border-strong)] transition-colors text-base overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isDark ? 'sun' : 'star'}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="inline-block"
            >
              {isDark ? '☀' : '✦'}
            </motion.span>
          </AnimatePresence>
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
    </motion.nav>
  )
}
