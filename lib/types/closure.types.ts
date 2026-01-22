/**
 * Types for Closures & Scope visualization
 */

import type { Variable } from './call-stack.types';

export interface ScopeLevel {
  id: string;
  name: string;
  type: 'global' | 'function' | 'block';
  variables: Variable[];
  color: string;
  isActive: boolean;
}

export interface ScopeChainItem {
  id: string;
  contextName: string;
  variables: Variable[];
  isActive: boolean;
  color: string;
}

export interface ClosureInfo {
  functionName: string;
  capturedVariables: string[];
  fromScope: string;
}

export interface ClosureState {
  scopes: ScopeLevel[];
  scopeChain: ScopeChainItem[];
  closureFormed: boolean;
  closureInfo?: ClosureInfo;
  accessedVariable?: { name: string; fromScope: string };
  output: string[];
  currentScope: string;
}

export interface ClosureStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: ClosureState;
  duration: number;
}
