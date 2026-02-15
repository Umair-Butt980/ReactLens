# Components Documentation

## Layout Components

### ConceptHeader

Header component for concept visualization pages.

**Location:** `components/layout/concept-header.tsx`

**Props:**

```typescript
interface ConceptHeaderProps {
  title: string; // Page title (e.g., "Event Loop")
  currentStep: number; // Current animation step
  totalSteps: number; // Total number of steps
  backHref?: string; // Back button URL (default: "/")
  prevTopic?: { title: string; href: string }; // Previous topic link
  nextTopic?: { title: string; href: string }; // Next topic link
}
```

**Usage:**

```tsx
<ConceptHeader
  title="Event Loop"
  currentStep={currentStep}
  totalSteps={10}
  backHref="/javascript"
  prevTopic={{ title: 'Call Stack', href: '/javascript/call-stack' }}
  nextTopic={{ title: 'Closures', href: '/javascript/closures' }}
/>
```

---

### SplitView

Container for the animation and code panels.

**Location:** `components/layout/main-content.tsx`

**Props:**

```typescript
interface SplitViewProps {
  animationPanel: React.ReactNode; // Left side content
  codePanel: React.ReactNode; // Right side content
  className?: string;
}
```

**Usage:**

```tsx
<SplitView
  animationPanel={<MyVisualization state={state} />}
  codePanel={<CodePanel code={code} highlightedLines={[1, 2]} />}
/>
```

---

### CodePanel

Syntax-highlighted code display with line highlighting.

**Location:** `components/layout/code-panel.tsx`

**Props:**

```typescript
interface CodePanelProps {
  code: string; // Source code to display
  language?: string; // Language (default: "javascript")
  highlightedLines?: number[]; // Lines to highlight
  showLineNumbers?: boolean; // Show line numbers (default: true)
  className?: string;
}
```

**Usage:**

```tsx
<CodePanel
  code={`console.log('Hello');`}
  language="javascript"
  highlightedLines={[1]}
  showLineNumbers
/>
```

---

### ExplanationPanel

Bottom panel with step explanation and controls.

**Location:** `components/layout/explanation-panel.tsx`

**Props:**

```typescript
interface ExplanationPanelProps {
  title: string; // Step title
  explanation: string; // Step explanation text
  controls: React.ReactNode; // Playback controls
  className?: string;
}
```

**Usage:**

```tsx
<ExplanationPanel
  title="The Call Stack"
  explanation="When JavaScript executes code..."
  controls={<PlaybackControls {...controlProps} />}
/>
```

---

### PlaybackControls

Animation playback control bar.

**Location:** `components/layout/playback-controls.tsx`

**Props:**

```typescript
interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: PlaybackSpeed; // 0.5 | 1 | 1.5 | 2
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onStepChange: (step: number) => void;
  className?: string;
}
```

---

### TopicCard & TopicGrid

Cards for displaying topics on overview pages.

**Location:** `components/layout/topic-card.tsx`

**Props:**

```typescript
interface TopicCardProps {
  topic: Topic; // Topic data
  index?: number; // For stagger animation
}

interface TopicGridProps {
  topics: Topic[];
  className?: string;
}
```

**Usage:**

```tsx
<TopicGrid topics={javascriptTopics} />
```

---

## Visualization Components

### EventLoopVisual

Animated Event Loop visualization.

**Location:** `components/visualizations/javascript/event-loop-visual.tsx`

**Props:**

```typescript
interface EventLoopVisualProps {
  state: EventLoopState; // Current visualization state
  className?: string;
}
```

**State Structure:**

```typescript
interface EventLoopState {
  callStack: CallStackItem[];
  callbackQueue: QueueItem[];
  microtaskQueue: QueueItem[];
  webApis: WebApiItem[];
  currentPhase: 'stack' | 'microtask' | 'callback' | 'idle' | 'webapi';
  output: string[];
}
```

---

## Next.js Visualization Components

### FileRoutingVisual

Animated folder tree to route mapping visualization showing how the Next.js App Router maps file system structure to URL routes.

**Location:** `components/visualizations/nextjs/file-routing-visual.tsx`

**Props:**

```typescript
interface FileRoutingVisualProps {
  state: FileRoutingState;
  className?: string;
}
```

**State Structure:**

```typescript
interface FileRoutingState {
  fileTree: FileNode[];
  browserUrl: BrowserBar;
  activeRoute: string;
  routeSegments: RouteSegment[];
  layoutWrappers: LayoutWrapper[];
  highlightedFile: string;
}
```

---

### ServerClientComponentsVisual

Component tree visualization showing the `'use client'` boundary, distinguishing server components from client components and illustrating their rendering pipeline.

**Location:** `components/visualizations/nextjs/server-client-components-visual.tsx`

**Props:**

```typescript
interface ServerClientComponentsVisualProps {
  state: ServerClientState;
  className?: string;
}
```

**State Structure:**

```typescript
interface ServerClientState {
  components: ComponentNode[];
  dataFlowArrows: DataFlowArrow[];
  boundaryLine: BoundaryLine;
  renderTimeline: RenderTimelineEntry[];
  currentPhase: 'server-render' | 'serialize' | 'client-hydrate' | 'interactive' | 'overview';
}
```

---

### RenderingStrategiesVisual

Timeline and flow diagram visualization for SSR, SSG, and ISR rendering strategies, showing how pages are built and served at different phases.

**Location:** `components/visualizations/nextjs/rendering-strategies-visual.tsx`

**Props:**

```typescript
interface RenderingStrategiesVisualProps {
  state: RenderingStrategiesState;
  className?: string;
}
```

**State Structure:**

```typescript
interface RenderingStrategiesState {
  timelinePhases: TimelinePhase[];
  cacheStatus: CacheStatus;
  strategyComparison: StrategyComparison[];
  requestFlow: RequestFlowStep[];
  activeStrategy: 'ssg' | 'ssr' | 'isr' | 'overview';
  currentPhase: string;
}
```

---

### DataFetchingVisual

Animated visualization of Next.js data fetching patterns including async Server Components, parallel fetching, Suspense streaming, and request deduplication.

**Location:** `components/visualizations/nextjs/data-fetching-visual.tsx`

**Props:**

```typescript
interface DataFetchingVisualProps {
  state: DataFetchingState;
  className?: string;
}
```

**State Structure:**

```typescript
interface DataFetchingState {
  fetchRequests: FetchRequest[];
  components: FetchComponent[];
  waterfallItems: WaterfallItem[];
  suspenseBoundaries: SuspenseBoundary[];
  currentPhase: 'setup' | 'fetching' | 'streaming' | 'complete' | 'overview';
  showDeduplication: boolean;
}
```

---

### MiddlewareVisual

Request flow visualization for Next.js Middleware, showing how requests are intercepted, checked against matchers, and then redirected, rewritten, or passed through with modified headers/cookies.

**Location:** `components/visualizations/nextjs/middleware-visual.tsx`

**Props:**

```typescript
interface MiddlewareVisualProps {
  state: MiddlewareState;
  className?: string;
}
```

**State Structure:**

```typescript
interface MiddlewareState {
  request: MiddlewareRequest;
  pipeline: MiddlewarePipeline;
  matchers: MatcherPattern[];
  responseModifications: ResponseModification[];
  flowNodes: FlowNode[];
  currentPhase: 'incoming' | 'matching' | 'executing' | 'response' | 'overview';
}
```

---

## UI Components

The project uses shadcn/ui components. Add new components with:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
# etc.
```

Components are installed to `components/ui/`.
