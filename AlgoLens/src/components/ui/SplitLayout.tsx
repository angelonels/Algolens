import { motion } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'
import type { ReactNode } from 'react'

export function SplitLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex gap-8 lg:gap-10 items-start max-lg:flex-col">
            {children}
        </div>
    )
}

export function SplitLeft({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="w-[400px] flex-shrink-0 flex flex-col gap-5 max-lg:w-full max-lg:order-2"
            initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
        >
            {children}
        </motion.div>
    )
}

export function SplitRight({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="flex-1 flex flex-col gap-5 min-w-0"
            initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
        >
            {children}
        </motion.div>
    )
}
