import { motion } from 'framer-motion'
import { SPRING } from '../../utils/animationConfig'
import type { ReactNode } from 'react'

interface ButtonProps {
    onClick: () => void
    disabled?: boolean
    children: ReactNode
    variant?: 'primary' | 'success' | 'danger'
    className?: string
}

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
