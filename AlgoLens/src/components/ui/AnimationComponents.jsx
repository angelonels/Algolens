import React from 'react'
import { motion } from 'framer-motion'
import { SPEED_PRESETS, COLORS, STYLES } from '../../utils/animationConfig'

// Speed Control Component
export function SpeedControl({ speed, onSpeedChange, disabled = false }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: COLORS.textSecondary }}>
                Speed:
            </label>
            <select
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                disabled={disabled}
                style={{
                    ...STYLES.speedSelect,
                    opacity: disabled ? 0.6 : 1
                }}
            >
                <option value={SPEED_PRESETS.slow}>0.5x</option>
                <option value={SPEED_PRESETS.normal}>1x</option>
                <option value={SPEED_PRESETS.fast}>2x</option>
                <option value={SPEED_PRESETS.turbo}>4x</option>
            </select>
        </div>
    )
}

// Step Counter Component
export function StepCounter({ current, total }) {
    const progress = total > 0 ? (current / total) * 100 : 0

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            minWidth: '150px'
        }}>
            <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: COLORS.textPrimary
            }}>
                Step {current} / {total}
            </span>
            <div style={{
                width: '100%',
                height: '6px',
                background: '#e2e8f0',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <motion.div
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '3px'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    )
}

// Status Message Component
export function StatusMessage({ message, type = 'info' }) {
    if (!message) return null

    const bgColors = {
        info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        compare: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        swap: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: bgColors[type] || bgColors.info,
                borderRadius: '12px',
                color: type === 'compare' ? '#333' : 'white',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                marginBottom: '20px'
            }}
        >
            {message}
        </motion.div>
    )
}

// Control Button Component
export function ControlButton({ onClick, disabled, children, variant = 'primary', ...props }) {
    const variants = {
        primary: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            hoverBg: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
        },
        success: {
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            hoverBg: 'linear-gradient(135deg, #0f8b7e 0%, #2fd36f 100%)'
        },
        danger: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            hoverBg: 'linear-gradient(135deg, #e55555 0%, #d94d1a 100%)'
        }
    }

    const style = variants[variant]

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            style={{
                padding: '14px 28px',
                background: disabled ? '#94a3b8' : style.background,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: disabled ? 'not-allowed' : 'pointer',
                boxShadow: disabled ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.2s ease',
                ...props.style
            }}
            {...props}
        >
            {children}
        </motion.button>
    )
}

// Legend Component
export function Legend({ items }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '16px',
            padding: '12px 20px',
            background: '#f1f5f9',
            borderRadius: '10px'
        }}>
            {items.map((item, index) => (
                <div key={index} style={STYLES.legendItem}>
                    <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        background: item.color,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }} />
                    <span style={{ fontWeight: '500' }}>{item.label}</span>
                </div>
            ))}
        </div>
    )
}

// Code Block Component with Syntax Highlighting Feel
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(17, 153, 142, 0.4)'
                }}
            >
                📋 Copy
            </motion.button>
        </div>
    )
}

// Array Element Component for Sorting Visualizers
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
        comparing: 1.1,
        swapping: 1.15,
        sorted: 1,
        pivot: 1.1,
        current: 1.15,
        active: 1.1
    }

    return (
        <motion.div
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
                scale: stateScales[state] || 1,
                opacity: 1,
                backgroundColor: stateColors[state] || COLORS.default
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                layout: { duration: 0.3 }
            }}
            style={{
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '18px',
                color: state === 'swapping' ? 'white' : COLORS.textPrimary,
                boxShadow: state === 'default'
                    ? '0 2px 4px rgba(0,0,0,0.1)'
                    : '0 4px 12px rgba(0,0,0,0.2)',
                border: state === 'pivot' ? '3px solid #7c3aed' : 'none'
            }}
        >
            {showValue && value}
        </motion.div>
    )
}

// Visualization Container
export function VisualizationContainer({ children, maxWidth = 900 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                ...STYLES.visualizationArea,
                maxWidth
            }}
        >
            {children}
        </motion.div>
    )
}

// Page Container
export function PageContainer({ title, children }) {
    return (
        <div style={STYLES.container}>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={STYLES.title}
            >
                {title}
            </motion.h1>
            {children}
        </div>
    )
}

// Explanation Box
export function ExplanationBox({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={STYLES.explanationBox}
        >
            {children}
        </motion.div>
    )
}

// Controls Row
export function ControlsRow({ children }) {
    return (
        <div style={STYLES.controlsRow}>
            {children}
        </div>
    )
}
