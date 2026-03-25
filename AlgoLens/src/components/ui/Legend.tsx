import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'

interface LegendItem {
    color: string
    label: string
}

export function Legend({ items }: { items: LegendItem[] }) {
    return (
        <motion.div
            className="flex gap-5 flex-wrap py-4 px-1 mt-2"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
        >
            {items.map(item => (
                <motion.div
                    key={item.label}
                    className="flex items-center gap-2"
                    variants={{
                        hidden: { opacity: 0, x: -8, scale: 0.9 },
                        visible: { opacity: 1, x: 0, scale: 1 },
                    }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                    <motion.div
                        className="w-3.5 h-3.5 border border-[var(--border-subtle)] rounded-sm"
                        style={{ background: item.color }}
                        whileHover={{ scale: 1.3 }}
                    />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                        {item.label}
                    </span>
                </motion.div>
            ))}
        </motion.div>
    )
}
