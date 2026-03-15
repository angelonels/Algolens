import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EASE_OUT } from '../utils/animationConfig'

export default function NotFound() {
    return (
        <div className="relative pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-[800px] mx-auto min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Scan line overlay */}
            <div className="scan-line-overlay" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="text-center"
            >
                {/* Glitch-style 404 */}
                <motion.div
                    className="glitch-text font-mono text-[clamp(5rem,15vw,10rem)] font-extrabold tracking-tighter leading-none text-[var(--fg)] mb-2 select-none"
                    data-text="404"
                    initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
                >
                    4<span className="text-[var(--accent)]">0</span>4
                </motion.div>

                <motion.div
                    className="w-16 h-0.5 bg-[var(--accent)] mx-auto mb-6"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: EASE_OUT }}
                    style={{ transformOrigin: 'center', animation: 'float 3s ease-in-out infinite' }}
                />

                <motion.h2
                    className="font-mono text-lg font-bold text-[var(--fg)] mb-3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4, ease: EASE_OUT }}
                >
                    Page Not Found
                </motion.h2>
                <motion.p
                    className="text-sm text-[var(--fg-muted)] max-w-[400px] mx-auto mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4, ease: EASE_OUT }}
                >
                    The algorithm you're looking for doesn't exist in our collection yet.
                    Check out the available visualizers on the home page.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4, ease: EASE_OUT }}
                >
                    <Link to="/">
                        <motion.button
                            className="font-mono text-xs font-bold uppercase tracking-wider px-8 py-3 border-2 border-[var(--border-strong)] bg-[var(--fg)] text-[var(--bg)] cursor-pointer"
                            style={{ boxShadow: '3px 3px 0px var(--accent)' }}
                            whileHover={{
                                x: -4, y: -4,
                                boxShadow: '7px 7px 0px var(--accent)',
                                scale: 1.02,
                            }}
                            whileTap={{ scale: 0.97, x: 0, y: 0, boxShadow: '1px 1px 0px var(--accent)' }}
                        >
                            ← Back to Algorithms
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Decorative dot grid with drift animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.08 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute inset-0 -z-10 pointer-events-none"
                    style={{
                        maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                    }}
                >
                    <motion.svg
                        width="100%" height="100%"
                        animate={{ x: [0, 8, 0], y: [0, -5, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <defs>
                            <pattern id="notFoundGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="var(--fg)" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#notFoundGrid)" />
                    </motion.svg>
                </motion.div>
            </motion.div>
        </div>
    )
}
