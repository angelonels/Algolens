import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'
import type { ReactNode } from 'react'

export function VisualizationContainer({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="bg-[var(--surface)] border border-[var(--border)] p-6 lg:p-8 min-h-[400px] flex flex-col rounded-sm font-mono transition-colors relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
        >
            {/* Subtle scan-line decorative overlay */}
            <div className="scan-line-overlay opacity-30" />
            {children}
        </motion.div>
    )
}
