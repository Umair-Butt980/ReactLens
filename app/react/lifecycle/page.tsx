'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ConceptHeader,
  SplitView,
  AnimationPanelWrapper,
  ExplanationPanel,
  PlaybackControls,
  KeyTakeaways,
} from '@/components/layout';
import { CodePanel } from '@/components/layout/code-panel';
import { VisualizationErrorBoundary } from '@/components/error-boundary';
import { LifecycleVisual } from '@/components/visualizations/react';
import {
  lifecycleSteps,
  lifecycleCode,
  lifecycleKeyTakeaways,
} from '@/lib/data';
import type { PlaybackSpeed } from '@/lib/types';

export default function LifecyclePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const totalSteps = lifecycleSteps.length;
  const currentStepData = lifecycleSteps[currentStep - 1];

  // Auto-play logic with error handling
  useEffect(() => {
    if (!isPlaying || !currentStepData) return;

    try {
      const duration = currentStepData.duration / speed;
      const timer = setTimeout(() => {
        if (currentStep < totalSteps) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, duration);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Playback error:', error);
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, totalSteps, currentStepData, speed]);

  const handlePlay = useCallback(() => {
    try {
      if (currentStep >= totalSteps) {
        setCurrentStep(1);
      }
      setIsPlaying(true);
    } catch (error) {
      console.error('Play error:', error);
    }
  }, [currentStep, totalSteps]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(1);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: PlaybackSpeed) => {
    setSpeed(newSpeed);
  }, []);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
  }, []);

  // Guard against invalid step data
  if (!currentStepData) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading visualization...</p>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <ConceptHeader
        title="Component Lifecycle"
        currentStep={currentStep}
        totalSteps={totalSteps}
        backHref="/react"
        prevTopic={{ title: 'React Hooks', href: '/react/hooks' }}
        nextTopic={{ title: 'Reconciliation', href: '/react/reconciliation' }}
      />

      {/* Main Content - Split View */}
      <div className="flex-1 overflow-hidden">
        <SplitView
          animationPanel={
            <AnimationPanelWrapper title="Lifecycle Visualization">
              <VisualizationErrorBoundary visualizationName="Component Lifecycle">
                <LifecycleVisual state={currentStepData.state} />
              </VisualizationErrorBoundary>
            </AnimationPanelWrapper>
          }
          codePanel={
            <CodePanel
              code={lifecycleCode}
              language="jsx"
              highlightedLines={currentStepData.highlightedLines}
              showLineNumbers
            />
          }
        />
      </div>

      {/* Explanation Panel */}
      <ExplanationPanel
        title={currentStepData.title}
        explanation={currentStepData.explanation}
        controls={
          <div className="flex w-full flex-col items-center gap-6">
            <PlaybackControls
              isPlaying={isPlaying}
              currentStep={currentStep}
              totalSteps={totalSteps}
              speed={speed}
              onPlay={handlePlay}
              onPause={handlePause}
              onNext={handleNext}
              onPrev={handlePrev}
              onReset={handleReset}
              onSpeedChange={handleSpeedChange}
              onStepChange={handleStepChange}
            />

            {/* Show key takeaways on the last step */}
            {currentStep === totalSteps && (
              <KeyTakeaways takeaways={lifecycleKeyTakeaways} className="w-full max-w-xl" />
            )}
          </div>
        }
      />
    </div>
  );
}
