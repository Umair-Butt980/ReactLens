/**
 * Types for Middleware visualization
 *
 * This visualization shows how Next.js Middleware works:
 * request interception, redirects, rewrites, headers,
 * authentication checks, and matcher configuration.
 */

// Middleware action types
export type MiddlewareAction =
  | 'next' // Continue to destination
  | 'redirect' // Redirect to another URL
  | 'rewrite' // Rewrite to a different path
  | 'response' // Return a custom response
  | 'block'; // Block the request

// Represents an incoming request
export interface MiddlewareRequest {
  id: string;
  method: string;
  path: string;
  headers: RequestHeader[];
  cookies: RequestCookie[];
  isHighlighted: boolean;
}

// A single header
export interface RequestHeader {
  id: string;
  name: string;
  value: string;
  isModified: boolean;
  isAdded: boolean;
}

// A single cookie
export interface RequestCookie {
  id: string;
  name: string;
  value: string;
  isChecked: boolean;
}

// Represents the middleware processing pipeline
export interface MiddlewarePipeline {
  id: string;
  label: string;
  description: string;
  isActive: boolean;
  isComplete: boolean;
  action: MiddlewareAction;
}

// Represents a matcher pattern
export interface MatcherPattern {
  id: string;
  pattern: string;
  description: string;
  matches: boolean;
  testPath: string;
  isHighlighted: boolean;
}

// Response modification
export interface ResponseModification {
  id: string;
  type: 'header' | 'cookie' | 'redirect' | 'rewrite' | 'status';
  label: string;
  value: string;
  isHighlighted: boolean;
}

// Request flow node
export interface FlowNode {
  id: string;
  label: string;
  type: 'request' | 'middleware' | 'matcher' | 'action' | 'destination';
  isActive: boolean;
  isHighlighted: boolean;
}

// The active concept being explained
export type MiddlewareConcept =
  | 'overview'
  | 'request-flow'
  | 'matchers'
  | 'redirects'
  | 'rewrites'
  | 'headers-cookies'
  | 'auth-pattern'
  | 'chaining';

// The main state for the Middleware visualization
export interface MiddlewareState {
  // Current request
  request: MiddlewareRequest;

  // Processing pipeline steps
  pipeline: MiddlewarePipeline[];

  // Matcher patterns
  matchers: MatcherPattern[];

  // Response modifications
  modifications: ResponseModification[];

  // Flow visualization nodes
  flowNodes: FlowNode[];

  // Active concept
  activeConcept: MiddlewareConcept;

  // Active panel
  activePanel: 'flow' | 'request' | 'matchers' | 'response';

  // Annotation
  annotation: string;

  // The final action taken
  finalAction: MiddlewareAction;

  // Destination path after middleware
  destinationPath: string;
}

// Step definition for Middleware visualization
export interface MiddlewareStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: MiddlewareState;
  duration: number;
}
