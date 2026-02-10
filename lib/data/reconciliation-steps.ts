/**
 * Step-by-step data for Reconciliation visualization
 *
 * This visualization demonstrates how React's diffing algorithm compares
 * old and new Virtual DOM trees to compute the minimal set of DOM
 * operations needed to update the UI.
 */

import type { ReconciliationStep } from '@/lib/types';

export const reconciliationCode = `// Before state update
<div className="container">
  <h1>Welcome</h1>
  <ul>
    <li key="a">Apple</li>
    <li key="b">Banana</li>
    <li key="c">Cherry</li>
  </ul>
</div>

// After state update (items reordered + prop changed)
<div className="container active">
  <h1>Welcome</h1>
  <ul>
    <li key="c">Cherry</li>
    <li key="a">Apple</li>
    <li key="b">Banana</li>
    <li key="d">Date</li>
  </ul>
</div>

// React's job: Figure out the MINIMAL DOM changes needed
// to transform the old tree into the new tree`;

export const reconciliationSteps: ReconciliationStep[] = [
  {
    id: 'step-1',
    title: 'What is Reconciliation?',
    explanation: `Reconciliation is React's process for determining what changed between renders. When your component returns new JSX, React doesn't blindly recreate the entire DOM - that would be incredibly slow!

Instead, React:
1. Compares the NEW Virtual DOM with the PREVIOUS Virtual DOM
2. Computes the DIFFERENCES (this is the "diffing" algorithm)
3. Generates a MINIMAL set of DOM operations
4. Applies only those changes to the real DOM

This is what makes React fast! Generating Virtual DOM is cheap (just JavaScript objects). Manipulating real DOM is expensive. By minimizing DOM operations, React keeps your UI snappy.

The diffing algorithm makes two key assumptions to achieve O(n) complexity:
1. Elements of DIFFERENT TYPES produce different trees
2. Developer-provided KEYS hint at stable identity across renders

Without these heuristics, comparing two trees would be O(n³) - impossibly slow for real apps. Let's see how this works in practice...`,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    state: {
      oldTree: {
        id: 'old-root',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'old-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'old-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'old-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: true,
        diffStatus: 'unchanged',
      },
      newTree: null,
      diffResults: [],
      currentComparison: null,
      domOperations: [],
      listReconciliation: null,
      phase: 'idle',
      comparisonSteps: [],
      output: [
        { id: 'msg-1', type: 'info', message: 'Reconciliation: Computing minimal DOM changes' },
        { id: 'msg-2', type: 'info', message: 'Goal: Transform old tree → new tree efficiently' },
      ],
      activePanel: 'trees',
      showConnections: false,
    },
    duration: 5500,
  },
  {
    id: 'step-2',
    title: 'State Update Triggers New Render',
    explanation: `A state update occurs in your component. React calls your component function again, which returns NEW JSX:

<div className="container active">  // className changed!
  <h1>Welcome</h1>                   // Same
  <ul>
    <li key="c">Cherry</li>          // Moved from position 2 to 0
    <li key="a">Apple</li>           // Moved from position 0 to 1
    <li key="b">Banana</li>          // Moved from position 1 to 2
    <li key="d">Date</li>            // NEW item!
  </ul>
</div>

What changed?
1. Root div: className "container" → "container active"
2. List items: Reordered (c, a, b) and one added (d)

React now has TWO Virtual DOM trees:
• Previous (what's currently on screen)
• Next (what we want on screen)

The diffing algorithm will walk these trees and identify exactly what needs to change. Let's start the comparison...`,
    highlightedLines: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    state: {
      oldTree: {
        id: 'old-root',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'old-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'old-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'old-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'unchanged',
      },
      newTree: {
        id: 'new-root',
        type: 'div',
        props: { className: 'container active' },
        children: [
          {
            id: 'new-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'new-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'new-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-d',
                type: 'li',
                props: { key: 'd' },
                children: [],
                key: 'd',
                isHighlighted: false,
                diffStatus: 'added',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: true,
        diffStatus: 'unchanged',
      },
      diffResults: [],
      currentComparison: null,
      domOperations: [],
      listReconciliation: null,
      phase: 'start',
      comparisonSteps: [],
      output: [
        { id: 'msg-1', type: 'info', message: 'New render triggered by state update' },
        { id: 'msg-2', type: 'compare', message: 'Old tree and new tree ready for comparison' },
      ],
      activePanel: 'trees',
      showConnections: false,
    },
    duration: 5000,
  },
  {
    id: 'step-3',
    title: 'Rule 1: Compare Element Types',
    explanation: `The first rule of React's diffing algorithm:

If two elements have DIFFERENT TYPES, React destroys the old tree and builds the new tree from scratch.

Examples:
• <div> → <span>: Destroy div and all children, create span
• <Article> → <Comment>: Unmount Article, mount Comment
• <div> → <p>: Full replacement

In our case, root is <div> in both trees - SAME TYPE! So React can UPDATE the existing div rather than replacing it.

When types match, React:
1. Keeps the same DOM node
2. Compares props to find changes
3. Recurses into children

This is a HUGE optimization. Imagine a <div> with 100 children. If we had to recreate everything for a single prop change, it would be extremely slow.

By reusing the DOM node, React only needs to update what actually changed. Let's see what changed in the props...`,
    highlightedLines: [2, 13],
    state: {
      oldTree: {
        id: 'old-root',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'old-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'old-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'old-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: true,
        diffStatus: 'comparing',
      },
      newTree: {
        id: 'new-root',
        type: 'div',
        props: { className: 'container active' },
        children: [
          {
            id: 'new-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'new-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'new-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-d',
                type: 'li',
                props: { key: 'd' },
                children: [],
                key: 'd',
                isHighlighted: false,
                diffStatus: 'added',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: true,
        diffStatus: 'comparing',
      },
      diffResults: [],
      currentComparison: 'root',
      domOperations: [],
      listReconciliation: null,
      phase: 'compare-root',
      comparisonSteps: [
        {
          id: 'step-1',
          oldNodeId: 'old-root',
          newNodeId: 'new-root',
          result: 'update-props',
          description: 'Types match (div), comparing props',
          isActive: true,
        },
      ],
      output: [
        { id: 'msg-1', type: 'compare', message: 'Comparing root: <div> vs <div>' },
        { id: 'msg-2', type: 'diff', message: 'Types MATCH → Can reuse DOM node' },
        { id: 'msg-3', type: 'info', message: 'Next: Compare props for changes' },
      ],
      activePanel: 'trees',
      showConnections: true,
    },
    duration: 5000,
  },
  {
    id: 'step-4',
    title: 'Compare Props - Find Changes',
    explanation: `Types match, so React compares the PROPS of both elements:

Old: <div className="container">
New: <div className="container active">

React iterates through all props and finds:
• className: "container" → "container active" (CHANGED!)
• Other props: unchanged

For this change, React generates ONE DOM operation:
element.className = "container active"

That's it! React doesn't recreate the div, doesn't touch children yet - just updates the single attribute that changed.

This granular update strategy is why React is fast. Consider all the things React DOESN'T do:
• Doesn't recreate the div element
• Doesn't remove/add children
• Doesn't touch event listeners
• Doesn't lose focus state

Now React moves on to compare the children of this div...`,
    highlightedLines: [2, 13],
    state: {
      oldTree: {
        id: 'old-root',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'old-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'old-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'old-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'updated',
      },
      newTree: {
        id: 'new-root',
        type: 'div',
        props: { className: 'container active' },
        children: [
          {
            id: 'new-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'new-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'new-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-d',
                type: 'li',
                props: { key: 'd' },
                children: [],
                key: 'd',
                isHighlighted: false,
                diffStatus: 'added',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'updated',
      },
      diffResults: [
        {
          id: 'diff-1',
          action: 'update-props',
          nodePath: 'root',
          propChanges: [
            {
              name: 'className',
              oldValue: 'container',
              newValue: 'container active',
              changeType: 'changed',
            },
          ],
          isActive: true,
        },
      ],
      currentComparison: 'root.props',
      domOperations: [
        {
          id: 'op-1',
          type: 'updateAttribute',
          target: 'div',
          details: 'className: "container" → "container active"',
          isExecuted: false,
          isHighlighted: true,
        },
      ],
      listReconciliation: null,
      phase: 'compare-props',
      comparisonSteps: [
        {
          id: 'step-1',
          oldNodeId: 'old-root',
          newNodeId: 'new-root',
          result: 'update-props',
          description: 'className changed',
          isActive: true,
        },
      ],
      output: [
        { id: 'msg-1', type: 'compare', message: 'Comparing props of <div>' },
        { id: 'msg-2', type: 'diff', message: 'className: "container" → "container active"' },
        { id: 'msg-3', type: 'dom', message: 'DOM op: updateAttribute(className)' },
      ],
      activePanel: 'diff',
      showConnections: true,
    },
    duration: 4500,
  },
  {
    id: 'step-5',
    title: 'Recursing Into Children',
    explanation: `React now recursively compares children. The div has two children:
1. <h1>Welcome</h1>
2. <ul>...</ul>

For the <h1>:
• Same type (h1)
• Same props (none)
• Same children ("Welcome")
• Result: NO CHANGES needed!

React is smart enough to skip entirely when nothing changed. This is why React is efficient even with large trees - it can quickly skip unchanged subtrees.

For the <ul>:
• Same type (ul)
• Same props (none)
• But children are DIFFERENT!

This is where things get interesting. The list items have KEYS. React uses these keys to understand which items moved, which are new, and which were removed.

Without keys, React would compare by index:
• Old[0] vs New[0]: <li>Apple</li> vs <li>Cherry</li> → DIFFERENT!

This would be terrible - React would update every single item! Let's see how keys help...`,
    highlightedLines: [3, 4, 5, 6, 7, 8, 9, 14, 15, 16, 17, 18, 19, 20],
    state: {
      oldTree: {
        id: 'old-root',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'old-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: true,
            diffStatus: 'unchanged',
          },
          {
            id: 'old-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'old-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
            ],
            key: null,
            isHighlighted: true,
            diffStatus: 'comparing',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'updated',
      },
      newTree: {
        id: 'new-root',
        type: 'div',
        props: { className: 'container active' },
        children: [
          {
            id: 'new-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: true,
            diffStatus: 'unchanged',
          },
          {
            id: 'new-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'new-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-d',
                type: 'li',
                props: { key: 'd' },
                children: [],
                key: 'd',
                isHighlighted: false,
                diffStatus: 'added',
              },
            ],
            key: null,
            isHighlighted: true,
            diffStatus: 'comparing',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'updated',
      },
      diffResults: [
        { id: 'diff-1', action: 'update-props', nodePath: 'root', isActive: false },
        { id: 'diff-2', action: 'none', nodePath: 'root.children[0]', isActive: true },
      ],
      currentComparison: 'root.children',
      domOperations: [
        {
          id: 'op-1',
          type: 'updateAttribute',
          target: 'div',
          details: 'className updated',
          isExecuted: false,
          isHighlighted: false,
        },
      ],
      listReconciliation: null,
      phase: 'compare-children',
      comparisonSteps: [
        {
          id: 'step-1',
          oldNodeId: 'old-root',
          newNodeId: 'new-root',
          result: 'update-props',
          description: 'className changed',
          isActive: false,
        },
        {
          id: 'step-2',
          oldNodeId: 'old-h1',
          newNodeId: 'new-h1',
          result: 'none',
          description: '<h1> unchanged - skip!',
          isActive: true,
        },
        {
          id: 'step-3',
          oldNodeId: 'old-ul',
          newNodeId: 'new-ul',
          result: 'none',
          description: '<ul> same type, checking children...',
          isActive: true,
        },
      ],
      output: [
        { id: 'msg-1', type: 'compare', message: 'Comparing children of <div>' },
        { id: 'msg-2', type: 'diff', message: '<h1>Welcome</h1> - no changes, skipping' },
        { id: 'msg-3', type: 'compare', message: '<ul> - same type, checking list items...' },
      ],
      activePanel: 'trees',
      showConnections: true,
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'Rule 2: Keys Enable Efficient List Diffing',
    explanation: `This is where keys become ESSENTIAL. React uses keys to match elements between old and new lists:

Old list: [a: Apple, b: Banana, c: Cherry]
New list: [c: Cherry, a: Apple, b: Banana, d: Date]

React creates a map of old items by key:
{ a: <li>Apple</li>, b: <li>Banana</li>, c: <li>Cherry</li> }

Then for each new item:
• key="c": Found in old! Just MOVE it (no recreation)
• key="a": Found in old! Just MOVE it
• key="b": Found in old! Just MOVE it
• key="d": NOT found! CREATE new item

Without keys, React would:
• See Apple → Cherry: Different! Recreate
• See Banana → Apple: Different! Recreate
• See Cherry → Banana: Different! Recreate
• See nothing → Date: Create

That's 4 DOM operations vs just 1 insert + 3 moves!

This is why you should NEVER use array index as key when items can reorder. With index keys:
• key="0": Apple → Cherry (would update content)
• key="1": Banana → Apple (would update content)
• key="2": Cherry → Banana (would update content)
• key="3": NEW → Date (create)

Every item appears "changed" even though they just moved!`,
    highlightedLines: [5, 6, 7, 16, 17, 18, 19],
    state: {
      oldTree: {
        id: 'old-root',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'old-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'old-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'old-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: true,
                diffStatus: 'reordered',
              },
              {
                id: 'old-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: true,
                diffStatus: 'reordered',
              },
              {
                id: 'old-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: true,
                diffStatus: 'reordered',
              },
            ],
            key: null,
            isHighlighted: true,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'updated',
      },
      newTree: {
        id: 'new-root',
        type: 'div',
        props: { className: 'container active' },
        children: [
          {
            id: 'new-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'new-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'new-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: true,
                diffStatus: 'reordered',
              },
              {
                id: 'new-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: true,
                diffStatus: 'reordered',
              },
              {
                id: 'new-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: true,
                diffStatus: 'reordered',
              },
              {
                id: 'new-d',
                type: 'li',
                props: { key: 'd' },
                children: [],
                key: 'd',
                isHighlighted: true,
                diffStatus: 'added',
              },
            ],
            key: null,
            isHighlighted: true,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'updated',
      },
      diffResults: [],
      currentComparison: 'ul.children',
      domOperations: [
        {
          id: 'op-1',
          type: 'updateAttribute',
          target: 'div',
          details: 'className updated',
          isExecuted: false,
          isHighlighted: false,
        },
      ],
      listReconciliation: {
        oldKeys: ['a', 'b', 'c'],
        newKeys: ['c', 'a', 'b', 'd'],
        matches: [
          { key: 'c', oldIndex: 2, newIndex: 0, status: 'moved' },
          { key: 'a', oldIndex: 0, newIndex: 1, status: 'moved' },
          { key: 'b', oldIndex: 1, newIndex: 2, status: 'moved' },
          { key: 'd', oldIndex: -1, newIndex: 3, status: 'new' },
        ],
        operations: [
          'Move c to index 0',
          'Move a to index 1',
          'Move b to index 2',
          'Insert d at index 3',
        ],
      },
      phase: 'key-matching',
      comparisonSteps: [],
      output: [
        { id: 'msg-1', type: 'key', message: 'Key matching: a, b, c → c, a, b, d' },
        { id: 'msg-2', type: 'key', message: 'Matched: c(move), a(move), b(move)' },
        { id: 'msg-3', type: 'key', message: 'New key: d (will be created)' },
      ],
      activePanel: 'keys',
      showConnections: true,
    },
    duration: 5500,
  },
  {
    id: 'step-7',
    title: 'Generating DOM Operations',
    explanation: `React has completed the diff! Now it generates the minimal set of DOM operations:

1. updateAttribute(div, className, "container active")
   → Updates the class on the container

2. insertBefore(ul, li[d], null)
   → Creates new <li>Date</li> and appends to list

3. Reorder operations for existing items
   → React uses insertBefore to move DOM nodes

IMPORTANT: React doesn't recreate elements that moved - it MOVES them! The actual DOM nodes for Apple, Banana, and Cherry are the same objects. Their internal state (like input values, scroll position) is preserved.

This is the magic of keys: they let React understand that items are the SAME even when their position changes.

Total DOM operations: ~4 (1 attribute update, 1 create, 2-3 moves)
Without keys: Would be 7+ (4 updates + creates)

Let's execute these operations and see the final result...`,
    highlightedLines: [],
    state: {
      oldTree: {
        id: 'old-root',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'old-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'old-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'old-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'reordered',
              },
              {
                id: 'old-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'reordered',
              },
              {
                id: 'old-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'reordered',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'updated',
      },
      newTree: {
        id: 'new-root',
        type: 'div',
        props: { className: 'container active' },
        children: [
          {
            id: 'new-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'new-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'new-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'reordered',
              },
              {
                id: 'new-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'reordered',
              },
              {
                id: 'new-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'reordered',
              },
              {
                id: 'new-d',
                type: 'li',
                props: { key: 'd' },
                children: [],
                key: 'd',
                isHighlighted: false,
                diffStatus: 'added',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: false,
        diffStatus: 'updated',
      },
      diffResults: [
        { id: 'diff-1', action: 'update-props', nodePath: 'div', isActive: false },
        { id: 'diff-2', action: 'reorder', nodePath: 'ul.children', isActive: false },
        { id: 'diff-3', action: 'insert', nodePath: 'ul.children[3]', isActive: false },
      ],
      currentComparison: null,
      domOperations: [
        {
          id: 'op-1',
          type: 'updateAttribute',
          target: 'div',
          details: 'className → "container active"',
          isExecuted: false,
          isHighlighted: true,
        },
        {
          id: 'op-2',
          type: 'insertChild',
          target: 'ul',
          details: 'Create and insert <li key="d">Date</li>',
          isExecuted: false,
          isHighlighted: true,
        },
        {
          id: 'op-3',
          type: 'insertChild',
          target: 'ul',
          details: 'Move <li key="c"> to position 0',
          isExecuted: false,
          isHighlighted: true,
        },
        {
          id: 'op-4',
          type: 'insertChild',
          target: 'ul',
          details: 'Move <li key="a"> to position 1',
          isExecuted: false,
          isHighlighted: true,
        },
      ],
      listReconciliation: {
        oldKeys: ['a', 'b', 'c'],
        newKeys: ['c', 'a', 'b', 'd'],
        matches: [
          { key: 'c', oldIndex: 2, newIndex: 0, status: 'moved' },
          { key: 'a', oldIndex: 0, newIndex: 1, status: 'moved' },
          { key: 'b', oldIndex: 1, newIndex: 2, status: 'matched' },
          { key: 'd', oldIndex: -1, newIndex: 3, status: 'new' },
        ],
        operations: [],
      },
      phase: 'generate-ops',
      comparisonSteps: [],
      output: [
        { id: 'msg-1', type: 'dom', message: 'Generated 4 DOM operations' },
        { id: 'msg-2', type: 'info', message: 'Existing DOM nodes will be MOVED, not recreated' },
        { id: 'msg-3', type: 'info', message: 'Internal state (focus, scroll) preserved!' },
      ],
      activePanel: 'operations',
      showConnections: true,
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'Commit Phase - Applying Changes',
    explanation: `React now applies all the DOM operations in the commit phase:

Step 1: div.className = "container active"
✓ Container now has the "active" class

Step 2: Create new <li>Date</li>
✓ New DOM node created

Step 3: Move <li>Cherry</li> to first position
✓ DOM node MOVED (not recreated!)

Step 4: Move <li>Apple</li> to second position
✓ DOM node MOVED

Step 5: Insert <li>Date</li> at end
✓ New node inserted

The result is exactly what we wanted with MINIMAL DOM manipulation:
• 1 attribute update
• 1 element created
• 2-3 moves via insertBefore

The commit phase is SYNCHRONOUS - once it starts, it runs to completion. This ensures the DOM is never in an inconsistent state.

After commit, effects run (if any). Our reconciliation is complete!`,
    highlightedLines: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    state: {
      oldTree: null,
      newTree: {
        id: 'new-root',
        type: 'div',
        props: { className: 'container active' },
        children: [
          {
            id: 'new-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
          {
            id: 'new-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'new-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-d',
                type: 'li',
                props: { key: 'd' },
                children: [],
                key: 'd',
                isHighlighted: false,
                diffStatus: 'unchanged',
              },
            ],
            key: null,
            isHighlighted: false,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: true,
        diffStatus: 'unchanged',
      },
      diffResults: [],
      currentComparison: null,
      domOperations: [
        {
          id: 'op-1',
          type: 'updateAttribute',
          target: 'div',
          details: 'className → "container active"',
          isExecuted: true,
          isHighlighted: false,
        },
        {
          id: 'op-2',
          type: 'insertChild',
          target: 'ul',
          details: 'Create <li key="d">Date</li>',
          isExecuted: true,
          isHighlighted: false,
        },
        {
          id: 'op-3',
          type: 'insertChild',
          target: 'ul',
          details: 'Move <li key="c"> to position 0',
          isExecuted: true,
          isHighlighted: false,
        },
        {
          id: 'op-4',
          type: 'insertChild',
          target: 'ul',
          details: 'Move <li key="a"> to position 1',
          isExecuted: true,
          isHighlighted: false,
        },
      ],
      listReconciliation: null,
      phase: 'complete',
      comparisonSteps: [],
      output: [
        { id: 'msg-1', type: 'dom', message: '✓ All DOM operations executed' },
        { id: 'msg-2', type: 'info', message: 'DOM is now in sync with Virtual DOM' },
        { id: 'msg-3', type: 'info', message: 'Reconciliation complete!' },
      ],
      activePanel: 'trees',
      showConnections: false,
    },
    duration: 5000,
  },
  {
    id: 'step-9',
    title: 'Reconciliation - Key Takeaways',
    explanation: `Congratulations! You now understand React's reconciliation algorithm. Let's summarize:

THE DIFFING ALGORITHM:
1. Compare element types first
2. Same type → Update props, recurse into children
3. Different type → Destroy old, create new

KEY-BASED RECONCILIATION:
• Keys provide stable identity across renders
• Enable efficient list reordering
• Preserve DOM node state (focus, scroll, etc.)
• NEVER use array index as key for dynamic lists!

OPTIMIZATIONS:
• Unchanged elements are skipped entirely
• Props are compared shallowly
• DOM nodes are reused when types match
• Minimal operations computed before commit

WHY THIS MATTERS:
• Makes React fast even with large trees
• Enables declarative UI programming
• You describe WHAT you want, React figures out HOW

BEST PRACTICES:
• Use stable, unique keys for lists
• Keep component structure consistent
• Avoid changing element types unnecessarily
• Co-locate state to minimize re-renders

Understanding reconciliation helps you write performant React apps!`,
    highlightedLines: [],
    state: {
      oldTree: {
        id: 'old-root',
        type: 'div',
        props: { className: 'container' },
        children: [
          {
            id: 'old-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: true,
            diffStatus: 'unchanged',
          },
          {
            id: 'old-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'old-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: true,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: true,
                diffStatus: 'unchanged',
              },
              {
                id: 'old-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: true,
                diffStatus: 'unchanged',
              },
            ],
            key: null,
            isHighlighted: true,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: true,
        diffStatus: 'unchanged',
      },
      newTree: {
        id: 'new-root',
        type: 'div',
        props: { className: 'container active' },
        children: [
          {
            id: 'new-h1',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            isHighlighted: true,
            diffStatus: 'unchanged',
          },
          {
            id: 'new-ul',
            type: 'ul',
            props: {},
            children: [
              {
                id: 'new-c',
                type: 'li',
                props: { key: 'c' },
                children: [],
                key: 'c',
                isHighlighted: true,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-a',
                type: 'li',
                props: { key: 'a' },
                children: [],
                key: 'a',
                isHighlighted: true,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-b',
                type: 'li',
                props: { key: 'b' },
                children: [],
                key: 'b',
                isHighlighted: true,
                diffStatus: 'unchanged',
              },
              {
                id: 'new-d',
                type: 'li',
                props: { key: 'd' },
                children: [],
                key: 'd',
                isHighlighted: true,
                diffStatus: 'unchanged',
              },
            ],
            key: null,
            isHighlighted: true,
            diffStatus: 'unchanged',
          },
        ],
        key: null,
        isHighlighted: true,
        diffStatus: 'unchanged',
      },
      diffResults: [],
      currentComparison: null,
      domOperations: [],
      listReconciliation: null,
      phase: 'complete',
      comparisonSteps: [],
      output: [
        {
          id: 'msg-1',
          type: 'info',
          message: 'Reconciliation: Old VDOM → New VDOM → Minimal DOM ops',
        },
        {
          id: 'msg-2',
          type: 'info',
          message: 'Next: React Fiber - enabling concurrent rendering!',
        },
      ],
      activePanel: 'trees',
      showConnections: true,
    },
    duration: 6000,
  },
];

export const reconciliationKeyTakeaways = [
  'Reconciliation computes minimal DOM changes by diffing Virtual DOM trees',
  'Same element type → Update props and recurse; Different type → Replace entirely',
  'Keys provide stable identity for list items across renders',
  'NEVER use array index as key when list order can change',
  'Unchanged subtrees are skipped entirely for efficiency',
  'DOM nodes are reused when types match (preserves internal state)',
  'Commit phase applies all changes synchronously',
  'Understanding reconciliation helps you write performant React apps',
];
