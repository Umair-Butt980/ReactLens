'use client';

import { Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

/**
 * Error Boundary component that catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      errorInfo: errorInfo.componentStack || null,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: string | null;
  onReset: () => void;
}

/**
 * Default fallback UI displayed when an error is caught
 */
function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div
      className="bg-background flex min-h-[400px] flex-col items-center justify-center p-8"
      role="alert"
      aria-label="error occurred"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex max-w-md flex-col items-center gap-6 text-center"
      >
        {/* Error Icon */}
        <div className="rounded-2xl bg-red-500/20 p-6">
          <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
        </div>

        {/* Error Title */}
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-bold">Something went wrong</h2>
          <p className="text-muted-foreground">
            An error occurred while rendering this visualization. Please try again.
          </p>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="w-full rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-red-300">Error Details:</p>
            <code className="text-muted-foreground block text-xs break-all">{error.message}</code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className={cn(
              'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium',
              'bg-primary text-primary-foreground hover:bg-primary/90',
              'focus:ring-primary/50 transition-colors focus:ring-2 focus:outline-none'
            )}
            aria-label="try again"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/javascript"
            className={cn(
              'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium',
              'border-border bg-background text-foreground hover:bg-muted border',
              'transition-colors'
            )}
            aria-label="go back to javascript topics"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to topics
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Visualization-specific error boundary with themed styling
 */
interface VisualizationErrorBoundaryProps {
  children: ReactNode;
  visualizationName?: string;
}

export function VisualizationErrorBoundary({
  children,
  visualizationName = 'visualization',
}: VisualizationErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div
          className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border border-red-500/30 bg-red-500/5 p-6"
          role="alert"
          aria-label={`${visualizationName} error`}
        >
          <AlertTriangle className="h-8 w-8 text-red-400" aria-hidden="true" />
          <p className="text-muted-foreground text-center text-sm">
            Failed to load {visualizationName}. Please refresh the page.
          </p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
