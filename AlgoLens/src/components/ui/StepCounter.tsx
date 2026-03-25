import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'

interface StepCounterProps {
    current: number
    total: number
}

export function StepCounter({ current, total }: StepCounterProps) {
    const progress = total > 0 ? (current / total) * 100 : 0

    return (
        <div className="flex flex-col items-center gap-1.5 min-w-[160px]">
            <AnimatePresence mode="wait">
                <motion.span
                    key={current}
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: EASE_OUT }}
                    className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)]"
                >
                    Step {current} / {total}
                </motion.span>
            </AnimatePresence>
            <div className="w-full h-1.5 bg-[var(--border)] overflow-hidden relative rounded-sm">
                <motion.div
                    className="h-full relative rounded-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    style={{
                        background: `linear-gradient(90deg, var(--accent), #ff6b4a, var(--accent))`,
                        backgroundSize: '200% 100%',
                        animation: 'gradient-shift 2s ease infinite',
                    }}
                />
                {progress > 0 && progress < 100 && (
                    <>
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.2s infinite linear',
                            }}
                        />
                        {/* Leading edge glow */}
                        <motion.div
                            className="absolute top-0 h-full w-2 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                right: 0,
                                background: 'var(--accent)',
                                boxShadow: '0 0 8px 2px rgba(230, 51, 18, 0.5)',
                                left: `${progress}%`,
                                transform: 'translateX(-50%)',
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
