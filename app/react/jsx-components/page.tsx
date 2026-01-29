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
import { JSXComponentsVisual } from '@/components/visualizations/react';
import { jsxComponentsSteps, jsxComponentsCode, jsxComponentsKeyTakeaways } from '@/lib/data';
import type { PlaybackSpeed } from '@/lib/types';

export default function JSXComponentsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const totalSteps = jsxComponentsSteps.length;
  const currentStepData = jsxComponentsSteps[currentStep - 1];

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const duration = currentStepData.duration / speed;
    const timer = setTimeout(() => {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, currentStepData.duration, speed]);

  const handlePlay = useCallback(() => {
    if (currentStep >= totalSteps) {
      setCurrentStep(1);
    }
    setIsPlaying(true);
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

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <ConceptHeader
        title="JSX & Components"
        currentStep={currentStep}
        totalSteps={totalSteps}
        backHref="/react"
        prevTopic={{ title: 'Virtual DOM', href: '/javascript/virtual-dom' }}
        nextTopic={{ title: 'Props & State', href: '/react/props-state' }}
      />

      {/* Main Content - Split View */}
      <div className="flex-1 overflow-hidden">
        <SplitView
          animationPanel={
            <AnimationPanelWrapper title="JSX Transformation Pipeline">
              <VisualizationErrorBoundary visualizationName="JSX & Components">
                <JSXComponentsVisual state={currentStepData.state} />
              </VisualizationErrorBoundary>
            </AnimationPanelWrapper>
          }
          codePanel={
            <CodePanel
              code={jsxComponentsCode}
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
              <KeyTakeaways takeaways={jsxComponentsKeyTakeaways} className="w-full max-w-xl" />
            )}
          </div>
        }
      />
    </div>
  );
}
