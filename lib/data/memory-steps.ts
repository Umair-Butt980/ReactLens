/**
 * Memory Management visualization data
 * Demonstrates heap/stack, garbage collection, and memory leaks
 */

import type { MemoryStep } from '@/lib/types/memory.types';

/**
 * Code example for Memory Management visualization
 */
export const memoryCode = `// Memory Allocation Demo
let user = {
  name: 'Alice',
  scores: [85, 92, 78]
};

let admin = user;  // Same reference!

function processUser(u) {
  const temp = {
    processed: true,
    data: u
  };
  console.log(temp.data.name);
  // temp goes out of scope here
}

processUser(user);

// Memory Leak Example
let cache = {};
function addToCache(key, value) {
  cache[key] = value;  // Never cleaned up!
}

// Closure holding reference
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}
const counter = createCounter();

// Breaking references for GC
user = null;    // user object now unreachable
admin = null;   // Now it can be garbage collected`;

/**
 * Steps for Memory Management visualization
 */
export const memorySteps: MemoryStep[] = [
  {
    id: 'step-1',
    title: 'Stack vs Heap Memory',
    explanation:
      'JavaScript uses two main memory areas: the Stack (for primitives and references) and the Heap (for objects). When you create an object, the object lives in the heap, and a reference/pointer to it is stored on the stack.',
    highlightedLines: [2, 3, 4, 5],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [{ id: 'user-ref', name: 'user', pointsTo: 'user-obj', color: '#06B6D4' }],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: ['scores-arr'],
          isReachable: true,
        },
        {
          id: 'scores-arr',
          type: 'array',
          name: 'scores',
          size: 40,
          color: '#10B981',
          references: [],
          isReachable: true,
        },
      ],
      gcPhase: 'idle',
      roots: ['user-ref'],
      consoleOutput: [
        '// Stack: Stores references (pointers)',
        '// Heap: Stores actual objects',
        '',
        'user → points to object in heap',
        'scores array → nested in heap',
      ],
      metrics: {
        heapUsed: 100,
        heapTotal: 500,
        objectCount: 2,
      },
    },
    duration: 3500,
  },
  {
    id: 'step-2',
    title: 'Reference Copying',
    explanation:
      "When you assign an object to another variable (admin = user), you're copying the REFERENCE, not the object. Both variables now point to the same object in the heap. Changes through one affect the other!",
    highlightedLines: [7],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'user-ref', name: 'user', pointsTo: 'user-obj', color: '#06B6D4' },
            { id: 'admin-ref', name: 'admin', pointsTo: 'user-obj', color: '#EC4899' },
          ],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: ['scores-arr'],
          isReachable: true,
        },
        {
          id: 'scores-arr',
          type: 'array',
          name: 'scores',
          size: 40,
          color: '#10B981',
          references: [],
          isReachable: true,
        },
      ],
      gcPhase: 'idle',
      roots: ['user-ref', 'admin-ref'],
      consoleOutput: [
        '> let admin = user',
        '',
        '// Both point to SAME object!',
        'user  → [user object]',
        'admin → [user object]',
        '',
        '// admin.name = "Bob" would',
        '// also change user.name!',
      ],
      highlightedPath: ['admin-ref', 'user-obj'],
      metrics: {
        heapUsed: 100,
        heapTotal: 500,
        objectCount: 2,
      },
    },
    duration: 3000,
  },
  {
    id: 'step-3',
    title: 'Function Call & New Stack Frame',
    explanation:
      'When a function is called, a new stack frame is created. Local variables live in this frame. The parameter "u" is a copy of the reference, pointing to the same object. A new temp object is created in the heap.',
    highlightedLines: [9, 10, 11, 12, 13],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'user-ref', name: 'user', pointsTo: 'user-obj', color: '#06B6D4' },
            { id: 'admin-ref', name: 'admin', pointsTo: 'user-obj', color: '#EC4899' },
          ],
        },
        {
          id: 'processUser',
          name: 'processUser()',
          color: '#F97316',
          variables: [
            { id: 'u-ref', name: 'u', pointsTo: 'user-obj', color: '#F97316' },
            { id: 'temp-ref', name: 'temp', pointsTo: 'temp-obj', color: '#FBBF24' },
          ],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: ['scores-arr'],
          isReachable: true,
        },
        {
          id: 'scores-arr',
          type: 'array',
          name: 'scores',
          size: 40,
          color: '#10B981',
          references: [],
          isReachable: true,
        },
        {
          id: 'temp-obj',
          type: 'object',
          name: 'temp',
          size: 40,
          color: '#FBBF24',
          references: ['user-obj'],
          isReachable: true,
        },
      ],
      gcPhase: 'idle',
      roots: ['user-ref', 'admin-ref', 'temp-ref'],
      consoleOutput: [
        '// New stack frame created',
        '// Local variables: u, temp',
        '',
        'temp = { processed: true, data: u }',
        '// temp.data references user object',
        '',
        '> "Alice"',
      ],
      metrics: {
        heapUsed: 180,
        heapTotal: 500,
        objectCount: 3,
      },
    },
    duration: 3500,
  },
  {
    id: 'step-4',
    title: 'Function Returns - Stack Frame Popped',
    explanation:
      'When the function returns, its stack frame is popped. The temp variable is gone, so nothing references the temp object anymore. This object becomes "unreachable" and eligible for garbage collection.',
    highlightedLines: [14, 15],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'user-ref', name: 'user', pointsTo: 'user-obj', color: '#06B6D4' },
            { id: 'admin-ref', name: 'admin', pointsTo: 'user-obj', color: '#EC4899' },
          ],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: ['scores-arr'],
          isReachable: true,
        },
        {
          id: 'scores-arr',
          type: 'array',
          name: 'scores',
          size: 40,
          color: '#10B981',
          references: [],
          isReachable: true,
        },
        {
          id: 'temp-obj',
          type: 'object',
          name: 'temp',
          size: 40,
          color: '#FBBF24',
          references: ['user-obj'],
          isReachable: false,
        },
      ],
      gcPhase: 'idle',
      roots: ['user-ref', 'admin-ref'],
      consoleOutput: [
        '// Function returned',
        '// Stack frame destroyed',
        '',
        '// temp object is now UNREACHABLE',
        '// No variable points to it!',
        '',
        '⚠️ Eligible for garbage collection',
      ],
      metrics: {
        heapUsed: 180,
        heapTotal: 500,
        objectCount: 3,
      },
    },
    duration: 3000,
  },
  {
    id: 'step-5',
    title: 'Mark Phase - Finding Reachable Objects',
    explanation:
      'Garbage collection starts with the "Mark" phase. Starting from "roots" (global variables, stack variables), it follows all references and marks every object it can reach. Unreachable objects are not marked.',
    highlightedLines: [],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'user-ref', name: 'user', pointsTo: 'user-obj', color: '#06B6D4' },
            { id: 'admin-ref', name: 'admin', pointsTo: 'user-obj', color: '#EC4899' },
          ],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: ['scores-arr'],
          isReachable: true,
          isMarked: true,
        },
        {
          id: 'scores-arr',
          type: 'array',
          name: 'scores',
          size: 40,
          color: '#10B981',
          references: [],
          isReachable: true,
          isMarked: true,
        },
        {
          id: 'temp-obj',
          type: 'object',
          name: 'temp',
          size: 40,
          color: '#FBBF24',
          references: ['user-obj'],
          isReachable: false,
          isMarked: false,
        },
      ],
      gcPhase: 'mark',
      roots: ['user-ref', 'admin-ref'],
      highlightedPath: ['user-ref', 'user-obj', 'scores-arr'],
      consoleOutput: [
        '🔍 GC: Mark Phase',
        '',
        '1. Start from roots',
        '2. user → user object ✓ marked',
        '3. user.scores → scores array ✓ marked',
        '',
        '❌ temp object: NOT reachable',
      ],
      metrics: {
        heapUsed: 180,
        heapTotal: 500,
        objectCount: 3,
      },
    },
    duration: 3500,
  },
  {
    id: 'step-6',
    title: 'Sweep Phase - Collecting Garbage',
    explanation:
      'In the "Sweep" phase, the garbage collector frees memory for all unmarked objects. The temp object is collected, and its memory is returned to the heap. This happens automatically - you don\'t need to do anything!',
    highlightedLines: [],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'user-ref', name: 'user', pointsTo: 'user-obj', color: '#06B6D4' },
            { id: 'admin-ref', name: 'admin', pointsTo: 'user-obj', color: '#EC4899' },
          ],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: ['scores-arr'],
          isReachable: true,
        },
        {
          id: 'scores-arr',
          type: 'array',
          name: 'scores',
          size: 40,
          color: '#10B981',
          references: [],
          isReachable: true,
        },
        {
          id: 'temp-obj',
          type: 'object',
          name: 'temp',
          size: 40,
          color: '#FBBF24',
          references: ['user-obj'],
          isCollected: true,
        },
      ],
      gcPhase: 'sweep',
      roots: ['user-ref', 'admin-ref'],
      consoleOutput: [
        '🧹 GC: Sweep Phase',
        '',
        '✓ user object: marked, kept',
        '✓ scores array: marked, kept',
        '🗑️ temp object: COLLECTED',
        '',
        '📊 Memory freed: 40 units',
      ],
      metrics: {
        heapUsed: 140,
        heapTotal: 500,
        objectCount: 2,
        collectedCount: 1,
      },
    },
    duration: 3000,
  },
  {
    id: 'step-7',
    title: 'Memory Leak: Growing Cache',
    explanation:
      "A memory leak occurs when objects stay reachable but are no longer needed. Here, the cache object keeps growing - old entries are never removed, so they can't be garbage collected even if they're never used again.",
    highlightedLines: [20, 21, 22, 23],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'user-ref', name: 'user', pointsTo: 'user-obj', color: '#06B6D4' },
            { id: 'cache-ref', name: 'cache', pointsTo: 'cache-obj', color: '#EF4444' },
          ],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: [],
          isReachable: true,
        },
        {
          id: 'cache-obj',
          type: 'object',
          name: 'cache',
          size: 100,
          color: '#EF4444',
          references: ['cache-item-1', 'cache-item-2', 'cache-item-3'],
          isReachable: true,
        },
        {
          id: 'cache-item-1',
          type: 'object',
          name: 'item-1',
          size: 30,
          color: '#EF4444',
          references: [],
          isReachable: true,
        },
        {
          id: 'cache-item-2',
          type: 'object',
          name: 'item-2',
          size: 30,
          color: '#EF4444',
          references: [],
          isReachable: true,
        },
        {
          id: 'cache-item-3',
          type: 'object',
          name: 'item-3',
          size: 30,
          color: '#EF4444',
          references: [],
          isReachable: true,
        },
      ],
      gcPhase: 'idle',
      roots: ['user-ref', 'cache-ref'],
      consoleOutput: [
        '⚠️ MEMORY LEAK!',
        '',
        'cache object keeps growing...',
        '  - item-1 (never used again)',
        '  - item-2 (never used again)',
        '  - item-3 (never used again)',
        '',
        "// GC can't collect them -",
        "// they're still reachable!",
      ],
      metrics: {
        heapUsed: 250,
        heapTotal: 500,
        objectCount: 5,
      },
    },
    duration: 3500,
  },
  {
    id: 'step-8',
    title: 'Closures Retain References',
    explanation:
      'Closures can cause memory retention. When createCounter() returns, the inner function still references "count" - so the closure and its scope stay in memory as long as "counter" exists.',
    highlightedLines: [26, 27, 28, 29, 30, 31],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'counter-ref', name: 'counter', pointsTo: 'closure-obj', color: '#8B5CF6' },
          ],
        },
      ],
      heap: [
        {
          id: 'closure-obj',
          type: 'closure',
          name: 'counter (closure)',
          size: 50,
          color: '#8B5CF6',
          references: ['scope-obj'],
          isReachable: true,
        },
        {
          id: 'scope-obj',
          type: 'object',
          name: 'Closure Scope',
          size: 30,
          color: '#EC4899',
          references: [],
          isReachable: true,
        },
      ],
      gcPhase: 'idle',
      roots: ['counter-ref'],
      highlightedPath: ['counter-ref', 'closure-obj', 'scope-obj'],
      consoleOutput: [
        '// Closure retains its scope',
        '',
        'counter function',
        '  └─ [[Scope]]',
        '       └─ count = 0',
        '',
        "// This scope can't be GC'd",
        '// until counter = null',
      ],
      metrics: {
        heapUsed: 80,
        heapTotal: 500,
        objectCount: 2,
      },
    },
    duration: 3000,
  },
  {
    id: 'step-9',
    title: 'Breaking References for GC',
    explanation:
      'To help the garbage collector, you can break references by setting variables to null. Here, setting user to null removes one reference, but the object is still reachable through admin.',
    highlightedLines: [34],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'user-ref', name: 'user', value: 'null', color: '#6B7280' },
            { id: 'admin-ref', name: 'admin', pointsTo: 'user-obj', color: '#EC4899' },
          ],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: ['scores-arr'],
          isReachable: true,
        },
        {
          id: 'scores-arr',
          type: 'array',
          name: 'scores',
          size: 40,
          color: '#10B981',
          references: [],
          isReachable: true,
        },
      ],
      gcPhase: 'idle',
      roots: ['admin-ref'],
      consoleOutput: [
        '> user = null',
        '',
        '// user no longer references object',
        '// BUT admin still does!',
        '',
        '// Object is still reachable',
        '// Cannot be garbage collected yet',
      ],
      metrics: {
        heapUsed: 100,
        heapTotal: 500,
        objectCount: 2,
      },
    },
    duration: 2500,
  },
  {
    id: 'step-10',
    title: 'Object Now Eligible for GC',
    explanation:
      "After setting admin to null too, no references point to the user object. Now it's truly unreachable and will be garbage collected. The scores array will also be collected since it was only reachable through user.",
    highlightedLines: [35],
    animationState: {
      stack: [
        {
          id: 'global',
          name: 'Global',
          color: '#8B5CF6',
          variables: [
            { id: 'user-ref', name: 'user', value: 'null', color: '#6B7280' },
            { id: 'admin-ref', name: 'admin', value: 'null', color: '#6B7280' },
          ],
        },
      ],
      heap: [
        {
          id: 'user-obj',
          type: 'object',
          name: 'user',
          size: 60,
          color: '#06B6D4',
          references: ['scores-arr'],
          isReachable: false,
        },
        {
          id: 'scores-arr',
          type: 'array',
          name: 'scores',
          size: 40,
          color: '#10B981',
          references: [],
          isReachable: false,
        },
      ],
      gcPhase: 'mark',
      roots: [],
      consoleOutput: [
        '> admin = null',
        '',
        '// Now NO references to user object!',
        '',
        '🗑️ user object: unreachable',
        '🗑️ scores array: unreachable',
        '',
        '// Both eligible for GC',
        '// Memory will be reclaimed',
      ],
      metrics: {
        heapUsed: 100,
        heapTotal: 500,
        objectCount: 2,
        collectedCount: 2,
      },
    },
    duration: 3000,
  },
];

/**
 * Key takeaways for Memory Management topic
 */
export const memoryKeyTakeaways = [
  'Stack stores primitives and references; Heap stores objects',
  'Assigning objects copies the reference, not the object itself',
  'GC uses mark-and-sweep: mark reachable objects, sweep the rest',
  "Memory leaks happen when objects stay reachable but aren't needed",
  'Closures retain references to their outer scope variables',
  'Set references to null to help GC clean up unneeded objects',
];
