/**
 * Types specific to Event Loop visualization
 */

export interface CallStackItem {
  id: string;
  name: string;
  type: 'function' | 'global' | 'callback' | 'anonymous';
  color: string;
}

export interface QueueItem {
  id: string;
  name: string;
  type: 'callback' | 'microtask';
  source: string;
}

export interface WebApiItem {
  id: string;
  name: string;
  type: 'timer' | 'fetch' | 'event' | 'promise';
  delay?: number;
  progress?: number;
}

export interface EventLoopState {
  callStack: CallStackItem[];
  callbackQueue: QueueItem[];
  microtaskQueue: QueueItem[];
  webApis: WebApiItem[];
  currentPhase: 'stack' | 'microtask' | 'callback' | 'idle' | 'webapi';
  output: string[];
}

export interface EventLoopStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: EventLoopState;
  duration: number;
}
