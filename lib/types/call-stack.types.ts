/**
 * Types for Call Stack visualization
 */

export interface Variable {
  id: string;
  name: string;
  value: string;
  type: 'var' | 'let' | 'const' | 'function' | 'parameter';
}

export interface ExecutionContext {
  id: string;
  name: string;
  type: 'global' | 'function' | 'eval';
  variableEnvironment: Variable[];
  outerReference: string | null;
  thisBinding: string;
  color: string;
}

export interface CallStackState {
  contexts: ExecutionContext[];
  currentLine: number;
  phase: 'creation' | 'execution';
  output: string[];
}

export interface CallStackStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: CallStackState;
  duration: number;
}
