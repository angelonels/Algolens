import { motion } from 'framer-motion'

interface ArrayElementProps {
    value: number
    height: string
    color: string
    label?: string
}

export function ArrayElement({ value, height, color, label }: ArrayElementProps) {
    return (
        <motion.div
            layout
            className="flex flex-col items-center justify-end"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <motion.div
                className="w-12 flex items-end justify-center border border-[var(--border-subtle)] font-mono text-xs font-bold rounded-t-sm"
                style={{ height, backgroundColor: color }}
                layout
                animate={{ backgroundColor: color }}
                transition={{ duration: 0.2 }}
            >
                <span className="pb-1 text-white mix-blend-difference">{value}</span>
            </motion.div>
            {label && (
                <span className="mt-1 font-mono text-[10px] font-semibold uppercase text-[var(--fg-muted)]">
                    {label}
                </span>
            )}
        </motion.div>
    )
}
