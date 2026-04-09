import { useState, useCallback } from 'react';

/**
 * Hook to manage global playback speed of visualizations.
 */
export function useAlgorithmSpeed(initialSpeed: number = 50) {
  const [speed, setSpeed] = useState<number>(initialSpeed);

  const updateSpeed = useCallback((newSpeed: number) => {
    // Clamp speed between 1x and 100x effectively
    setSpeed(Math.max(1, Math.min(newSpeed, 100)));
  }, []);

  return { speed, updateSpeed };
}
