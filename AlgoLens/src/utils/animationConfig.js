// Shared animation configuration for AlgoLens visualizers
// Provides consistent timing, easing, and color theming

// Animation speed presets (milliseconds between steps)
export const SPEED_PRESETS = {
    slow: 1500,
    normal: 800,
    fast: 400,
    turbo: 150
}

// Framer Motion spring configurations
export const SPRING = {
    gentle: { type: 'spring', stiffness: 120, damping: 14 },
    bouncy: { type: 'spring', stiffness: 300, damping: 20 },
    snappy: { type: 'spring', stiffness: 400, damping: 25 },
    smooth: { type: 'spring', stiffness: 100, damping: 20 }
}

// Easing presets
export const EASING = {
    smooth: [0.4, 0, 0.2, 1],
    sharp: [0.4, 0, 0.6, 1],
    bounce: [0.68, -0.55, 0.265, 1.55]
}

// Modern color palette
export const COLORS = {
    // Primary states
    default: '#e2e8f0',      // Slate 200
    active: '#f59e0b',       // Amber 500
    comparing: '#fbbf24',    // Amber 400
    swapping: '#ef4444',     // Red 500
    sorted: '#22c55e',       // Green 500
    found: '#10b981',        // Emerald 500

    // Accent colors
    pivot: '#8b5cf6',        // Violet 500
    current: '#3b82f6',      // Blue 500
    visited: '#06b6d4',      // Cyan 500
    exploring: '#f97316',    // Orange 500

    // Backgrounds
    cardBg: '#1e293b',       // Slate 800
    codeBg: '#0f172a',       // Slate 900
    surfaceBg: '#f8fafc',    // Slate 50

    // Text
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textLight: '#f8fafc'
}

// Gradient definitions
export const GRADIENTS = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
}

// Common animation variants for Framer Motion
export const VARIANTS = {
    // Fade in from bottom
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    },

    // Scale pop
    pop: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 }
    },

    // Pulse effect
    pulse: {
        animate: {
            scale: [1, 1.05, 1],
            transition: { duration: 0.5, repeat: Infinity }
        }
    },

    // Glow effect (for SVG)
    glow: {
        animate: {
            filter: ['drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))',
                'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))',
                'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))'],
            transition: { duration: 1, repeat: Infinity }
        }
    }
}

// Shared styles
export const STYLES = {
    codeBlock: {
        background: COLORS.codeBg,
        padding: '20px',
        borderRadius: '12px',
        fontFamily: "'Fira Code', 'Monaco', monospace",
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#e2e8f0',
        textAlign: 'left',
        maxWidth: '800px',
        margin: '0 auto',
        overflowX: 'auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },

    controlButton: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.4)'
    },

    controlButtonDisabled: {
        background: '#94a3b8',
        cursor: 'not-allowed',
        boxShadow: 'none'
    },

    speedSelect: {
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '2px solid #e2e8f0',
        background: 'white',
        cursor: 'pointer',
        fontWeight: '500'
    },

    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        boxShadow: '0 4px 6px -1px rgba(79, 172, 254, 0.4)'
    },

    legendItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginRight: '16px',
        fontSize: '13px',
        color: COLORS.textSecondary
    },

    legendDot: (color) => ({
        width: '14px',
        height: '14px',
        borderRadius: '4px',
        background: color
    }),

    arrayElement: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
    },

    container: {
        textAlign: 'center',
        padding: '30px 20px',
        minHeight: '100vh',
        background: '#f8fafc'
    },

    title: {
        fontSize: '2rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '10px'
    },

    explanationBox: {
        maxWidth: '800px',
        margin: '20px auto',
        textAlign: 'left',
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        color: COLORS.textPrimary,
        fontSize: '15px',
        lineHeight: '1.7'
    },

    visualizationArea: {
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        margin: '20px auto',
        maxWidth: '900px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },

    controlsRow: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginTop: '24px'
    }
}
