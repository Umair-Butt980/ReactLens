/**
 * Types for Prototypes & this visualization
 */

/**
 * Represents a property on an object
 */
export interface ObjectProperty {
  name: string;
  value: string;
  type: 'data' | 'method' | 'getter' | 'setter';
  isOwn: boolean; // true if on the object itself, false if inherited
  isHighlighted?: boolean;
}

/**
 * Represents an object in the prototype chain
 */
export interface PrototypeObject {
  id: string;
  name: string;
  properties: ObjectProperty[];
  prototypeOf?: string; // ID of the object this is prototype of
  color?: string;
  isHighlighted?: boolean;
}

/**
 * Context where 'this' is bound
 */
export type ThisContext =
  | 'global'
  | 'object-method'
  | 'constructor'
  | 'arrow-function'
  | 'explicit-bind'
  | 'event-handler'
  | 'class-method';

/**
 * Represents the 'this' binding state
 */
export interface ThisBinding {
  context: ThisContext;
  value: string;
  explanation: string;
  color?: string;
}

/**
 * Property lookup step in the prototype chain
 */
export interface PropertyLookup {
  propertyName: string;
  currentObjectId: string;
  found: boolean;
  path: string[]; // IDs of objects checked
}

/**
 * State for Prototypes & this visualization
 */
export interface PrototypesState {
  // Objects in the prototype chain
  objects: PrototypeObject[];
  // Current this binding
  thisBinding?: ThisBinding;
  // Property lookup animation
  propertyLookup?: PropertyLookup;
  // Console output
  consoleOutput: string[];
  // Current focused object
  focusedObjectId?: string;
}

/**
 * A single step in the Prototypes & this visualization
 */
export interface PrototypesStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  animationState: PrototypesState;
  duration: number;
}
