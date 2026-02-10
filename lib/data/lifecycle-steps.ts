/**
 * Step-by-step data for Component Lifecycle visualization
 *
 * This visualization demonstrates the complete lifecycle of a React component
 * from initial mount through updates to final unmount, showing how each
 * phase works and when effects run.
 */

import type { LifecycleStep } from '@/lib/types';

export const lifecycleCode = `function UserProfile({ userId }) {
  // State initialization
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ref for tracking renders
  const renderCount = useRef(0);
  renderCount.current++;

  // Effect: Fetch user data
  useEffect(() => {
    console.log('Effect: Fetching user', userId);
    
    fetchUser(userId).then(data => {
      setUser(data);
      setLoading(false);
    });

    // Cleanup function
    return () => {
      console.log('Cleanup: Cancelling fetch');
      // Cancel pending requests
    };
  }, [userId]);

  // Effect: Update document title
  useEffect(() => {
    if (user) {
      document.title = user.name;
    }
    
    return () => {
      document.title = 'React App';
    };
  }, [user]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>Renders: {renderCount.current}</p>
    </div>
  );
}`;

export const lifecycleSteps: LifecycleStep[] = [
  {
    id: 'step-1',
    title: 'Understanding Component Lifecycle',
    explanation: `Every React component goes through a predictable lifecycle with three main phases:

1. MOUNTING - Component is being created and inserted into the DOM
2. UPDATING - Component is re-rendering due to props or state changes  
3. UNMOUNTING - Component is being removed from the DOM

In class components, these phases had explicit methods (componentDidMount, componentDidUpdate, componentWillUnmount). In function components with hooks, the lifecycle is managed through useEffect and other hooks.

Understanding this lifecycle is crucial because:
• It determines WHEN your code runs
• It affects performance (unnecessary renders)
• It's essential for proper cleanup (memory leaks)
• It explains why certain patterns work or fail

The lifecycle is NOT synchronous! React batches updates and runs effects AFTER the browser paints. This is intentional - it keeps the UI responsive.

Let's trace through a component's complete lifecycle from birth to death...`,
    highlightedLines: [1, 2, 3, 4, 5],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'initial',
          name: 'mount',
          stage: 'initial-render',
          isActive: false,
          progress: 0,
        },
        state: [],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [],
        renderCount: 0,
        isMounted: false,
        isHighlighted: true,
      },
      timeline: [],
      dom: [],
      activePhaseSegment: 'mount',
      output: [
        {
          id: 'msg-1',
          type: 'info',
          message: 'Component lifecycle has 3 phases: Mount → Update → Unmount',
        },
        { id: 'msg-2', type: 'info', message: 'Effects run AFTER render and paint' },
      ],
      showDiagram: true,
      activePanel: 'diagram',
    },
    duration: 5500,
  },
  {
    id: 'step-2',
    title: 'Mounting Phase Begins - Initial Render',
    explanation: `The mounting phase begins when React decides to render your component for the first time. This happens when:
• A parent component includes <UserProfile /> in its JSX
• The app initially loads
• A route change renders this component

Here's what happens during initial render:

1. React calls your function component (or creates class instance)
2. useState initializers run ONCE - they set initial state
3. useRef creates the ref object
4. The function body executes top to bottom
5. JSX is returned (creating React Elements)

IMPORTANT: During this first call, effects DO NOT run yet! The useEffect callbacks are SCHEDULED but not executed. React needs to finish the render phase first.

Notice that useState(null) and useState(true) set up our initial state. These initializer functions/values only run on mount - on subsequent renders, React returns the EXISTING state.

The component function is "pure" during render - it should only compute JSX based on props and state, with no side effects.`,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'mount-1',
          name: 'mount',
          stage: 'initial-render',
          isActive: true,
          progress: 20,
        },
        state: [
          { id: 'user', name: 'user', value: 'null', hasChanged: false },
          { id: 'loading', name: 'loading', value: 'true', hasChanged: false },
        ],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [],
        renderCount: 1,
        isMounted: false,
        isHighlighted: true,
      },
      timeline: [
        {
          id: 'event-1',
          phase: 'mount',
          stage: 'initial-render',
          description: 'Component function called',
          timestamp: Date.now(),
          isActive: true,
          category: 'render',
        },
      ],
      dom: [],
      activePhaseSegment: 'mount',
      output: [
        { id: 'msg-1', type: 'render', message: 'UserProfile() called - render #1' },
        { id: 'msg-2', type: 'info', message: 'useState(null) → user = null' },
        { id: 'msg-3', type: 'info', message: 'useState(true) → loading = true' },
      ],
      showDiagram: true,
      activePanel: 'component',
    },
    duration: 5000,
  },
  {
    id: 'step-3',
    title: 'Render Output - Creating React Elements',
    explanation: `The component function returns JSX, which React transforms into a tree of React Elements. Since loading is true, we return the loading state:

return <div>Loading...</div>

This JSX becomes:
React.createElement('div', null, 'Loading...')

Which produces a React Element object:
{
  type: 'div',
  props: { children: 'Loading...' },
  key: null,
  ref: null
}

At this point:
• No DOM has been touched yet
• useEffect callbacks are queued but NOT run
• The render phase is complete

React now has a description of what the UI SHOULD look like. The next step is the "commit phase" where React actually creates DOM nodes.

This separation of render (what to show) and commit (actually showing it) is key to React's architecture. Rendering is interruptible and can be discarded. Commits are synchronous and final.`,
    highlightedLines: [32, 33],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'mount-2',
          name: 'mount',
          stage: 'execute-render',
          isActive: true,
          progress: 40,
        },
        state: [
          { id: 'user', name: 'user', value: 'null', hasChanged: false },
          { id: 'loading', name: 'loading', value: 'true', hasChanged: false },
        ],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [
          {
            id: 'effect-1',
            name: 'fetchEffect',
            dependencies: ['userId'],
            hasCleanup: true,
            status: 'pending',
            runCount: 0,
          },
          {
            id: 'effect-2',
            name: 'titleEffect',
            dependencies: ['user'],
            hasCleanup: true,
            status: 'pending',
            runCount: 0,
          },
        ],
        renderCount: 1,
        isMounted: false,
        isHighlighted: true,
      },
      timeline: [
        {
          id: 'event-1',
          phase: 'mount',
          stage: 'initial-render',
          description: 'Component function called',
          timestamp: Date.now() - 100,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-2',
          phase: 'mount',
          stage: 'execute-render',
          description: 'JSX returned (loading state)',
          timestamp: Date.now(),
          isActive: true,
          category: 'render',
        },
      ],
      dom: [],
      activePhaseSegment: 'mount',
      output: [
        { id: 'msg-1', type: 'render', message: 'JSX returned: <div>Loading...</div>' },
        { id: 'msg-2', type: 'info', message: 'Effects scheduled: fetchEffect, titleEffect' },
        { id: 'msg-3', type: 'info', message: 'Render phase complete, commit phase next' },
      ],
      showDiagram: true,
      activePanel: 'component',
    },
    duration: 4500,
  },
  {
    id: 'step-4',
    title: 'Commit Phase - DOM Creation',
    explanation: `Now React enters the COMMIT phase. This is where the Virtual DOM becomes real DOM:

1. React creates actual DOM nodes based on the React Elements
2. Sets attributes and properties
3. Inserts nodes into the document
4. The browser paints the screen

For our component:
document.createElement('div')
div.textContent = 'Loading...'
parentElement.appendChild(div)

The commit phase is SYNCHRONOUS - once it starts, it runs to completion without interruption. This ensures the DOM is always in a consistent state.

After commit, the user can SEE "Loading..." on screen. But wait - our effects STILL haven't run! React schedules them to run AFTER the browser has painted.

Why after paint? Because effects often do heavy work (API calls, subscriptions) that could block rendering. By deferring effects, React ensures the UI appears fast, then does the heavy lifting.

This is different from useLayoutEffect, which runs synchronously BEFORE paint (rarely needed).`,
    highlightedLines: [],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'mount-3',
          name: 'mount',
          stage: 'commit-dom',
          isActive: true,
          progress: 60,
        },
        state: [
          { id: 'user', name: 'user', value: 'null', hasChanged: false },
          { id: 'loading', name: 'loading', value: 'true', hasChanged: false },
        ],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [
          {
            id: 'effect-1',
            name: 'fetchEffect',
            dependencies: ['userId'],
            hasCleanup: true,
            status: 'pending',
            runCount: 0,
          },
          {
            id: 'effect-2',
            name: 'titleEffect',
            dependencies: ['user'],
            hasCleanup: true,
            status: 'pending',
            runCount: 0,
          },
        ],
        renderCount: 1,
        isMounted: false,
        isHighlighted: true,
      },
      timeline: [
        {
          id: 'event-1',
          phase: 'mount',
          stage: 'initial-render',
          description: 'Component function called',
          timestamp: Date.now() - 200,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-2',
          phase: 'mount',
          stage: 'execute-render',
          description: 'JSX returned',
          timestamp: Date.now() - 100,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-3',
          phase: 'mount',
          stage: 'commit-dom',
          description: 'DOM nodes created and inserted',
          timestamp: Date.now(),
          isActive: true,
          category: 'commit',
        },
      ],
      dom: [
        {
          id: 'dom-1',
          tagName: 'div',
          content: 'Loading...',
          isNew: true,
          isUpdated: false,
          isRemoved: false,
        },
      ],
      activePhaseSegment: 'mount',
      output: [
        { id: 'msg-1', type: 'commit', message: 'DOM created: <div>Loading...</div>' },
        { id: 'msg-2', type: 'info', message: 'Browser paints: User sees "Loading..."' },
        { id: 'msg-3', type: 'info', message: 'Effects still pending (run after paint)' },
      ],
      showDiagram: true,
      activePanel: 'dom',
    },
    duration: 4500,
  },
  {
    id: 'step-5',
    title: 'Effects Run - componentDidMount Equivalent',
    explanation: `After the browser paints, React runs our effects. This is the "componentDidMount" equivalent in hooks:

useEffect(() => {
  fetchUser(userId).then(data => {
    setUser(data);
    setLoading(false);
  });
  return () => { /* cleanup */ };
}, [userId]);

Effects run in ORDER (top to bottom in your component). Our fetch effect runs first:
1. Logs "Effect: Fetching user 123"
2. Calls fetchUser(123)
3. The promise is pending...

Then the title effect runs:
1. Checks if user exists (it's null)
2. Does nothing since user is falsy

CRITICAL INSIGHT: The API call is now in flight, but the component is MOUNTED. When the promise resolves (setUser, setLoading), it will trigger the UPDATE phase.

The cleanup functions are NOT called on mount - they're stored for later. Cleanup runs:
• Before the effect re-runs (on update)
• When the component unmounts

This is the pattern for subscriptions, timers, and event listeners - set up in effect, tear down in cleanup.`,
    highlightedLines: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'mount-4',
          name: 'mount',
          stage: 'run-effects',
          isActive: true,
          progress: 80,
        },
        state: [
          { id: 'user', name: 'user', value: 'null', hasChanged: false },
          { id: 'loading', name: 'loading', value: 'true', hasChanged: false },
        ],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [
          {
            id: 'effect-1',
            name: 'fetchEffect',
            dependencies: ['userId'],
            hasCleanup: true,
            status: 'running',
            runCount: 1,
          },
          {
            id: 'effect-2',
            name: 'titleEffect',
            dependencies: ['user'],
            hasCleanup: true,
            status: 'complete',
            runCount: 1,
          },
        ],
        renderCount: 1,
        isMounted: true,
        isHighlighted: true,
      },
      timeline: [
        {
          id: 'event-1',
          phase: 'mount',
          stage: 'initial-render',
          description: 'Component function called',
          timestamp: Date.now() - 300,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-2',
          phase: 'mount',
          stage: 'execute-render',
          description: 'JSX returned',
          timestamp: Date.now() - 200,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-3',
          phase: 'mount',
          stage: 'commit-dom',
          description: 'DOM nodes created',
          timestamp: Date.now() - 100,
          isActive: false,
          category: 'commit',
        },
        {
          id: 'event-4',
          phase: 'mount',
          stage: 'run-effects',
          description: 'Effects executing',
          timestamp: Date.now(),
          isActive: true,
          category: 'effect',
        },
      ],
      dom: [
        {
          id: 'dom-1',
          tagName: 'div',
          content: 'Loading...',
          isNew: false,
          isUpdated: false,
          isRemoved: false,
        },
      ],
      activePhaseSegment: 'mount',
      output: [
        { id: 'msg-1', type: 'effect', message: 'Effect #1: Fetching user 123' },
        { id: 'msg-2', type: 'effect', message: 'Effect #2: titleEffect (user is null, skipped)' },
        { id: 'msg-3', type: 'info', message: 'API request in flight...' },
      ],
      showDiagram: true,
      activePanel: 'component',
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'Update Phase - State Changes',
    explanation: `The API returns! fetchUser resolves with user data, triggering:

setUser({ name: 'Alice', id: 123 });
setLoading(false);

These state updates trigger the UPDATE phase. React batches both updates together (they're in the same async callback) and schedules ONE re-render.

Update phase begins:
1. React sees pending state updates
2. Calculates new state values
3. Calls your component function AGAIN with new state
4. Compares old JSX vs new JSX (reconciliation)
5. Updates only changed DOM nodes
6. Runs effect cleanups for changed dependencies
7. Runs effects with changed dependencies

This time the render returns actual content:
<div className="profile">
  <h1>Alice</h1>
  <p>Renders: 2</p>
</div>

renderCount.current is now 2 - the ref persists across renders but doesn't trigger re-renders when mutated.`,
    highlightedLines: [13, 14, 15],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'update-1',
          name: 'update',
          stage: 'trigger',
          isActive: true,
          progress: 20,
        },
        state: [
          {
            id: 'user',
            name: 'user',
            value: '{ name: "Alice", id: 123 }',
            previousValue: 'null',
            hasChanged: true,
          },
          {
            id: 'loading',
            name: 'loading',
            value: 'false',
            previousValue: 'true',
            hasChanged: true,
          },
        ],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [
          {
            id: 'effect-1',
            name: 'fetchEffect',
            dependencies: ['userId'],
            hasCleanup: true,
            status: 'complete',
            runCount: 1,
          },
          {
            id: 'effect-2',
            name: 'titleEffect',
            dependencies: ['user'],
            hasCleanup: true,
            status: 'pending',
            runCount: 1,
          },
        ],
        renderCount: 2,
        isMounted: true,
        isHighlighted: true,
      },
      timeline: [
        {
          id: 'event-1',
          phase: 'mount',
          stage: 'mount-complete',
          description: 'Mount complete',
          timestamp: Date.now() - 500,
          isActive: false,
          category: 'effect',
        },
        {
          id: 'event-5',
          phase: 'update',
          stage: 'trigger',
          description: 'State update: user, loading',
          timestamp: Date.now(),
          isActive: true,
          category: 'render',
        },
      ],
      dom: [
        {
          id: 'dom-1',
          tagName: 'div',
          content: 'Loading...',
          isNew: false,
          isUpdated: false,
          isRemoved: false,
        },
      ],
      activePhaseSegment: 'update',
      output: [
        { id: 'msg-1', type: 'info', message: 'API resolved: { name: "Alice", id: 123 }' },
        { id: 'msg-2', type: 'render', message: 'setUser() + setLoading() batched' },
        { id: 'msg-3', type: 'render', message: 'Update scheduled → re-render #2' },
      ],
      showDiagram: true,
      activePanel: 'component',
    },
    duration: 5000,
  },
  {
    id: 'step-7',
    title: 'Re-render and DOM Update',
    explanation: `React re-renders the component with updated state. Since loading is now false, we hit the main return:

return (
  <div className="profile">
    <h1>{user.name}</h1>
    <p>Renders: {renderCount.current}</p>
  </div>
);

React now RECONCILES - compares old Virtual DOM with new:
• Old: <div>Loading...</div>
• New: <div className="profile"><h1>Alice</h1><p>Renders: 2</p></div>

The reconciliation algorithm sees:
1. Root is still <div> (same type) → UPDATE it, don't replace
2. Add className="profile" attribute
3. Replace text children with new structure

React computes the MINIMAL set of DOM operations:
• div.className = "profile"
• Remove text node "Loading..."
• Create and append h1 and p elements

After commit, user sees "Alice" on screen. Now effects need to run...`,
    highlightedLines: [35, 36, 37, 38, 39, 40],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'update-2',
          name: 'update',
          stage: 'commit-dom',
          isActive: true,
          progress: 60,
        },
        state: [
          { id: 'user', name: 'user', value: '{ name: "Alice", id: 123 }', hasChanged: false },
          { id: 'loading', name: 'loading', value: 'false', hasChanged: false },
        ],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [
          {
            id: 'effect-1',
            name: 'fetchEffect',
            dependencies: ['userId'],
            hasCleanup: true,
            status: 'complete',
            runCount: 1,
          },
          {
            id: 'effect-2',
            name: 'titleEffect',
            dependencies: ['user'],
            hasCleanup: true,
            status: 'pending',
            runCount: 1,
          },
        ],
        renderCount: 2,
        isMounted: true,
        isHighlighted: true,
      },
      timeline: [
        {
          id: 'event-5',
          phase: 'update',
          stage: 'trigger',
          description: 'State update triggered',
          timestamp: Date.now() - 200,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-6',
          phase: 'update',
          stage: 'execute-render',
          description: 'Re-render executed',
          timestamp: Date.now() - 100,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-7',
          phase: 'update',
          stage: 'commit-dom',
          description: 'DOM updated',
          timestamp: Date.now(),
          isActive: true,
          category: 'commit',
        },
      ],
      dom: [
        {
          id: 'dom-2',
          tagName: 'div.profile',
          content: '',
          isNew: false,
          isUpdated: true,
          isRemoved: false,
        },
        {
          id: 'dom-3',
          tagName: 'h1',
          content: 'Alice',
          isNew: true,
          isUpdated: false,
          isRemoved: false,
        },
        {
          id: 'dom-4',
          tagName: 'p',
          content: 'Renders: 2',
          isNew: true,
          isUpdated: false,
          isRemoved: false,
        },
      ],
      activePhaseSegment: 'update',
      output: [
        { id: 'msg-1', type: 'render', message: 'Re-render: loading=false, showing profile' },
        { id: 'msg-2', type: 'commit', message: 'DOM updated: div.className = "profile"' },
        { id: 'msg-3', type: 'commit', message: 'New children: <h1>Alice</h1>, <p>Renders: 2</p>' },
      ],
      showDiagram: true,
      activePanel: 'dom',
    },
    duration: 4500,
  },
  {
    id: 'step-8',
    title: 'Effect Cleanup and Re-run',
    explanation: `After DOM update, React processes effects. But wait - our dependencies changed!

Effect #1 (fetchEffect): deps = [userId]
• userId is still '123' → Dependencies UNCHANGED → Effect SKIPPED

Effect #2 (titleEffect): deps = [user]  
• user changed from null to {name: 'Alice'} → Dependencies CHANGED!

When deps change, React:
1. Runs the PREVIOUS cleanup function first
2. Then runs the NEW effect

titleEffect cleanup: document.title = 'React App' (previous cleanup)
titleEffect runs: document.title = 'Alice' (new effect)

This cleanup-then-run pattern ensures:
• Subscriptions are properly unsubscribed before resubscribing
• Timers are cleared before setting new ones
• Previous resources are released

React compares dependencies using Object.is() - similar to ===. For objects/arrays, this means reference equality. That's why [user] triggered (new object), but [userId] didn't (same string).`,
    highlightedLines: [23, 24, 25, 26, 27, 28, 29, 30, 31],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'update-3',
          name: 'update',
          stage: 'run-effects',
          isActive: true,
          progress: 90,
        },
        state: [
          { id: 'user', name: 'user', value: '{ name: "Alice", id: 123 }', hasChanged: false },
          { id: 'loading', name: 'loading', value: 'false', hasChanged: false },
        ],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [
          {
            id: 'effect-1',
            name: 'fetchEffect',
            dependencies: ['userId'],
            hasCleanup: true,
            status: 'complete',
            runCount: 1,
          },
          {
            id: 'effect-2',
            name: 'titleEffect',
            dependencies: ['user'],
            hasCleanup: true,
            status: 'running',
            runCount: 2,
          },
        ],
        renderCount: 2,
        isMounted: true,
        isHighlighted: true,
      },
      timeline: [
        {
          id: 'event-7',
          phase: 'update',
          stage: 'commit-dom',
          description: 'DOM updated',
          timestamp: Date.now() - 100,
          isActive: false,
          category: 'commit',
        },
        {
          id: 'event-8',
          phase: 'update',
          stage: 'cleanup-effects',
          description: 'titleEffect cleanup',
          timestamp: Date.now() - 50,
          isActive: false,
          category: 'cleanup',
        },
        {
          id: 'event-9',
          phase: 'update',
          stage: 'run-effects',
          description: 'titleEffect running',
          timestamp: Date.now(),
          isActive: true,
          category: 'effect',
        },
      ],
      dom: [
        {
          id: 'dom-2',
          tagName: 'div.profile',
          content: '',
          isNew: false,
          isUpdated: false,
          isRemoved: false,
        },
        {
          id: 'dom-3',
          tagName: 'h1',
          content: 'Alice',
          isNew: false,
          isUpdated: false,
          isRemoved: false,
        },
        {
          id: 'dom-4',
          tagName: 'p',
          content: 'Renders: 2',
          isNew: false,
          isUpdated: false,
          isRemoved: false,
        },
      ],
      activePhaseSegment: 'update',
      output: [
        { id: 'msg-1', type: 'info', message: 'fetchEffect: deps unchanged, skipped' },
        { id: 'msg-2', type: 'cleanup', message: 'titleEffect cleanup: title → "React App"' },
        { id: 'msg-3', type: 'effect', message: 'titleEffect runs: title → "Alice"' },
      ],
      showDiagram: true,
      activePanel: 'timeline',
    },
    duration: 5000,
  },
  {
    id: 'step-9',
    title: 'Unmounting Phase - Component Removal',
    explanation: `Eventually, the component will unmount. This happens when:
• Parent stops rendering it (conditional rendering)
• Route changes to a different page
• App is closed/navigated away

When unmounting begins, React:
1. Calls ALL effect cleanup functions (componentWillUnmount equivalent)
2. Removes DOM nodes
3. Releases the fiber node for garbage collection

Both our cleanup functions run:
• fetchEffect cleanup: Cancels pending requests
• titleEffect cleanup: Resets document title

Cleanup order is typically REVERSE of effect order (LIFO), ensuring proper teardown. This is crucial for:
• Preventing memory leaks (event listeners, subscriptions)
• Avoiding state updates on unmounted components (React warning)
• Proper resource cleanup (WebSocket connections, timers)

After unmount, the component is GONE. Any attempt to setState would cause the "Can't perform state update on unmounted component" warning.

This is why cleanup is essential - without it, your effects would keep running even after the component is removed!`,
    highlightedLines: [17, 18, 19, 20, 28, 29, 30],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'unmount-1',
          name: 'unmount',
          stage: 'cleanup-effects',
          isActive: true,
          progress: 50,
        },
        state: [
          { id: 'user', name: 'user', value: '{ name: "Alice", id: 123 }', hasChanged: false },
          { id: 'loading', name: 'loading', value: 'false', hasChanged: false },
        ],
        props: [{ id: 'userId', name: 'userId', value: '123', hasChanged: false }],
        effects: [
          {
            id: 'effect-1',
            name: 'fetchEffect',
            dependencies: ['userId'],
            hasCleanup: true,
            status: 'cleanup',
            runCount: 1,
          },
          {
            id: 'effect-2',
            name: 'titleEffect',
            dependencies: ['user'],
            hasCleanup: true,
            status: 'cleanup',
            runCount: 2,
          },
        ],
        renderCount: 2,
        isMounted: false,
        isHighlighted: true,
      },
      timeline: [
        {
          id: 'event-10',
          phase: 'unmount',
          stage: 'trigger',
          description: 'Unmount triggered',
          timestamp: Date.now() - 100,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-11',
          phase: 'unmount',
          stage: 'cleanup-effects',
          description: 'All cleanups running',
          timestamp: Date.now(),
          isActive: true,
          category: 'cleanup',
        },
      ],
      dom: [
        {
          id: 'dom-2',
          tagName: 'div.profile',
          content: '',
          isNew: false,
          isUpdated: false,
          isRemoved: true,
        },
        {
          id: 'dom-3',
          tagName: 'h1',
          content: 'Alice',
          isNew: false,
          isUpdated: false,
          isRemoved: true,
        },
        {
          id: 'dom-4',
          tagName: 'p',
          content: 'Renders: 2',
          isNew: false,
          isUpdated: false,
          isRemoved: true,
        },
      ],
      activePhaseSegment: 'unmount',
      output: [
        { id: 'msg-1', type: 'info', message: 'Parent stopped rendering <UserProfile />' },
        { id: 'msg-2', type: 'cleanup', message: 'fetchEffect cleanup: Cancelling fetch' },
        { id: 'msg-3', type: 'cleanup', message: 'titleEffect cleanup: title → "React App"' },
      ],
      showDiagram: true,
      activePanel: 'timeline',
    },
    duration: 5000,
  },
  {
    id: 'step-10',
    title: 'Component Lifecycle - Key Takeaways',
    explanation: `Excellent! You now understand React's component lifecycle. Let's summarize:

MOUNTING (Birth):
1. Component function called
2. useState initializers run (once)
3. JSX returned → React Elements created
4. DOM nodes created and inserted
5. Browser paints
6. useEffect callbacks run

UPDATING (Life):
1. State or props change triggers update
2. Component function called again
3. New JSX compared with old (reconciliation)
4. Changed DOM nodes updated
5. Effect cleanups run for changed deps
6. Effects run for changed deps

UNMOUNTING (Death):
1. Parent removes component
2. ALL effect cleanups run
3. DOM nodes removed
4. Fiber released

KEY PATTERNS:
• Effects run AFTER paint (async)
• Cleanup runs BEFORE next effect
• Dependencies control when effects re-run
• [] deps = run once on mount
• No deps = run every render (usually wrong!)

This lifecycle model is the foundation of React - understanding it helps you write bug-free, performant components!`,
    highlightedLines: [],
    state: {
      component: {
        id: 'userprofile',
        name: 'UserProfile',
        phase: {
          id: 'complete',
          name: 'unmount',
          stage: 'unmount-complete',
          isActive: false,
          progress: 100,
        },
        state: [],
        props: [],
        effects: [],
        renderCount: 2,
        isMounted: false,
        isHighlighted: false,
      },
      timeline: [
        {
          id: 'event-1',
          phase: 'mount',
          stage: 'initial-render',
          description: 'Initial render',
          timestamp: Date.now() - 600,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-2',
          phase: 'mount',
          stage: 'commit-dom',
          description: 'DOM created',
          timestamp: Date.now() - 500,
          isActive: false,
          category: 'commit',
        },
        {
          id: 'event-3',
          phase: 'mount',
          stage: 'run-effects',
          description: 'Effects run',
          timestamp: Date.now() - 400,
          isActive: false,
          category: 'effect',
        },
        {
          id: 'event-4',
          phase: 'update',
          stage: 'trigger',
          description: 'State update',
          timestamp: Date.now() - 300,
          isActive: false,
          category: 'render',
        },
        {
          id: 'event-5',
          phase: 'update',
          stage: 'commit-dom',
          description: 'DOM updated',
          timestamp: Date.now() - 200,
          isActive: false,
          category: 'commit',
        },
        {
          id: 'event-6',
          phase: 'unmount',
          stage: 'cleanup-effects',
          description: 'Cleanup',
          timestamp: Date.now() - 100,
          isActive: false,
          category: 'cleanup',
        },
        {
          id: 'event-7',
          phase: 'unmount',
          stage: 'unmount-complete',
          description: 'Unmounted',
          timestamp: Date.now(),
          isActive: true,
          category: 'cleanup',
        },
      ],
      dom: [],
      activePhaseSegment: 'mount',
      output: [
        { id: 'msg-1', type: 'info', message: 'Lifecycle complete: Mount → Update → Unmount' },
        {
          id: 'msg-2',
          type: 'info',
          message: 'Next: Reconciliation - how React diffs Virtual DOM!',
        },
      ],
      showDiagram: true,
      activePanel: 'diagram',
    },
    duration: 6000,
  },
];

export const lifecycleKeyTakeaways = [
  'Component lifecycle has 3 phases: Mounting, Updating, and Unmounting',
  'Mounting: Component created → Render → DOM insert → Effects run',
  'Updating: State/props change → Re-render → Reconcile → DOM update → Effects',
  'Unmounting: Cleanup ALL effects → Remove DOM → Release resources',
  'Effects run AFTER browser paint (asynchronous)',
  'Cleanup runs BEFORE next effect or on unmount',
  'Empty deps [] means effect runs once on mount only',
  'Understanding lifecycle prevents memory leaks and bugs',
];
