import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'

interface StatusProps {
    message: string
    type?: 'info' | 'success' | 'warning' | 'compare' | 'swap' | 'error'
}

export function StatusMessage({ message, type = 'info' }: StatusProps) {
    if (!message) return null

    const borderMap: Record<string, string> = {
        info: 'var(--color-current)',
        success: 'var(--color-sorted)',
        warning: 'var(--accent)',
        compare: 'var(--color-comparing)',
        swap: 'var(--color-swapping)',
    }
    const color = borderMap[type] ?? 'var(--border)'
    const pulse = type === 'swap' || type === 'warning'

    return (
        <motion.div
            key={message}
            initial={{ opacity: 0, x: -16, scaleX: 0.95 }}
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            exit={{ opacity: 0, x: 8, scaleX: 0.98 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="px-5 py-2.5 bg-[var(--surface)] font-mono font-medium text-[13px] text-[var(--fg)] mb-4 rounded-sm relative overflow-hidden"
            style={{
                border: `1px solid ${color}`,
                borderLeft: `3px solid ${color}`,
                animation: pulse ? 'pulse-glow 0.6s ease-out' : 'none',
            }}
        >
            {/* Slide-in border wipe */}
            <motion.div
                className="absolute top-0 left-0 h-full"
                initial={{ width: 0 }}
                animate={{ width: '3px' }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                style={{ backgroundColor: color }}
            />
            {message}
        </motion.div>
    )
}
