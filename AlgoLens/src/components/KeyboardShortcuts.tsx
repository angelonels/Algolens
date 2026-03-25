import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { EASE_OUT } from '../utils/animationConfig'
import { ALGO_ROUTES } from '../data/algorithmRegistry'

interface Shortcut {
    keys: string[]
    label: string
}

const SHORTCUTS: Shortcut[] = [
    { keys: ['←'], label: 'Previous algorithm' },
    { keys: ['→'], label: 'Next algorithm' },
    { keys: ['R'], label: 'Random algorithm' },
    { keys: ['H'], label: 'Go home' },
    { keys: ['D'], label: 'Toggle dark mode' },
    { keys: ['⌘', 'K'], label: 'Focus search' },
    { keys: ['?'], label: 'Toggle this panel' },
]

export default function KeyboardShortcuts() {
    const navigate = useNavigate()
    const location = useLocation()
    const { toggleTheme } = useTheme()
    const [showHelp, setShowHelp] = useState(false)
    const [flash, setFlash] = useState('')

    const showFlash = useCallback((text: string) => {
        setFlash(text)
        setTimeout(() => setFlash(''), 1200)
    }, [])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement).tagName
            if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return

            const idx = ALGO_ROUTES.indexOf(location.pathname)

            switch (e.key) {
                case 'ArrowLeft':
                    if (idx > 0) { navigate(ALGO_ROUTES[idx - 1]); showFlash('← Previous') }
                    break
                case 'ArrowRight':
                    if (idx >= 0 && idx < ALGO_ROUTES.length - 1) { navigate(ALGO_ROUTES[idx + 1]); showFlash('Next →') }
                    break
                case 'r':
                case 'R': {
                    const rand = ALGO_ROUTES[Math.floor(Math.random() * ALGO_ROUTES.length)]
                    navigate(rand); showFlash('Random')
                    break
                }
                case 'h':
                case 'H':
                    navigate('/'); showFlash('Home')
                    break
                case 'd':
                case 'D':
                    toggleTheme(); showFlash('Theme Toggled')
                    break
                case '?':
                    setShowHelp(p => !p)
                    break
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [location.pathname, navigate, toggleTheme, showFlash])

    const currentIdx = ALGO_ROUTES.indexOf(location.pathname)

    return (
        <>
            {/* Flash message */}
            <AnimatePresence>
                {flash && (
                    <motion.div
                        key={flash}
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: EASE_OUT }}
                        className="fixed top-16 left-1/2 -translate-x-1/2 z-[200] font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 bg-[var(--fg)] text-[var(--bg)] border border-[var(--border-strong)]"
                        style={{ boxShadow: '3px 3px 0px var(--accent)' }}
                    >
                        {flash}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nav arrows (bottom right) */}
            {currentIdx >= 0 && (
                <div className="fixed bottom-5 right-5 z-50 flex items-center gap-1">
                    <button
                        onClick={() => currentIdx > 0 && navigate(ALGO_ROUTES[currentIdx - 1])}
                        disabled={currentIdx === 0}
                        className="w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] font-mono cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--border-strong)] transition-colors"
                    >←</button>
                    <span className="font-mono text-[11px] font-semibold text-[var(--fg-muted)] px-2">
                        {currentIdx + 1}/{ALGO_ROUTES.length}
                    </span>
                    <button
                        onClick={() => currentIdx < ALGO_ROUTES.length - 1 && navigate(ALGO_ROUTES[currentIdx + 1])}
                        disabled={currentIdx === ALGO_ROUTES.length - 1}
                        className="w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] font-mono cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--border-strong)] transition-colors"
                    >→</button>
                </div>
            )}

            {/* Help toggle */}
            <motion.button
                onClick={() => setShowHelp(p => !p)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-5 right-5 z-50 w-9 h-9 flex items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] font-mono font-bold cursor-pointer hover:border-[var(--border-strong)] transition-colors"
                style={{ right: currentIdx >= 0 ? '160px' : '20px' }}
            >?</motion.button>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[300]"
                            onClick={() => setShowHelp(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: EASE_OUT }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[360px] bg-[var(--surface)] border border-[var(--border-strong)] p-6"
                            style={{ boxShadow: '6px 6px 0px var(--accent)' }}
                        >
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--fg)]">Keyboard Shortcuts</h3>
                                <button
                                    onClick={() => setShowHelp(false)}
                                    className="font-mono text-lg text-[var(--fg-muted)] cursor-pointer hover:text-[var(--accent)] transition-colors bg-transparent border-none"
                                >✕</button>
                            </div>
                            <div className="flex flex-col gap-2.5">
                                {SHORTCUTS.map(s => (
                                    <div key={s.label} className="flex justify-between items-center">
                                        <span className="text-[13px] text-[var(--fg-muted)]">{s.label}</span>
                                        <div className="flex gap-1">
                                            {s.keys.map(k => (
                                                <kbd key={k} className="font-mono text-[11px] font-bold px-2 py-0.5 border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--fg)]">
                                                    {k}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
