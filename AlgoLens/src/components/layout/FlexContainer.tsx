import React from 'react';

interface FlexContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  col?: boolean;
  centered?: boolean;
  between?: boolean;
  wrap?: boolean;
  gap?: number;
}

/**
 * Reusable Flexbox layout container to standardize spacing and alignment.
 */
export function FlexContainer({ 
  children, 
  col = false, 
  centered = false, 
  between = false, 
  wrap = false,
  gap = 4,
  className = '',
  ...props 
}: FlexContainerProps) {
  const alignClass = centered ? 'items-center justify-center' : '';
  const justifyClass = between ? 'justify-between' : '';
  const wrapClass = wrap ? 'flex-wrap' : '';
  const dirClass = col ? 'flex-col' : 'flex-row';
  
  return (
    <div 
      className={`flex ${dirClass} ${alignClass} ${justifyClass} ${wrapClass} gap-${gap} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
