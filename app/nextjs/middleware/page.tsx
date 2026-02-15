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
import { MiddlewareVisual } from '@/components/visualizations/nextjs';
import {
  middlewareSteps,
  middlewareCode,
  middlewareKeyTakeaways,
} from '@/lib/data';
import type { PlaybackSpeed } from '@/lib/types';

export default function MiddlewarePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const totalSteps = middlewareSteps.length;
  const currentStepData = middlewareSteps[currentStep - 1];

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
        title="Middleware"
        currentStep={currentStep}
        totalSteps={totalSteps}
        backHref="/nextjs"
        prevTopic={{ title: 'Data Fetching', href: '/nextjs/data-fetching' }}
      />

      {/* Main Content - Split View */}
      <div className="flex-1 overflow-hidden">
        <SplitView
          animationPanel={
            <AnimationPanelWrapper title="Request Middleware">
              <VisualizationErrorBoundary visualizationName="Middleware">
                <MiddlewareVisual state={currentStepData.state} />
              </VisualizationErrorBoundary>
            </AnimationPanelWrapper>
          }
          codePanel={
            <CodePanel
              code={middlewareCode}
              language="tsx"
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
              <KeyTakeaways takeaways={middlewareKeyTakeaways} className="w-full max-w-xl" />
            )}
          </div>
        }
      />
    </div>
  );
}
