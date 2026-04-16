import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

/**
 * Standard loading spinner for React Suspense or heavy async calculations.
 */
export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg 
        className="animate-spin text-[var(--accent)]" 
        width={size} 
        height={size} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </div>
  );
}
