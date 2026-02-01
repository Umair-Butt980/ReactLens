/**
 * Types for React Hooks visualization
 *
 * This visualization shows how React hooks work internally,
 * including the hooks linked list, fiber nodes, effect lifecycle,
 * and the rules of hooks.
 */

// Hook type definitions
export type HookType =
  | 'useState'
  | 'useEffect'
  | 'useRef'
  | 'useMemo'
  | 'useCallback'
  | 'useContext';

// Represents a single hook instance in the linked list
export interface HookInstance {
  id: string;
  type: HookType;
  name: string; // Variable name (e.g., 'count', 'setCount')
  index: number; // Position in the hooks array (0, 1, 2...)

  // Current value (type depends on hook)
  value: string;
  previousValue?: string;

  // For useState
  setter?: string; // Setter function name

  // For useEffect/useMemo/useCallback
  dependencies?: DependencyValue[];
  previousDependencies?: DependencyValue[];
  hasChangedDeps?: boolean;

  // For useEffect
  cleanup?: string;
  effectPhase?: EffectPhase;

  // For useRef
  current?: string;

  // For useMemo/useCallback
  memoizedValue?: string;
  isCached?: boolean;

  // Visual state
  isHighlighted: boolean;
  isExecuting: boolean;
  isStale: boolean; // For deps that changed
}

// Dependency value for effects and memos
export interface DependencyValue {
  id: string;
  name: string;
  value: string;
  hasChanged: boolean;
}

// Effect lifecycle phases
export type EffectPhase =
  | 'pending' // Effect scheduled but not run
  | 'cleanup' // Running previous cleanup
  | 'running' // Effect function executing
  | 'complete' // Effect finished
  | 'skipped'; // Dependencies unchanged, effect skipped

// Simplified Fiber Node representation
export interface FiberNodeSimple {
  id: string;
  componentName: string;

  // Hooks stored as linked list
  memoizedState: HookInstance[];

  // Effect list
  updateQueue: EffectInstance[];

  // Render info
  renderCount: number;
  isRendering: boolean;

  // Visual
  isHighlighted: boolean;
}

// Effect instance for the update queue
export interface EffectInstance {
  id: string;
  hookIndex: number;
  phase: EffectPhase;
  hasCleanup: boolean;
  dependencies: string[];
  tag: 'layout' | 'passive'; // useLayoutEffect vs useEffect
}

// Hook render phase
export type HookRenderPhase =
  | 'idle'
  | 'render-start' // Component function called
  | 'hooks-executing' // Hooks being called in order
  | 'render-complete' // JSX returned
  | 'effects-cleanup' // Cleanup functions running
  | 'effects-running' // Effect callbacks running
  | 'complete';

// Hook call in the current render
export interface HookCall {
  id: string;
  index: number;
  type: HookType;
  name: string;
  isCurrentCall: boolean;
  isComplete: boolean;
  result?: string;
}

// Rules of Hooks violation
export interface HookViolation {
  id: string;
  type: 'conditional' | 'loop' | 'nested' | 'order-changed';
  message: string;
  hookIndex: number;
}

// Output message for console
export interface HooksOutput {
  id: string;
  type: 'info' | 'hook' | 'effect' | 'cleanup' | 'warning' | 'error';
  message: string;
}

// The main state for the visualization
export interface HooksState {
  // The fiber node containing hooks
  fiberNode: FiberNodeSimple;

  // Current hook call order (for visualization)
  hookCalls: HookCall[];

  // Current hook index being executed
  currentHookIndex: number;

  // Render phase
  renderPhase: HookRenderPhase;

  // Effect timeline for visualization
  effectTimeline: EffectTimelineItem[];

  // Any violations (for educational purposes)
  violations: HookViolation[];

  // Console output
  output: HooksOutput[];

  // Which panel is active
  activePanel: 'fiber' | 'hooks' | 'effects' | 'timeline';

  // Whether to show dependency comparison
  showDepsComparison: boolean;
}

// Effect timeline item for visualization
export interface EffectTimelineItem {
  id: string;
  hookIndex: number;
  hookName: string;
  phase: EffectPhase;
  timestamp: number;
  dependencies: string[];
  isActive: boolean;
}

// Step definition for Hooks visualization
export interface HooksStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: HooksState;
  duration: number;
}
