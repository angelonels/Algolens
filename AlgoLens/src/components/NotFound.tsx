import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EASE_OUT } from '../utils/animationConfig'

export default function NotFound() {
    return (
        <div className="relative pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-[800px] mx-auto min-h-screen flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="text-center"
            >
                {/* Glitch-style 404 */}
                <motion.div
                    className="font-mono text-[clamp(5rem,15vw,10rem)] font-extrabold tracking-tighter leading-none text-[var(--fg)] mb-2 select-none"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    4<span className="text-[var(--accent)]">0</span>4
                </motion.div>

                <div className="w-16 h-0.5 bg-[var(--accent)] mx-auto mb-6" />

                <h2 className="font-mono text-lg font-bold text-[var(--fg)] mb-3">
                    Page Not Found
                </h2>
                <p className="text-sm text-[var(--fg-muted)] max-w-[400px] mx-auto mb-8 leading-relaxed">
                    The algorithm you're looking for doesn't exist in our collection yet.
                    Check out the available visualizers on the home page.
                </p>

                <Link to="/">
                    <motion.button
                        className="font-mono text-xs font-bold uppercase tracking-wider px-8 py-3 border-2 border-[var(--border-strong)] bg-[var(--fg)] text-[var(--bg)] cursor-pointer"
                        style={{ boxShadow: '3px 3px 0px var(--accent)' }}
                        whileHover={{ x: -3, y: -3, boxShadow: '6px 6px 0px var(--accent)' }}
                        whileTap={{ scale: 0.97 }}
                    >
                        ← Back to Algorithms
                    </motion.button>
                </Link>

                {/* Decorative dot grid */}
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
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="notFoundGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="var(--fg)" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#notFoundGrid)" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    )
}
