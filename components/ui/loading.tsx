'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Animated loading spinner component
 */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'border-primary/30 border-t-primary animate-spin rounded-full',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Skeleton loader for content placeholders
 */
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'rectangular', width, height }: SkeletonProps) {
  const variantClasses = {
    text: 'rounded h-4',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  return (
    <div
      className={cn('bg-muted animate-pulse', variantClasses[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton loader for visualization panels
 */
export function VisualizationSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex h-full min-h-[400px] flex-col gap-4 p-6', className)}
      aria-label="loading visualization"
    >
      {/* Title skeleton */}
      <Skeleton className="h-6 w-48" />

      {/* Main content area */}
      <div className="flex flex-1 gap-4">
        {/* Left panel - animation area */}
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-full min-h-[250px] rounded-xl" />
        </div>

        {/* Right panel - code area */}
        <div className="flex w-1/3 flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-full rounded-xl" />
        </div>
      </div>

      {/* Bottom controls skeleton */}
      <div className="flex items-center justify-center gap-4">
        <Skeleton className="h-10 w-10" variant="circular" />
        <Skeleton className="h-10 w-10" variant="circular" />
        <Skeleton className="h-10 w-10" variant="circular" />
        <Skeleton className="h-2 w-48 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Full-page loading state with spinner
 */
interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div
      className="bg-background flex min-h-screen flex-col items-center justify-center gap-4"
      role="status"
      aria-label="page loading"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Spinner size="lg" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </motion.div>
    </div>
  );
}

/**
 * Animated dots loading indicator
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)} aria-label="loading">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="bg-primary h-2 w-2 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Code panel skeleton
 */
export function CodePanelSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex flex-col gap-2 rounded-xl bg-[#1e1e2e] p-4', className)}
      aria-label="loading code"
    >
      <div className="mb-2 flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full bg-red-500/30" />
        <Skeleton className="h-3 w-3 rounded-full bg-yellow-500/30" />
        <Skeleton className="h-3 w-3 rounded-full bg-green-500/30" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 bg-white/5"
          width={`${[75, 60, 85, 50, 70, 55, 80, 65][i]}%`}
        />
      ))}
    </div>
  );
}

/**
 * Explanation panel skeleton
 */
export function ExplanationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3 p-4', className)} aria-label="loading explanation">
      <Skeleton className="h-6 w-56" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
