import { useEffect } from 'react'
import type { PlaybackActions, PlaybackState } from './useAlgorithmPlayback'

/**
 * Keyboard bindings for algorithm playback controls.
 *
 * Wires common keys to the playback hook's actions so every visualizer
 * gets consistent keyboard-driven step navigation for free:
 *
 *   Space       → pause / resume
 *   ArrowRight  → step forward  (auto-pauses)
 *   ArrowLeft   → step backward (auto-pauses)
 *   Home        → jump to first step
 *   End         → jump to last step
 *
 * Bindings are inert when the playback has no steps or when focus
 * is inside an input / select / textarea.
 */
export function usePlaybackKeyBindings<T>(
  state: PlaybackState<T>,
  actions: PlaybackActions<T>,
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in a form element
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return

      // Only respond when a visualizer playback is active
      if (!state.canStepManually) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          actions.togglePause()
          break

        case 'ArrowRight':
          e.preventDefault()
          actions.stepForward()
          break

        case 'ArrowLeft':
          e.preventDefault()
          actions.stepBackward()
          break

        case 'Home':
          e.preventDefault()
          actions.goToStep(0)
          break

        case 'End':
          e.preventDefault()
          actions.goToStep(state.steps.length - 1)
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.canStepManually, state.steps.length, actions])
}
