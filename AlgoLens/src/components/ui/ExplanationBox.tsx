import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'
import type { ReactNode } from 'react'

export function ExplanationBox({ children, title }: { children: ReactNode, title?: string }) {
    return (
        <motion.div
            className="bg-[var(--surface)] border border-[var(--border)] p-6 lg:p-7 rounded-sm transition-colors [&_ol]:list-decimal [&_ul]:list-disc [&_li]:marker:text-[var(--fg-muted)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.05 }}
        >
            {title && <h3 className="text-xl font-bold mb-4 text-[var(--fg-default)]">{title}</h3>}
            {children}
        </motion.div>
    )
}
