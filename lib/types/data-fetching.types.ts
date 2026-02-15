/**
 * Types for Data Fetching visualization
 *
 * This visualization shows how data fetching works in Next.js App Router,
 * including Server Component fetching, loading.tsx, error.tsx, parallel
 * fetching, sequential fetching, and caching behavior.
 */

// Fetch status
export type FetchStatus = 'idle' | 'loading' | 'success' | 'error' | 'cached';

// Where the fetch happens
export type FetchEnvironment = 'server' | 'client';

// Represents a data fetch request
export interface FetchRequest {
  id: string;
  url: string;
  method: string;
  status: FetchStatus;
  environment: FetchEnvironment;
  cacheOption: string; // e.g. 'force-cache', 'no-store', 'revalidate: 60'
  duration: string; // Display duration
  responseData?: string; // Simplified response preview
  isHighlighted: boolean;
  isParallel: boolean; // Part of Promise.all
}

// Represents a component in the loading hierarchy
export interface FetchComponent {
  id: string;
  name: string;
  type: 'page' | 'layout' | 'loading' | 'error' | 'suspense-boundary';
  status: 'idle' | 'loading' | 'rendered' | 'error' | 'streaming';
  isHighlighted: boolean;
  isActive: boolean;
  children: string[];
  depth: number;
}

// Loading state waterfall item
export interface WaterfallItem {
  id: string;
  label: string;
  startOffset: number; // Percentage from left
  width: number; // Percentage width
  status: FetchStatus;
  isHighlighted: boolean;
  environment: FetchEnvironment;
}

// Represents a Suspense boundary wrapping content
export interface SuspenseBoundary {
  id: string;
  fallbackLabel: string;
  isLoading: boolean;
  isStreamed: boolean;
  children: string[];
}

// The active concept being explained
export type DataFetchingConcept =
  | 'server-fetch'
  | 'loading-ui'
  | 'error-handling'
  | 'parallel-fetch'
  | 'sequential-fetch'
  | 'streaming'
  | 'deduplication'
  | 'patterns';

// The main state for the Data Fetching visualization
export interface DataFetchingState {
  // Active fetch requests
  requests: FetchRequest[];

  // Component hierarchy showing loading/error states
  components: FetchComponent[];

  // Waterfall timeline
  waterfall: WaterfallItem[];

  // Suspense boundaries
  suspenseBoundaries: SuspenseBoundary[];

  // Active concept
  activeConcept: DataFetchingConcept;

  // Active panel
  activePanel: 'requests' | 'components' | 'waterfall' | 'suspense';

  // Annotation
  annotation: string;

  // Whether to show the waterfall comparison
  showWaterfall: boolean;
}

// Step definition for Data Fetching visualization
export interface DataFetchingStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: DataFetchingState;
  duration: number;
}
