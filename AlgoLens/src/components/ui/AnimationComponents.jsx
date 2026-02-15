import React from 'react'
import { motion } from 'framer-motion'
import { SPEED_PRESETS, COLORS, STYLES } from '../../utils/animationConfig'

// ── Speed Control ──
export function SpeedControl({ speed, onSpeedChange, disabled = false }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: COLORS.fgMuted
            }}>
                Speed
            </label>
            <select
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                disabled={disabled}
                style={{
                    ...STYLES.speedSelect,
                    opacity: disabled ? 0.5 : 1
                }}
            >
                <option value={SPEED_PRESETS.slow}>0.5×</option>
                <option value={SPEED_PRESETS.normal}>1×</option>
                <option value={SPEED_PRESETS.fast}>2×</option>
                <option value={SPEED_PRESETS.turbo}>4×</option>
            </select>
        </div>
    )
}

// ── Step Counter ──
export function StepCounter({ current, total }) {
    const progress = total > 0 ? (current / total) * 100 : 0

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            minWidth: '140px'
        }}>
            <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                fontWeight: 600,
                color: COLORS.fg,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
            }}>
                Step {current} / {total}
            </span>
            <div style={{
                width: '100%',
                height: '3px',
                background: COLORS.border,
                overflow: 'hidden'
            }}>
                <motion.div
                    style={{
                        height: '100%',
                        background: COLORS.accent
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>
        </div>
    )
}

// ── Status Message ──
export function StatusMessage({ message, type = 'info' }) {
    if (!message) return null

    const borderColors = {
        info: COLORS.current,
        success: COLORS.sorted,
        warning: COLORS.accent,
        compare: COLORS.comparing,
        swap: COLORS.swapping
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: COLORS.surface,
                border: `1px solid ${borderColors[type] || COLORS.border}`,
                borderLeft: `3px solid ${borderColors[type] || COLORS.border}`,
                borderRadius: '0px',
                color: COLORS.fg,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                fontSize: '13px',
                marginBottom: '16px'
            }}
        >
            {message}
        </motion.div>
    )
}

// ── Control Button ──
export function ControlButton({ onClick, disabled, children, variant = 'primary', ...props }) {
    const variants = {
        primary: {
            background: COLORS.fg,
            color: COLORS.fgLight,
            borderColor: COLORS.fg,
            hoverBg: COLORS.accent,
            hoverBorder: COLORS.accent
        },
        success: {
            background: COLORS.sorted,
            color: '#ffffff',
            borderColor: COLORS.sorted,
            hoverBg: '#15803d',
            hoverBorder: '#15803d'
        },
        danger: {
            background: 'transparent',
            color: COLORS.fg,
            borderColor: COLORS.border,
            hoverBg: COLORS.accent,
            hoverBorder: COLORS.accent
        }
    }

    const v = variants[variant]

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { y: -1 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '10px 20px',
                background: disabled ? COLORS.border : v.background,
                color: disabled ? COLORS.fgMuted : v.color,
                border: `1px solid ${disabled ? COLORS.border : v.borderColor}`,
                borderRadius: '0px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                ...props.style
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = v.hoverBg
                    e.currentTarget.style.borderColor = v.hoverBorder
                    e.currentTarget.style.color = '#ffffff'
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.currentTarget.style.background = v.background
                    e.currentTarget.style.borderColor = v.borderColor
                    e.currentTarget.style.color = v.color
                }
            }}
            {...props}
        >
            {children}
        </motion.button>
    )
}

// ── Legend ──
export function Legend({ items }) {
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '16px',
            padding: '12px 16px',
            background: COLORS.bgAlt,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '0px'
        }}>
            {items.map((item, index) => (
                <div key={index} style={STYLES.legendItem}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '0px',
                        background: item.color,
                        border: '1px solid rgba(0,0,0,0.1)'
                    }} />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    )
}

// ── Code Block ──
export function CodeBlock({ code, onCopy }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        if (onCopy) onCopy()
    }

    return (
        <div style={{
            ...STYLES.codeBlock,
            position: 'relative'
        }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{code}</pre>
            <motion.button
                onClick={handleCopy}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 14px',
                    background: 'transparent',
                    color: COLORS.fgLight,
                    border: `1px solid rgba(255,255,255,0.2)`,
                    borderRadius: '0px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.background = 'transparent'
                }}
            >
                Copy
            </motion.button>
        </div>
    )
}

// ── Array Element ──
export function ArrayElement({
    value,
    state = 'default',
    width = 50,
    height = 80,
    showValue = true
}) {
    const stateColors = {
        default: COLORS.default,
        comparing: COLORS.comparing,
        swapping: COLORS.swapping,
        sorted: COLORS.sorted,
        pivot: COLORS.pivot,
        current: COLORS.current,
        active: COLORS.active
    }

    const stateScales = {
        default: 1,
        comparing: 1.06,
        swapping: 1.08,
        sorted: 1,
        pivot: 1.06,
        current: 1.08,
        active: 1.04
    }

    return (
        <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
                scale: stateScales[state] || 1,
                opacity: 1,
                backgroundColor: stateColors[state] || COLORS.default
            }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                layout: { duration: 0.2 }
            }}
            style={{
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '16px',
                color: (state === 'swapping' || state === 'comparing' || state === 'current')
                    ? '#ffffff' : COLORS.fg,
                border: state === 'pivot'
                    ? `2px solid ${COLORS.pivot}`
                    : `1px solid rgba(0,0,0,0.1)`
            }}
        >
            {showValue && value}
        </motion.div>
    )
}

// ── Visualization Container ──
export function VisualizationContainer({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={STYLES.visualizationArea}
        >
            {children}
        </motion.div>
    )
}

// ── Page Container ──
export function PageContainer({ title, children }) {
    return (
        <div style={STYLES.container}>
            <motion.h1
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={STYLES.title}
            >
                {title}
            </motion.h1>
            {children}
        </div>
    )
}

// ── Split Layout Wrappers ──
export function SplitLayout({ children }) {
    return (
        <div style={STYLES.splitLayout}>
            {children}
        </div>
    )
}

export function SplitLeft({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={STYLES.splitLeft}
        >
            {children}
        </motion.div>
    )
}

export function SplitRight({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={STYLES.splitRight}
        >
            {children}
        </motion.div>
    )
}

// ── Explanation Box ──
export function ExplanationBox({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={STYLES.explanationBox}
        >
            {children}
        </motion.div>
    )
}

// ── Controls Row ──
export function ControlsRow({ children }) {
    return (
        <div style={STYLES.controlsRow}>
            {children}
        </div>
    )
}
