/**
 * Types for File-based Routing (App Router) visualization
 *
 * This visualization shows how Next.js maps folder/file structure
 * to URL routes, including layouts, dynamic segments, route groups,
 * and special files like loading.tsx and error.tsx.
 */

// Type of file system node
export type FileNodeType = 'folder' | 'file';

// Special file types in the App Router
export type SpecialFileType =
  | 'page' // page.tsx - route UI
  | 'layout' // layout.tsx - shared wrapper
  | 'loading' // loading.tsx - loading state
  | 'error' // error.tsx - error boundary
  | 'not-found' // not-found.tsx - 404 UI
  | 'template' // template.tsx - re-mounting wrapper
  | 'route' // route.ts - API route
  | 'default'; // default.tsx - parallel route fallback

// Represents a single node in the folder tree
export interface FileNode {
  id: string;
  name: string;
  type: FileNodeType;
  specialType?: SpecialFileType;
  children?: FileNode[];

  // Visual state
  isHighlighted: boolean;
  isActive: boolean;
  isExpanded: boolean;

  // Routing metadata
  routePath?: string; // The URL path this node maps to
  isDynamic?: boolean; // [param] segment
  isRouteGroup?: boolean; // (group) segment
  isCatchAll?: boolean; // [...slug] segment
}

// Represents the browser URL bar
export interface BrowserBar {
  url: string;
  isNavigating: boolean;
}

// Represents a matched route segment
export interface RouteSegment {
  id: string;
  segment: string;
  filePath: string;
  isLayout: boolean;
  isPage: boolean;
  isDynamic: boolean;
  isHighlighted: boolean;
}

// Represents a layout wrapper in the nesting visualization
export interface LayoutWrapper {
  id: string;
  name: string;
  filePath: string;
  isActive: boolean;
  depth: number;
}

// The active concept being explained
export type RoutingConcept =
  | 'basic-routing'
  | 'nested-routes'
  | 'layouts'
  | 'dynamic-segments'
  | 'route-groups'
  | 'special-files'
  | 'catch-all'
  | 'parallel-routes';

// The main state for the File Routing visualization
export interface FileRoutingState {
  // Folder tree structure
  fileTree: FileNode[];

  // Browser URL bar
  browserBar: BrowserBar;

  // Matched route segments
  matchedSegments: RouteSegment[];

  // Layout nesting visualization
  layoutWrappers: LayoutWrapper[];

  // Which routing concept is active
  activeConcept: RoutingConcept;

  // Annotation text shown near the tree
  annotation: string;

  // Whether to show the route resolution arrow
  showRouteArrow: boolean;
}

// Step definition for File Routing visualization
export interface FileRoutingStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  state: FileRoutingState;
  duration: number;
}
