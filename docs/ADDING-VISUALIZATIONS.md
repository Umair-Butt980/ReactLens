# Adding New Visualizations

This guide explains how to add a new concept visualization to ReactLens.

## Step 1: Define Types

Create type definitions for your visualization state in `lib/types/`.

**Example: `lib/types/closure.types.ts`**

```typescript
export interface ScopeLevel {
  id: string;
  name: string;
  variables: Variable[];
  color: string;
}

export interface Variable {
  id: string;
  name: string;
  value: string;
}

export interface ClosureState {
  scopes: ScopeLevel[];
  currentScope: string;
  accessedVariables: string[];
}

export interface ClosureStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: ClosureState;
  duration: number;
}
```

Export from `lib/types/index.ts`:

```typescript
export * from './closure.types';
```

## Step 2: Create Step Data

Create the step-by-step data in `lib/data/`.

**Example: `lib/data/closure-steps.ts`**

```typescript
import type { ClosureStep } from '@/lib/types';

export const closureCode = `function outer() {
  const x = 10;
  
  function inner() {
    console.log(x);
  }
  
  return inner;
}

const closure = outer();
closure();`;

export const closureSteps: ClosureStep[] = [
  {
    id: 'step-1',
    title: 'Define Outer Function',
    explanation: 'We define a function called outer...',
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8],
    state: {
      scopes: [{ id: 'global', name: 'Global Scope', variables: [], color: '#8B5CF6' }],
      currentScope: 'global',
      accessedVariables: [],
    },
    duration: 3000,
  },
  // ... more steps
];

export const closureKeyTakeaways = [
  'Closures remember variables from their outer scope',
  'Functions can access variables defined outside them',
  // ...
];
```

## Step 3: Create Visualization Component

Create the visual component in `components/visualizations/javascript/`.

**Example: `components/visualizations/javascript/closure-visual.tsx`**

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ClosureState } from '@/lib/types';

interface ClosureVisualProps {
  state: ClosureState;
  className?: string;
}

export function ClosureVisual({ state, className }: ClosureVisualProps) {
  const { scopes, currentScope, accessedVariables } = state;

  return (
    <div className={cn('flex flex-col gap-4', className)} aria-label="closure visualization">
      {scopes.map((scope) => (
        <motion.div
          key={scope.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'rounded-xl border-2 p-4',
            scope.id === currentScope && 'ring-2 ring-primary'
          )}
          style={{ borderColor: scope.color }}
        >
          <h3 className="text-sm font-semibold">{scope.name}</h3>
          <div className="mt-2 flex gap-2">
            {scope.variables.map((variable) => (
              <div
                key={variable.id}
                className={cn(
                  'rounded px-2 py-1 text-sm',
                  accessedVariables.includes(variable.id)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted'
                )}
              >
                {variable.name}: {variable.value}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

Export from `components/visualizations/javascript/index.ts`:

```typescript
export { ClosureVisual } from './closure-visual';
```

## Step 4: Create the Page

Create the page in `app/javascript/closures/page.tsx`.

```typescript
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
import { ClosureVisual } from '@/components/visualizations';
import {
  closureCode,
  closureSteps,
  closureKeyTakeaways,
} from '@/lib/data/closure-steps';
import type { PlaybackSpeed } from '@/lib/types';

export default function ClosuresPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const totalSteps = closureSteps.length;
  const currentStepData = closureSteps[currentStep - 1];

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

  // ... handlers (copy from event-loop page)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ConceptHeader
        title="Closures & Scope"
        currentStep={currentStep}
        totalSteps={totalSteps}
        backHref="/javascript"
      />

      <div className="flex-1 overflow-hidden">
        <SplitView
          animationPanel={
            <AnimationPanelWrapper title="Visualization">
              <ClosureVisual state={currentStepData.state} />
            </AnimationPanelWrapper>
          }
          codePanel={
            <CodePanel
              code={closureCode}
              highlightedLines={currentStepData.highlightedLines}
            />
          }
        />
      </div>

      <ExplanationPanel
        title={currentStepData.title}
        explanation={currentStepData.explanation}
        controls={
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
        }
      />
    </div>
  );
}
```

## Step 5: Update Topic Data

If not already present, add the topic to `lib/data/javascript-topics.ts`:

```typescript
{
  id: 'closures',
  title: 'Closures & Scope',
  slug: 'closures',
  description: 'Master closures and understand lexical scoping...',
  category: 'javascript',
  difficulty: 'intermediate',
  estimatedTime: 12,
  icon: 'Box',
  color: '#EC4899',
}
```

## Checklist

- [ ] Types defined in `lib/types/`
- [ ] Step data created in `lib/data/`
- [ ] Visualization component in `components/visualizations/`
- [ ] Page created in `app/[category]/[concept]/page.tsx`
- [ ] Exports updated in index files
- [ ] Topic added to topic data (if new)
- [ ] Tested with all animation steps
- [ ] Responsive layout verified
