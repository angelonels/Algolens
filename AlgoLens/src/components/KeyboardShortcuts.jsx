import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const ALGORITHMS = [
    { name: 'Binary Search', path: '/binary-search' },
    { name: 'Bubble Sort', path: '/bubble-sort' },
    { name: 'Insertion Sort', path: '/insertion-sort' },
    { name: 'Merge Sort', path: '/merge-sort' },
    { name: 'Quick Sort', path: '/quick-sort' },
    { name: 'Euclidean GCD', path: '/gcd' },
    { name: 'Matrix Traversal', path: '/matrix-traversal' },
    { name: "Dijkstra's Path", path: '/dijkstra' },
    { name: 'BFS Grid Search', path: '/bfs' },
    { name: 'DFS Grid Search', path: '/dfs' },
    { name: 'K-Means Clustering', path: '/kmeans' },
    { name: 'Edit Distance (DP)', path: '/edit-distance' },
    { name: 'Linear Regression', path: '/linear-regression' },
    { name: 'Logistic Regression', path: '/logistic-regression' },
    { name: 'Decision Tree', path: '/decision-tree' }
]

const SHORTCUTS = [
    { keys: ['?'], description: 'Toggle this help panel' },
    { keys: ['←'], description: 'Previous algorithm' },
    { keys: ['→'], description: 'Next algorithm' },
    { keys: ['Esc'], description: 'Go to home / Close panel' },
    { keys: ['H'], description: 'Go to home page' },
    { keys: ['R'], description: 'Random algorithm' },
    { keys: ['D'], description: 'Toggle dark mode' },
]

function KeyBadge({ children }) {
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '28px',
            height: '28px',
            padding: '0 8px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--fg)',
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            borderBottom: '3px solid var(--border-strong)',
            borderRadius: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1,
        }}>
            {children}
        </span>
    )
}

export default function KeyboardShortcuts() {
    const [isOpen, setIsOpen] = useState(false)
    const [flashMessage, setFlashMessage] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    const { toggleTheme } = useTheme()

    const currentIndex = ALGORITHMS.findIndex(a => a.path === location.pathname)

    const showFlash = useCallback((msg) => {
        setFlashMessage(msg)
        setTimeout(() => setFlashMessage(null), 1200)
    }, [])

    const goToAlgorithm = useCallback((index) => {
        if (index >= 0 && index < ALGORITHMS.length) {
            navigate(ALGORITHMS[index].path)
            showFlash(ALGORITHMS[index].name)
        }
    }, [navigate, showFlash])

    useEffect(() => {
        const handler = (e) => {
            // Don't trigger when typing in inputs/selects/textareas
            const tag = e.target.tagName.toLowerCase()
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return

            switch (e.key) {
                case '?':
                    e.preventDefault()
                    setIsOpen(prev => !prev)
                    break

                case 'Escape':
                    if (isOpen) {
                        setIsOpen(false)
                    } else {
                        navigate('/')
                    }
                    break

                case 'ArrowLeft':
                    e.preventDefault()
                    if (currentIndex > 0) {
                        goToAlgorithm(currentIndex - 1)
                    } else if (currentIndex === -1) {
                        // On home page, go to last
                        goToAlgorithm(ALGORITHMS.length - 1)
                    }
                    break

                case 'ArrowRight':
                    e.preventDefault()
                    if (currentIndex >= 0 && currentIndex < ALGORITHMS.length - 1) {
                        goToAlgorithm(currentIndex + 1)
                    } else if (currentIndex === -1) {
                        // On home page, go to first
                        goToAlgorithm(0)
                    }
                    break

                case 'h':
                case 'H':
                    navigate('/')
                    break

                case 'r':
                case 'R': {
                    const randomIndex = Math.floor(Math.random() * ALGORITHMS.length)
                    goToAlgorithm(randomIndex)
                    break
                }

                case 'd':
                case 'D':
                    toggleTheme()
                    showFlash('Theme toggled')
                    break

                default:
                    break
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, currentIndex, navigate, goToAlgorithm, toggleTheme, showFlash])

    // Navigation context for the shortcut bar
    const prevAlgo = currentIndex > 0 ? ALGORITHMS[currentIndex - 1] : null
    const nextAlgo = currentIndex >= 0 && currentIndex < ALGORITHMS.length - 1
        ? ALGORITHMS[currentIndex + 1] : null

    return (
        <>
            {/* ── Floating Shortcut Hint ── */}
            <AnimatePresence>
                {flashMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'fixed',
                            bottom: '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                            padding: '10px 24px',
                            background: 'var(--fg)',
                            color: 'var(--bg)',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '13px',
                            fontWeight: 600,
                            border: '1px solid var(--fg)',
                            boxShadow: '4px 4px 0px var(--accent)',
                            letterSpacing: '0.04em',
                        }}
                    >
                        → {flashMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Bottom Bar (Algorithm Navigation + Help Toggle) ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                {/* Prev/Next indicators when on a visualizer */}
                {currentIndex >= 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginRight: '4px',
                    }}>
                        <motion.button
                            onClick={() => prevAlgo && goToAlgorithm(currentIndex - 1)}
                            disabled={!prevAlgo}
                            whileHover={prevAlgo ? { y: -2, boxShadow: '2px 2px 0px var(--accent)' } : {}}
                            whileTap={prevAlgo ? { scale: 0.95 } : {}}
                            title={prevAlgo ? `Previous: ${prevAlgo.name}` : 'No previous'}
                            style={{
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '16px',
                                fontWeight: 700,
                                background: prevAlgo ? 'var(--surface)' : 'var(--bg-alt)',
                                color: prevAlgo ? 'var(--fg)' : 'var(--fg-muted)',
                                border: '1px solid var(--border)',
                                borderRadius: '0px',
                                cursor: prevAlgo ? 'pointer' : 'not-allowed',
                                transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            ←
                        </motion.button>

                        <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--fg-muted)',
                            letterSpacing: '0.04em',
                            padding: '0 4px',
                            minWidth: '40px',
                            textAlign: 'center',
                        }}>
                            {currentIndex + 1}/{ALGORITHMS.length}
                        </span>

                        <motion.button
                            onClick={() => nextAlgo && goToAlgorithm(currentIndex + 1)}
                            disabled={!nextAlgo}
                            whileHover={nextAlgo ? { y: -2, boxShadow: '2px 2px 0px var(--accent)' } : {}}
                            whileTap={nextAlgo ? { scale: 0.95 } : {}}
                            title={nextAlgo ? `Next: ${nextAlgo.name}` : 'No next'}
                            style={{
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: '16px',
                                fontWeight: 700,
                                background: nextAlgo ? 'var(--surface)' : 'var(--bg-alt)',
                                color: nextAlgo ? 'var(--fg)' : 'var(--fg-muted)',
                                border: '1px solid var(--border)',
                                borderRadius: '0px',
                                cursor: nextAlgo ? 'pointer' : 'not-allowed',
                                transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            →
                        </motion.button>
                    </div>
                )}

                {/* Help Toggle Button */}
                <motion.button
                    onClick={() => setIsOpen(prev => !prev)}
                    whileHover={{
                        y: -3,
                        x: -3,
                        boxShadow: '3px 3px 0px var(--accent)',
                    }}
                    whileTap={{ scale: 0.95, y: 0, x: 0, boxShadow: '0px 0px 0px transparent' }}
                    style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '18px',
                        fontWeight: 800,
                        background: isOpen ? 'var(--accent)' : 'var(--fg)',
                        color: 'var(--bg)',
                        border: '1px solid var(--fg)',
                        borderRadius: '0px',
                        cursor: 'pointer',
                        transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '2px 2px 0px var(--border-strong)',
                    }}
                >
                    ?
                </motion.button>
            </motion.div>

            {/* ── Shortcuts Modal Overlay ── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(10, 10, 10, 0.4)',
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)',
                                zIndex: 9000,
                            }}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 9001,
                                width: '420px',
                                maxWidth: '90vw',
                                background: 'var(--surface)',
                                border: '1px solid var(--border-strong)',
                                boxShadow: '8px 8px 0px var(--border-strong)',
                                padding: '0',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '20px 28px 16px',
                                borderBottom: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div>
                                    <h3 style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '16px',
                                        fontWeight: 800,
                                        color: 'var(--fg)',
                                        letterSpacing: '-0.02em',
                                        margin: 0,
                                    }}>
                                        Keyboard <span style={{ color: 'var(--accent)' }}>Shortcuts</span>
                                    </h3>
                                    <p style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: '12px',
                                        color: 'var(--fg-muted)',
                                        margin: '4px 0 0',
                                        lineHeight: 1.4,
                                    }}>
                                        Navigate the app without a mouse
                                    </p>
                                </div>
                                <motion.button
                                    onClick={() => setIsOpen(false)}
                                    whileHover={{ scale: 1.1, color: 'var(--accent)' }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0,
                                        background: 'transparent',
                                        border: '1px solid var(--border)',
                                        borderRadius: '0px',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: 'var(--fg-muted)',
                                        cursor: 'pointer',
                                        transition: 'all 150ms',
                                    }}
                                >
                                    ✕
                                </motion.button>
                            </div>

                            {/* Shortcut List */}
                            <div style={{ padding: '8px 0' }}>
                                {SHORTCUTS.map((shortcut, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 28px',
                                            transition: 'background 150ms',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--bg-alt)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent'
                                        }}
                                    >
                                        <span style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: '13px',
                                            color: 'var(--fg)',
                                            fontWeight: 500,
                                        }}>
                                            {shortcut.description}
                                        </span>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {shortcut.keys.map((key, j) => (
                                                <KeyBadge key={j}>{key}</KeyBadge>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div style={{
                                padding: '14px 28px',
                                borderTop: '1px solid var(--border)',
                                background: 'var(--bg-alt)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <span style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '11px',
                                    color: 'var(--fg-muted)',
                                    fontWeight: 500,
                                    letterSpacing: '0.04em',
                                }}>
                                    {currentIndex >= 0
                                        ? `Viewing: ${ALGORITHMS[currentIndex].name}`
                                        : 'Home — Select an algorithm'
                                    }
                                </span>
                                <span style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: '10px',
                                    color: 'var(--fg-muted)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                }}>
                                    Press <KeyBadge>?</KeyBadge> to close
                                </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
