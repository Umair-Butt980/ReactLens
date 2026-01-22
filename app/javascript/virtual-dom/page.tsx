'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ConceptHeader,
  SplitView,
  AnimationPanelWrapper,
  ExplanationPanel,
  CodePanel,
  PlaybackControls,
  KeyTakeaways,
} from '@/components/layout';
import { VirtualDOMVisual } from '@/components/visualizations';
import {
  virtualDOMCode,
  virtualDOMSteps,
  virtualDOMKeyTakeaways,
} from '@/lib/data/virtual-dom-steps';
import type { PlaybackSpeed } from '@/lib/types';

export default function VirtualDOMPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const totalSteps = virtualDOMSteps.length;
  const currentStepData = virtualDOMSteps[currentStep - 1];

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
        title="Virtual DOM"
        currentStep={currentStep}
        totalSteps={totalSteps}
        backHref="/javascript"
        prevTopic={{ title: 'DOM Basics', href: '/javascript/dom' }}
        nextTopic={{ title: 'Async & Promises', href: '/javascript/async-promises' }}
      />

      {/* Main Content - Split View */}
      <div className="flex-1 overflow-hidden">
        <SplitView
          animationPanel={
            <AnimationPanelWrapper title="Visualization">
              <VirtualDOMVisual state={currentStepData.animationState} />
            </AnimationPanelWrapper>
          }
          codePanel={
            <CodePanel
              code={virtualDOMCode}
              language="javascript"
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
              <KeyTakeaways takeaways={virtualDOMKeyTakeaways} className="w-full max-w-xl" />
            )}
          </div>
        }
      />
    </div>
  );
}
