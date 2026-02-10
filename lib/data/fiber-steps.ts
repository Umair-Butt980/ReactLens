/**
 * Step-by-step data for React Fiber visualization
 *
 * This visualization demonstrates React's Fiber architecture,
 * including the fiber tree structure, work loop, time slicing,
 * priority lanes, and concurrent rendering features.
 */

import type { FiberStep } from '@/lib/types';

export const fiberCode = `// React Fiber enables interruptible rendering
function App() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  // High priority: User input
  const handleClick = () => {
    setCount(c => c + 1);  // SyncLane - immediate
  };

  // Low priority: Background update
  const loadItems = () => {
    startTransition(() => {
      setItems(fetchItems());  // TransitionLane - deferrable
    });
  };

  return (
    <div>
      <Header count={count} />
      <button onClick={handleClick}>
        Count: {count}
      </button>
      <ItemList items={items} />
    </div>
  );
}

// Fiber processes work in small units
// Can pause, resume, or abort work
// Prioritizes user interactions`;

export const fiberSteps: FiberStep[] = [
  {
    id: 'step-1',
    title: 'Why React Fiber Was Created',
    explanation: `Before React 16, React used a "Stack Reconciler" that processed updates synchronously. Once it started, it couldn't stop until the entire tree was processed.

The problem? For large trees, this could take 100+ milliseconds, blocking the main thread and making the UI feel janky. Users would click a button and see no response for hundreds of milliseconds!

React Fiber (introduced in React 16) solves this with INTERRUPTIBLE RENDERING:

1. Work is broken into small UNITS (one fiber = one unit)
2. After each unit, React can PAUSE and check for higher priority work
3. If user input comes in, React can INTERRUPT and handle it first
4. Then it can RESUME the original work

This is like a chef who can pause chopping vegetables to answer a customer's question, then continue chopping.

The key insight: NOT ALL UPDATES ARE EQUALLY URGENT
• User typing = URGENT (needs immediate feedback)
• Data fetching = NOT URGENT (can wait a bit)

Fiber enables React to schedule work based on priority, keeping your UI responsive.`,
    highlightedLines: [1, 2, 3, 4],
    state: {
      currentTree: null,
      wipTree: null,
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: false,
        timeRemaining: 16,
        deadline: 0,
        pendingLanes: [],
        currentLane: null,
        phase: 'idle',
        unitsOfWork: 0,
      },
      workUnits: [],
      timeline: [],
      lanes: [
        {
          lane: 'SyncLane',
          label: 'Sync (Urgent)',
          color: '#EF4444',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition',
          color: '#22C55E',
          pendingWork: 0,
          isActive: false,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'info', message: 'Stack Reconciler: Synchronous, blocking' },
        { id: 'msg-2', type: 'info', message: 'Fiber: Interruptible, priority-based' },
      ],
      activePanel: 'lanes',
      showAlternate: false,
      showPointers: false,
    },
    duration: 5500,
  },
  {
    id: 'step-2',
    title: 'The Fiber Node - Unit of Work',
    explanation: `A "Fiber" is a JavaScript object that represents a unit of work. Each component/element in your tree has a corresponding fiber node:

{
  tag: 'FunctionComponent',   // What kind of fiber
  type: App,                   // The component/element
  key: null,                   // For reconciliation
  
  // TREE STRUCTURE (linked list, not array!)
  child: firstChildFiber,      // First child
  sibling: nextSiblingFiber,   // Next sibling
  return: parentFiber,         // Parent (called "return")
  
  // STATE
  memoizedState: {...},        // Hooks live here!
  memoizedProps: {...},        // Current props
  pendingProps: {...},         // New props to process
  
  // EFFECTS
  flags: Placement | Update,   // What DOM work needed
  
  // PRIORITY
  lanes: DefaultLane,          // Priority of this work
}

Why a LINKED LIST instead of parent/children arrays?
• Can easily pause at any node
• Can traverse without recursion (no stack overflow)
• Siblings are traversed one at a time

The tree structure: parent has "child" pointing to FIRST child. That child has "sibling" pointing to next sibling. All children have "return" pointing back to parent.`,
    highlightedLines: [7, 8, 9, 10, 11],
    state: {
      currentTree: {
        id: 'root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: {
            id: 'div',
            tag: 'HostComponent',
            type: 'div',
            key: null,
            child: {
              id: 'header',
              tag: 'FunctionComponent',
              type: 'Header',
              key: null,
              child: null,
              sibling: {
                id: 'button',
                tag: 'HostComponent',
                type: 'button',
                key: null,
                child: null,
                sibling: {
                  id: 'itemlist',
                  tag: 'FunctionComponent',
                  type: 'ItemList',
                  key: null,
                  child: null,
                  sibling: null,
                  return: null,
                  alternate: null,
                  pendingProps: {},
                  memoizedProps: {},
                  memoizedState: null,
                  flags: ['NoFlags'],
                  subtreeFlags: [],
                  lanes: 'DefaultLane',
                  childLanes: [],
                  isHighlighted: false,
                  isProcessing: false,
                  isComplete: false,
                },
                return: null,
                alternate: null,
                pendingProps: {},
                memoizedProps: {},
                memoizedState: null,
                flags: ['NoFlags'],
                subtreeFlags: [],
                lanes: 'DefaultLane',
                childLanes: [],
                isHighlighted: false,
                isProcessing: false,
                isComplete: false,
              },
              return: null,
              alternate: null,
              pendingProps: {},
              memoizedProps: {},
              memoizedState: null,
              flags: ['NoFlags'],
              subtreeFlags: [],
              lanes: 'DefaultLane',
              childLanes: [],
              isHighlighted: false,
              isProcessing: false,
              isComplete: false,
            },
            sibling: null,
            return: null,
            alternate: null,
            pendingProps: {},
            memoizedProps: {},
            memoizedState: null,
            flags: ['NoFlags'],
            subtreeFlags: [],
            lanes: 'DefaultLane',
            childLanes: [],
            isHighlighted: true,
            isProcessing: false,
            isComplete: false,
          },
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: {},
          memoizedProps: {},
          memoizedState: null,
          flags: ['NoFlags'],
          subtreeFlags: [],
          lanes: 'DefaultLane',
          childLanes: [],
          isHighlighted: true,
          isProcessing: false,
          isComplete: false,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'DefaultLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: false,
        isComplete: false,
      },
      wipTree: null,
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: false,
        timeRemaining: 16,
        deadline: 0,
        pendingLanes: [],
        currentLane: null,
        phase: 'idle',
        unitsOfWork: 0,
      },
      workUnits: [],
      timeline: [],
      lanes: [
        { lane: 'SyncLane', label: 'Sync', color: '#EF4444', pendingWork: 0, isActive: false },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition',
          color: '#22C55E',
          pendingWork: 0,
          isActive: false,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'info', message: 'Fiber = Unit of work = One component/element' },
        { id: 'msg-2', type: 'info', message: 'Tree uses child/sibling/return pointers' },
      ],
      activePanel: 'trees',
      showAlternate: false,
      showPointers: true,
    },
    duration: 5500,
  },
  {
    id: 'step-3',
    title: 'Double Buffering - Current vs WIP Trees',
    explanation: `React maintains TWO fiber trees at any time:

1. CURRENT TREE - What's currently on screen
   • Represents the committed state
   • User is seeing this right now

2. WORK-IN-PROGRESS (WIP) TREE - Being built/updated
   • Where new changes are computed
   • Not visible to user yet

Each fiber has an "alternate" pointer to its counterpart in the other tree:
currentFiber.alternate = wipFiber
wipFiber.alternate = currentFiber

This is called DOUBLE BUFFERING (borrowed from graphics programming):
1. Build the new frame in the WIP tree
2. Once complete, SWAP - WIP becomes Current
3. Old Current becomes the new WIP (for next update)

Why double buffering?
• Work can be interrupted without affecting what user sees
• If work is aborted, current tree is unchanged
• Smooth transitions - no half-rendered states
• Reuses fiber objects (memory efficient)

When you call setState, React clones current fiber into WIP, applies changes there, then swaps when done.`,
    highlightedLines: [],
    state: {
      currentTree: {
        id: 'current-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'current-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: null,
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: {},
          memoizedProps: { count: '0' },
          memoizedState: 'count: 0',
          flags: ['NoFlags'],
          subtreeFlags: [],
          lanes: 'DefaultLane',
          childLanes: [],
          isHighlighted: true,
          isProcessing: false,
          isComplete: true,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'DefaultLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: false,
        isComplete: true,
      },
      wipTree: {
        id: 'wip-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'wip-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: null,
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: { count: '1' },
          memoizedProps: {},
          memoizedState: 'count: 1',
          flags: ['Update'],
          subtreeFlags: [],
          lanes: 'SyncLane',
          childLanes: [],
          isHighlighted: true,
          isProcessing: true,
          isComplete: false,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'SyncLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: true,
        isComplete: false,
      },
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: false,
        timeRemaining: 16,
        deadline: 0,
        pendingLanes: ['SyncLane'],
        currentLane: 'SyncLane',
        phase: 'begin-work',
        unitsOfWork: 1,
      },
      workUnits: [],
      timeline: [
        {
          id: 'ev-1',
          type: 'schedule',
          description: 'setState(count + 1) scheduled',
          timestamp: Date.now(),
          isActive: true,
        },
      ],
      lanes: [
        { lane: 'SyncLane', label: 'Sync', color: '#EF4444', pendingWork: 1, isActive: true },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition',
          color: '#22C55E',
          pendingWork: 0,
          isActive: false,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'info', message: 'Current tree: What user sees (count: 0)' },
        { id: 'msg-2', type: 'work', message: 'WIP tree: Being built (count: 1)' },
        { id: 'msg-3', type: 'info', message: 'alternate pointers connect the two' },
      ],
      activePanel: 'trees',
      showAlternate: true,
      showPointers: false,
    },
    duration: 5500,
  },
  {
    id: 'step-4',
    title: 'The Work Loop - Processing Fibers',
    explanation: `The Work Loop is the heart of Fiber. It processes fibers one at a time:

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

Each iteration:
1. performUnitOfWork() processes ONE fiber
2. shouldYield() checks if we should pause
3. If yes, save position and return control to browser

Processing a fiber has two phases:

beginWork (going DOWN):
• Called when entering a fiber
• Reconciles children, creates child fibers
• Returns the next child to process (or null)

completeWork (going UP):
• Called when a fiber has no more children to process
• Creates/updates DOM nodes
• Moves to sibling, or returns to parent

The traversal order: go DOWN via children, go UP and OVER via siblings, go UP via return. This is depth-first traversal using the linked list structure!

After each fiber, React checks: "Do I need to yield?" If yes, it saves workInProgress and returns. Next frame, it resumes from exactly where it left off.`,
    highlightedLines: [24, 25, 26, 27],
    state: {
      currentTree: {
        id: 'current-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'current-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: null,
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: {},
          memoizedProps: {},
          memoizedState: null,
          flags: ['NoFlags'],
          subtreeFlags: [],
          lanes: 'DefaultLane',
          childLanes: [],
          isHighlighted: false,
          isProcessing: false,
          isComplete: true,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'DefaultLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: false,
        isComplete: true,
      },
      wipTree: {
        id: 'wip-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'wip-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: {
            id: 'wip-div',
            tag: 'HostComponent',
            type: 'div',
            key: null,
            child: null,
            sibling: null,
            return: null,
            alternate: null,
            pendingProps: {},
            memoizedProps: {},
            memoizedState: null,
            flags: ['NoFlags'],
            subtreeFlags: [],
            lanes: 'DefaultLane',
            childLanes: [],
            isHighlighted: true,
            isProcessing: true,
            isComplete: false,
          },
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: {},
          memoizedProps: {},
          memoizedState: null,
          flags: ['Update'],
          subtreeFlags: [],
          lanes: 'SyncLane',
          childLanes: [],
          isHighlighted: false,
          isProcessing: false,
          isComplete: true,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'SyncLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: false,
        isComplete: false,
      },
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: false,
        timeRemaining: 12,
        deadline: 16,
        pendingLanes: ['SyncLane'],
        currentLane: 'SyncLane',
        phase: 'begin-work',
        unitsOfWork: 3,
      },
      workUnits: [
        {
          id: 'wu-1',
          fiberId: 'wip-root',
          fiberName: 'Root',
          phase: 'complete',
          isProcessed: true,
          timestamp: Date.now() - 2,
        },
        {
          id: 'wu-2',
          fiberId: 'wip-app',
          fiberName: 'App',
          phase: 'complete',
          isProcessed: true,
          timestamp: Date.now() - 1,
        },
        {
          id: 'wu-3',
          fiberId: 'wip-div',
          fiberName: 'div',
          phase: 'begin',
          isProcessed: false,
          timestamp: Date.now(),
        },
      ],
      timeline: [
        {
          id: 'ev-1',
          type: 'begin',
          fiberId: 'wip-root',
          fiberName: 'Root',
          description: 'beginWork(Root)',
          timestamp: Date.now() - 3,
          isActive: false,
        },
        {
          id: 'ev-2',
          type: 'begin',
          fiberId: 'wip-app',
          fiberName: 'App',
          description: 'beginWork(App)',
          timestamp: Date.now() - 2,
          isActive: false,
        },
        {
          id: 'ev-3',
          type: 'begin',
          fiberId: 'wip-div',
          fiberName: 'div',
          description: 'beginWork(div)',
          timestamp: Date.now(),
          isActive: true,
        },
      ],
      lanes: [
        { lane: 'SyncLane', label: 'Sync', color: '#EF4444', pendingWork: 1, isActive: true },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition',
          color: '#22C55E',
          pendingWork: 0,
          isActive: false,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'work', message: 'beginWork(Root) → beginWork(App) → beginWork(div)' },
        { id: 'msg-2', type: 'info', message: 'Traversing DOWN the tree (children first)' },
        { id: 'msg-3', type: 'info', message: 'Time remaining: 12ms' },
      ],
      activePanel: 'workloop',
      showAlternate: false,
      showPointers: true,
    },
    duration: 5500,
  },
  {
    id: 'step-5',
    title: 'Time Slicing - Yielding to the Browser',
    explanation: `Time slicing is what makes Fiber truly concurrent. React uses requestIdleCallback (or a polyfill) to know when to yield:

shouldYield() checks:
• Has 5ms passed since we started this chunk?
• Is there a higher priority event waiting?
• Is the browser frame budget (16ms) exhausted?

If shouldYield() returns true, React:
1. Saves workInProgress (current fiber)
2. Returns control to browser
3. Browser can handle events, paint, etc.
4. Next idle period, React RESUMES from saved position

This is COOPERATIVE SCHEDULING. React voluntarily gives up the thread, trusting the browser will give it back.

Example timeline:
[0ms]  Start processing fibers
[5ms]  Processed 10 fibers, shouldYield? No
[10ms] Processed 20 fibers, shouldYield? Yes, user moved mouse!
[10ms] Save position, return to browser
[12ms] Browser handles mouse move
[14ms] React resumes from fiber #21

Without time slicing, processing 1000 fibers might take 100ms with NO interruption. With slicing, it takes the same total time, but stays responsive!`,
    highlightedLines: [24, 25, 26, 27],
    state: {
      currentTree: null,
      wipTree: {
        id: 'wip-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'wip-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: null,
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: {},
          memoizedProps: {},
          memoizedState: null,
          flags: ['Update'],
          subtreeFlags: [],
          lanes: 'TransitionLane',
          childLanes: [],
          isHighlighted: true,
          isProcessing: false,
          isComplete: false,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'TransitionLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: false,
        isComplete: false,
      },
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: true,
        timeRemaining: 0,
        deadline: 5,
        pendingLanes: ['TransitionLane'],
        currentLane: 'TransitionLane',
        phase: 'begin-work',
        unitsOfWork: 15,
      },
      workUnits: [],
      timeline: [
        {
          id: 'ev-1',
          type: 'begin',
          description: 'Started processing...',
          timestamp: Date.now() - 10,
          isActive: false,
        },
        {
          id: 'ev-2',
          type: 'yield',
          description: 'shouldYield() → true, pausing',
          timestamp: Date.now() - 5,
          isActive: true,
        },
        {
          id: 'ev-3',
          type: 'resume',
          description: 'Browser handled events, resuming...',
          timestamp: Date.now(),
          isActive: true,
        },
      ],
      lanes: [
        { lane: 'SyncLane', label: 'Sync', color: '#EF4444', pendingWork: 0, isActive: false },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 1,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition',
          color: '#22C55E',
          pendingWork: 1,
          isActive: true,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'yield', message: 'Time budget exhausted (5ms), yielding...' },
        { id: 'msg-2', type: 'info', message: 'Browser: handling mouse input' },
        { id: 'msg-3', type: 'work', message: 'Resuming from saved position' },
      ],
      activePanel: 'timeline',
      showAlternate: false,
      showPointers: false,
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'Priority Lanes - Not All Work is Equal',
    explanation: `Fiber uses LANES to represent priority (like highway lanes). Each update is assigned a lane:

SyncLane (Highest Priority):
• User clicks, keyboard input
• Must respond immediately
• Blocks everything else

InputContinuousLane:
• Mouse move, drag events  
• Very high priority but can batch

DefaultLane:
• Normal setState calls
• Network responses
• Standard priority

TransitionLane:
• startTransition() updates
• Can be interrupted by higher lanes
• Won't block user input

IdleLane (Lowest Priority):
• offscreen rendering
• Suspense fallbacks
• Only when browser is truly idle

Example:
User types while data is loading:
• Typing = SyncLane (must see letters appear)
• Data fetch = TransitionLane (can wait)

React processes SyncLane first, INTERRUPTING the data update if needed. User sees responsive typing, data loads in background.`,
    highlightedLines: [6, 7, 8, 9, 12, 13, 14, 15],
    state: {
      currentTree: null,
      wipTree: null,
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: false,
        timeRemaining: 16,
        deadline: 0,
        pendingLanes: ['SyncLane', 'TransitionLane'],
        currentLane: 'SyncLane',
        phase: 'schedule',
        unitsOfWork: 0,
      },
      workUnits: [],
      timeline: [
        {
          id: 'ev-1',
          type: 'schedule',
          description: 'Click: setCount() → SyncLane',
          timestamp: Date.now() - 2,
          isActive: true,
        },
        {
          id: 'ev-2',
          type: 'schedule',
          description: 'startTransition: setItems() → TransitionLane',
          timestamp: Date.now() - 1,
          isActive: false,
        },
      ],
      lanes: [
        {
          lane: 'SyncLane',
          label: 'Sync (Click)',
          color: '#EF4444',
          pendingWork: 1,
          isActive: true,
        },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition (Data)',
          color: '#22C55E',
          pendingWork: 1,
          isActive: false,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'schedule', message: 'SyncLane: Click handler (urgent)' },
        { id: 'msg-2', type: 'schedule', message: 'TransitionLane: Data update (can wait)' },
        { id: 'msg-3', type: 'info', message: 'Processing SyncLane first!' },
      ],
      activePanel: 'lanes',
      showAlternate: false,
      showPointers: false,
    },
    duration: 5000,
  },
  {
    id: 'step-7',
    title: 'Concurrent Features - startTransition',
    explanation: `React 18 introduced startTransition() to explicitly mark updates as non-urgent:

// Without startTransition
setSearchResults(results);  // Blocks UI during large update

// With startTransition
startTransition(() => {
  setSearchResults(results);  // Can be interrupted!
});

What happens internally:
1. Update is assigned TransitionLane (low priority)
2. If user types again (SyncLane), transition is INTERRUPTED
3. React abandons WIP tree for transition
4. Processes the typing first
5. Then restarts the transition with NEW data

This enables:
• Responsive typing while filtering large lists
• Smooth tab switches while loading content
• Search-as-you-type without jank

The isPending flag from useTransition tells you if a transition is in progress:

const [isPending, startTransition] = useTransition();
// isPending = true while transition updates are processing

Combined with Suspense, this enables truly fluid UIs that never feel "stuck".`,
    highlightedLines: [11, 12, 13, 14],
    state: {
      currentTree: {
        id: 'current-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'current-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: null,
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: {},
          memoizedProps: { items: '[]' },
          memoizedState: 'items: []',
          flags: ['NoFlags'],
          subtreeFlags: [],
          lanes: 'DefaultLane',
          childLanes: [],
          isHighlighted: false,
          isProcessing: false,
          isComplete: true,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'DefaultLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: false,
        isComplete: true,
      },
      wipTree: {
        id: 'wip-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'wip-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: null,
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: { items: '[...1000 items]' },
          memoizedProps: {},
          memoizedState: 'items: [1000]',
          flags: ['Update'],
          subtreeFlags: [],
          lanes: 'TransitionLane',
          childLanes: [],
          isHighlighted: true,
          isProcessing: true,
          isComplete: false,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'TransitionLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: true,
        isComplete: false,
      },
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: false,
        timeRemaining: 10,
        deadline: 16,
        pendingLanes: ['TransitionLane'],
        currentLane: 'TransitionLane',
        phase: 'begin-work',
        unitsOfWork: 50,
      },
      workUnits: [],
      timeline: [
        {
          id: 'ev-1',
          type: 'schedule',
          description: 'startTransition(() => setItems(...))',
          timestamp: Date.now() - 5,
          isActive: false,
        },
        {
          id: 'ev-2',
          type: 'begin',
          description: 'Processing 1000 items...',
          timestamp: Date.now(),
          isActive: true,
        },
      ],
      lanes: [
        { lane: 'SyncLane', label: 'Sync', color: '#EF4444', pendingWork: 0, isActive: false },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition',
          color: '#22C55E',
          pendingWork: 1,
          isActive: true,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'work', message: 'startTransition: setItems([...1000])' },
        { id: 'msg-2', type: 'info', message: 'Processing in TransitionLane (interruptible)' },
        { id: 'msg-3', type: 'info', message: 'User input will interrupt if needed' },
      ],
      activePanel: 'trees',
      showAlternate: true,
      showPointers: false,
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'The Commit Phase - Applying Changes',
    explanation: `Once the render phase completes (all fibers processed), React enters the COMMIT phase. Unlike render, commit is SYNCHRONOUS and cannot be interrupted.

Commit has three sub-phases:

1. Before Mutation:
   • Snapshot effects (getSnapshotBeforeUpdate)
   • Read current DOM values

2. Mutation:
   • Actually modify the DOM
   • Insert, update, delete nodes
   • This is where user SEES changes

3. Layout:
   • Run useLayoutEffect callbacks
   • DOM is updated but not painted yet

After commit:
• Current and WIP trees SWAP
• Old current becomes new WIP (for next render)
• useEffect runs (after paint)

Why is commit synchronous?
• DOM must be consistent - no half-rendered states
• Layout effects need accurate DOM measurements
• Commit is usually fast (just applying pre-computed changes)

The work loop did the heavy lifting (diffing, creating fibers). Commit just applies the results.`,
    highlightedLines: [],
    state: {
      currentTree: null,
      wipTree: {
        id: 'wip-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'wip-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: null,
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: {},
          memoizedProps: {},
          memoizedState: null,
          flags: ['Update'],
          subtreeFlags: [],
          lanes: 'SyncLane',
          childLanes: [],
          isHighlighted: true,
          isProcessing: false,
          isComplete: true,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'SyncLane',
        childLanes: [],
        isHighlighted: false,
        isProcessing: false,
        isComplete: true,
      },
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: false,
        timeRemaining: 16,
        deadline: 0,
        pendingLanes: [],
        currentLane: null,
        phase: 'commit-mutation',
        unitsOfWork: 0,
      },
      workUnits: [],
      timeline: [
        {
          id: 'ev-1',
          type: 'complete',
          description: 'Render phase complete',
          timestamp: Date.now() - 3,
          isActive: false,
        },
        {
          id: 'ev-2',
          type: 'commit',
          description: 'Commit: Before mutation',
          timestamp: Date.now() - 2,
          isActive: false,
        },
        {
          id: 'ev-3',
          type: 'commit',
          description: 'Commit: Mutation (DOM updates)',
          timestamp: Date.now(),
          isActive: true,
        },
      ],
      lanes: [
        { lane: 'SyncLane', label: 'Sync', color: '#EF4444', pendingWork: 0, isActive: false },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition',
          color: '#22C55E',
          pendingWork: 0,
          isActive: false,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'commit', message: 'Render complete → entering commit' },
        { id: 'msg-2', type: 'commit', message: 'Mutation phase: applying DOM changes' },
        { id: 'msg-3', type: 'info', message: 'Commit is synchronous (cannot interrupt)' },
      ],
      activePanel: 'timeline',
      showAlternate: false,
      showPointers: false,
    },
    duration: 5000,
  },
  {
    id: 'step-9',
    title: 'React Fiber - Key Takeaways',
    explanation: `Congratulations! You now understand React's Fiber architecture. Let's summarize:

FIBER NODES:
• Each component/element has a fiber
• Linked via child/sibling/return pointers
• Stores state, props, effects, and priority

DOUBLE BUFFERING:
• Current tree = what's on screen
• WIP tree = what's being built
• They swap on commit

WORK LOOP:
• Processes fibers one at a time
• beginWork (going down), completeWork (going up)
• Can pause and resume via shouldYield()

TIME SLICING:
• Work divided into 5ms chunks
• Yields to browser between chunks
• Keeps UI responsive during large updates

PRIORITY LANES:
• SyncLane = immediate (user input)
• TransitionLane = deferrable (startTransition)
• Higher priority interrupts lower

COMMIT PHASE:
• Synchronous, cannot be interrupted
• Before mutation → Mutation → Layout
• Trees swap after commit

This architecture enables React's concurrent features: Suspense, transitions, and responsive UIs even during heavy computation!`,
    highlightedLines: [],
    state: {
      currentTree: {
        id: 'current-root',
        tag: 'HostRoot',
        type: 'root',
        key: null,
        child: {
          id: 'current-app',
          tag: 'FunctionComponent',
          type: 'App',
          key: null,
          child: null,
          sibling: null,
          return: null,
          alternate: null,
          pendingProps: {},
          memoizedProps: {},
          memoizedState: null,
          flags: ['NoFlags'],
          subtreeFlags: [],
          lanes: 'DefaultLane',
          childLanes: [],
          isHighlighted: true,
          isProcessing: false,
          isComplete: true,
        },
        sibling: null,
        return: null,
        alternate: null,
        pendingProps: {},
        memoizedProps: {},
        memoizedState: null,
        flags: ['NoFlags'],
        subtreeFlags: [],
        lanes: 'DefaultLane',
        childLanes: [],
        isHighlighted: true,
        isProcessing: false,
        isComplete: true,
      },
      wipTree: null,
      workLoop: {
        workInProgressFiber: null,
        workInProgressRoot: null,
        isYielding: false,
        timeRemaining: 16,
        deadline: 0,
        pendingLanes: [],
        currentLane: null,
        phase: 'finished',
        unitsOfWork: 0,
      },
      workUnits: [],
      timeline: [],
      lanes: [
        { lane: 'SyncLane', label: 'Sync', color: '#EF4444', pendingWork: 0, isActive: false },
        {
          lane: 'InputContinuousLane',
          label: 'Input',
          color: '#F97316',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'DefaultLane',
          label: 'Default',
          color: '#EAB308',
          pendingWork: 0,
          isActive: false,
        },
        {
          lane: 'TransitionLane',
          label: 'Transition',
          color: '#22C55E',
          pendingWork: 0,
          isActive: false,
        },
        { lane: 'IdleLane', label: 'Idle', color: '#6B7280', pendingWork: 0, isActive: false },
      ],
      output: [
        { id: 'msg-1', type: 'info', message: 'Fiber enables: Interruptible rendering' },
        { id: 'msg-2', type: 'info', message: 'Fiber enables: Priority-based scheduling' },
        {
          id: 'msg-3',
          type: 'info',
          message: 'Fiber enables: Concurrent features (Suspense, transitions)',
        },
      ],
      activePanel: 'trees',
      showAlternate: false,
      showPointers: true,
    },
    duration: 6000,
  },
];

export const fiberKeyTakeaways = [
  'Fiber enables interruptible rendering - work can be paused, resumed, or aborted',
  'Each component has a fiber node with child/sibling/return pointers (linked list)',
  'Double buffering: Current tree (on screen) and WIP tree (being built)',
  'Work loop processes one fiber at a time, checking shouldYield() between units',
  'Time slicing divides work into ~5ms chunks to keep UI responsive',
  'Priority lanes: SyncLane (urgent) > DefaultLane > TransitionLane (deferrable)',
  'startTransition marks updates as non-urgent (can be interrupted)',
  'Commit phase is synchronous: Before mutation → Mutation → Layout → Effects',
];
