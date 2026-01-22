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

## UI Components

The project uses shadcn/ui components. Add new components with:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
# etc.
```

Components are installed to `components/ui/`.
