/**
 * Types for Memory Management visualization
 */

/**
 * Types of objects in the heap
 */
export type HeapObjectType = 'object' | 'array' | 'function' | 'string' | 'closure';

/**
 * Represents an object allocated in the heap
 */
export interface HeapObject {
  id: string;
  type: HeapObjectType;
  name: string;
  size: number; // Visual size for display
  color: string;
  references: string[]; // IDs of objects this references
  isReachable?: boolean;
  isMarked?: boolean; // For mark-and-sweep
  isCollected?: boolean;
}

/**
 * Represents a variable in the stack
 */
export interface StackVariable {
  id: string;
  name: string;
  pointsTo?: string; // ID of heap object, or undefined for primitives
  value?: string; // For primitives
  color?: string;
}

/**
 * Represents a stack frame
 */
export interface StackFrame {
  id: string;
  name: string;
  variables: StackVariable[];
  color?: string;
}

/**
 * GC Phase
 */
export type GCPhase = 'idle' | 'mark' | 'sweep' | 'compact';

/**
 * Memory metrics
 */
export interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  objectCount: number;
  collectedCount?: number;
}

/**
 * State for Memory Management visualization
 */
export interface MemoryState {
  // Stack frames
  stack: StackFrame[];
  // Heap objects
  heap: HeapObject[];
  // Current GC phase
  gcPhase: GCPhase;
  // Root references (global variables, etc.)
  roots: string[];
  // Console output
  consoleOutput: string[];
  // Memory metrics
  metrics?: MemoryMetrics;
  // Currently highlighted reference path
  highlightedPath?: string[];
}

/**
 * A single step in the Memory Management visualization
 */
export interface MemoryStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  animationState: MemoryState;
  duration: number;
}
