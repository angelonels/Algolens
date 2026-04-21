import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Standard error boundary to prevent full page crashes during visualizer execution
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in algorithm visualizer:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 text-red-900 rounded-lg shadow-sm border border-red-200">
          <h2 className="text-xl font-bold mb-2">Visualization Crashed</h2>
          <p className="text-sm opacity-80 max-w-md text-center">
            The algorithm unexpectedly threw an error. Checking the input validations may help.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
