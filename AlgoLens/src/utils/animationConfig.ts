import type { Transition, Variants } from 'framer-motion'

// ── Speed Presets ──
export const SPEED_PRESETS = {
    '0.5x': 1200,
    '1x': 600,
    '2x': 300,
    '4x': 150,
} as const

export type SpeedKey = keyof typeof SPEED_PRESETS

// ── Spring Physics ──
export const SPRING = {
    snappy: { type: 'spring', stiffness: 300, damping: 25 } as Transition,
    bouncy: { type: 'spring', stiffness: 400, damping: 15 } as Transition,
    gentle: { type: 'spring', stiffness: 200, damping: 20 } as Transition,
}

// ── Easing ──
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

// ── Page Transitions ──
export const PAGE_TRANSITION = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25, ease: EASE_OUT },
}

// ── Shared Variants ──
export const VARIANTS: Record<string, Variants> = {
    fadeInUp: {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
    },
    cardItem: {
        initial: { opacity: 0, y: 16, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.97 },
    },
}

// ── Stagger Presets ──
export const STAGGER = {
    fast: { staggerChildren: 0.03, delayChildren: 0.1 },
    normal: { staggerChildren: 0.06, delayChildren: 0.15 },
}
