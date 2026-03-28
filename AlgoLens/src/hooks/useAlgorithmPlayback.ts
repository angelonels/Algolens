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
  /** Progress through the steps as a percentage (0–100) */
  progress: number
  /** True when steps exist but playback hasn't started auto-playing */
  canStepManually: boolean
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
  /** Advance one step forward (pauses auto-play if running) */
  stepForward: () => void
  /** Go back one step (pauses auto-play if running) */
  stepBackward: () => void
  /** Jump to a specific step index (pauses auto-play if running) */
  goToStep: (index: number) => void
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

  /** Advance one step; pauses auto-play so the user stays in control. */
  const stepForward = useCallback(() => {
    if (steps.length === 0) return
    setIsPaused(true)
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  /** Go back one step; pauses auto-play so the user stays in control. */
  const stepBackward = useCallback(() => {
    if (steps.length === 0) return
    setIsPaused(true)
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [steps.length])

  /** Jump to an arbitrary step index; clamps to valid range. */
  const goToStep = useCallback((index: number) => {
    if (steps.length === 0) return
    setIsPaused(true)
    setCurrentStep(Math.max(0, Math.min(index, steps.length - 1)))
  }, [steps.length])

  const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null
  const isFinalStep = steps.length > 0 && currentStep === steps.length - 1 && !isRunning
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0
  const canStepManually = steps.length > 0 && currentStep >= 0

  const state: PlaybackState<T> = {
    steps,
    currentStep,
    isRunning,
    isPaused,
    speed,
    currentStepData,
    isFinalStep,
    progress,
    canStepManually,
  }

  const actions: PlaybackActions<T> = {
    start,
    reset,
    togglePause,
    setSpeed: setPlaybackSpeed,
    stepForward,
    stepBackward,
    goToStep,
  }

  return [state, actions]
}
