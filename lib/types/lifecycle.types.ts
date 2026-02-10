/**
 * Types for Component Lifecycle visualization
 *
 * This visualization shows the complete lifecycle of a React component
 * from mounting through updates to unmounting, including how hooks
 * integrate with the lifecycle.
 */

// Lifecycle phase names
export type LifecyclePhaseName = 'mount' | 'update' | 'unmount';

// Mount phase stages
export type MountStage =
  | 'initial-render' // Component function called first time
  | 'create-fiber' // Fiber node created
  | 'execute-render' // JSX returned
  | 'commit-dom' // DOM nodes created and inserted
  | 'run-effects' // useEffect callbacks run
  | 'mount-complete'; // Component fully mounted

// Update phase stages
export type UpdateStage =
  | 'trigger' // State/props change detected
  | 'schedule-update' // Update scheduled in queue
  | 'execute-render' // Component re-renders
  | 'reconcile' // Diff old vs new
  | 'commit-dom' // DOM updated
  | 'cleanup-effects' // Previous effect cleanup
  | 'run-effects' // New effects run
  | 'update-complete'; // Update cycle complete

// Unmount phase stages
export type UnmountStage =
  | 'trigger' // Parent removes component
  | 'cleanup-effects' // All effect cleanups run
  | 'remove-dom' // DOM nodes removed
  | 'destroy-fiber' // Fiber node destroyed
  | 'unmount-complete'; // Component fully unmounted

// Combined stage type
export type LifecycleStage = MountStage | UpdateStage | UnmountStage;

// Represents the current lifecycle phase
export interface LifecyclePhase {
  id: string;
  name: LifecyclePhaseName;
  stage: LifecycleStage;
  isActive: boolean;
  progress: number; // 0-100 for progress indicator
}

// Effect instance for tracking
export interface LifecycleEffect {
  id: string;
  name: string;
  dependencies: string[];
  hasCleanup: boolean;
  status: 'pending' | 'running' | 'complete' | 'cleanup';
  runCount: number;
}

// State value for the component
export interface LifecycleStateValue {
  id: string;
  name: string;
  value: string;
  previousValue?: string;
  hasChanged: boolean;
}

// Props value for the component
export interface LifecycleProp {
  id: string;
  name: string;
  value: string;
  previousValue?: string;
  hasChanged: boolean;
}

// Represents a component instance
export interface ComponentInstance {
  id: string;
  name: string;
  phase: LifecyclePhase;
  state: LifecycleStateValue[];
  props: LifecycleProp[];
  effects: LifecycleEffect[];
  renderCount: number;
  isMounted: boolean;
  isHighlighted: boolean;
}

// Timeline event
export interface LifecycleEvent {
  id: string;
  phase: LifecyclePhaseName;
  stage: LifecycleStage;
  description: string;
  timestamp: number;
  isActive: boolean;
  category: 'render' | 'commit' | 'effect' | 'cleanup';
}

// DOM representation
export interface DOMNodeSimple {
  id: string;
  tagName: string;
  content?: string;
  isNew: boolean;
  isUpdated: boolean;
  isRemoved: boolean;
}

// Output message
export interface LifecycleOutput {
  id: string;
  type: 'info' | 'render' | 'effect' | 'cleanup' | 'commit' | 'warning';
  message: string;
}

// The main state for the visualization
export interface LifecycleState {
  // Component being visualized
  component: ComponentInstance;

  // Timeline of lifecycle events
  timeline: LifecycleEvent[];

  // Current DOM representation
  dom: DOMNodeSimple[];

  // Which phase diagram segment is active
  activePhaseSegment: LifecyclePhaseName;

  // Console output
  output: LifecycleOutput[];

  // Show the circular diagram
  showDiagram: boolean;

  // Active panel
  activePanel: 'diagram' | 'component' | 'timeline' | 'dom';
}

// Step definition for Lifecycle visualization
export interface LifecycleStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: LifecycleState;
  duration: number;
}
