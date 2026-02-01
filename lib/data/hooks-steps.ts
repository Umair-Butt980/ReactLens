/**
 * Step-by-step data for React Hooks visualization
 *
 * This visualization demonstrates how hooks work internally in React,
 * including the hooks linked list, fiber nodes, the rules of hooks,
 * and how effects are scheduled and executed.
 */

import type { HooksStep } from '@/lib/types';

export const hooksCode = `function Counter() {
  // Hook #0: useState
  const [count, setCount] = useState(0);
  
  // Hook #1: useState  
  const [name, setName] = useState('React');
  
  // Hook #2: useRef
  const renderCount = useRef(0);
  renderCount.current++;
  
  // Hook #3: useEffect
  useEffect(() => {
    document.title = \`Count: \${count}\`;
    
    return () => {
      document.title = 'React App';
    };
  }, [count]);
  
  // Hook #4: useMemo
  const expensiveValue = useMemo(() => {
    return count * 1000;
  }, [count]);
  
  // Hook #5: useCallback
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <h1>{name}: {count}</h1>
      <p>Renders: {renderCount.current}</p>
      <p>Computed: {expensiveValue}</p>
      <button onClick={handleClick}>
        Increment
      </button>
    </div>
  );
}`;

export const hooksSteps: HooksStep[] = [
  {
    id: 'step-1',
    title: 'The Rules of Hooks - Why Order Matters',
    explanation: `Before diving into how hooks work, you need to understand THE RULES. These aren't arbitrary - they're fundamental to how React tracks hook state.

Rule 1: Only call hooks at the TOP LEVEL
• Not inside loops, conditions, or nested functions
• Must be called in the same order every render

Rule 2: Only call hooks from React FUNCTIONS
• Function components or custom hooks
• Not regular JavaScript functions

WHY does order matter? React doesn't use hook names to identify them - it uses their POSITION (index) in the call order. Each time your component renders, React expects hooks to be called in the EXACT same order.

Imagine React keeps a list: [hook0, hook1, hook2, hook3...]
On render 1: useState → useState → useRef → useEffect
On render 2: If you skip one, ALL subsequent hooks get the WRONG data!

This is why conditional hooks are forbidden:
if (condition) { useState() } // DANGER! Changes hook order

React stores hook data in a "fiber node" - let's see how this works internally.`,
    highlightedLines: [1, 2, 3],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [],
        updateQueue: [],
        renderCount: 0,
        isRendering: false,
        isHighlighted: true,
      },
      hookCalls: [],
      currentHookIndex: -1,
      renderPhase: 'idle',
      effectTimeline: [],
      violations: [],
      output: [
        {
          id: 'msg-1',
          type: 'info',
          message: 'Hooks must be called in the SAME ORDER every render',
        },
        { id: 'msg-2', type: 'warning', message: 'React uses POSITION, not names, to track hooks' },
        { id: 'msg-3', type: 'info', message: 'This is why conditional hooks are forbidden!' },
      ],
      activePanel: 'fiber',
      showDepsComparison: false,
    },
    duration: 5500,
  },
  {
    id: 'step-2',
    title: 'Component Renders - Hooks Begin Execution',
    explanation: `When React renders your component, it calls your function. As each hook is encountered, React does two things:

FIRST RENDER (mount):
• Creates a new "hook object" to store the hook's state
• Adds it to the fiber node's memoizedState (a linked list)
• Returns the initial value

SUBSEQUENT RENDERS (update):
• Reads the existing hook object at the current index
• Returns the stored value (or recalculates if needed)
• Moves to the next index

The fiber node is React's internal representation of your component. It stores:
• memoizedState: The linked list of hook data
• updateQueue: Pending state updates and effects
• Other metadata for rendering

Think of hooks as slots in an array. Each time you call a hook, React says "give me data from slot N" and increments N. If you call hooks in a different order, you get the wrong slot's data!

Watch as we call each hook in order...`,
    highlightedLines: [1, 2],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [],
        updateQueue: [],
        renderCount: 1,
        isRendering: true,
        isHighlighted: true,
      },
      hookCalls: [],
      currentHookIndex: -1,
      renderPhase: 'render-start',
      effectTimeline: [],
      violations: [],
      output: [
        { id: 'msg-1', type: 'info', message: 'Counter() called - render #1 starting' },
        { id: 'msg-2', type: 'info', message: 'Fiber node created to store hook data' },
        { id: 'msg-3', type: 'hook', message: 'Hook index initialized to 0' },
      ],
      activePanel: 'fiber',
      showDepsComparison: false,
    },
    duration: 4500,
  },
  {
    id: 'step-3',
    title: 'useState - Creating Reactive State',
    explanation: `useState is the most fundamental hook. Let's see what happens when we call useState(0):

INTERNALLY, React creates a hook object:
{
  memoizedState: 0,          // The current value
  baseState: 0,              // Base for updates
  queue: { pending: null },  // Queued updates
  next: null                 // Link to next hook
}

The function returns [state, setState] where:
• state: The current value (0 on first render)
• setState: A function that queues an update

When you call setCount(1):
1. React adds the update to the queue
2. Schedules a re-render
3. On next render, processes the queue to get new state

IMPORTANT: setState doesn't immediately change the value! It schedules an update. This is why:
console.log(count);  // 0
setCount(1);
console.log(count);  // Still 0! Update is queued.

The new value is available on the NEXT render. This asynchronous behavior enables React to batch updates for performance.`,
    highlightedLines: [3],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [
          {
            id: 'hook-0',
            type: 'useState',
            name: 'count',
            index: 0,
            value: '0',
            setter: 'setCount',
            isHighlighted: true,
            isExecuting: true,
            isStale: false,
          },
        ],
        updateQueue: [],
        renderCount: 1,
        isRendering: true,
        isHighlighted: false,
      },
      hookCalls: [
        {
          id: 'call-0',
          index: 0,
          type: 'useState',
          name: 'count',
          isCurrentCall: true,
          isComplete: false,
          result: '[0, setCount]',
        },
      ],
      currentHookIndex: 0,
      renderPhase: 'hooks-executing',
      effectTimeline: [],
      violations: [],
      output: [
        { id: 'msg-1', type: 'hook', message: 'Hook #0: useState(0)' },
        { id: 'msg-2', type: 'info', message: 'Created: { memoizedState: 0, queue: {...} }' },
        { id: 'msg-3', type: 'hook', message: 'Returns: [0, setCount]' },
      ],
      activePanel: 'hooks',
      showDepsComparison: false,
    },
    duration: 5000,
  },
  {
    id: 'step-4',
    title: 'Second useState - Building the List',
    explanation: `Now we call the second useState. React increments the hook index and creates another hook object:

Hook #0: count = 0     ← Already exists
Hook #1: name = 'React' ← Creating now

Each hook is linked to the next, forming a linked list in the fiber's memoizedState:

hook0 (count) → hook1 (name) → null

This linked list structure is why hooks must be called in order. React traverses this list during each render, matching each hook call to its stored data by POSITION.

Why a linked list instead of an array? 
1. Efficient insertion/deletion
2. Memory can grow dynamically
3. Matches React's incremental processing model

Notice how each useState is independent - they don't know about each other. You can have as many useState calls as you need, as long as the ORDER stays consistent.

Multiple useState calls are common:
• Separate concerns (count vs name vs isLoading)
• Only changed values trigger re-computation
• Clearer code than one big state object`,
    highlightedLines: [5, 6],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [
          {
            id: 'hook-0',
            type: 'useState',
            name: 'count',
            index: 0,
            value: '0',
            setter: 'setCount',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-1',
            type: 'useState',
            name: 'name',
            index: 1,
            value: '"React"',
            setter: 'setName',
            isHighlighted: true,
            isExecuting: true,
            isStale: false,
          },
        ],
        updateQueue: [],
        renderCount: 1,
        isRendering: true,
        isHighlighted: false,
      },
      hookCalls: [
        {
          id: 'call-0',
          index: 0,
          type: 'useState',
          name: 'count',
          isCurrentCall: false,
          isComplete: true,
          result: '[0, setCount]',
        },
        {
          id: 'call-1',
          index: 1,
          type: 'useState',
          name: 'name',
          isCurrentCall: true,
          isComplete: false,
          result: '["React", setName]',
        },
      ],
      currentHookIndex: 1,
      renderPhase: 'hooks-executing',
      effectTimeline: [],
      violations: [],
      output: [
        { id: 'msg-1', type: 'hook', message: 'Hook #1: useState("React")' },
        { id: 'msg-2', type: 'info', message: 'Linked: hook0 → hook1 → null' },
        { id: 'msg-3', type: 'hook', message: 'Returns: ["React", setName]' },
      ],
      activePanel: 'hooks',
      showDepsComparison: false,
    },
    duration: 4500,
  },
  {
    id: 'step-5',
    title: 'useRef - Mutable Container Without Re-renders',
    explanation: `useRef creates a mutable container that persists across renders but DOESN'T trigger re-renders when changed. This is fundamentally different from useState!

useRef returns: { current: initialValue }

Key differences from useState:
• Changes to ref.current do NOT cause re-render
• The same object reference persists across renders
• Updates are synchronous (immediate, not batched)

Common use cases:
1. Storing DOM references: const inputRef = useRef(null); <input ref={inputRef} />
2. Storing mutable values: renderCount, previous values, timers
3. Storing instance-like data that shouldn't trigger updates

In our example, renderCount.current++ increments on every render, but this doesn't cause another render (which would cause an infinite loop!).

Think of useRef as an "escape hatch" from React's reactive model. Sometimes you need mutable data that React doesn't track.

WARNING: Don't read/write ref.current DURING render for values that affect output - that breaks React's model. useRef is for side-effecty stuff or DOM access.`,
    highlightedLines: [8, 9, 10],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [
          {
            id: 'hook-0',
            type: 'useState',
            name: 'count',
            index: 0,
            value: '0',
            setter: 'setCount',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-1',
            type: 'useState',
            name: 'name',
            index: 1,
            value: '"React"',
            setter: 'setName',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-2',
            type: 'useRef',
            name: 'renderCount',
            index: 2,
            value: '{ current: 1 }',
            current: '1',
            isHighlighted: true,
            isExecuting: true,
            isStale: false,
          },
        ],
        updateQueue: [],
        renderCount: 1,
        isRendering: true,
        isHighlighted: false,
      },
      hookCalls: [
        {
          id: 'call-0',
          index: 0,
          type: 'useState',
          name: 'count',
          isCurrentCall: false,
          isComplete: true,
          result: '[0, setCount]',
        },
        {
          id: 'call-1',
          index: 1,
          type: 'useState',
          name: 'name',
          isCurrentCall: false,
          isComplete: true,
          result: '["React", setName]',
        },
        {
          id: 'call-2',
          index: 2,
          type: 'useRef',
          name: 'renderCount',
          isCurrentCall: true,
          isComplete: false,
          result: '{ current: 1 }',
        },
      ],
      currentHookIndex: 2,
      renderPhase: 'hooks-executing',
      effectTimeline: [],
      violations: [],
      output: [
        { id: 'msg-1', type: 'hook', message: 'Hook #2: useRef(0)' },
        { id: 'msg-2', type: 'info', message: 'Returns: { current: 0 }' },
        { id: 'msg-3', type: 'info', message: 'renderCount.current++ → now 1 (no re-render!)' },
      ],
      activePanel: 'hooks',
      showDepsComparison: false,
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'useEffect - Scheduling Side Effects',
    explanation: `useEffect is where React connects to the outside world - DOM manipulation, API calls, subscriptions, timers. But it has a specific lifecycle you must understand!

useEffect(() => {
  // Effect: runs AFTER render commits to DOM
  return () => {
    // Cleanup: runs BEFORE next effect or unmount
  };
}, [dependencies]);

The lifecycle:
1. Component renders → JSX returned
2. React commits to DOM (screen updates)
3. THEN useEffect runs (asynchronously)
4. On re-render: cleanup runs first, then new effect

The dependency array controls WHEN the effect runs:
• [] - Only on mount (and cleanup on unmount)
• [count] - On mount AND when count changes
• No array - On EVERY render (usually a mistake)

React compares dependencies using Object.is() (similar to ===). If ANY dependency changed, the effect re-runs.

In our example: [count] means the effect runs when count changes. The cleanup function resets the title before the new effect sets it again.

IMPORTANT: Effects run AFTER paint, so users see the initial render first. For DOM measurements that must happen before paint, use useLayoutEffect.`,
    highlightedLines: [12, 13, 14, 15, 16, 17, 18, 19],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [
          {
            id: 'hook-0',
            type: 'useState',
            name: 'count',
            index: 0,
            value: '0',
            setter: 'setCount',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-1',
            type: 'useState',
            name: 'name',
            index: 1,
            value: '"React"',
            setter: 'setName',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-2',
            type: 'useRef',
            name: 'renderCount',
            index: 2,
            value: '{ current: 1 }',
            current: '1',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-3',
            type: 'useEffect',
            name: 'titleEffect',
            index: 3,
            value: 'effect fn',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: true }],
            cleanup: 'cleanup fn',
            effectPhase: 'pending',
            isHighlighted: true,
            isExecuting: true,
            isStale: false,
          },
        ],
        updateQueue: [
          {
            id: 'effect-0',
            hookIndex: 3,
            phase: 'pending',
            hasCleanup: true,
            dependencies: ['count'],
            tag: 'passive',
          },
        ],
        renderCount: 1,
        isRendering: true,
        isHighlighted: false,
      },
      hookCalls: [
        {
          id: 'call-0',
          index: 0,
          type: 'useState',
          name: 'count',
          isCurrentCall: false,
          isComplete: true,
          result: '[0, setCount]',
        },
        {
          id: 'call-1',
          index: 1,
          type: 'useState',
          name: 'name',
          isCurrentCall: false,
          isComplete: true,
          result: '["React", setName]',
        },
        {
          id: 'call-2',
          index: 2,
          type: 'useRef',
          name: 'renderCount',
          isCurrentCall: false,
          isComplete: true,
          result: '{ current: 1 }',
        },
        {
          id: 'call-3',
          index: 3,
          type: 'useEffect',
          name: 'titleEffect',
          isCurrentCall: true,
          isComplete: false,
          result: 'scheduled',
        },
      ],
      currentHookIndex: 3,
      renderPhase: 'hooks-executing',
      effectTimeline: [
        {
          id: 'timeline-0',
          hookIndex: 3,
          hookName: 'titleEffect',
          phase: 'pending',
          timestamp: Date.now(),
          dependencies: ['count'],
          isActive: true,
        },
      ],
      violations: [],
      output: [
        { id: 'msg-1', type: 'hook', message: 'Hook #3: useEffect(fn, [count])' },
        { id: 'msg-2', type: 'effect', message: 'Effect SCHEDULED (runs after commit)' },
        { id: 'msg-3', type: 'info', message: 'Dependencies: [count=0]' },
      ],
      activePanel: 'effects',
      showDepsComparison: true,
    },
    duration: 5500,
  },
  {
    id: 'step-7',
    title: 'useMemo - Caching Expensive Calculations',
    explanation: `useMemo caches ("memoizes") the RESULT of a calculation, only recomputing when dependencies change.

const memoized = useMemo(() => expensiveCalculation(a, b), [a, b]);

How it works:
1. First render: Runs the function, stores the result
2. Re-renders: Compares dependencies with Object.is()
   - Dependencies SAME → Return cached result (skip calculation)
   - Dependencies CHANGED → Run function, cache new result

When to use useMemo:
• Expensive calculations (sorting large arrays, complex math)
• Creating objects/arrays passed to memoized children
• Preventing recreating objects that would cause child re-renders

When NOT to use useMemo:
• Simple calculations (it has overhead too!)
• Values that change every render anyway
• Premature optimization (measure first!)

In our example: count * 1000 is trivial, but imagine sorting 10,000 items. Without useMemo, that sorts on EVERY render. With useMemo and [count], it only re-sorts when count changes.

Remember: useMemo is a PERFORMANCE optimization, not a semantic guarantee. React may "forget" cached values under memory pressure.`,
    highlightedLines: [21, 22, 23, 24],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [
          {
            id: 'hook-0',
            type: 'useState',
            name: 'count',
            index: 0,
            value: '0',
            setter: 'setCount',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-1',
            type: 'useState',
            name: 'name',
            index: 1,
            value: '"React"',
            setter: 'setName',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-2',
            type: 'useRef',
            name: 'renderCount',
            index: 2,
            value: '{ current: 1 }',
            current: '1',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-3',
            type: 'useEffect',
            name: 'titleEffect',
            index: 3,
            value: 'effect fn',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: false }],
            cleanup: 'cleanup fn',
            effectPhase: 'pending',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-4',
            type: 'useMemo',
            name: 'expensiveValue',
            index: 4,
            value: '0',
            memoizedValue: '0',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: true }],
            isCached: false,
            isHighlighted: true,
            isExecuting: true,
            isStale: false,
          },
        ],
        updateQueue: [
          {
            id: 'effect-0',
            hookIndex: 3,
            phase: 'pending',
            hasCleanup: true,
            dependencies: ['count'],
            tag: 'passive',
          },
        ],
        renderCount: 1,
        isRendering: true,
        isHighlighted: false,
      },
      hookCalls: [
        {
          id: 'call-0',
          index: 0,
          type: 'useState',
          name: 'count',
          isCurrentCall: false,
          isComplete: true,
          result: '[0, setCount]',
        },
        {
          id: 'call-1',
          index: 1,
          type: 'useState',
          name: 'name',
          isCurrentCall: false,
          isComplete: true,
          result: '["React", setName]',
        },
        {
          id: 'call-2',
          index: 2,
          type: 'useRef',
          name: 'renderCount',
          isCurrentCall: false,
          isComplete: true,
          result: '{ current: 1 }',
        },
        {
          id: 'call-3',
          index: 3,
          type: 'useEffect',
          name: 'titleEffect',
          isCurrentCall: false,
          isComplete: true,
          result: 'scheduled',
        },
        {
          id: 'call-4',
          index: 4,
          type: 'useMemo',
          name: 'expensiveValue',
          isCurrentCall: true,
          isComplete: false,
          result: '0',
        },
      ],
      currentHookIndex: 4,
      renderPhase: 'hooks-executing',
      effectTimeline: [
        {
          id: 'timeline-0',
          hookIndex: 3,
          hookName: 'titleEffect',
          phase: 'pending',
          timestamp: Date.now(),
          dependencies: ['count'],
          isActive: false,
        },
      ],
      violations: [],
      output: [
        { id: 'msg-1', type: 'hook', message: 'Hook #4: useMemo(fn, [count])' },
        { id: 'msg-2', type: 'info', message: 'First render: Computing value...' },
        { id: 'msg-3', type: 'hook', message: 'Cached: 0 * 1000 = 0' },
      ],
      activePanel: 'hooks',
      showDepsComparison: true,
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'useCallback - Caching Functions',
    explanation: `useCallback is useMemo for FUNCTIONS. It returns a memoized callback that only changes when dependencies change.

const memoizedFn = useCallback(() => { doSomething(a) }, [a]);

This is equivalent to:
const memoizedFn = useMemo(() => () => { doSomething(a) }, [a]);

Why cache functions? Because in JavaScript, functions are recreated on every render:

// Every render creates a NEW function object
const handleClick = () => setCount(c => c + 1);

This matters when:
1. Passing callbacks to memoized children (React.memo)
   - New function = new prop = child re-renders
2. Callbacks in useEffect dependencies
   - New function = dependencies changed = effect re-runs

In our example, handleClick has [] dependencies (empty array), so it's the SAME function reference across all renders. This is safe because setCount is stable (React guarantees it).

Common mistake: Missing dependencies!
// Bug: stale closure captures initial count
const badCallback = useCallback(() => {
  console.log(count); // Always logs initial value!
}, []); // Should be [count]

The dependency array must include everything used inside that changes between renders.`,
    highlightedLines: [26, 27, 28, 29],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [
          {
            id: 'hook-0',
            type: 'useState',
            name: 'count',
            index: 0,
            value: '0',
            setter: 'setCount',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-1',
            type: 'useState',
            name: 'name',
            index: 1,
            value: '"React"',
            setter: 'setName',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-2',
            type: 'useRef',
            name: 'renderCount',
            index: 2,
            value: '{ current: 1 }',
            current: '1',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-3',
            type: 'useEffect',
            name: 'titleEffect',
            index: 3,
            value: 'effect fn',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: false }],
            cleanup: 'cleanup fn',
            effectPhase: 'pending',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-4',
            type: 'useMemo',
            name: 'expensiveValue',
            index: 4,
            value: '0',
            memoizedValue: '0',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: false }],
            isCached: true,
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-5',
            type: 'useCallback',
            name: 'handleClick',
            index: 5,
            value: '() => setCount(c => c + 1)',
            memoizedValue: 'fn reference',
            dependencies: [],
            isCached: false,
            isHighlighted: true,
            isExecuting: true,
            isStale: false,
          },
        ],
        updateQueue: [
          {
            id: 'effect-0',
            hookIndex: 3,
            phase: 'pending',
            hasCleanup: true,
            dependencies: ['count'],
            tag: 'passive',
          },
        ],
        renderCount: 1,
        isRendering: true,
        isHighlighted: false,
      },
      hookCalls: [
        {
          id: 'call-0',
          index: 0,
          type: 'useState',
          name: 'count',
          isCurrentCall: false,
          isComplete: true,
          result: '[0, setCount]',
        },
        {
          id: 'call-1',
          index: 1,
          type: 'useState',
          name: 'name',
          isCurrentCall: false,
          isComplete: true,
          result: '["React", setName]',
        },
        {
          id: 'call-2',
          index: 2,
          type: 'useRef',
          name: 'renderCount',
          isCurrentCall: false,
          isComplete: true,
          result: '{ current: 1 }',
        },
        {
          id: 'call-3',
          index: 3,
          type: 'useEffect',
          name: 'titleEffect',
          isCurrentCall: false,
          isComplete: true,
          result: 'scheduled',
        },
        {
          id: 'call-4',
          index: 4,
          type: 'useMemo',
          name: 'expensiveValue',
          isCurrentCall: false,
          isComplete: true,
          result: '0',
        },
        {
          id: 'call-5',
          index: 5,
          type: 'useCallback',
          name: 'handleClick',
          isCurrentCall: true,
          isComplete: false,
          result: 'fn',
        },
      ],
      currentHookIndex: 5,
      renderPhase: 'hooks-executing',
      effectTimeline: [],
      violations: [],
      output: [
        { id: 'msg-1', type: 'hook', message: 'Hook #5: useCallback(fn, [])' },
        { id: 'msg-2', type: 'info', message: 'Empty deps: same fn reference every render' },
        { id: 'msg-3', type: 'hook', message: 'Cached: handleClick function' },
      ],
      activePanel: 'hooks',
      showDepsComparison: true,
    },
    duration: 5000,
  },
  {
    id: 'step-9',
    title: 'Render Complete - Effects Execute',
    explanation: `All hooks have been called! React now has a complete picture of your component's output. The render phase is complete.

Current hook list in fiber node:
#0: useState(count) = 0
#1: useState(name) = "React"
#2: useRef(renderCount) = { current: 1 }
#3: useEffect(titleEffect) = PENDING
#4: useMemo(expensiveValue) = 0
#5: useCallback(handleClick) = fn

Now React:
1. Returns the JSX from your component
2. Reconciles with previous output (diffing)
3. Commits changes to the DOM
4. THEN runs effects (after paint)

Effects run in a specific order:
1. All cleanup functions (from previous render)
2. All effect functions (from this render)

This ensures the user sees the UI update FIRST, then effects run. Effects are "passive" - they don't block the browser from painting.

On this initial render, there's no cleanup (first time). The effect will run and set document.title = "Count: 0".

Let's see the effect execute...`,
    highlightedLines: [31, 32, 33, 34, 35, 36, 37, 38],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [
          {
            id: 'hook-0',
            type: 'useState',
            name: 'count',
            index: 0,
            value: '0',
            setter: 'setCount',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-1',
            type: 'useState',
            name: 'name',
            index: 1,
            value: '"React"',
            setter: 'setName',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-2',
            type: 'useRef',
            name: 'renderCount',
            index: 2,
            value: '{ current: 1 }',
            current: '1',
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-3',
            type: 'useEffect',
            name: 'titleEffect',
            index: 3,
            value: 'effect fn',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: false }],
            cleanup: 'cleanup fn',
            effectPhase: 'running',
            isHighlighted: true,
            isExecuting: true,
            isStale: false,
          },
          {
            id: 'hook-4',
            type: 'useMemo',
            name: 'expensiveValue',
            index: 4,
            value: '0',
            memoizedValue: '0',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: false }],
            isCached: true,
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-5',
            type: 'useCallback',
            name: 'handleClick',
            index: 5,
            value: '() => setCount(c => c + 1)',
            memoizedValue: 'fn reference',
            dependencies: [],
            isCached: true,
            isHighlighted: false,
            isExecuting: false,
            isStale: false,
          },
        ],
        updateQueue: [],
        renderCount: 1,
        isRendering: false,
        isHighlighted: false,
      },
      hookCalls: [
        {
          id: 'call-0',
          index: 0,
          type: 'useState',
          name: 'count',
          isCurrentCall: false,
          isComplete: true,
          result: '[0, setCount]',
        },
        {
          id: 'call-1',
          index: 1,
          type: 'useState',
          name: 'name',
          isCurrentCall: false,
          isComplete: true,
          result: '["React", setName]',
        },
        {
          id: 'call-2',
          index: 2,
          type: 'useRef',
          name: 'renderCount',
          isCurrentCall: false,
          isComplete: true,
          result: '{ current: 1 }',
        },
        {
          id: 'call-3',
          index: 3,
          type: 'useEffect',
          name: 'titleEffect',
          isCurrentCall: false,
          isComplete: true,
          result: 'scheduled',
        },
        {
          id: 'call-4',
          index: 4,
          type: 'useMemo',
          name: 'expensiveValue',
          isCurrentCall: false,
          isComplete: true,
          result: '0',
        },
        {
          id: 'call-5',
          index: 5,
          type: 'useCallback',
          name: 'handleClick',
          isCurrentCall: false,
          isComplete: true,
          result: 'fn',
        },
      ],
      currentHookIndex: -1,
      renderPhase: 'effects-running',
      effectTimeline: [
        {
          id: 'timeline-0',
          hookIndex: 3,
          hookName: 'titleEffect',
          phase: 'running',
          timestamp: Date.now(),
          dependencies: ['count'],
          isActive: true,
        },
      ],
      violations: [],
      output: [
        { id: 'msg-1', type: 'info', message: 'Render complete, DOM committed' },
        { id: 'msg-2', type: 'effect', message: 'Running effect #3 (titleEffect)' },
        { id: 'msg-3', type: 'effect', message: 'document.title = "Count: 0"' },
      ],
      activePanel: 'effects',
      showDepsComparison: false,
    },
    duration: 5000,
  },
  {
    id: 'step-10',
    title: 'React Hooks - Key Takeaways',
    explanation: `Excellent! You now understand how React hooks work internally. Let's summarize the key concepts:

THE RULES OF HOOKS:
• Call hooks at the TOP LEVEL only (not in conditions/loops)
• Call hooks from React functions only
• Order must be CONSISTENT across renders

HOW HOOKS ARE STORED:
• Fiber node holds memoizedState (linked list of hooks)
• React uses POSITION (index) to match hooks to their data
• Each hook type has its own internal structure

THE HOOKS WE COVERED:
• useState: Reactive state, setter triggers re-render
• useRef: Mutable container, changes don't re-render
• useEffect: Side effects after render, with cleanup
• useMemo: Cache calculation results
• useCallback: Cache function references

EFFECT LIFECYCLE:
1. Render phase (call hooks, return JSX)
2. Commit phase (update DOM)
3. Effect phase (run effects after paint)
4. Cleanup runs before next effect or unmount

DEPENDENCY ARRAYS:
• [] = run once (mount/unmount)
• [a, b] = run when a or b changes (Object.is comparison)
• missing = run every render (usually a bug)

Understanding these internals helps you write better React code and debug issues when hooks behave unexpectedly!`,
    highlightedLines: [],
    state: {
      fiberNode: {
        id: 'counter-fiber',
        componentName: 'Counter',
        memoizedState: [
          {
            id: 'hook-0',
            type: 'useState',
            name: 'count',
            index: 0,
            value: '0',
            setter: 'setCount',
            isHighlighted: true,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-1',
            type: 'useState',
            name: 'name',
            index: 1,
            value: '"React"',
            setter: 'setName',
            isHighlighted: true,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-2',
            type: 'useRef',
            name: 'renderCount',
            index: 2,
            value: '{ current: 1 }',
            current: '1',
            isHighlighted: true,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-3',
            type: 'useEffect',
            name: 'titleEffect',
            index: 3,
            value: 'effect fn',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: false }],
            cleanup: 'cleanup fn',
            effectPhase: 'complete',
            isHighlighted: true,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-4',
            type: 'useMemo',
            name: 'expensiveValue',
            index: 4,
            value: '0',
            memoizedValue: '0',
            dependencies: [{ id: 'dep-count', name: 'count', value: '0', hasChanged: false }],
            isCached: true,
            isHighlighted: true,
            isExecuting: false,
            isStale: false,
          },
          {
            id: 'hook-5',
            type: 'useCallback',
            name: 'handleClick',
            index: 5,
            value: '() => setCount(c => c + 1)',
            memoizedValue: 'fn reference',
            dependencies: [],
            isCached: true,
            isHighlighted: true,
            isExecuting: false,
            isStale: false,
          },
        ],
        updateQueue: [],
        renderCount: 1,
        isRendering: false,
        isHighlighted: true,
      },
      hookCalls: [],
      currentHookIndex: -1,
      renderPhase: 'complete',
      effectTimeline: [
        {
          id: 'timeline-0',
          hookIndex: 3,
          hookName: 'titleEffect',
          phase: 'complete',
          timestamp: Date.now(),
          dependencies: ['count'],
          isActive: false,
        },
      ],
      violations: [],
      output: [
        { id: 'msg-1', type: 'info', message: 'All 6 hooks executed successfully!' },
        { id: 'msg-2', type: 'info', message: 'Hooks stored in fiber: linked list by position' },
        { id: 'msg-3', type: 'info', message: 'Next: Component Lifecycle & Advanced Patterns!' },
      ],
      activePanel: 'fiber',
      showDepsComparison: false,
    },
    duration: 6000,
  },
];

export const hooksKeyTakeaways = [
  'Hooks must be called at the top level, in the same order every render',
  'React tracks hooks by POSITION (index), not by name',
  'useState creates reactive state; changes trigger re-renders',
  'useRef creates a mutable container that does NOT trigger re-renders',
  'useEffect runs AFTER render/paint; cleanup runs before next effect or unmount',
  'useMemo caches calculation results; useCallback caches function references',
  'Dependency arrays control when effects/memos re-run (Object.is comparison)',
  'Empty [] deps = run once; [a,b] deps = run when a or b changes',
];
