import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EASE_OUT } from '../utils/animationConfig'
import { ALGORITHMS } from '../data/algorithmRegistry'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      style={{
        marginTop: 64,
        paddingTop: 32,
        paddingBottom: 32,
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Main footer grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32,
        marginBottom: 32,
      }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16, fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--fg)',
            }}>
              ALGO <span style={{ color: 'var(--accent)' }}>LENS</span>
            </span>
          </Link>
          <p style={{
            fontSize: 12, color: 'var(--fg-muted)',
            marginTop: 8, lineHeight: 1.5, maxWidth: 240,
          }}>
            Interactive algorithm visualizer with step-by-step animations and multi-language code examples.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
            color: 'var(--fg-muted)',
            marginBottom: 12,
          }}>
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Link to="/" style={{
              fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-muted)')}
            >
              Home
            </Link>
            <Link to="/complexity" style={{
              fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-muted)')}
            >
              Complexity Cheat Sheet
            </Link>
            <a
              href="https://github.com/angelonels/Algolens"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-muted)')}
            >
              GitHub ↗
            </a>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h4 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
            color: 'var(--fg-muted)',
            marginBottom: 12,
          }}>
            Stats
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
              <strong style={{ color: 'var(--fg)', fontWeight: 700 }}>{ALGORITHMS.length}</strong> Algorithms
            </span>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
              <strong style={{ color: 'var(--fg)', fontWeight: 700 }}>4</strong> Languages
            </span>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
              <strong style={{ color: 'var(--fg)', fontWeight: 700 }}>7</strong> Categories
            </span>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div>
          <h4 style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
            color: 'var(--fg-muted)',
            marginBottom: 12,
          }}>
            Shortcuts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { keys: '← →', label: 'Navigate algorithms' },
              { keys: '⌘K', label: 'Search' },
              { keys: '?', label: 'All shortcuts' },
              { keys: 'D', label: 'Toggle theme' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 11, color: 'var(--fg-muted)',
              }}>
                <kbd style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, fontWeight: 700,
                  padding: '1px 5px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--fg)',
                  minWidth: 28, textAlign: 'center' as const,
                }}>
                  {s.keys}
                </kbd>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        paddingTop: 16,
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, fontWeight: 600,
          textTransform: 'uppercase' as const, letterSpacing: '0.06em',
          color: 'var(--fg-muted)', opacity: 0.6,
        }}>
          © {new Date().getFullYear()} AlgoLens
        </span>
        <motion.div
          style={{ display: 'flex', gap: 8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, ease: EASE_OUT }}
        >
          {['React', 'Vite', 'TypeScript', 'Framer Motion'].map(tech => (
            <span
              key={tech}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, fontWeight: 600,
                textTransform: 'uppercase' as const, letterSpacing: '0.05em',
                padding: '3px 8px',
                border: '1px solid var(--border)',
                color: 'var(--fg-muted)', opacity: 0.7,
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.footer>
  )
}
