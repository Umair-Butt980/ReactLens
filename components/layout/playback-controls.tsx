'use client';

import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PlaybackSpeed } from '@/lib/types';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onStepChange: (step: number) => void;
  className?: string;
}

const speeds: PlaybackSpeed[] = [0.5, 1, 1.5, 2];

export function PlaybackControls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
  onStepChange,
  className,
}: PlaybackControlsProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div
      className={cn(
        'border-border/30 bg-card/50 flex flex-col gap-4 rounded-xl border p-4 backdrop-blur-sm',
        'w-full max-w-xl',
        className
      )}
      aria-label="playback controls"
    >
      {/* Progress bar */}
      <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
        <motion.div
          className="from-primary to-secondary absolute inset-y-0 left-0 rounded-full bg-gradient-to-r"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          aria-hidden="true"
        />

        {/* Clickable track for seeking */}
        <input
          type="range"
          min={1}
          max={totalSteps}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="seek to step"
        />

        {/* Step dots */}
        <div className="absolute inset-0 flex items-center justify-between px-0.5">
          {Array.from({ length: Math.min(totalSteps, 12) }).map((_, i) => {
            const stepNum = Math.round((i / 11) * (totalSteps - 1)) + 1;
            return (
              <button
                key={i}
                onClick={() => onStepChange(stepNum)}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-all duration-200',
                  stepNum <= currentStep
                    ? 'scale-100 bg-white'
                    : 'scale-75 bg-white/30 hover:scale-100'
                )}
                aria-label={`go to step ${stepNum}`}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left - Reset */}
        <button
          onClick={onReset}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
          aria-label="reset animation"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Center - Main controls */}
        <div className="flex items-center gap-2">
          {/* Previous */}
          <button
            onClick={onPrev}
            disabled={currentStep <= 1}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
              'text-muted-foreground hover:bg-muted hover:text-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            aria-label="previous step"
          >
            <SkipBack className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Play/Pause */}
          <motion.button
            onClick={isPlaying ? onPause : onPlay}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90',
              'glow-purple'
            )}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? 'pause animation' : 'play animation'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
            )}
          </motion.button>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
              'text-muted-foreground hover:bg-muted hover:text-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            aria-label="next step"
          >
            <SkipForward className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Right - Speed selector */}
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground mr-1 text-xs">Speed:</span>
          <select
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value) as PlaybackSpeed)}
            className={cn(
              'border-border/30 bg-muted/50 h-9 rounded-lg border px-2 text-sm',
              'text-foreground focus:ring-primary/50 focus:ring-2 focus:outline-none'
            )}
            aria-label="playback speed"
          >
            {speeds.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step indicator */}
      <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
        <span>Step</span>
        <span className="text-foreground font-mono font-medium">{currentStep}</span>
        <span>of</span>
        <span className="text-foreground font-mono font-medium">{totalSteps}</span>
      </div>
    </div>
  );
}

interface MiniPlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  canPrev: boolean;
  canNext: boolean;
  className?: string;
}

export function MiniPlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  canPrev,
  canNext,
  className,
}: MiniPlaybackControlsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} aria-label="mini playback controls">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
          'text-muted-foreground hover:bg-muted hover:text-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        aria-label="previous step"
      >
        <SkipBack className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        onClick={isPlaying ? onPause : onPlay}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
          'bg-primary/20 text-primary hover:bg-primary/30'
        )}
        aria-label={isPlaying ? 'pause' : 'play'}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />
        )}
      </button>

      <button
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
          'text-muted-foreground hover:bg-muted hover:text-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
        aria-label="next step"
      >
        <SkipForward className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
