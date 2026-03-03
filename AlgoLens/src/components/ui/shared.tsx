import { useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, type SpeedKey, EASE_OUT } from '../../utils/animationConfig'

// ── Types ──
interface SpeedControlProps {
    speed: SpeedKey
    onSpeedChange: (speed: SpeedKey) => void
}

interface StepCounterProps {
    current: number
    total: number
}

interface StatusProps {
    message: string
    type?: 'info' | 'success' | 'warning' | 'compare' | 'swap'
}

interface ButtonProps {
    onClick: () => void
    disabled?: boolean
    children: ReactNode
    variant?: 'primary' | 'success' | 'danger'
    className?: string
}

interface LegendItem {
    color: string
    label: string
}

interface CodeBlockProps {
    code: string
}

// ── Speed Control ──
export function SpeedControl({ speed, onSpeedChange }: SpeedControlProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                Speed
            </span>
            <select
                value={speed}
                onChange={e => onSpeedChange(e.target.value as SpeedKey)}
                className="font-mono text-xs font-medium px-2 py-1.5 bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)] transition-colors focus:outline-none focus:border-[var(--accent)]"
            >
                {Object.keys(SPEED_PRESETS).map(key => (
                    <option key={key} value={key}>{key}</option>
                ))}
            </select>
        </div>
    )
}

// ── Step Counter ──
export function StepCounter({ current, total }: StepCounterProps) {
    const progress = total > 0 ? (current / total) * 100 : 0

    return (
        <div className="flex flex-col items-center gap-1 min-w-[140px]">
            <AnimatePresence mode="wait">
                <motion.span
                    key={current}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)]"
                >
                    Step {current} / {total}
                </motion.span>
            </AnimatePresence>
            <div className="w-full h-[3px] bg-[var(--border)] overflow-hidden relative">
                <motion.div
                    className="h-full bg-[var(--accent)] relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.15, ease: EASE_OUT }}
                />
                {progress > 0 && progress < 100 && (
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite linear',
                        }}
                    />
                )}
            </div>
        </div>
    )
}

// ── Status Message ──
export function StatusMessage({ message, type = 'info' }: StatusProps) {
    if (!message) return null

    const borderMap: Record<string, string> = {
        info: 'var(--color-current)',
        success: 'var(--color-sorted)',
        warning: 'var(--accent)',
        compare: 'var(--color-comparing)',
        swap: 'var(--color-swapping)',
    }
    const color = borderMap[type] ?? 'var(--border)'
    const pulse = type === 'swap' || type === 'warning'

    return (
        <motion.div
            key={message}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="inline-block px-4 py-2 bg-[var(--surface)] font-mono font-medium text-[13px] text-[var(--fg)] mb-4"
            style={{
                border: `1px solid ${color}`,
                borderLeft: `3px solid ${color}`,
                animation: pulse ? 'pulse-glow 0.6s ease-out' : 'none',
            }}
        >
            {message}
        </motion.div>
    )
}

// ── Control Button ──
export function ControlButton({ onClick, disabled, children, variant = 'primary', className = '' }: ButtonProps) {
    const styles: Record<string, { bg: string; text: string; border: string; hover: string }> = {
        primary: { bg: 'var(--fg)', text: 'var(--bg)', border: 'var(--fg)', hover: 'var(--accent)' },
        success: { bg: 'var(--color-sorted)', text: '#fff', border: 'var(--color-sorted)', hover: '#15803d' },
        danger: { bg: 'transparent', text: 'var(--fg)', border: 'var(--border)', hover: 'var(--accent)' },
    }
    const s = styles[variant]

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { y: -2, x: -2, boxShadow: `3px 3px 0px ${s.hover}` } : {}}
            whileTap={!disabled ? { y: 1, x: 1, boxShadow: '0px 0px 0px transparent', scale: 0.98 } : {}}
            transition={{ duration: 0.12, ease: EASE_OUT }}
            className={`font-mono font-semibold text-[13px] uppercase tracking-wider px-5 py-2.5 cursor-pointer disabled:cursor-not-allowed transition-colors ${className}`}
            style={{
                background: disabled ? 'var(--border)' : s.bg,
                color: disabled ? 'var(--fg-muted)' : s.text,
                border: `1px solid ${disabled ? 'var(--border)' : s.border}`,
                boxShadow: disabled ? 'none' : '2px 2px 0px var(--border-strong)',
            }}
            onMouseEnter={e => {
                if (!disabled) {
                    const el = e.currentTarget
                    el.style.background = s.hover
                    el.style.borderColor = s.hover
                    el.style.color = '#fff'
                }
            }}
            onMouseLeave={e => {
                if (!disabled) {
                    const el = e.currentTarget
                    el.style.background = s.bg
                    el.style.borderColor = s.border
                    el.style.color = s.text
                }
            }}
        >
            {children}
        </motion.button>
    )
}

// ── Legend ──
export function Legend({ items }: { items: LegendItem[] }) {
    return (
        <div className="flex gap-5 flex-wrap py-3 px-1">
            {items.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-black/20" style={{ background: item.color }} />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}

// ── Code Block ──
export function CodeBlock({ code }: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }, [code])

    return (
        <div className="relative bg-[var(--code-bg)] text-[var(--code-fg)] p-4 border border-[var(--border)] font-mono text-[13px] leading-relaxed overflow-x-auto">
            <pre className="m-0 whitespace-pre-wrap">{code}</pre>
            <motion.button
                onClick={handleCopy}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={`absolute top-3 right-3 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider cursor-pointer transition-all ${copied
                        ? 'bg-green-600/20 text-green-400 border border-green-600/40'
                        : 'bg-transparent text-[var(--code-fg)] border border-white/20 hover:bg-white/10 hover:border-white/40'
                    }`}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={copied ? 'check' : 'copy'}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                    >
                        {copied ? '✓ Copied' : 'Copy'}
                    </motion.span>
                </AnimatePresence>
            </motion.button>
        </div>
    )
}

// ── Layout Components ──
export function PageContainer({ children }: { children: ReactNode }) {
    return (
        <div className="pt-[68px] pb-10 px-8 max-w-[1400px] mx-auto min-h-screen">
            {children}
        </div>
    )
}

export function SplitLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex gap-6 items-start max-lg:flex-col">
            {children}
        </div>
    )
}

export function SplitLeft({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="w-[380px] flex-shrink-0 flex flex-col gap-4 max-lg:w-full max-lg:order-2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
        >
            {children}
        </motion.div>
    )
}

export function SplitRight({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="flex-1 flex flex-col gap-4 min-w-0"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
        >
            {children}
        </motion.div>
    )
}

export function ExplanationBox({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
            {children}
        </div>
    )
}

export function VisualizationContainer({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-5 min-h-[320px] flex flex-col">
            {children}
        </div>
    )
}

export function ControlsRow({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center gap-3 flex-wrap py-3">
            {children}
        </div>
    )
}

// ── Array Element (Sorting Visualizers) ──
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
                className="w-10 flex items-end justify-center border border-black/15 font-mono text-xs font-bold"
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
