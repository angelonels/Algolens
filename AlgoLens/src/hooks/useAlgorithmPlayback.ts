import { useState, useEffect, useCallback } from 'react'
import { SPEED_PRESETS, type SpeedKey } from '../utils/animationConfig'

/**
 * Shared playback hook for algorithm visualizers (SRP + DIP).
 *
 * Encapsulates the boilerplate state management and auto-advance timer
 * that was previously duplicated across all 19 visualizers.
 *
 * @template T - The step type specific to each algorithm
 */
export interface PlaybackState<T> {
  steps: T[]
  currentStep: number
  isRunning: boolean
  isPaused: boolean
  speed: SpeedKey
  /** The data for the current step, or null if no step is active */
  currentStepData: T | null
  /** True when the final step has been reached and playback has stopped */
  isFinalStep: boolean
}

export interface PlaybackActions<T> {
  /** Initialize steps and begin playback */
  start: (steps: T[]) => void
  /** Reset all playback state */
  reset: () => void
  /** Toggle between paused and playing */
  togglePause: () => void
  /** Set playback speed */
  setSpeed: (speed: SpeedKey) => void
}

export function useAlgorithmPlayback<T>(): [PlaybackState<T>, PlaybackActions<T>] {
  const [steps, setSteps] = useState<T[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState<SpeedKey>('1x')
  const [isPaused, setIsPaused] = useState(false)

  // Auto-advance timer
  useEffect(() => {
    if (isRunning && !isPaused && currentStep >= 0 && currentStep < steps.length - 1) {
      const t = setTimeout(() => setCurrentStep(c => c + 1), SPEED_PRESETS[speed])
      return () => clearTimeout(t)
    } else if (isRunning && currentStep === steps.length - 1) {
      setIsRunning(false)
    }
  }, [currentStep, isRunning, steps, speed, isPaused])

  const start = useCallback((newSteps: T[]) => {
    setSteps(newSteps)
    setCurrentStep(0)
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const reset = useCallback(() => {
    setSteps([])
    setCurrentStep(-1)
    setIsRunning(false)
    setIsPaused(false)
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused(p => !p)
  }, [])

  const setPlaybackSpeed = useCallback((newSpeed: SpeedKey) => {
    setSpeed(newSpeed)
  }, [])

  const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null
  const isFinalStep = steps.length > 0 && currentStep === steps.length - 1 && !isRunning

  const state: PlaybackState<T> = {
    steps,
    currentStep,
    isRunning,
    isPaused,
    speed,
    currentStepData,
    isFinalStep,
  }

  const actions: PlaybackActions<T> = {
    start,
    reset,
    togglePause,
    setSpeed: setPlaybackSpeed,
  }

  return [state, actions]
}
