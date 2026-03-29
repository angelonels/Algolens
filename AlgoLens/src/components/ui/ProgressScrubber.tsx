import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'

interface ProgressScrubberProps {
  /** Current step index (0-based) */
  current: number
  /** Total number of steps */
  total: number
  /** Callback when the user clicks to jump to a step */
  onScrub: (stepIndex: number) => void
  /** Whether the scrubber is interactive */
  disabled?: boolean
}

/**
 * Clickable progress bar that lets users jump to any step in the
 * algorithm playback by clicking (or dragging) along the bar.
 *
 * Designed to pair with `useAlgorithmPlayback`'s `goToStep` action.
 */
export function ProgressScrubber({ current, total, onScrub, disabled = false }: ProgressScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const progress = total > 1 ? (current / (total - 1)) * 100 : 0

  const resolveStep = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track || disabled || total <= 1) return
      const rect = track.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const step = Math.round(ratio * (total - 1))
      onScrub(step)
    },
    [disabled, total, onScrub],
  )

  const handleClick = (e: React.MouseEvent) => resolveStep(e.clientX)

  // Optional: hold-and-drag scrubbing
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || total <= 1) return
    e.currentTarget.setPointerCapture(e.pointerId)
    resolveStep(e.clientX)

    const moveHandler = (ev: PointerEvent) => resolveStep(ev.clientX)
    const upHandler = () => {
      window.removeEventListener('pointermove', moveHandler)
      window.removeEventListener('pointerup', upHandler)
    }
    window.addEventListener('pointermove', moveHandler)
    window.addEventListener('pointerup', upHandler)
  }

  if (total <= 0) return null

  return (
    <div className="w-full flex flex-col gap-1">
      {/* Step label */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
          Step {current + 1} / {total}
        </span>
        <span className="font-mono text-[10px] font-medium text-[var(--fg-muted)]">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        role="slider"
        aria-label="Playback progress"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total - 1}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        className="relative w-full h-2 bg-[var(--border)] rounded-sm overflow-hidden group"
        style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }}
      >
        {/* Filled portion */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
          style={{
            background: 'linear-gradient(90deg, var(--accent), #ff6b4a)',
          }}
        />

        {/* Thumb indicator */}
        {!disabled && total > 1 && (
          <motion.div
            className="absolute top-1/2 w-3 h-3 rounded-full bg-[var(--fg)] border-2 border-[var(--accent)] shadow-sm"
            animate={{ left: `${progress}%` }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            style={{
              transform: 'translate(-50%, -50%)',
              opacity: current >= 0 ? 1 : 0,
            }}
          />
        )}

        {/* Hover highlight */}
        <div
          className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors"
        />
      </div>
    </div>
  )
}
