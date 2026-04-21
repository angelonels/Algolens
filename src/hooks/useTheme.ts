import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

/**
 * Hook to persist light/dark mode theme preferences to localStorage
 * and synchronize with the document body class.
 */
export function useTheme(defaultTheme: Theme = 'system') {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const persisted = localStorage.getItem('algolens-theme');
      if (persisted === 'light' || persisted === 'dark' || persisted === 'system') {
        return persisted;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('algolens-theme', theme);

    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return { theme, setTheme };
}
