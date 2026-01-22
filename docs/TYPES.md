# TypeScript Types Reference

## Core Types

### Topic & Category Types

```typescript
// lib/types/concept.types.ts

interface Topic {
  id: string; // Unique identifier
  title: string; // Display title
  slug: string; // URL slug
  description: string; // Brief description
  category: 'javascript' | 'react' | 'nextjs'; // Category
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // Minutes to complete
  prerequisites?: string[]; // Required topic IDs
  icon?: string; // Lucide icon name
  color?: string; // Theme color (hex)
}

interface TopicCategory {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  color: string;
}
```

### Concept Step Types

```typescript
// lib/types/concept.types.ts

interface ConceptStep {
  id: string; // Unique step ID
  title: string; // Step title
  explanation: string; // Detailed explanation
  highlightedLines: number[]; // Code lines to highlight
  animationState: Record<string, unknown>; // State for visualization
  duration: number; // Auto-play duration (ms)
}

interface ConceptPageData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'javascript' | 'react' | 'nextjs';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  codeExample: string; // Full code snippet
  steps: ConceptStep[]; // All animation steps
  totalDuration: number; // Total time (ms)
  keyTakeaways: string[]; // Summary points
  nextTopic?: string; // Next concept slug
  prevTopic?: string; // Previous concept slug
}
```

---

## Visualization Types

### Playback State

```typescript
// lib/types/visualization.types.ts

interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
}

type PlaybackSpeed = 0.5 | 1 | 1.5 | 2;

interface PlaybackControlsProps {
  state: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onStepChange: (step: number) => void;
}
```

---

## Event Loop Types

```typescript
// lib/types/event-loop.types.ts

interface CallStackItem {
  id: string;
  name: string;
  type: 'function' | 'global' | 'callback' | 'anonymous';
  color: string;
}

interface QueueItem {
  id: string;
  name: string;
  type: 'callback' | 'microtask';
  source: string; // e.g., "setTimeout", "Promise"
}

interface WebApiItem {
  id: string;
  name: string;
  type: 'timer' | 'fetch' | 'event' | 'promise';
  delay?: number;
  progress?: number; // 0-100 for progress animation
}

interface EventLoopState {
  callStack: CallStackItem[];
  callbackQueue: QueueItem[];
  microtaskQueue: QueueItem[];
  webApis: WebApiItem[];
  currentPhase: 'stack' | 'microtask' | 'callback' | 'idle' | 'webapi';
  output: string[]; // Console output
}

interface EventLoopStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: EventLoopState;
  duration: number;
}
```

---

## Animation Types

```typescript
// lib/types/animation.types.ts

import type { Variants, Transition } from 'framer-motion';

// Pre-defined animation variants
const stackItemVariants: Variants = {
  initial: { opacity: 0, y: -30, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 30, scale: 0.8 },
};

const queueItemVariants: Variants = {
  initial: { opacity: 0, x: 50, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.9 },
};

const fadeInVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const cardHoverVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.05, 1] }, // Repeating
};

// Transition presets
const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
};
```

---

## Utility Types

```typescript
// Common utility types used across the project

type Category = 'javascript' | 'react' | 'nextjs';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type Phase = 'stack' | 'microtask' | 'callback' | 'idle' | 'webapi';
```
