import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = window.location.href
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Copy link to clipboard"
        title="Copy link to clipboard"
        className="w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] cursor-pointer hover:border-[var(--border-strong)] transition-colors text-base overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={copied ? 'check' : 'link'}
            initial={{ y: -16, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 16, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            style={{
              display: 'inline-block',
              fontSize: 14,
              color: copied ? '#16a34a' : 'var(--fg)',
            }}
          >
            {copied ? '✓' : '⎘'}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 6,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.06em',
              padding: '4px 10px',
              background: '#16a34a',
              color: '#fff',
              whiteSpace: 'nowrap' as const,
              pointerEvents: 'none' as const,
            }}
          >
            Link Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
