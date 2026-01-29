/**
 * Types for JSX & Components visualization
 *
 * This visualization shows how JSX is transformed into JavaScript,
 * how components are structured, and how React processes them.
 */

// Represents a JSX element in the source code
export interface JSXElement {
  id: string;
  tag: string;
  type: 'html' | 'component' | 'fragment';
  props: JSXProp[];
  children: (JSXElement | JSXText)[];
  isHighlighted: boolean;
  depth: number;
}

export interface JSXText {
  id: string;
  content: string;
  isExpression: boolean; // {variable} vs plain text
  expressionValue?: string;
}

export interface JSXProp {
  id: string;
  name: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'expression' | 'function';
  isHighlighted: boolean;
}

// Represents the transformed React.createElement call
export interface CreateElementCall {
  id: string;
  type: string; // 'div', 'span', 'MyComponent', etc.
  typeCategory: 'string' | 'function' | 'class';
  props: Record<string, string>;
  children: (CreateElementCall | string)[];
  isHighlighted: boolean;
  nestingLevel: number;
}

// Represents a React component
export interface ComponentDefinition {
  id: string;
  name: string;
  type: 'function' | 'class' | 'arrow';
  props: ComponentProp[];
  hasState: boolean;
  hasEffects: boolean;
  returnsJSX: boolean;
  isHighlighted: boolean;
}

export interface ComponentProp {
  id: string;
  name: string;
  type: string;
  defaultValue?: string;
  isRequired: boolean;
  isDestructured: boolean;
}

// Virtual DOM element representation
export interface VirtualDOMNode {
  id: string;
  type: string;
  props: Record<string, string>;
  children: VirtualDOMNode[];
  key: string | null;
  ref: string | null;
  isHighlighted: boolean;
  $$typeof: string; // Symbol representation
}

// Transformation phase indicator
export type TransformationPhase =
  | 'jsx-written' // Developer writes JSX
  | 'babel-parsing' // Babel parses JSX
  | 'createElement' // Transformed to createElement calls
  | 'virtual-dom' // Virtual DOM objects created
  | 'reconciliation' // React reconciles with DOM
  | 'dom-update'; // Actual DOM is updated

// The main state for the visualization
export interface JSXComponentsState {
  // Current JSX structure being visualized
  jsxTree: JSXElement | null;

  // The transformed createElement calls
  createElementCalls: CreateElementCall | null;

  // The resulting Virtual DOM
  virtualDOM: VirtualDOMNode | null;

  // Current transformation phase
  phase: TransformationPhase;

  // Component being analyzed
  component: ComponentDefinition | null;

  // Whether to show the transformation animation
  showTransformation: boolean;

  // Currently highlighted elements for visual focus
  highlightedPath: string[];

  // Console/output messages
  output: OutputMessage[];

  // Active panel for focus
  activePanel: 'jsx' | 'createElement' | 'virtualDOM' | 'component';
}

export interface OutputMessage {
  id: string;
  type: 'info' | 'transform' | 'render' | 'warning';
  message: string;
  timestamp?: number;
}

// Step definition for JSX & Components visualization
export interface JSXComponentsStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: JSXComponentsState;
  duration: number;
}

// Type guard helpers
export function isJSXElement(node: JSXElement | JSXText): node is JSXElement {
  return 'tag' in node;
}

export function isJSXText(node: JSXElement | JSXText): node is JSXText {
  return 'content' in node;
}
