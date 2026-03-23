import { useEffect } from 'react'

const DEFAULT_TITLE = 'AlgoLens — Algorithm Visualizer'

/**
 * Sets the document title for the current page.
 * Automatically appends "— AlgoLens" suffix and restores
 * the default title on unmount.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — AlgoLens` : DEFAULT_TITLE
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title])
}
