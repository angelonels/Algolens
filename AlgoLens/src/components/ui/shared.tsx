import { useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPEED_PRESETS, type SpeedKey, EASE_OUT, SPRING } from '../../utils/animationConfig'

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
        <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                Speed
            </span>
            <select
                value={speed}
                onChange={e => onSpeedChange(e.target.value as SpeedKey)}
                className="font-mono text-xs font-medium px-3 py-2 bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] cursor-pointer hover:border-[var(--border-strong)] transition-colors focus:outline-none focus:border-[var(--accent)]"
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
        <div className="flex flex-col items-center gap-1.5 min-w-[160px]">
            <AnimatePresence mode="wait">
                <motion.span
                    key={current}
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: EASE_OUT }}
                    className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--fg)]"
                >
                    Step {current} / {total}
                </motion.span>
            </AnimatePresence>
            <div className="w-full h-1.5 bg-[var(--border)] overflow-hidden relative rounded-sm">
                <motion.div
                    className="h-full relative rounded-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    style={{
                        background: `linear-gradient(90deg, var(--accent), #ff6b4a, var(--accent))`,
                        backgroundSize: '200% 100%',
                        animation: 'gradient-shift 2s ease infinite',
                    }}
                />
                {progress > 0 && progress < 100 && (
                    <>
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.2s infinite linear',
                            }}
                        />
                        {/* Leading edge glow */}
                        <motion.div
                            className="absolute top-0 h-full w-2 rounded-full"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                right: 0,
                                background: 'var(--accent)',
                                boxShadow: '0 0 8px 2px rgba(230, 51, 18, 0.5)',
                                left: `${progress}%`,
                                transform: 'translateX(-50%)',
                            }}
                        />
                    </>
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
            initial={{ opacity: 0, x: -16, scaleX: 0.95 }}
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            exit={{ opacity: 0, x: 8, scaleX: 0.98 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="px-5 py-2.5 bg-[var(--surface)] font-mono font-medium text-[13px] text-[var(--fg)] mb-4 rounded-sm relative overflow-hidden"
            style={{
                border: `1px solid ${color}`,
                borderLeft: `3px solid ${color}`,
                animation: pulse ? 'pulse-glow 0.6s ease-out' : 'none',
            }}
        >
            {/* Slide-in border wipe */}
            <motion.div
                className="absolute top-0 left-0 h-full"
                initial={{ width: 0 }}
                animate={{ width: '3px' }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                style={{ backgroundColor: color }}
            />
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
            whileHover={!disabled ? { y: -3, x: -3, boxShadow: `4px 4px 0px ${s.hover}`, scale: 1.02 } : {}}
            whileTap={!disabled ? { y: 1, x: 1, boxShadow: '0px 0px 0px transparent', scale: 0.96 } : {}}
            transition={{ ...SPRING.pop }}
            className={`font-mono font-semibold text-[13px] uppercase tracking-wider px-6 py-2.5 cursor-pointer disabled:cursor-not-allowed transition-colors relative overflow-hidden ${className}`}
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
        <motion.div
            className="flex gap-5 flex-wrap py-4 px-1 mt-2"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
        >
            {items.map(item => (
                <motion.div
                    key={item.label}
                    className="flex items-center gap-2"
                    variants={{
                        hidden: { opacity: 0, x: -8, scale: 0.9 },
                        visible: { opacity: 1, x: 0, scale: 1 },
                    }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                    <motion.div
                        className="w-3.5 h-3.5 border border-[var(--border-subtle)] rounded-sm"
                        style={{ background: item.color }}
                        whileHover={{ scale: 1.3 }}
                    />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                        {item.label}
                    </span>
                </motion.div>
            ))}
        </motion.div>
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
        <motion.div
            className="relative bg-[var(--code-bg)] text-[var(--code-fg)] p-5 border border-[var(--border)] font-mono text-[13px] leading-relaxed overflow-x-auto rounded-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 }}
        >
            <pre className="m-0 whitespace-pre-wrap">{code}</pre>
            <motion.button
                onClick={handleCopy}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute top-3 right-3 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider cursor-pointer transition-all rounded-sm ${copied
                    ? 'bg-green-600/20 text-green-400 border border-green-600/40'
                    : 'bg-transparent text-[var(--code-fg)] border border-white/20 hover:bg-white/10 hover:border-white/40'
                    }`}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={copied ? 'check' : 'copy'}
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                    >
                        {copied ? '✓ Copied' : 'Copy'}
                    </motion.span>
                </AnimatePresence>
            </motion.button>
        </motion.div>
    )
}

// ── Layout Components ──
export function PageContainer({ children }: { children: ReactNode }) {
    return (
        <div className="pt-20 pb-12 px-6 sm:px-10 lg:px-14 max-w-[1440px] mx-auto min-h-screen">
            {children}
        </div>
    )
}

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

export function ExplanationBox({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="bg-[var(--surface)] border border-[var(--border)] p-6 lg:p-7 rounded-sm transition-colors [&_ol]:list-decimal [&_ul]:list-disc [&_li]:marker:text-[var(--fg-muted)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.05 }}
        >
            {children}
        </motion.div>
    )
}

export function VisualizationContainer({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="bg-[var(--surface)] border border-[var(--border)] p-6 lg:p-8 min-h-[400px] flex flex-col rounded-sm font-mono transition-colors relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
        >
            {/* Subtle scan-line decorative overlay */}
            <div className="scan-line-overlay opacity-30" />
            {children}
        </motion.div>
    )
}

export function ControlsRow({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="flex items-center gap-4 flex-wrap py-4 mt-2 border-t border-[var(--border)]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.2 }}
        >
            {children}
        </motion.div>
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
