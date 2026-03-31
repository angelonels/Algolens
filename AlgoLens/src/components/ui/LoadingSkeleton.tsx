import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'

/**
 * Animated skeleton loader shown while lazy-loaded visualizer
 * components are being fetched.
 *
 * Replaces the bare `null` Suspense fallback with a visually
 * consistent loading state that matches the app's split-layout
 * structure, preventing layout shift and giving the user immediate
 * feedback that content is loading.
 */
export function LoadingSkeleton() {
  return (
    <div className="pt-20 pb-12 px-6 sm:px-10 lg:px-14 max-w-[1440px] mx-auto min-h-screen">
      {/* Title skeleton */}
      <motion.div
        className="h-7 w-48 bg-[var(--border)] rounded-sm mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="flex gap-8 lg:gap-10 items-start max-lg:flex-col">
        {/* Left panel skeleton (explanation + code) */}
        <motion.div
          className="w-[400px] flex-shrink-0 flex flex-col gap-5 max-lg:w-full max-lg:order-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          {/* Explanation box skeleton */}
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-sm">
            <motion.div
              className="h-5 w-40 bg-[var(--border)] rounded-sm mb-4"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            />
            <div className="flex flex-col gap-2">
              {[100, 85, 92, 70].map((w, i) => (
                <motion.div
                  key={i}
                  className="h-3 bg-[var(--border)] rounded-sm"
                  style={{ width: `${w}%` }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 * i }}
                />
              ))}
            </div>
          </div>

          {/* Code block skeleton */}
          <div className="bg-[var(--code-bg)] border border-[var(--border)] rounded-sm overflow-hidden">
            <div className="flex border-b border-white/10 px-1 py-1">
              {[48, 64, 36, 42].map((w, i) => (
                <motion.div
                  key={i}
                  className="h-6 bg-white/5 rounded-sm mx-1"
                  style={{ width: w }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 * i }}
                />
              ))}
            </div>
            <div className="p-5 flex flex-col gap-2">
              {[90, 60, 75, 50, 85, 40, 70, 55].map((w, i) => (
                <motion.div
                  key={i}
                  className="h-3 bg-white/8 rounded-sm"
                  style={{ width: `${w}%` }}
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.08 * i }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right panel skeleton (visualization area) */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
        >
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 lg:p-8 min-h-[400px] rounded-sm flex flex-col items-center justify-center gap-6">
            {/* Pulsing icon */}
            <motion.div
              className="text-4xl text-[var(--fg-muted)]"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ◉
            </motion.div>

            {/* Loading text */}
            <motion.span
              className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--fg-muted)]"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              Loading visualizer…
            </motion.span>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--accent), #ff6b4a)' }}
                initial={{ width: '0%', x: '-100%' }}
                animate={{ x: ['−100%', '200%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
