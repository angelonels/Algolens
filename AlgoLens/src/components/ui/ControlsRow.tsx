import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'
import type { ReactNode } from 'react'

export function ControlsRow({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="flex items-center gap-4 flex-wrap py-4 mt-2 border-t border-[var(--border)]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.2 }}
        >
            {children}
        </motion.div>
    )
}
