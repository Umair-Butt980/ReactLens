'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PlaybackSpeed } from '@/lib/types';

/**
 * Configuration for the visualization hook
 */
interface UseVisualizationConfig<T> {
  /** Array of steps for the visualization */
  steps: T[];
  /** Function to get the duration of a step */
  getDuration: (step: T) => number;
  /** Initial step index (1-based) */
  initialStep?: number;
  /** Initial playback speed */
  initialSpeed?: PlaybackSpeed;
  /** Callback when step changes */
  onStepChange?: (step: number, data: T) => void;
  /** Callback when playback completes */
  onComplete?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Return type for the visualization hook
 */
interface UseVisualizationReturn<T> {
  /** Current step (1-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Current step data */
  currentStepData: T | null;
  /** Whether playback is active */
  isPlaying: boolean;
  /** Current playback speed */
  speed: PlaybackSpeed;
  /** Whether there's an error */
  hasError: boolean;
  /** Error message if any */
  errorMessage: string | null;
  /** Play/resume playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Toggle play/pause */
  togglePlay: () => void;
  /** Go to next step */
  next: () => void;
  /** Go to previous step */
  prev: () => void;
  /** Reset to first step */
  reset: () => void;
  /** Go to specific step */
  goToStep: (step: number) => void;
  /** Change playback speed */
  setSpeed: (speed: PlaybackSpeed) => void;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Custom hook for managing visualization playback with error handling
 *
 * @example
 * ```tsx
 * const {
 *   currentStep,
 *   totalSteps,
 *   currentStepData,
 *   isPlaying,
 *   play,
 *   pause,
 *   next,
 *   prev,
 *   reset,
 * } = useVisualization({
 *   steps: eventLoopSteps,
 *   getDuration: (step) => step.duration,
 * });
 * ```
 */
export function useVisualization<T>({
  steps,
  getDuration,
  initialStep = 1,
  initialSpeed = 1,
  onStepChange,
  onComplete,
  onError,
}: UseVisualizationConfig<T>): UseVisualizationReturn<T> {
  // Validate steps array
  const totalSteps = steps.length;

  // State
  const [currentStep, setCurrentStep] = useState(() => {
    // Clamp initial step to valid range
    return Math.max(1, Math.min(initialStep, totalSteps));
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(initialSpeed);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get current step data safely
  const currentStepData = steps[currentStep - 1] ?? null;

  // Clear any existing timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Handle errors
  const handleError = useCallback(
    (error: Error) => {
      console.error('Visualization error:', error);
      setHasError(true);
      setErrorMessage(error.message);
      setIsPlaying(false);
      clearTimer();
      onError?.(error);
    },
    [clearTimer, onError]
  );

  // Clear error state
  const clearError = useCallback(() => {
    setHasError(false);
    setErrorMessage(null);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || !currentStepData) {
      clearTimer();
      return;
    }

    try {
      const duration = getDuration(currentStepData) / speed;

      timerRef.current = setTimeout(() => {
        try {
          if (currentStep < totalSteps) {
            setCurrentStep((prev) => {
              const nextStep = prev + 1;
              // Notify step change
              const nextData = steps[nextStep - 1];
              if (nextData) {
                onStepChange?.(nextStep, nextData);
              }
              return nextStep;
            });
          } else {
            // Reached the end
            setIsPlaying(false);
            onComplete?.();
          }
        } catch (error) {
          handleError(error instanceof Error ? error : new Error('Unknown error during playback'));
        }
      }, duration);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to calculate step duration'));
    }

    return clearTimer;
  }, [
    isPlaying,
    currentStep,
    totalSteps,
    currentStepData,
    speed,
    getDuration,
    steps,
    onStepChange,
    onComplete,
    clearTimer,
    handleError,
  ]);

  // Play handler
  const play = useCallback(() => {
    try {
      if (totalSteps === 0) {
        throw new Error('No steps available for playback');
      }

      // If at the end, reset to beginning
      if (currentStep >= totalSteps) {
        setCurrentStep(1);
        onStepChange?.(1, steps[0]);
      }

      setIsPlaying(true);
      clearError();
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to start playback'));
    }
  }, [currentStep, totalSteps, steps, onStepChange, clearError, handleError]);

  // Pause handler
  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Next step handler
  const next = useCallback(() => {
    try {
      if (currentStep < totalSteps) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        onStepChange?.(nextStep, steps[nextStep - 1]);
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to go to next step'));
    }
  }, [currentStep, totalSteps, steps, onStepChange, handleError]);

  // Previous step handler
  const prev = useCallback(() => {
    try {
      if (currentStep > 1) {
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        onStepChange?.(prevStep, steps[prevStep - 1]);
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to go to previous step'));
    }
  }, [currentStep, steps, onStepChange, handleError]);

  // Reset handler
  const reset = useCallback(() => {
    try {
      setIsPlaying(false);
      clearTimer();
      setCurrentStep(1);
      clearError();
      if (steps[0]) {
        onStepChange?.(1, steps[0]);
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to reset'));
    }
  }, [clearTimer, clearError, steps, onStepChange, handleError]);

  // Go to specific step handler
  const goToStep = useCallback(
    (step: number) => {
      try {
        if (step < 1 || step > totalSteps) {
          throw new Error(`Invalid step: ${step}. Must be between 1 and ${totalSteps}`);
        }

        setCurrentStep(step);
        setIsPlaying(false);
        clearTimer();

        const stepData = steps[step - 1];
        if (stepData) {
          onStepChange?.(step, stepData);
        }
      } catch (error) {
        handleError(error instanceof Error ? error : new Error('Failed to go to step'));
      }
    },
    [totalSteps, steps, onStepChange, clearTimer, handleError]
  );

  // Speed change handler
  const handleSpeedChange = useCallback((newSpeed: PlaybackSpeed) => {
    setSpeed(newSpeed);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    currentStep,
    totalSteps,
    currentStepData,
    isPlaying,
    speed,
    hasError,
    errorMessage,
    play,
    pause,
    togglePlay,
    next,
    prev,
    reset,
    goToStep,
    setSpeed: handleSpeedChange,
    clearError,
  };
}

export default useVisualization;
