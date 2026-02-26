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

// Color palette — uses CSS variables for theme support
export const COLORS = {
    // Element states
    default: 'var(--color-default-el)',
    active: 'var(--color-active)',
    comparing: 'var(--color-comparing)',
    swapping: 'var(--color-swapping)',
    sorted: 'var(--color-sorted)',
    found: 'var(--color-found)',

    // Accent states
    pivot: 'var(--color-pivot)',
    current: 'var(--color-current)',
    visited: 'var(--color-visited)',
    exploring: 'var(--color-exploring)',
    eliminated: 'var(--color-eliminated)',

    // Surfaces
    bg: 'var(--bg)',
    bgAlt: 'var(--bg-alt)',
    surface: 'var(--surface)',
    codeBg: 'var(--code-bg)',

    // Text
    fg: 'var(--fg)',
    fgMuted: 'var(--fg-muted)',
    fgLight: 'var(--bg)',

    // Borders
    border: 'var(--border)',
    borderStrong: 'var(--border-strong)',

    // Accent
    accent: 'var(--accent)',
    accentHover: 'var(--accent-hover)'
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
        background: 'var(--bg)',
        maxWidth: '1440px',
        margin: '0 auto'
    },

    title: {
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        letterSpacing: '-0.02em',
        color: 'var(--fg)',
        marginBottom: '8px',
        textAlign: 'left'
    },

    // ── Split Layout ──
    splitLayout: {
        display: 'flex',
        gap: '32px',
        alignItems: 'flex-start',
        marginTop: '20px'
    },

    splitLeft: {
        flex: '0 0 420px',
        minWidth: 0,
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        paddingRight: '8px'
    },

    splitRight: {
        flex: 1,
        minWidth: 0,
        position: 'sticky',
        top: '80px',
        alignSelf: 'flex-start'
    },

    explanationBox: {
        margin: '0 0 16px 0',
        textAlign: 'left',
        background: 'var(--surface)',
        padding: '24px 28px',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        color: 'var(--fg)',
        fontSize: '14px',
        lineHeight: '1.7'
    },

    visualizationArea: {
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        padding: '32px',
        margin: '0'
    },

    codeBlock: {
        background: 'var(--code-bg)',
        padding: '20px 24px',
        borderRadius: '0px',
        border: '1px solid var(--code-bg)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        lineHeight: '1.65',
        color: 'var(--code-fg)',
        textAlign: 'left',
        margin: '0 0 16px 0',
        overflowX: 'auto'
    },

    controlButton: {
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 600,
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '10px 20px',
        background: 'var(--fg)',
        color: 'var(--bg)',
        border: '1px solid var(--fg)',
        borderRadius: '0px',
        cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)'
    },

    controlButtonDisabled: {
        background: 'var(--border)',
        borderColor: 'var(--border)',
        color: 'var(--fg-muted)',
        cursor: 'not-allowed'
    },

    speedSelect: {
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 500,
        fontSize: '13px',
        padding: '8px 12px',
        border: '1px solid var(--border)',
        borderRadius: '0px',
        background: 'var(--surface)',
        cursor: 'pointer',
        color: 'var(--fg)'
    },

    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '2px',
        color: 'var(--fg)',
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
        color: 'var(--fg-muted)',
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
