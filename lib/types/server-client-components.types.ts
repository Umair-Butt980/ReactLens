/**
 * Types for Server vs Client Components visualization
 *
 * This visualization shows how React Server Components and Client
 * Components work together in Next.js, including the 'use client'
 * boundary, data flow, composition patterns, and rendering flow.
 */

// Environment where a component runs
export type ComponentEnvironment = 'server' | 'client';

// Render phase in the RSC pipeline
export type RSCRenderPhase =
  | 'idle'
  | 'server-render' // Server components rendering on server
  | 'serialization' // RSC payload being serialized
  | 'client-hydration' // Client components hydrating
  | 'interactive'; // Fully interactive

// Represents a component node in the tree
export interface ComponentNode {
  id: string;
  name: string;
  environment: ComponentEnvironment;
  hasBoundaryDirective: boolean; // Has 'use client' at top

  // Component capabilities
  capabilities: ComponentCapability[];

  // Props being passed
  props: ComponentProp[];

  // Children component IDs
  children: string[];

  // Visual state
  isHighlighted: boolean;
  isRendering: boolean;
  isHydrated: boolean;

  // Position in tree
  depth: number;
}

// What a component can / cannot do
export interface ComponentCapability {
  id: string;
  name: string;
  allowed: boolean;
  description: string;
}

// A prop being passed between components
export interface ComponentProp {
  id: string;
  name: string;
  value: string;
  isSerializable: boolean;
  isHighlighted: boolean;
}

// Data flow arrow between components
export interface DataFlowArrow {
  id: string;
  from: string;
  to: string;
  label: string;
  type: 'props' | 'children' | 'data';
  isHighlighted: boolean;
  isBlocked: boolean;
  blockReason?: string;
}

// The boundary line between server and client
export interface BoundaryLine {
  isVisible: boolean;
  label: string;
  position: number; // Depth level where boundary exists
}

// Render timeline entry
export interface RenderTimelineEntry {
  id: string;
  phase: RSCRenderPhase;
  description: string;
  isActive: boolean;
  isComplete: boolean;
}

// The active concept being explained
export type ServerClientConcept =
  | 'default-server'
  | 'use-client-directive'
  | 'boundary-rules'
  | 'composition-pattern'
  | 'data-flow'
  | 'rendering-pipeline'
  | 'serialization'
  | 'best-practices';

// The main state for the Server/Client Components visualization
export interface ServerClientState {
  // Component tree
  components: ComponentNode[];

  // Data flow arrows
  dataFlows: DataFlowArrow[];

  // Server/client boundary
  boundary: BoundaryLine;

  // Render timeline
  renderTimeline: RenderTimelineEntry[];

  // Current render phase
  currentPhase: RSCRenderPhase;

  // Active concept
  activeConcept: ServerClientConcept;

  // Active panel for focus
  activePanel: 'tree' | 'capabilities' | 'timeline' | 'data-flow';

  // Annotation
  annotation: string;
}

// Step definition for Server/Client Components visualization
export interface ServerClientStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: ServerClientState;
  duration: number;
}
