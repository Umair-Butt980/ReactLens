'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConceptHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  backHref?: string;
  prevTopic?: { title: string; href: string };
  nextTopic?: { title: string; href: string };
}

export function ConceptHeader({
  title,
  currentStep,
  totalSteps,
  backHref = '/',
  prevTopic,
  nextTopic,
}: ConceptHeaderProps) {
  return (
    <header
      className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      aria-label="concept header"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left - Back button */}
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className={cn(
              'text-muted-foreground flex items-center gap-2 text-sm transition-colors',
              'hover:text-foreground'
            )}
            aria-label="back to topics"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back to topics</span>
          </Link>

          {prevTopic && (
            <Link
              href={prevTopic.href}
              className={cn(
                'text-muted-foreground hidden items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors md:flex',
                'hover:bg-muted hover:text-foreground'
              )}
              aria-label={`previous topic: ${prevTopic.title}`}
            >
              <ChevronLeft className="h-3 w-3" aria-hidden="true" />
              {prevTopic.title}
            </Link>
          )}
        </div>

        {/* Center - Title and step indicator */}
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">{title}</h1>
          <p className="text-muted-foreground text-xs">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Right - Next topic */}
        <div className="flex items-center gap-4">
          {nextTopic && (
            <Link
              href={nextTopic.href}
              className={cn(
                'text-muted-foreground hidden items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors md:flex',
                'hover:bg-muted hover:text-foreground'
              )}
              aria-label={`next topic: ${nextTopic.title}`}
            >
              {nextTopic.title}
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          )}

          {/* Step dots for mobile */}
          <div className="flex items-center gap-1 sm:hidden" aria-label="step progress">
            {Array.from({ length: Math.min(totalSteps, 5) }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'step-dot',
                  i + 1 === currentStep
                    ? 'active bg-primary'
                    : i + 1 < currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted'
                )}
                aria-hidden="true"
              />
            ))}
            {totalSteps > 5 && <span className="text-muted-foreground text-xs">...</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
