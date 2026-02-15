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

## Next.js Types

### File-based Routing Types

```typescript
// lib/types/file-routing.types.ts

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isSpecial?: boolean; // layout.tsx, loading.tsx, error.tsx, etc.
  color?: string;
}

interface BrowserBar {
  url: string;
  isLoading: boolean;
}

interface RouteSegment {
  id: string;
  segment: string;
  isDynamic: boolean; // [slug], [id], etc.
  isGroup: boolean; // (marketing), (shop), etc.
}

interface LayoutWrapper {
  id: string;
  name: string;
  depth: number;
  isActive: boolean;
  color: string;
}

interface FileRoutingState {
  fileTree: FileNode[];
  browserUrl: BrowserBar;
  activeRoute: string;
  routeSegments: RouteSegment[];
  layoutWrappers: LayoutWrapper[];
  highlightedFile: string;
}

interface FileRoutingStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: FileRoutingState;
  duration: number;
}
```

---

### Server vs Client Components Types

```typescript
// lib/types/server-client-components.types.ts

interface ComponentNode {
  id: string;
  name: string;
  type: 'server' | 'client';
  children?: string[];
  props?: string[];
  hasDirective?: boolean; // 'use client'
  color: string;
}

interface DataFlowArrow {
  id: string;
  from: string;
  to: string;
  label: string;
  type: 'props' | 'children' | 'serialized';
}

interface BoundaryLine {
  visible: boolean;
  label: string;
}

interface RenderTimelineEntry {
  id: string;
  phase: string;
  description: string;
  isActive: boolean;
}

interface ServerClientState {
  components: ComponentNode[];
  dataFlowArrows: DataFlowArrow[];
  boundaryLine: BoundaryLine;
  renderTimeline: RenderTimelineEntry[];
  currentPhase: 'server-render' | 'serialize' | 'client-hydrate' | 'interactive' | 'overview';
}

interface ServerClientStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: ServerClientState;
  duration: number;
}
```

---

### Rendering Strategies Types

```typescript
// lib/types/rendering-strategies.types.ts

interface TimelinePhase {
  id: string;
  label: string;
  description: string;
  timing: 'build' | 'request' | 'revalidate';
  isActive: boolean;
  color: string;
}

interface CacheStatus {
  isCached: boolean;
  isStale: boolean;
  ttl?: number; // seconds
  lastRevalidated?: string;
}

interface StrategyComparison {
  strategy: 'ssg' | 'ssr' | 'isr';
  label: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

interface RequestFlowStep {
  id: string;
  label: string;
  type: 'client' | 'cdn' | 'server' | 'database';
  isActive: boolean;
}

interface RenderingStrategiesState {
  timelinePhases: TimelinePhase[];
  cacheStatus: CacheStatus;
  strategyComparison: StrategyComparison[];
  requestFlow: RequestFlowStep[];
  activeStrategy: 'ssg' | 'ssr' | 'isr' | 'overview';
  currentPhase: string;
}

interface RenderingStrategiesStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: RenderingStrategiesState;
  duration: number;
}
```

---

### Data Fetching Types

```typescript
// lib/types/data-fetching.types.ts

interface FetchRequest {
  id: string;
  url: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  cacheStrategy: 'force-cache' | 'no-store' | 'revalidate';
  data?: string;
}

interface FetchComponent {
  id: string;
  name: string;
  isAsync: boolean;
  fetchRequests: string[]; // references to FetchRequest ids
  status: 'waiting' | 'fetching' | 'rendered' | 'streaming';
}

interface WaterfallItem {
  id: string;
  label: string;
  startTime: number;
  endTime: number;
  color: string;
  isParallel: boolean;
}

interface SuspenseBoundary {
  id: string;
  fallback: string; // loading UI description
  isResolved: boolean;
  children: string[]; // component ids
}

interface DataFetchingState {
  fetchRequests: FetchRequest[];
  components: FetchComponent[];
  waterfallItems: WaterfallItem[];
  suspenseBoundaries: SuspenseBoundary[];
  currentPhase: 'setup' | 'fetching' | 'streaming' | 'complete' | 'overview';
  showDeduplication: boolean;
}

interface DataFetchingStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: DataFetchingState;
  duration: number;
}
```

---

### Middleware Types

```typescript
// lib/types/middleware.types.ts

interface MiddlewareRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  cookies: Record<string, string>;
}

interface MiddlewarePipeline {
  steps: string[];
  currentStep: number;
  result: 'next' | 'redirect' | 'rewrite' | 'pending';
}

interface MatcherPattern {
  id: string;
  pattern: string;
  isMatched: boolean;
  description: string;
}

interface ResponseModification {
  id: string;
  type: 'header' | 'cookie' | 'redirect' | 'rewrite';
  key: string;
  value: string;
}

interface FlowNode {
  id: string;
  label: string;
  type: 'request' | 'matcher' | 'middleware' | 'response' | 'destination';
  isActive: boolean;
  color: string;
}

interface MiddlewareState {
  request: MiddlewareRequest;
  pipeline: MiddlewarePipeline;
  matchers: MatcherPattern[];
  responseModifications: ResponseModification[];
  flowNodes: FlowNode[];
  currentPhase: 'incoming' | 'matching' | 'executing' | 'response' | 'overview';
}

interface MiddlewareStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: MiddlewareState;
  duration: number;
}
```

---

## Utility Types

```typescript
// Common utility types used across the project

type Category = 'javascript' | 'react' | 'nextjs';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type Phase = 'stack' | 'microtask' | 'callback' | 'idle' | 'webapi';
```
