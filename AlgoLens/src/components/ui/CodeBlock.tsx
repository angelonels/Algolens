import { useState, useCallback, useEffect } from 'react'
import { type CodeLanguage, type AlgorithmCodes, LANGUAGES, getStoredLanguage, setStoredLanguage } from '../../data/languageConfig'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from '../../utils/animationConfig'

interface CodeBlockProps {
    code?: string
    codes?: AlgorithmCodes
}

export function CodeBlock({ code, codes }: CodeBlockProps) {
    const [lang, setLang] = useState<CodeLanguage>(getStoredLanguage)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const handler = () => setLang(getStoredLanguage())
        window.addEventListener('algolens-lang-change', handler)
        return () => window.removeEventListener('algolens-lang-change', handler)
    }, [])

    const displayCode = codes ? codes[lang] : (code || '')

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(displayCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }, [displayCode])

    const handleLangChange = useCallback((newLang: CodeLanguage) => {
        setLang(newLang)
        setStoredLanguage(newLang)
        window.dispatchEvent(new Event('algolens-lang-change'))
    }, [])

    return (
        <motion.div
            className="relative bg-[var(--code-bg)] text-[var(--code-fg)] border border-[var(--border)] font-mono text-[13px] leading-relaxed overflow-x-auto rounded-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 }}
        >
            {codes && (
                <div className="flex border-b border-white/10">
                    {LANGUAGES.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => handleLangChange(key)}
                            className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider cursor-pointer transition-all ${
                                lang === key
                                    ? 'bg-white/10 text-[var(--code-fg)] border-b-2 border-[var(--accent)]'
                                    : 'bg-transparent text-[var(--code-fg)]/50 hover:text-[var(--code-fg)] hover:bg-white/5 border-b-2 border-transparent'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
            <div className="p-5">
                <pre className="m-0 whitespace-pre-wrap">{displayCode}</pre>
            </div>
            <motion.button
                onClick={handleCopy}
                aria-label="Copy code to clipboard"
                title="Copy code to clipboard"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute top-3 right-3 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider cursor-pointer transition-all rounded-sm ${copied
                    ? 'bg-green-600/20 text-green-400 border border-green-600/40'
                    : 'bg-transparent text-[var(--code-fg)] border border-white/20 hover:bg-white/10 hover:border-white/40'
                    }`}
                style={codes ? { top: '52px' } : undefined}
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
