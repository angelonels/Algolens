import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
    theme: Theme
    isDark: boolean
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): Theme {
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
}

/**
 * Theme provider refactored to delegate persistence to the generic
 * `useLocalStorage` hook, eliminating duplicated localStorage boilerplate.
 *
 * Falls back to the system's color-scheme preference when no stored
 * value exists.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useLocalStorage<Theme>('algolens-theme', getSystemTheme())

    useEffect(() => {
        document.documentElement.dataset.theme = theme
    }, [theme])

    const toggleTheme = () => setTheme((t: Theme) => (t === 'light' ? 'dark' : 'light'))

    return (
        <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}
