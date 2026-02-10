/**
 * Types for Rendering Strategies (SSR, SSG, ISR) visualization
 *
 * This visualization shows how Next.js renders pages using different
 * strategies: Static Site Generation, Server-Side Rendering, and
 * Incremental Static Regeneration.
 */

// Available rendering strategies
export type RenderingStrategy = 'SSG' | 'SSR' | 'ISR';

// Phase in the rendering lifecycle
export type RenderPhase =
  | 'build-time'
  | 'request-received'
  | 'cache-check'
  | 'server-render'
  | 'html-generation'
  | 'cache-store'
  | 'response-sent'
  | 'revalidation'
  | 'stale-while-revalidate';

// Represents a single phase in the timeline
export interface TimelinePhase {
  id: string;
  phase: RenderPhase;
  label: string;
  description: string;
  isActive: boolean;
  isComplete: boolean;
  duration: string; // Display duration e.g. "~0ms", "~200ms"
  environment: 'build' | 'server' | 'cdn' | 'browser';
}

// Cache status
export interface CacheStatus {
  isCached: boolean;
  isStale: boolean;
  lastGenerated: string; // Timestamp display
  revalidateAfter?: string; // e.g. "60s"
  cacheType: 'full-route' | 'data' | 'none';
}

// Strategy comparison item
export interface StrategyComparison {
  id: string;
  property: string;
  ssg: string;
  ssr: string;
  isr: string;
  highlightedStrategy?: RenderingStrategy;
}

// Request flow step
export interface RequestFlowStep {
  id: string;
  from: string;
  to: string;
  label: string;
  isActive: boolean;
  isHighlighted: boolean;
}

// The active concept being explained
export type RenderingConcept =
  | 'overview'
  | 'ssg-flow'
  | 'ssr-flow'
  | 'isr-flow'
  | 'cache-behavior'
  | 'comparison'
  | 'when-to-use'
  | 'fetch-options';

// The main state for the Rendering Strategies visualization
export interface RenderingStrategiesState {
  // Active rendering strategy
  activeStrategy: RenderingStrategy | null;

  // Timeline phases for the active strategy
  timeline: TimelinePhase[];

  // Cache status
  cache: CacheStatus;

  // Request flow
  requestFlow: RequestFlowStep[];

  // Strategy comparison table data
  comparison: StrategyComparison[];

  // Active concept
  activeConcept: RenderingConcept;

  // Active panel
  activePanel: 'timeline' | 'cache' | 'flow' | 'comparison';

  // Annotation
  annotation: string;

  // Whether to show all strategies side by side
  showComparison: boolean;
}

// Step definition for Rendering Strategies visualization
export interface RenderingStrategiesStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: RenderingStrategiesState;
  duration: number;
}
