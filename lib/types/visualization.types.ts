/**
 * Types for visualization states and animations
 */

export interface AnimationStep {
  id: string;
  duration: number;
  description: string;
  highlightedCode?: { start: number; end: number };
}

export interface VisualizationState {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  steps: AnimationStep[];
}

export interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
}

export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2;

export interface PlaybackControlsProps {
  state: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onStepChange: (step: number) => void;
}
