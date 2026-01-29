/**
 * Step-by-step data for Props & State visualization
 *
 * This visualization demonstrates how data flows through React applications
 * via props and state, the unidirectional data flow pattern, and how
 * state changes trigger re-renders throughout the component tree.
 */

import type { PropsStateStep } from '@/lib/types';

export const propsStateCode = `// Parent component with state
function UserProfile() {
  const [user, setUser] = useState({ 
    name: 'Alice', 
    points: 100 
  });
  const [theme, setTheme] = useState('dark');

  const handleAddPoints = () => {
    setUser(prev => ({ 
      ...prev, 
      points: prev.points + 10 
    }));
  };

  return (
    <div className={theme}>
      <Header userName={user.name} />
      <Stats 
        points={user.points} 
        onAddPoints={handleAddPoints} 
      />
      <ThemeToggle 
        theme={theme} 
        onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
      />
    </div>
  );
}

// Child component receiving props
function Stats({ points, onAddPoints }) {
  return (
    <div>
      <p>Points: {points}</p>
      <button onClick={onAddPoints}>
        Add 10 Points
      </button>
    </div>
  );
}`;

export const propsStateSteps: PropsStateStep[] = [
  {
    id: 'step-1',
    title: 'Understanding Props - Data Flows Down',
    explanation: `Props (short for "properties") are React's mechanism for passing data from parent components to child components. Think of props as function arguments - just like you pass arguments to functions, you pass props to components.

Key insight: Props flow in ONE direction - from parent to child. This is called "unidirectional data flow" and it's one of React's core architectural principles. Why? Because it makes your app predictable and easy to debug. You always know where data comes from - you just look up the component tree.

In our example, UserProfile is the parent that OWNS the data (user and theme). It passes pieces of this data DOWN to its children:
• Header receives userName (just the name)
• Stats receives points and a callback function
• ThemeToggle receives theme and a toggle function

Props are READ-ONLY! A child component should never modify the props it receives. If it needs to change something, it should call a function (callback) passed as a prop, which then updates the parent's state.`,
    highlightedLines: [2, 3, 4, 5, 6, 7],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 100 }',
            isHighlighted: true,
            isChanged: false,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: false,
        renderCount: 1,
        isHighlighted: true,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '100',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
        ],
      },
      dataFlows: [],
      renderPhase: 'idle',
      stateUpdates: [],
      renderEvents: [],
      highlightedComponent: 'userprofile',
      highlightedData: 'user-state',
      output: [
        {
          id: 'msg-1',
          type: 'info',
          message: 'Props flow DOWN from parent to child - unidirectional data flow',
        },
        { id: 'msg-2', type: 'info', message: 'UserProfile owns state: user and theme' },
      ],
      showDataFlow: false,
      activeView: 'tree',
    },
    duration: 5000,
  },
  {
    id: 'step-2',
    title: 'Props Being Passed - The Data Highway',
    explanation: `Watch the data flow in action! When UserProfile renders, React passes the specified props to each child component. This happens every time the parent renders.

Notice the syntax: <Stats points={user.points} onAddPoints={handleAddPoints} />

• "points" is the prop NAME (what the child will call it)
• "{user.points}" is the VALUE (from parent's state)
• The curly braces mean "evaluate this JavaScript expression"

The child receives these as a single object: { points: 100, onAddPoints: fn }

This is why we destructure in the child: function Stats({ points, onAddPoints })
It's the same as: function Stats(props) { const { points, onAddPoints } = props; }

Important mental model: Think of props like water flowing downhill. Data naturally flows from top (parent) to bottom (children). To send data UPSTREAM, you need a pump (callback function).

Callbacks are functions passed as props that allow children to communicate BACK to parents. When Stats calls onAddPoints(), it's really calling handleAddPoints in UserProfile!`,
    highlightedLines: [16, 17, 18, 19, 20],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 100 }',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: true,
        renderCount: 1,
        isHighlighted: true,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '100',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: true,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
        ],
      },
      dataFlows: [
        {
          id: 'flow-1',
          from: 'userprofile',
          to: 'header',
          propName: 'userName',
          value: '"Alice"',
          direction: 'down',
          isActive: true,
        },
        {
          id: 'flow-2',
          from: 'userprofile',
          to: 'stats',
          propName: 'points',
          value: '100',
          direction: 'down',
          isActive: true,
        },
        {
          id: 'flow-3',
          from: 'userprofile',
          to: 'stats',
          propName: 'onAddPoints',
          value: 'fn()',
          direction: 'down',
          isActive: true,
        },
        {
          id: 'flow-4',
          from: 'userprofile',
          to: 'themetoggle',
          propName: 'theme',
          value: '"dark"',
          direction: 'down',
          isActive: true,
        },
      ],
      renderPhase: 'props-passed',
      stateUpdates: [],
      renderEvents: [],
      highlightedComponent: 'stats',
      highlightedData: null,
      output: [
        { id: 'msg-1', type: 'prop', message: 'UserProfile → Header: userName="Alice"' },
        { id: 'msg-2', type: 'prop', message: 'UserProfile → Stats: points=100, onAddPoints=fn()' },
        {
          id: 'msg-3',
          type: 'prop',
          message: 'UserProfile → ThemeToggle: theme="dark", onToggle=fn()',
        },
      ],
      showDataFlow: true,
      activeView: 'tree',
    },
    duration: 5000,
  },
  {
    id: 'step-3',
    title: 'Understanding State - Component Memory',
    explanation: `State is a component's private memory. Unlike props (which come from outside), state is created and managed WITHIN the component. It's what makes components dynamic and interactive.

useState returns an array with exactly two elements:
• [0] The current value (user, theme)
• [1] A function to update that value (setUser, setTheme)

Why arrays? Because you can name them whatever you want when destructuring!
const [count, setCount] = useState(0)  // "count" could be anything

Key differences between Props and State:
• Props: Passed IN, read-only, controlled by parent
• State: Created INSIDE, mutable via setter, controlled by self

When does state change?
• User interactions (clicks, typing, etc.)
• API responses
• Timers and intervals
• Any side effect that needs to update the UI

CRITICAL: State updates are ASYNCHRONOUS! When you call setUser(), React doesn't immediately change the value. It schedules an update and re-render. This is why you can't read the new value immediately after setting it.`,
    highlightedLines: [3, 4, 5, 6, 7],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 100 }',
            isHighlighted: true,
            isChanged: false,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: true,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: false,
        renderCount: 1,
        isHighlighted: true,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '100',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
        ],
      },
      dataFlows: [],
      renderPhase: 'idle',
      stateUpdates: [],
      renderEvents: [],
      highlightedComponent: 'userprofile',
      highlightedData: 'user-state',
      output: [
        { id: 'msg-1', type: 'state', message: 'useState creates: [value, setter]' },
        { id: 'msg-2', type: 'info', message: "State is component's private memory" },
        { id: 'msg-3', type: 'warning', message: 'State updates are asynchronous!' },
      ],
      showDataFlow: false,
      activeView: 'tree',
    },
    duration: 5500,
  },
  {
    id: 'step-4',
    title: 'User Clicks Button - Event Triggered',
    explanation: `Let's trace what happens when a user clicks "Add 10 Points" in the Stats component. This is where React's magic truly shines!

The button in Stats has onClick={onAddPoints}. Remember, onAddPoints is actually handleAddPoints from UserProfile, passed down as a prop.

When clicked:
1. The onClick event fires
2. JavaScript calls the onAddPoints function
3. This executes handleAddPoints in UserProfile's scope
4. handleAddPoints calls setUser with a NEW object

Notice the update pattern: setUser(prev => ({ ...prev, points: prev.points + 10 }))

Why use a function instead of a value? Because state updates are batched and asynchronous. If you write setUser({ ...user, points: user.points + 10 }), you're using the CURRENT user value, which might be stale if multiple updates are queued.

The function form (prev => ...) always receives the LATEST state, ensuring correctness even with rapid updates. This is called a "functional update."`,
    highlightedLines: [32, 33, 34],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 100 }',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: false,
        renderCount: 1,
        isHighlighted: false,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '100',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: true,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
        ],
      },
      dataFlows: [
        {
          id: 'flow-callback',
          from: 'stats',
          to: 'userprofile',
          propName: 'onAddPoints()',
          value: 'called!',
          direction: 'callback',
          isActive: true,
        },
      ],
      renderPhase: 'idle',
      stateUpdates: [],
      renderEvents: [
        {
          id: 'event-1',
          componentName: 'Stats',
          reason: 'state-change',
          triggeredBy: 'button click',
          phase: 'idle',
          timestamp: Date.now(),
        },
      ],
      highlightedComponent: 'stats',
      highlightedData: 'onaddpoints-prop',
      output: [
        { id: 'msg-1', type: 'info', message: '🖱️ User clicks "Add 10 Points" button' },
        { id: 'msg-2', type: 'info', message: 'Stats calls onAddPoints() → handleAddPoints()' },
        {
          id: 'msg-3',
          type: 'state',
          message: 'setUser(prev => ({ ...prev, points: prev.points + 10 }))',
        },
      ],
      showDataFlow: true,
      activeView: 'tree',
    },
    duration: 4500,
  },
  {
    id: 'step-5',
    title: 'State Update - React Schedules Re-render',
    explanation: `When setUser is called, React doesn't immediately update the state. Instead, it:

1. SCHEDULES a re-render of UserProfile
2. BATCHES multiple state updates together (for performance)
3. Calculates the NEW state value
4. Re-renders the component with the new state

React uses a work queue to manage updates. Your setUser call adds work to this queue. React processes the queue when the call stack is empty (similar to how the Event Loop works with microtasks).

Why batch updates? Imagine clicking a button that calls setA(), setB(), setC(). Without batching, React would re-render 3 times. With batching, it re-renders ONCE with all three updates applied. Huge performance win!

In React 18+, ALL state updates are automatically batched, even inside setTimeout, promises, or native event handlers. Before React 18, only updates inside React event handlers were batched.

The state is now: { name: "Alice", points: 110 }

Watch what happens next - the entire component tree responds to this single state change!`,
    highlightedLines: [9, 10, 11, 12, 13],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 110 }',
            previousValue: '{ name: "Alice", points: 100 }',
            isHighlighted: true,
            isChanged: true,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: false,
        renderCount: 1,
        isHighlighted: true,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '100',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
        ],
      },
      dataFlows: [],
      renderPhase: 'state-update',
      stateUpdates: [
        {
          id: 'update-1',
          componentName: 'UserProfile',
          stateName: 'user.points',
          oldValue: '100',
          newValue: '110',
          trigger: 'setUser()',
          timestamp: Date.now(),
        },
      ],
      renderEvents: [],
      highlightedComponent: 'userprofile',
      highlightedData: 'user-state',
      output: [
        { id: 'msg-1', type: 'state', message: 'State updated: points 100 → 110' },
        { id: 'msg-2', type: 'render', message: 'React schedules re-render of UserProfile' },
        { id: 'msg-3', type: 'info', message: 'Updates are batched for performance' },
      ],
      showDataFlow: false,
      activeView: 'both',
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'Parent Re-renders - The Cascade Begins',
    explanation: `Now UserProfile re-renders. React calls the UserProfile function again with the NEW state values. This is crucial to understand: React literally calls your component function again!

function UserProfile() {
  // useState returns the NEW value now: points is 110
  const [user, setUser] = useState(...)  // user.points === 110
  
  // This entire function body executes again
  return (
    <div>
      <Header userName={user.name} />
      <Stats points={user.points} />  // Now passes 110!
      ...
    </div>
  );
}

When the function runs:
1. useState returns the CURRENT state (with updated points)
2. New props objects are created for children
3. New React Elements (Virtual DOM nodes) are created
4. React compares old vs new elements (reconciliation)

Every child component will receive NEW prop objects. Even if the values haven't changed, the OBJECTS are new (referential inequality). This is why Header and ThemeToggle also re-render - their props are "new" objects even though values are the same.

This is where React.memo() becomes useful - it can skip re-renders when props haven't actually changed in value.`,
    highlightedLines: [15, 16, 17, 18, 19, 20],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 110 }',
            isHighlighted: true,
            isChanged: true,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: true,
        renderCount: 2,
        isHighlighted: true,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '100 → 110',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: true,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: true,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 1,
            isHighlighted: false,
            children: [],
          },
        ],
      },
      dataFlows: [
        {
          id: 'flow-2',
          from: 'userprofile',
          to: 'stats',
          propName: 'points',
          value: '110',
          direction: 'down',
          isActive: true,
        },
      ],
      renderPhase: 'render-parent',
      stateUpdates: [],
      renderEvents: [
        {
          id: 'event-1',
          componentName: 'UserProfile',
          reason: 'state-change',
          phase: 'render-parent',
          timestamp: Date.now(),
        },
      ],
      highlightedComponent: 'userprofile',
      highlightedData: null,
      output: [
        { id: 'msg-1', type: 'render', message: '🔄 UserProfile re-renders (render #2)' },
        { id: 'msg-2', type: 'prop', message: 'New props created for all children' },
        { id: 'msg-3', type: 'info', message: 'Stats will receive points=110' },
      ],
      showDataFlow: true,
      activeView: 'both',
    },
    duration: 5000,
  },
  {
    id: 'step-7',
    title: 'Children Re-render - Props Changed!',
    explanation: `Now ALL children of UserProfile re-render. This is the default React behavior - when a parent re-renders, so do its children.

Why does React do this? Because React can't know in advance which children will have different output. Maybe Header displays a timestamp, or Stats has local state. React plays it safe by re-rendering everything.

Let's see what each child does:

1. Header: userName is still "Alice" - same value, but new object. It re-renders but produces the same output.

2. Stats: points changed from 100 to 110! It re-renders and shows the new value. The button click has now propagated through the entire system.

3. ThemeToggle: theme is still "dark" - same situation as Header.

This is where performance optimization comes in:
• React.memo(Header) - Skip re-render if props are shallowly equal
• useMemo / useCallback - Prevent recreating objects/functions
• Proper state placement - Keep state close to where it's used

The render phase is now complete. React has new Virtual DOM elements for everything. Next comes reconciliation and commit to the actual DOM.`,
    highlightedLines: [27, 28, 29, 30, 31, 32, 33],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 110 }',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: false,
        renderCount: 2,
        isHighlighted: false,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: true,
            renderCount: 2,
            isHighlighted: true,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '110',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: true,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: true,
            renderCount: 2,
            isHighlighted: true,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: true,
            renderCount: 2,
            isHighlighted: true,
            children: [],
          },
        ],
      },
      dataFlows: [],
      renderPhase: 'render-children',
      stateUpdates: [],
      renderEvents: [
        {
          id: 'event-1',
          componentName: 'Header',
          reason: 'parent-rerender',
          phase: 'render-children',
          timestamp: Date.now(),
        },
        {
          id: 'event-2',
          componentName: 'Stats',
          reason: 'props-change',
          phase: 'render-children',
          timestamp: Date.now(),
        },
        {
          id: 'event-3',
          componentName: 'ThemeToggle',
          reason: 'parent-rerender',
          phase: 'render-children',
          timestamp: Date.now(),
        },
      ],
      highlightedComponent: null,
      highlightedData: 'points-prop',
      output: [
        { id: 'msg-1', type: 'render', message: '🔄 Header re-renders (props unchanged)' },
        { id: 'msg-2', type: 'render', message: '🔄 Stats re-renders (points: 100 → 110)' },
        { id: 'msg-3', type: 'render', message: '🔄 ThemeToggle re-renders (props unchanged)' },
      ],
      showDataFlow: false,
      activeView: 'both',
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'Commit Phase - DOM Updated',
    explanation: `After rendering, React enters the "commit" phase where it actually updates the DOM. But here's the efficiency magic - React only updates what ACTUALLY changed!

React's reconciliation algorithm (the "diffing" algorithm) compared the old Virtual DOM with the new one and found:
• Header's output is identical - NO DOM update needed
• Stats shows "110" instead of "100" - TEXT NODE updated
• ThemeToggle's output is identical - NO DOM update needed

So despite ALL components re-rendering, only ONE DOM node was actually modified - the text content showing the points.

This is why React is fast:
1. JavaScript object comparison is cheap
2. DOM manipulation is expensive
3. React minimizes DOM operations through smart diffing

The render cycle is now complete:
1. ✅ Event triggered (button click)
2. ✅ Callback called (onAddPoints → handleAddPoints)
3. ✅ State updated (setUser)
4. ✅ Parent re-rendered (UserProfile)
5. ✅ Props passed (new values to children)
6. ✅ Children re-rendered (Header, Stats, ThemeToggle)
7. ✅ DOM committed (only changed text node)

The UI now reflects the new state: Points: 110`,
    highlightedLines: [],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 110 }',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: false,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: false,
        renderCount: 2,
        isHighlighted: false,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 2,
            isHighlighted: false,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '110',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 2,
            isHighlighted: true,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: false,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 2,
            isHighlighted: false,
            children: [],
          },
        ],
      },
      dataFlows: [],
      renderPhase: 'commit',
      stateUpdates: [],
      renderEvents: [],
      highlightedComponent: 'stats',
      highlightedData: 'points-prop',
      output: [
        { id: 'msg-1', type: 'render', message: '✅ DOM reconciliation complete' },
        { id: 'msg-2', type: 'info', message: 'Only 1 DOM node updated (Stats text content)' },
        { id: 'msg-3', type: 'info', message: 'Points now displays: 110' },
      ],
      showDataFlow: false,
      activeView: 'tree',
    },
    duration: 5500,
  },
  {
    id: 'step-9',
    title: 'Props & State - Key Takeaways',
    explanation: `Excellent! You've now seen the complete data flow cycle in React. Let's summarize the essential concepts:

PROPS - Data passed from parent to child
• Flow DOWN the component tree (unidirectional)
• Read-only - children should never modify props
• Changes when parent re-renders with new values
• Use callbacks (functions as props) to communicate UP

STATE - Component's internal, private data
• Created with useState (or other hooks)
• Mutable via setter function (setX)
• Changes trigger re-renders
• Updates are asynchronous and batched

THE RENDER CYCLE:
1. State changes (setX called)
2. React schedules re-render
3. Component function executes with new state
4. New props created for children
5. Children re-render (by default, all of them)
6. React diffs Virtual DOM
7. Only actual changes committed to real DOM

PERFORMANCE TIPS:
• Keep state close to where it's used
• Use React.memo() to skip unnecessary re-renders
• Use useCallback() to stabilize function references
• Use useMemo() for expensive calculations

Understanding this flow is fundamental to writing efficient React applications!`,
    highlightedLines: [],
    state: {
      componentTree: {
        id: 'userprofile',
        name: 'UserProfile',
        type: 'parent',
        props: [],
        state: [
          {
            id: 'user-state',
            name: 'user',
            value: '{ name: "Alice", points: 110 }',
            isHighlighted: true,
            isChanged: false,
            updateFunction: 'setUser',
          },
          {
            id: 'theme-state',
            name: 'theme',
            value: '"dark"',
            isHighlighted: true,
            isChanged: false,
            updateFunction: 'setTheme',
          },
        ],
        isRendering: false,
        renderCount: 2,
        isHighlighted: true,
        children: [
          {
            id: 'header',
            name: 'Header',
            type: 'child',
            props: [
              {
                id: 'username-prop',
                name: 'userName',
                value: '"Alice"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 2,
            isHighlighted: true,
            children: [],
          },
          {
            id: 'stats',
            name: 'Stats',
            type: 'child',
            props: [
              {
                id: 'points-prop',
                name: 'points',
                value: '110',
                valueType: 'number',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
              {
                id: 'onaddpoints-prop',
                name: 'onAddPoints',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 2,
            isHighlighted: true,
            children: [],
          },
          {
            id: 'themetoggle',
            name: 'ThemeToggle',
            type: 'child',
            props: [
              {
                id: 'theme-prop',
                name: 'theme',
                value: '"dark"',
                valueType: 'string',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
              {
                id: 'ontoggle-prop',
                name: 'onToggle',
                value: 'fn()',
                valueType: 'function',
                fromParent: 'UserProfile',
                isHighlighted: true,
                isChanged: false,
              },
            ],
            state: [],
            isRendering: false,
            renderCount: 2,
            isHighlighted: true,
            children: [],
          },
        ],
      },
      dataFlows: [
        {
          id: 'flow-1',
          from: 'userprofile',
          to: 'header',
          propName: 'userName',
          value: '"Alice"',
          direction: 'down',
          isActive: true,
        },
        {
          id: 'flow-2',
          from: 'userprofile',
          to: 'stats',
          propName: 'points',
          value: '110',
          direction: 'down',
          isActive: true,
        },
        {
          id: 'flow-3',
          from: 'userprofile',
          to: 'themetoggle',
          propName: 'theme',
          value: '"dark"',
          direction: 'down',
          isActive: true,
        },
      ],
      renderPhase: 'complete',
      stateUpdates: [],
      renderEvents: [],
      highlightedComponent: null,
      highlightedData: null,
      output: [
        { id: 'msg-1', type: 'info', message: '✅ Data flow cycle complete!' },
        {
          id: 'msg-2',
          type: 'info',
          message: 'Next: Learn React Hooks for powerful state management!',
        },
      ],
      showDataFlow: true,
      activeView: 'tree',
    },
    duration: 6000,
  },
];

export const propsStateKeyTakeaways = [
  'Props flow DOWN (parent → child), callbacks flow UP (child → parent)',
  'Props are read-only - never modify them, use callbacks instead',
  "State is component's private memory, created with useState hook",
  'State updates are asynchronous and batched for performance',
  'When state changes, the component re-renders with new values',
  'Parent re-render triggers children re-renders (by default)',
  'React only updates DOM nodes that actually changed (efficient diffing)',
  'Use React.memo, useCallback, useMemo for performance optimization',
];
