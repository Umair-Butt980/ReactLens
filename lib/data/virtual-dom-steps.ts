/**
 * Virtual DOM visualization data
 * Demonstrates why Virtual DOM was created and how it optimizes updates
 */

import type { VirtualDOMStep, VNode } from '@/lib/types/virtual-dom.types';

/**
 * Code example for Virtual DOM visualization
 */
export const virtualDOMCode = `// Initial State
const state = { count: 0, items: ['A', 'B', 'C'] };

// React Component (simplified)
function Counter() {
  return (
    <div id="app">
      <h1>Count: {state.count}</h1>
      <ul>
        {state.items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={() => state.count++}>
        Increment
      </button>
    </div>
  );
}

// When state changes: count = 1
// React creates a NEW Virtual DOM tree
// Then DIFFS it against the previous one
// Only updates what actually changed!

// Without Virtual DOM:
document.getElementById('app').innerHTML = newHTML;
// Re-creates EVERYTHING - expensive!

// With Virtual DOM:
// Only this text node changes: "Count: 0" → "Count: 1"
// The rest of the DOM is untouched`;

/**
 * Initial Virtual DOM tree
 */
const initialVDOM: VNode = {
  id: 'app',
  type: 'div',
  props: { id: 'app' },
  children: [
    {
      id: 'heading',
      type: 'h1',
      props: {},
      children: ['Count: 0'],
    },
    {
      id: 'list',
      type: 'ul',
      props: {},
      children: [
        { id: 'item-a', type: 'li', props: { key: 'A' }, children: ['A'] },
        { id: 'item-b', type: 'li', props: { key: 'B' }, children: ['B'] },
        { id: 'item-c', type: 'li', props: { key: 'C' }, children: ['C'] },
      ],
    },
    {
      id: 'button',
      type: 'button',
      props: { onClick: '() => state.count++' },
      children: ['Increment'],
    },
  ],
};

/**
 * Updated Virtual DOM after state change
 */
const updatedVDOM: VNode = {
  id: 'app',
  type: 'div',
  props: { id: 'app' },
  children: [
    {
      id: 'heading',
      type: 'h1',
      props: {},
      children: ['Count: 1'],
      isUpdated: true,
    },
    {
      id: 'list',
      type: 'ul',
      props: {},
      children: [
        { id: 'item-a', type: 'li', props: { key: 'A' }, children: ['A'], isUnchanged: true },
        { id: 'item-b', type: 'li', props: { key: 'B' }, children: ['B'], isUnchanged: true },
        { id: 'item-c', type: 'li', props: { key: 'C' }, children: ['C'], isUnchanged: true },
      ],
    },
    {
      id: 'button',
      type: 'button',
      props: { onClick: '() => state.count++' },
      children: ['Increment'],
      isUnchanged: true,
    },
  ],
};

/**
 * Steps for Virtual DOM visualization
 */
export const virtualDOMSteps: VirtualDOMStep[] = [
  {
    id: 'step-1',
    title: 'The Problem with Direct DOM Manipulation',
    explanation:
      'When you directly change the DOM using innerHTML or similar methods, the browser has to: 1) Parse the HTML string, 2) Destroy existing DOM nodes, 3) Create new nodes, 4) Recalculate styles, 5) Re-layout the page, 6) Repaint everything. This is extremely expensive, especially when only a small part actually changed!',
    highlightedLines: [32, 33],
    animationState: {
      realDOM: initialVDOM,
      previousVDOM: null,
      currentVDOM: initialVDOM,
      diffs: [],
      patches: [],
      phase: 'render',
      highlightedRealNodes: ['app', 'heading', 'list', 'item-a', 'item-b', 'item-c', 'button'],
      highlightedVirtualNodes: [],
      consoleOutput: [
        '// Direct DOM update:',
        'element.innerHTML = newHTML',
        '',
        '⚠️ Problem: Destroys and recreates EVERYTHING',
        '⚠️ Even unchanged elements are re-rendered!',
      ],
      metrics: {
        directDOMOps: 7,
        virtualDOMOps: 0,
        savedOps: 0,
      },
    },
    duration: 3500,
  },
  {
    id: 'step-2',
    title: 'Enter the Virtual DOM',
    explanation:
      'The Virtual DOM is a lightweight JavaScript representation of the real DOM. Instead of updating the real DOM directly, React first creates a virtual copy in memory. This is just a plain JavaScript object describing what the UI should look like - no actual DOM operations yet!',
    highlightedLines: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    animationState: {
      realDOM: initialVDOM,
      previousVDOM: null,
      currentVDOM: initialVDOM,
      diffs: [],
      patches: [],
      phase: 'render',
      highlightedRealNodes: [],
      highlightedVirtualNodes: ['app', 'heading', 'list', 'button'],
      consoleOutput: [
        '// Virtual DOM is just a JS object:',
        '{ type: "div", props: { id: "app" },',
        '  children: [',
        '    { type: "h1", children: ["Count: 0"] },',
        '    { type: "ul", children: [...] },',
        '    { type: "button", children: ["Increment"] }',
        '  ]',
        '}',
      ],
    },
    duration: 3000,
  },
  {
    id: 'step-3',
    title: 'State Changes Trigger Re-render',
    explanation:
      "When state changes (e.g., count goes from 0 to 1), React creates a completely NEW Virtual DOM tree representing the updated UI. This is fast because it's just creating JavaScript objects in memory - no DOM operations!",
    highlightedLines: [27, 28, 29],
    animationState: {
      realDOM: initialVDOM,
      previousVDOM: initialVDOM,
      currentVDOM: updatedVDOM,
      diffs: [],
      patches: [],
      phase: 'render',
      highlightedRealNodes: [],
      highlightedVirtualNodes: ['heading'],
      consoleOutput: [
        '// State changed: count = 1',
        '// Creating NEW Virtual DOM...',
        '',
        '// Old: { children: ["Count: 0"] }',
        '// New: { children: ["Count: 1"] }',
      ],
    },
    duration: 2500,
  },
  {
    id: 'step-4',
    title: 'The Diffing Algorithm',
    explanation:
      'React\'s reconciliation algorithm compares the new Virtual DOM with the previous one. It walks through both trees and identifies exactly what changed. This is called "diffing". The algorithm is O(n) - it compares nodes level by level.',
    highlightedLines: [28, 29, 30],
    animationState: {
      realDOM: initialVDOM,
      previousVDOM: initialVDOM,
      currentVDOM: updatedVDOM,
      diffs: [
        {
          id: 'diff-1',
          type: 'update',
          path: 'app > h1 > text',
          oldValue: 'Count: 0',
          newValue: 'Count: 1',
          description: 'Text content changed',
        },
      ],
      patches: [],
      phase: 'diff',
      highlightedRealNodes: [],
      highlightedVirtualNodes: ['heading'],
      consoleOutput: [
        '🔍 Diffing Virtual DOM trees...',
        '',
        '✓ div#app - unchanged',
        '✓ ul - unchanged',
        '✓ li (A, B, C) - unchanged',
        '✓ button - unchanged',
        '',
        '⚡ h1 text: "Count: 0" → "Count: 1"',
        '',
        '📊 Only 1 change detected!',
      ],
    },
    duration: 3000,
  },
  {
    id: 'step-5',
    title: 'Creating Minimal Patches',
    explanation:
      'Based on the diff results, React creates a minimal set of patch operations. Instead of recreating everything, it creates surgical updates - only the operations needed to transform the old DOM into the new one.',
    highlightedLines: [36, 37],
    animationState: {
      realDOM: initialVDOM,
      previousVDOM: initialVDOM,
      currentVDOM: updatedVDOM,
      diffs: [
        {
          id: 'diff-1',
          type: 'update',
          path: 'app > h1 > text',
          oldValue: 'Count: 0',
          newValue: 'Count: 1',
          description: 'Text content changed',
        },
      ],
      patches: [
        {
          id: 'patch-1',
          type: 'UPDATE_TEXT',
          targetPath: 'app > h1 > text',
          payload: 'Count: 1',
          description: 'Update text node',
          isApplied: false,
        },
      ],
      phase: 'patch',
      highlightedRealNodes: ['heading'],
      highlightedVirtualNodes: ['heading'],
      consoleOutput: [
        '📋 Patch Operations:',
        '',
        '1. UPDATE_TEXT at h1',
        '   "Count: 0" → "Count: 1"',
        '',
        '✨ Only 1 DOM operation needed!',
        '   (vs 7 with innerHTML)',
      ],
      metrics: {
        directDOMOps: 7,
        virtualDOMOps: 1,
        savedOps: 6,
      },
    },
    duration: 3000,
  },
  {
    id: 'step-6',
    title: 'Batch Commit to Real DOM',
    explanation:
      'Finally, React batches all the patches and applies them to the real DOM in a single update. This minimizes layout thrashing and repaints. The browser only has to do the work for the parts that actually changed!',
    highlightedLines: [36, 37],
    animationState: {
      realDOM: {
        ...updatedVDOM,
        children: [
          { ...(updatedVDOM.children[0] as VNode), isUpdated: true },
          updatedVDOM.children[1],
          updatedVDOM.children[2],
        ],
      },
      previousVDOM: initialVDOM,
      currentVDOM: updatedVDOM,
      diffs: [],
      patches: [
        {
          id: 'patch-1',
          type: 'UPDATE_TEXT',
          targetPath: 'app > h1 > text',
          payload: 'Count: 1',
          description: 'Update text node',
          isApplied: true,
        },
      ],
      phase: 'commit',
      highlightedRealNodes: ['heading'],
      highlightedVirtualNodes: [],
      consoleOutput: [
        '✅ Committed to Real DOM!',
        '',
        '// What actually happened:',
        'h1.textContent = "Count: 1"',
        '',
        "// That's it! One operation.",
        '// All other nodes untouched.',
      ],
    },
    duration: 2500,
  },
  {
    id: 'step-7',
    title: 'Keys Help with List Optimization',
    explanation:
      'When rendering lists, React uses "keys" to track which items changed, were added, or removed. Without keys, React might re-render the entire list. With keys, it can identify exactly which items need updates and reorder nodes efficiently.',
    highlightedLines: [10, 11],
    animationState: {
      realDOM: updatedVDOM,
      previousVDOM: null,
      currentVDOM: {
        ...updatedVDOM,
        children: [
          updatedVDOM.children[0],
          {
            ...(updatedVDOM.children[1] as VNode),
            children: [
              { id: 'item-a', type: 'li', props: { key: 'A' }, children: ['A'], isUnchanged: true },
              { id: 'item-b', type: 'li', props: { key: 'B' }, children: ['B'], isUnchanged: true },
              { id: 'item-c', type: 'li', props: { key: 'C' }, children: ['C'], isUnchanged: true },
              { id: 'item-d', type: 'li', props: { key: 'D' }, children: ['D'], isNew: true },
            ],
          },
          updatedVDOM.children[2],
        ],
      },
      diffs: [
        {
          id: 'diff-add',
          type: 'add',
          path: 'app > ul',
          newValue: '{ key: "D", children: ["D"] }',
          description: 'New item added',
        },
      ],
      patches: [
        {
          id: 'patch-add',
          type: 'CREATE',
          targetPath: 'app > ul > li[key=D]',
          payload: '<li>D</li>',
          description: 'Append new list item',
          isApplied: false,
        },
      ],
      phase: 'diff',
      highlightedRealNodes: [],
      highlightedVirtualNodes: ['item-a', 'item-b', 'item-c'],
      consoleOutput: [
        '// Adding item "D" to list',
        '',
        '🔑 Keys found: A, B, C',
        '✓ A - in place',
        '✓ B - in place',
        '✓ C - in place',
        '➕ D - new, append at end',
        '',
        '// Only 1 DOM operation: appendChild',
      ],
    },
    duration: 3000,
  },
  {
    id: 'step-8',
    title: 'Performance Benefits Visualized',
    explanation:
      'The Virtual DOM shines when you have complex UIs with frequent updates. Instead of blindly re-rendering everything, it surgically updates only what changed. This leads to better performance and smoother user experiences.',
    highlightedLines: [],
    animationState: {
      realDOM: updatedVDOM,
      previousVDOM: initialVDOM,
      currentVDOM: updatedVDOM,
      diffs: [],
      patches: [],
      phase: 'commit',
      highlightedRealNodes: [],
      highlightedVirtualNodes: [],
      consoleOutput: [
        '📊 Performance Comparison:',
        '',
        '❌ Direct DOM (innerHTML):',
        '   7 nodes destroyed',
        '   7 nodes created',
        '   1 full layout recalc',
        '',
        '✅ Virtual DOM:',
        '   1 text node updated',
        '   0 nodes destroyed',
        '   0 full layout recalcs',
        '',
        '🚀 ~85% fewer DOM operations!',
      ],
      metrics: {
        directDOMOps: 14,
        virtualDOMOps: 1,
        savedOps: 13,
      },
    },
    duration: 3500,
  },
];

/**
 * Key takeaways for Virtual DOM topic
 */
export const virtualDOMKeyTakeaways = [
  'Virtual DOM is a JavaScript object representation of the actual DOM',
  'Diffing compares old and new Virtual DOM to find minimal changes',
  'Only changed parts are updated in the real DOM (reconciliation)',
  'Keys help React track list items efficiently during updates',
  'Batch updates minimize browser layout thrashing and repaints',
  'This is why React apps feel fast even with complex UIs',
];
