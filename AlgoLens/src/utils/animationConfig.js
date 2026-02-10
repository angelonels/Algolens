// ═══════════════════════════════════════════
// ALGOLENS — Animation & Design Tokens
// Swiss-Style / Neobrutalist System
// ═══════════════════════════════════════════

// Animation speed presets (ms between steps)
export const SPEED_PRESETS = {
    slow: 1500,
    normal: 800,
    fast: 400,
    turbo: 150
}

// Framer Motion spring configs — snappy, not floaty
export const SPRING = {
    gentle: { type: 'spring', stiffness: 200, damping: 22 },
    bouncy: { type: 'spring', stiffness: 500, damping: 28 },
    snappy: { type: 'spring', stiffness: 600, damping: 35 },
    smooth: { type: 'spring', stiffness: 300, damping: 30 }
}

// Easing — expo-out for crisp, intentional motion
export const EASING = {
    smooth: [0.16, 1, 0.3, 1],
    sharp: [0.33, 1, 0.68, 1],
    bounce: [0.34, 1.56, 0.64, 1]
}

// Color palette — no gradients, flat and deliberate
export const COLORS = {
    // Element states
    default: '#e8e4dc',
    active: '#d97706',
    comparing: '#2563eb',
    swapping: '#e63312',
    sorted: '#16a34a',
    found: '#16a34a',

    // Accent states
    pivot: '#7c3aed',
    current: '#2563eb',
    visited: '#0891b2',
    exploring: '#ea580c',
    eliminated: '#b0ada5',

    // Surfaces
    bg: '#f5f0e8',
    bgAlt: '#eee9df',
    surface: '#ffffff',
    codeBg: '#0a0a0a',

    // Text
    fg: '#0a0a0a',
    fgMuted: '#6b6b60',
    fgLight: '#f5f0e8',

    // Borders
    border: '#d4d0c8',
    borderStrong: '#0a0a0a',

    // Accent
    accent: '#e63312',
    accentHover: '#c72a0e'
}

// Shared animation variants
export const VARIANTS = {
    fadeInUp: {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 }
    },
    pop: {
        initial: { scale: 0.92, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.92, opacity: 0 }
    },
    pulse: {
        animate: {
            scale: [1, 1.03, 1],
            transition: { duration: 0.6, repeat: Infinity }
        }
    }
}

// Shared style objects — sharp, bordered, no shadows
export const STYLES = {
    container: {
        padding: '80px 40px 60px',
        minHeight: '100vh',
        background: '#f5f0e8',
        maxWidth: '1100px',
        margin: '0 auto'
    },

    title: {
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        letterSpacing: '-0.02em',
        color: '#0a0a0a',
        marginBottom: '8px',
        textAlign: 'left'
    },

    explanationBox: {
        maxWidth: '760px',
        margin: '20px 0',
        textAlign: 'left',
        background: '#ffffff',
        padding: '24px 28px',
        border: '1px solid #d4d0c8',
        borderRadius: '2px',
        color: '#0a0a0a',
        fontSize: '15px',
        lineHeight: '1.7'
    },

    visualizationArea: {
        background: '#ffffff',
        border: '1px solid #d4d0c8',
        borderRadius: '2px',
        padding: '32px',
        margin: '24px 0',
        maxWidth: '960px'
    },

    codeBlock: {
        background: '#0a0a0a',
        padding: '24px 28px',
        borderRadius: '0px',
        border: '1px solid #0a0a0a',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px',
        lineHeight: '1.65',
        color: '#e8e4dc',
        textAlign: 'left',
        maxWidth: '760px',
        margin: '16px 0',
        overflowX: 'auto'
    },

    controlButton: {
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '10px 20px',
        background: '#0a0a0a',
        color: '#f5f0e8',
        border: '1px solid #0a0a0a',
        borderRadius: '0px',
        cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)'
    },

    controlButtonDisabled: {
        background: '#d4d0c8',
        borderColor: '#d4d0c8',
        color: '#6b6b60',
        cursor: 'not-allowed'
    },

    speedSelect: {
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 500,
        fontSize: '13px',
        padding: '8px 12px',
        border: '1px solid #d4d0c8',
        borderRadius: '0px',
        background: '#ffffff',
        cursor: 'pointer',
        color: '#0a0a0a'
    },

    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: '#ffffff',
        border: '1px solid #d4d0c8',
        borderRadius: '2px',
        color: '#0a0a0a',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: '13px'
    },

    legendItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginRight: '16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        color: '#6b6b60',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
    },

    legendDot: (color) => ({
        width: '12px',
        height: '12px',
        borderRadius: '0px',
        background: color,
        border: '1px solid rgba(0,0,0,0.1)'
    }),

    arrayElement: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '2px',
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: '16px',
        border: '1px solid rgba(0,0,0,0.12)',
        transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)'
    },

    controlsRow: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginTop: '24px'
    }
}
