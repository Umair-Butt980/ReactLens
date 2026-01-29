/**
 * Types for Props & State visualization
 *
 * This visualization shows how data flows through props,
 * how state triggers re-renders, and the unidirectional data flow pattern.
 */

// Represents a component in the component tree
export interface ComponentNode {
  id: string;
  name: string;
  type: 'parent' | 'child' | 'grandchild';
  props: PropValue[];
  state: StateValue[];
  isRendering: boolean;
  renderCount: number;
  isHighlighted: boolean;
  children: ComponentNode[];
}

// Represents a prop being passed
export interface PropValue {
  id: string;
  name: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'object' | 'function' | 'array';
  fromParent: string | null; // Parent component name, null if from outside
  isHighlighted: boolean;
  isChanged: boolean;
}

// Represents component state
export interface StateValue {
  id: string;
  name: string;
  value: string;
  previousValue?: string;
  isHighlighted: boolean;
  isChanged: boolean;
  updateFunction: string; // e.g., 'setCount'
}

// Represents data flow between components
export interface DataFlow {
  id: string;
  from: string; // Component id
  to: string; // Component id
  propName: string;
  value: string;
  direction: 'down' | 'callback'; // Props go down, callbacks go up
  isActive: boolean;
}

// State update event
export interface StateUpdate {
  id: string;
  componentName: string;
  stateName: string;
  oldValue: string;
  newValue: string;
  trigger: string; // What triggered the update (e.g., 'onClick', 'useEffect')
  timestamp: number;
}

// Render phase indicator
export type RenderPhase =
  | 'idle'
  | 'state-update' // State setter called
  | 'schedule-render' // React schedules re-render
  | 'render-parent' // Parent component renders
  | 'props-passed' // Props passed to children
  | 'render-children' // Children re-render
  | 'commit' // Changes committed to DOM
  | 'complete'; // Render cycle complete

// Re-render reason
export type RerenderReason =
  | 'state-change'
  | 'props-change'
  | 'parent-rerender'
  | 'context-change'
  | 'force-update';

// Render event for timeline
export interface RenderEvent {
  id: string;
  componentName: string;
  reason: RerenderReason;
  triggeredBy?: string;
  phase: RenderPhase;
  timestamp: number;
}

// The main state for the visualization
export interface PropsStateState {
  // Component tree
  componentTree: ComponentNode;

  // Data flow arrows
  dataFlows: DataFlow[];

  // Current render phase
  renderPhase: RenderPhase;

  // State update history
  stateUpdates: StateUpdate[];

  // Render event timeline
  renderEvents: RenderEvent[];

  // Currently highlighted component
  highlightedComponent: string | null;

  // Currently highlighted prop/state
  highlightedData: string | null;

  // Console output
  output: PropsStateOutput[];

  // Whether to show the data flow animation
  showDataFlow: boolean;

  // Active view
  activeView: 'tree' | 'timeline' | 'both';
}

export interface PropsStateOutput {
  id: string;
  type: 'info' | 'state' | 'render' | 'prop' | 'warning';
  message: string;
}

// Step definition for Props & State visualization
export interface PropsStateStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: PropsStateState;
  duration: number;
}
