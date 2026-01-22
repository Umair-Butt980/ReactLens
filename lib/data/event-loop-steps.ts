/**
 * Step-by-step data for Event Loop visualization
 */

import type { EventLoopStep } from '@/lib/types/event-loop.types';

export const eventLoopCode = `console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');`;

export const eventLoopSteps: EventLoopStep[] = [
  {
    id: 'step-1',
    title: 'Script Starts Executing',
    explanation: `When JavaScript starts executing your code, it creates a Global Execution Context and pushes it onto the Call Stack. The Call Stack is where JavaScript keeps track of what function is currently being executed. Think of it as a stack of plates - you can only add or remove from the top.`,
    highlightedLines: [],
    state: {
      callStack: [{ id: 'global', name: 'Global', type: 'global', color: '#8B5CF6' }],
      callbackQueue: [],
      microtaskQueue: [],
      webApis: [],
      currentPhase: 'stack',
      output: [],
    },
    duration: 3000,
  },
  {
    id: 'step-2',
    title: 'First console.log Executes',
    explanation: `The first line of code is console.log('Start'). JavaScript pushes this function call onto the Call Stack, executes it immediately (which prints "Start" to the console), and then pops it off the stack. Synchronous code like console.log runs directly on the Call Stack without any delay.`,
    highlightedLines: [1],
    state: {
      callStack: [
        { id: 'global', name: 'Global', type: 'global', color: '#8B5CF6' },
        { id: 'log-start', name: "console.log('Start')", type: 'function', color: '#06B6D4' },
      ],
      callbackQueue: [],
      microtaskQueue: [],
      webApis: [],
      currentPhase: 'stack',
      output: ['Start'],
    },
    duration: 3000,
  },
  {
    id: 'step-3',
    title: 'setTimeout is Called',
    explanation: `Next, JavaScript encounters setTimeout. This is a Web API, not part of JavaScript itself! When setTimeout is called, JavaScript hands it off to the browser's Web APIs. The timer starts counting in the background while JavaScript continues executing the rest of your code. This is what makes JavaScript "non-blocking".`,
    highlightedLines: [3, 4, 5],
    state: {
      callStack: [
        { id: 'global', name: 'Global', type: 'global', color: '#8B5CF6' },
        { id: 'settimeout', name: 'setTimeout(..., 0)', type: 'function', color: '#F97316' },
      ],
      callbackQueue: [],
      microtaskQueue: [],
      webApis: [{ id: 'timer-1', name: 'Timer (0ms)', type: 'timer', delay: 0, progress: 0 }],
      currentPhase: 'webapi',
      output: ['Start'],
    },
    duration: 3000,
  },
  {
    id: 'step-4',
    title: 'Promise.resolve().then() is Called',
    explanation: `Now JavaScript encounters a Promise. When you call Promise.resolve().then(), the Promise resolves immediately, and its .then() callback is scheduled as a Microtask. Microtasks have higher priority than regular callbacks (macrotasks). They get their own special queue and run before the Event Loop checks the Callback Queue.`,
    highlightedLines: [7, 8, 9],
    state: {
      callStack: [
        { id: 'global', name: 'Global', type: 'global', color: '#8B5CF6' },
        { id: 'promise', name: 'Promise.then()', type: 'function', color: '#EC4899' },
      ],
      callbackQueue: [],
      microtaskQueue: [
        { id: 'micro-1', name: "() => log('Promise')", type: 'microtask', source: 'Promise' },
      ],
      webApis: [{ id: 'timer-1', name: 'Timer (0ms)', type: 'timer', delay: 0, progress: 100 }],
      currentPhase: 'stack',
      output: ['Start'],
    },
    duration: 3500,
  },
  {
    id: 'step-5',
    title: 'Timer Completes, Callback Queued',
    explanation: `While we were setting up the Promise, the setTimeout timer (with 0ms delay) has completed! The Web API moves its callback function to the Callback Queue (also called the Task Queue or Macrotask Queue). But notice - even though the timer is done, the callback doesn't run yet. It has to wait for the Call Stack to be empty AND for all microtasks to complete first.`,
    highlightedLines: [7, 8, 9],
    state: {
      callStack: [{ id: 'global', name: 'Global', type: 'global', color: '#8B5CF6' }],
      callbackQueue: [
        { id: 'cb-1', name: "() => log('Timeout')", type: 'callback', source: 'setTimeout' },
      ],
      microtaskQueue: [
        { id: 'micro-1', name: "() => log('Promise')", type: 'microtask', source: 'Promise' },
      ],
      webApis: [],
      currentPhase: 'stack',
      output: ['Start'],
    },
    duration: 3000,
  },
  {
    id: 'step-6',
    title: 'Last console.log Executes',
    explanation: `JavaScript continues with the last synchronous line: console.log('End'). This gets pushed onto the Call Stack, executes immediately, prints "End" to the console, and gets popped off. Now all the synchronous code has finished running.`,
    highlightedLines: [11],
    state: {
      callStack: [
        { id: 'global', name: 'Global', type: 'global', color: '#8B5CF6' },
        { id: 'log-end', name: "console.log('End')", type: 'function', color: '#06B6D4' },
      ],
      callbackQueue: [
        { id: 'cb-1', name: "() => log('Timeout')", type: 'callback', source: 'setTimeout' },
      ],
      microtaskQueue: [
        { id: 'micro-1', name: "() => log('Promise')", type: 'microtask', source: 'Promise' },
      ],
      webApis: [],
      currentPhase: 'stack',
      output: ['Start', 'End'],
    },
    duration: 3000,
  },
  {
    id: 'step-7',
    title: 'Global Context Completes',
    explanation: `The Global Execution Context finishes and gets popped off the Call Stack. Now the Call Stack is empty! This is the moment the Event Loop has been waiting for. But before it checks the Callback Queue, it first checks if there are any Microtasks waiting.`,
    highlightedLines: [],
    state: {
      callStack: [],
      callbackQueue: [
        { id: 'cb-1', name: "() => log('Timeout')", type: 'callback', source: 'setTimeout' },
      ],
      microtaskQueue: [
        { id: 'micro-1', name: "() => log('Promise')", type: 'microtask', source: 'Promise' },
      ],
      webApis: [],
      currentPhase: 'idle',
      output: ['Start', 'End'],
    },
    duration: 3000,
  },
  {
    id: 'step-8',
    title: 'Event Loop: Process Microtasks',
    explanation: `The Event Loop sees the Call Stack is empty and immediately checks the Microtask Queue. There's a Promise callback waiting! Microtasks ALWAYS run before macrotasks. The Event Loop moves the Promise callback to the Call Stack and executes it. This prints "Promise" to the console.`,
    highlightedLines: [8],
    state: {
      callStack: [
        { id: 'micro-cb', name: "() => log('Promise')", type: 'callback', color: '#EC4899' },
      ],
      callbackQueue: [
        { id: 'cb-1', name: "() => log('Timeout')", type: 'callback', source: 'setTimeout' },
      ],
      microtaskQueue: [],
      webApis: [],
      currentPhase: 'microtask',
      output: ['Start', 'End', 'Promise'],
    },
    duration: 3500,
  },
  {
    id: 'step-9',
    title: 'Event Loop: Process Callback Queue',
    explanation: `Now the Microtask Queue is empty, so the Event Loop can finally check the Callback Queue. The setTimeout callback has been patiently waiting! The Event Loop moves it to the Call Stack and executes it. This prints "Timeout" to the console. Notice how even with a 0ms delay, setTimeout ran LAST because of the Event Loop's priority system.`,
    highlightedLines: [4],
    state: {
      callStack: [
        { id: 'timeout-cb', name: "() => log('Timeout')", type: 'callback', color: '#F97316' },
      ],
      callbackQueue: [],
      microtaskQueue: [],
      webApis: [],
      currentPhase: 'callback',
      output: ['Start', 'End', 'Promise', 'Timeout'],
    },
    duration: 3500,
  },
  {
    id: 'step-10',
    title: 'Execution Complete!',
    explanation: `All done! The final output order is: Start → End → Promise → Timeout. This demonstrates the Event Loop's priority system: 1) Synchronous code runs first on the Call Stack, 2) Microtasks (Promises) run next, 3) Macrotasks (setTimeout, setInterval) run last. Understanding this order is crucial for writing predictable asynchronous JavaScript code!`,
    highlightedLines: [],
    state: {
      callStack: [],
      callbackQueue: [],
      microtaskQueue: [],
      webApis: [],
      currentPhase: 'idle',
      output: ['Start', 'End', 'Promise', 'Timeout'],
    },
    duration: 4000,
  },
];

export const eventLoopKeyTakeaways = [
  'The Call Stack executes synchronous code one function at a time (LIFO)',
  'Web APIs handle asynchronous operations (timers, fetch, events) in the background',
  'The Callback Queue (Macrotask Queue) holds callbacks from timers and events',
  'The Microtask Queue has higher priority and holds Promise callbacks',
  "The Event Loop moves callbacks to the Call Stack only when it's empty",
  'Microtasks always run before macrotasks, even if the macrotask was queued first',
];
