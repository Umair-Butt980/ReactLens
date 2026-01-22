/**
 * Types for Virtual DOM visualization
 */

/**
 * Represents a node in the Virtual DOM tree
 */
export interface VNode {
  id: string;
  type: string; // Component name or HTML tag
  props: Record<string, unknown>;
  children: (VNode | string)[];
  key?: string | number;
  isNew?: boolean;
  isRemoved?: boolean;
  isUpdated?: boolean;
  isUnchanged?: boolean;
}

/**
 * Types of changes detected by diff algorithm
 */
export type DiffType = 'add' | 'remove' | 'update' | 'replace' | 'move' | 'none';

/**
 * Represents a single diff/change detected
 */
export interface DiffEntry {
  id: string;
  type: DiffType;
  path: string; // Path to the node in the tree
  oldValue?: unknown;
  newValue?: unknown;
  description: string;
}

/**
 * Represents a patch operation to be applied to the real DOM
 */
export interface PatchOperation {
  id: string;
  type: 'CREATE' | 'REMOVE' | 'REPLACE' | 'UPDATE_PROPS' | 'UPDATE_TEXT';
  targetPath: string;
  payload?: unknown;
  description: string;
  isApplied: boolean;
}

/**
 * State for Virtual DOM visualization
 */
export interface VirtualDOMState {
  // Real DOM representation
  realDOM: VNode;
  // Previous Virtual DOM state
  previousVDOM: VNode | null;
  // Current Virtual DOM state
  currentVDOM: VNode;
  // Detected differences
  diffs: DiffEntry[];
  // Patch operations to apply
  patches: PatchOperation[];
  // Current phase of the reconciliation
  phase: 'render' | 'diff' | 'patch' | 'commit';
  // Highlighted nodes for visualization
  highlightedRealNodes: string[];
  highlightedVirtualNodes: string[];
  // Console/log output
  consoleOutput: string[];
  // Performance metrics
  metrics?: {
    directDOMOps?: number;
    virtualDOMOps?: number;
    savedOps?: number;
  };
}

/**
 * A single step in the Virtual DOM visualization
 */
export interface VirtualDOMStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  animationState: VirtualDOMState;
  duration: number;
}
