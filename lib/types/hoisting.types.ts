/**
 * Types for Hoisting visualization
 */

export interface MemorySlot {
  id: string;
  name: string;
  value: string;
  type: 'var' | 'let' | 'const' | 'function';
  status: 'hoisted' | 'tdz' | 'initialized' | 'uninitialized';
  color: string;
}

export interface HoistingState {
  phase: 'creation' | 'execution';
  creationMemory: MemorySlot[];
  executionMemory: MemorySlot[];
  currentLine: number;
  executionLine: number;
  output: string[];
  error?: string;
}

export interface HoistingStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: HoistingState;
  duration: number;
}
