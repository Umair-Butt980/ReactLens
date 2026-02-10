/**
 * Types for React Fiber visualization
 *
 * This visualization shows how React's Fiber architecture enables
 * concurrent rendering through interruptible work, priority-based
 * scheduling, and the double-buffering technique.
 */

// Fiber node tags (simplified from React's internal tags)
export type FiberTag =
  | 'FunctionComponent'
  | 'ClassComponent'
  | 'HostRoot' // Root of the fiber tree
  | 'HostComponent' // DOM element (div, span, etc.)
  | 'HostText' // Text node
  | 'Fragment'
  | 'ContextProvider'
  | 'ContextConsumer'
  | 'MemoComponent'
  | 'SuspenseComponent';

// Effect flags (what needs to be done)
export type EffectFlag =
  | 'NoFlags'
  | 'Placement' // Insert into DOM
  | 'Update' // Update existing
  | 'Deletion' // Remove from DOM
  | 'ChildDeletion'
  | 'Passive' // useEffect
  | 'Layout' // useLayoutEffect
  | 'Ref';

// Priority lanes (simplified)
export type PriorityLane =
  | 'SyncLane' // Highest priority (clicks, input)
  | 'InputContinuousLane' // Continuous input (drag, scroll)
  | 'DefaultLane' // Normal priority
  | 'TransitionLane' // startTransition
  | 'IdleLane'; // Lowest priority

// Represents a fiber node
export interface FiberNode {
  id: string;
  tag: FiberTag;
  type: string; // Component name or DOM tag
  key: string | null;

  // Tree structure (linked list)
  child: FiberNode | null;
  sibling: FiberNode | null;
  return: FiberNode | null; // Parent

  // Alternate (for double buffering)
  alternate: FiberNode | null;

  // Work info
  pendingProps: Record<string, string>;
  memoizedProps: Record<string, string>;
  memoizedState: string | null;

  // Effects
  flags: EffectFlag[];
  subtreeFlags: EffectFlag[];

  // Priority
  lanes: PriorityLane;
  childLanes: PriorityLane[];

  // Visual state
  isHighlighted: boolean;
  isProcessing: boolean;
  isComplete: boolean;
}

// Work loop state
export interface WorkLoop {
  workInProgressFiber: FiberNode | null;
  workInProgressRoot: FiberNode | null;

  // Time slicing
  isYielding: boolean;
  timeRemaining: number; // ms remaining in frame
  deadline: number; // When to yield

  // Scheduling
  pendingLanes: PriorityLane[];
  currentLane: PriorityLane | null;

  // Progress
  phase: WorkPhase;
  unitsOfWork: number;
}

// Work phases
export type WorkPhase =
  | 'idle'
  | 'schedule' // Scheduling work
  | 'begin-work' // Processing down (beginWork)
  | 'complete-work' // Processing up (completeWork)
  | 'commit-before' // Before mutation
  | 'commit-mutation' // DOM mutations
  | 'commit-layout' // Layout effects
  | 'finished';

// Work unit (for visualization)
export interface WorkUnit {
  id: string;
  fiberId: string;
  fiberName: string;
  phase: 'begin' | 'complete';
  isProcessed: boolean;
  timestamp: number;
}

// Timeline event
export interface FiberEvent {
  id: string;
  type: 'schedule' | 'begin' | 'complete' | 'yield' | 'resume' | 'commit';
  fiberId?: string;
  fiberName?: string;
  description: string;
  timestamp: number;
  isActive: boolean;
}

// Priority visualization
export interface LaneVisualization {
  lane: PriorityLane;
  label: string;
  color: string;
  pendingWork: number;
  isActive: boolean;
}

// Output message
export interface FiberOutput {
  id: string;
  type: 'info' | 'schedule' | 'work' | 'yield' | 'commit' | 'warning';
  message: string;
}

// The main state for the visualization
export interface FiberState {
  // Current committed tree
  currentTree: FiberNode | null;

  // Work-in-progress tree (double buffer)
  wipTree: FiberNode | null;

  // Work loop state
  workLoop: WorkLoop;

  // Work units for step-by-step visualization
  workUnits: WorkUnit[];

  // Timeline of events
  timeline: FiberEvent[];

  // Priority lanes
  lanes: LaneVisualization[];

  // Console output
  output: FiberOutput[];

  // Active panel
  activePanel: 'trees' | 'workloop' | 'timeline' | 'lanes';

  // Show alternate connections
  showAlternate: boolean;

  // Show tree pointers (child/sibling/return)
  showPointers: boolean;
}

// Step definition for Fiber visualization
export interface FiberStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: FiberState;
  duration: number;
}
