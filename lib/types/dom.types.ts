/**
 * Types for DOM Basics visualization
 */

/**
 * Represents a node in the DOM tree
 */
export interface DOMNode {
  id: string;
  tagName: string;
  attributes?: Record<string, string>;
  textContent?: string;
  children: DOMNode[];
  isHighlighted?: boolean;
  highlightColor?: string;
  isSelected?: boolean;
  isModified?: boolean;
}

/**
 * Represents the full DOM tree structure
 */
export interface DOMTree {
  root: DOMNode;
}

/**
 * DOM operation types
 */
export type DOMOperationType =
  | 'select'
  | 'modify'
  | 'append'
  | 'remove'
  | 'setAttribute'
  | 'getText'
  | 'traverse';

/**
 * Represents a DOM operation being demonstrated
 */
export interface DOMOperation {
  type: DOMOperationType;
  targetId: string;
  description: string;
  value?: string;
  attribute?: string;
}

/**
 * State for DOM visualization at each step
 */
export interface DOMState {
  tree: DOMTree;
  selectedNodeId?: string;
  highlightedNodeIds: string[];
  currentOperation?: DOMOperation;
  consoleOutput: string[];
  browserPreview?: string; // HTML preview for browser rendering
}

/**
 * A single step in the DOM visualization
 */
export interface DOMStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  animationState: DOMState;
  duration: number;
}
