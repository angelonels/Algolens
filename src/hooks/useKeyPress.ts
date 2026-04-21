import { useState, useEffect } from 'react';

/**
 * Hook to listen for specific key presses, e.g., Spacebar for pausing the visualization
 */
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      // Prevent triggering when typing inside form inputs
      const activeElement = document.activeElement;
      const isInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';

      if (!isInput && e.key === targetKey) {
        if (e.key === ' ') e.preventDefault(); // prevent scrolling for spacebar
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}
