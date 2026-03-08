import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls the window to the top whenever the route changes.
 * Prevents users from landing mid-page when navigating between visualizers.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }, [pathname])

    return null
}
