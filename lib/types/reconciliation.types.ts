/**
 * Types for Reconciliation visualization
 *
 * This visualization shows how React's diffing algorithm compares
 * old and new Virtual DOM trees to determine the minimal set of
 * DOM operations needed.
 */

// Virtual DOM node representation
export interface VDOMNode {
  id: string;
  type: string; // 'div', 'span', 'MyComponent', etc.
  props: Record<string, string>;
  children: VDOMNode[];
  key: string | null;
  isHighlighted: boolean;
  diffStatus: DiffStatus;
}

// Diff status for a node
export type DiffStatus =
  | 'unchanged' // Node is identical
  | 'updated' // Same type, props changed
  | 'replaced' // Different type, will be replaced
  | 'added' // New node
  | 'removed' // Node no longer exists
  | 'reordered' // Same node, different position
  | 'comparing'; // Currently being compared

// Result of comparing two nodes
export interface DiffResult {
  id: string;
  action: DiffAction;
  nodePath: string; // Path in tree e.g., "root.children[0]"
  oldNode?: VDOMNode;
  newNode?: VDOMNode;
  propChanges?: PropChange[];
  isActive: boolean;
}

export type DiffAction =
  | 'none' // No change needed
  | 'update-props' // Update attributes only
  | 'update-text' // Update text content
  | 'replace' // Remove old, insert new
  | 'insert' // Insert new node
  | 'remove' // Remove node
  | 'reorder'; // Move node to new position

// Property change detail
export interface PropChange {
  name: string;
  oldValue: string | null;
  newValue: string | null;
  changeType: 'added' | 'removed' | 'changed';
}

// DOM operation to be performed
export interface ReconciliationDOMOperation {
  id: string;
  type:
    | 'createElement'
    | 'updateAttribute'
    | 'removeAttribute'
    | 'insertChild'
    | 'removeChild'
    | 'replaceChild'
    | 'updateText';
  target: string;
  details: string;
  isExecuted: boolean;
  isHighlighted: boolean;
}

// Comparison step in the algorithm
export interface ComparisonStep {
  id: string;
  oldNodeId: string | null;
  newNodeId: string | null;
  result: DiffAction;
  description: string;
  isActive: boolean;
}

// Key-based reconciliation info
export interface KeyMatch {
  key: string;
  oldIndex: number;
  newIndex: number;
  status: 'matched' | 'new' | 'removed' | 'moved';
}

// List reconciliation result
export interface ListReconciliation {
  oldKeys: string[];
  newKeys: string[];
  matches: KeyMatch[];
  operations: string[];
}

// Output message
export interface ReconciliationOutput {
  id: string;
  type: 'info' | 'compare' | 'diff' | 'dom' | 'key' | 'warning';
  message: string;
}

// Reconciliation phase
export type ReconciliationPhase =
  | 'idle'
  | 'start' // Beginning comparison
  | 'compare-root' // Comparing root elements
  | 'compare-props' // Comparing props
  | 'compare-children' // Comparing children recursively
  | 'key-matching' // Key-based list diffing
  | 'generate-ops' // Generating DOM operations
  | 'complete'; // Reconciliation done

// The main state for the visualization
export interface ReconciliationState {
  // Old Virtual DOM tree
  oldTree: VDOMNode | null;

  // New Virtual DOM tree
  newTree: VDOMNode | null;

  // Results of diffing
  diffResults: DiffResult[];

  // Current comparison path
  currentComparison: string | null;

  // DOM operations queue
  domOperations: ReconciliationDOMOperation[];

  // List reconciliation info (for key-based diffing)
  listReconciliation: ListReconciliation | null;

  // Current phase
  phase: ReconciliationPhase;

  // Comparison steps for visualization
  comparisonSteps: ComparisonStep[];

  // Console output
  output: ReconciliationOutput[];

  // Active panel
  activePanel: 'trees' | 'diff' | 'operations' | 'keys';

  // Show connection lines between matching nodes
  showConnections: boolean;
}

// Step definition for Reconciliation visualization
export interface ReconciliationStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: ReconciliationState;
  duration: number;
}
