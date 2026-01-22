/**
 * Types for Async & Promises visualization
 */

/**
 * Promise states
 */
export type PromiseStatus = 'pending' | 'fulfilled' | 'rejected';

/**
 * Represents a Promise in the visualization
 */
export interface PromiseState {
  id: string;
  name: string;
  status: PromiseStatus;
  value?: unknown;
  error?: string;
  chainedFrom?: string; // ID of parent promise
  color?: string;
}

/**
 * Queue item types
 */
export type QueueItemType = 'callback' | 'microtask' | 'promise' | 'timeout' | 'fetch';

/**
 * Represents an item in the task/microtask queue
 */
export interface AsyncQueueItem {
  id: string;
  type: QueueItemType;
  label: string;
  promiseId?: string;
  isExecuting?: boolean;
  color?: string;
}

/**
 * Call stack frame for async context
 */
export interface AsyncCallFrame {
  id: string;
  name: string;
  isAsync?: boolean;
  color?: string;
}

/**
 * State for Async & Promises visualization
 */
export interface AsyncState {
  // Call stack
  callStack: AsyncCallFrame[];
  // Web APIs / pending operations
  webAPIs: {
    id: string;
    type: 'setTimeout' | 'fetch' | 'Promise';
    label: string;
    remaining?: number;
    color?: string;
  }[];
  // Task queue (macrotasks)
  taskQueue: AsyncQueueItem[];
  // Microtask queue (promises, queueMicrotask)
  microtaskQueue: AsyncQueueItem[];
  // Active promises
  promises: PromiseState[];
  // Console output
  consoleOutput: string[];
  // Current phase being explained
  currentPhase?: 'sync' | 'webapi' | 'microtask' | 'macrotask';
  // Highlighted promise for focus
  highlightedPromiseId?: string;
}

/**
 * A single step in the Async & Promises visualization
 */
export interface AsyncStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  animationState: AsyncState;
  duration: number;
}
