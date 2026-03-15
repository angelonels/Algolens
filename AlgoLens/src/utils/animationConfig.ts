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
    smooth: { type: 'spring', stiffness: 250, damping: 30 } as Transition,
    elastic: { type: 'spring', stiffness: 500, damping: 12, mass: 0.8 } as Transition,
    pop: { type: 'spring', stiffness: 600, damping: 18, mass: 0.6 } as Transition,
}

// ── Easing ──
export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const
export const EASE_BACK = [0.34, 1.56, 0.64, 1] as const

// ── Page Transitions (Clip-path reveal) ──
export const PAGE_TRANSITION = {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(6px)', y: 12 },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 },
    exit: { opacity: 0, scale: 0.99, filter: 'blur(4px)', y: -8 },
    transition: { duration: 0.4, ease: EASE_OUT },
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
    scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
    },
    slideInLeft: {
        initial: { opacity: 0, x: -30, skewX: 2 },
        animate: { opacity: 1, x: 0, skewX: 0 },
        exit: { opacity: 0, x: -15 },
    },
    slideInRight: {
        initial: { opacity: 0, x: 30, skewX: -2 },
        animate: { opacity: 1, x: 0, skewX: 0 },
        exit: { opacity: 0, x: 15 },
    },
    popIn: {
        initial: { opacity: 0, scale: 0.8 },
        animate: {
            opacity: 1,
            scale: [0.8, 1.05, 0.98, 1],
            transition: { duration: 0.5, ease: EASE_OUT },
        },
        exit: { opacity: 0, scale: 0.9 },
    },
    glowPulse: {
        initial: { opacity: 0.7, scale: 1 },
        animate: {
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.02, 1],
            transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        },
    },
}

// ── Stagger Presets ──
export const STAGGER = {
    fast: { staggerChildren: 0.03, delayChildren: 0.1 },
    normal: { staggerChildren: 0.06, delayChildren: 0.15 },
    slow: { staggerChildren: 0.1, delayChildren: 0.2 },
    cascade: { staggerChildren: 0.04, delayChildren: 0.05 },
}

// ── Word-by-word stagger text variant ──
export const STAGGER_TEXT = {
    container: {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.06, delayChildren: 0.2 },
        },
    } as Variants,
    word: {
        hidden: { opacity: 0, y: 20, rotateX: -60 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { type: 'spring', stiffness: 300, damping: 20, mass: 0.8 },
        },
    } as Variants,
}

// ── 3D Card Tilt ──
export function createTiltHandlers(intensity: number = 15) {
    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        e.currentTarget.style.transform =
            `perspective(600px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.transform =
            'perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)'
    }

    return { handleMouseMove, handleMouseLeave }
}

// ── Navbar entrance ──
export const NAVBAR_VARIANTS: Variants = {
    hidden: { y: -60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 24, delay: 0.1 } },
}
