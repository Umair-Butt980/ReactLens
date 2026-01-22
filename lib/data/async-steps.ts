/**
 * Async & Promises visualization data
 * Demonstrates Promise states, async/await, and integration with the Event Loop
 */

import type { AsyncStep } from '@/lib/types/async.types';

/**
 * Code example for Async visualization
 */
export const asyncCode = `console.log('1. Start');

// Create a Promise
const promise = new Promise((resolve, reject) => {
  console.log('2. Promise executor');
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

// Attach .then() handler
promise.then(result => {
  console.log('5. Promise resolved:', result);
});

console.log('3. After promise');

// Using async/await
async function fetchData() {
  console.log('4. Fetching...');
  const result = await promise;
  console.log('6. Got result:', result);
  return result;
}

fetchData();

console.log('4. End of sync code');

// Output order:
// 1. Start
// 2. Promise executor
// 3. After promise
// 4. End of sync code
// 4. Fetching...
// 5. Promise resolved: Success!
// 6. Got result: Success!`;

/**
 * Steps for Async & Promises visualization
 */
export const asyncSteps: AsyncStep[] = [
  {
    id: 'step-1',
    title: 'Synchronous Code Runs First',
    explanation:
      'JavaScript executes synchronous code line by line, top to bottom. The first console.log runs immediately and gets added to the call stack, executes, and prints "1. Start".',
    highlightedLines: [1],
    animationState: {
      callStack: [
        { id: 'global', name: 'Global', color: '#8B5CF6' },
        { id: 'log1', name: 'console.log("1. Start")', color: '#06B6D4' },
      ],
      webAPIs: [],
      taskQueue: [],
      microtaskQueue: [],
      promises: [],
      consoleOutput: ['1. Start'],
      currentPhase: 'sync',
    },
    duration: 2500,
  },
  {
    id: 'step-2',
    title: 'Creating a Promise',
    explanation:
      "When you create a Promise with new Promise(), the executor function (the callback you pass) runs IMMEDIATELY and synchronously. It doesn't wait - it executes right now! This is important to understand.",
    highlightedLines: [4, 5, 6, 7, 8, 9],
    animationState: {
      callStack: [
        { id: 'global', name: 'Global', color: '#8B5CF6' },
        { id: 'executor', name: 'Promise Executor', color: '#EC4899' },
      ],
      webAPIs: [],
      taskQueue: [],
      microtaskQueue: [],
      promises: [{ id: 'p1', name: 'promise', status: 'pending', color: '#FBBF24' }],
      consoleOutput: ['1. Start', '2. Promise executor'],
      currentPhase: 'sync',
      highlightedPromiseId: 'p1',
    },
    duration: 3000,
  },
  {
    id: 'step-3',
    title: 'setTimeout Goes to Web API',
    explanation:
      'Inside the executor, setTimeout is called. Since setTimeout is a Web API (provided by the browser), JavaScript hands it off to the browser to handle. The timer starts running in the background while JavaScript continues executing.',
    highlightedLines: [6, 7, 8],
    animationState: {
      callStack: [{ id: 'global', name: 'Global', color: '#8B5CF6' }],
      webAPIs: [
        {
          id: 'timer1',
          type: 'setTimeout',
          label: 'setTimeout(resolve, 1000ms)',
          remaining: 1000,
          color: '#F97316',
        },
      ],
      taskQueue: [],
      microtaskQueue: [],
      promises: [{ id: 'p1', name: 'promise', status: 'pending', color: '#FBBF24' }],
      consoleOutput: ['1. Start', '2. Promise executor'],
      currentPhase: 'webapi',
      highlightedPromiseId: 'p1',
    },
    duration: 2500,
  },
  {
    id: 'step-4',
    title: 'Registering .then() Handler',
    explanation:
      'The .then() handler is registered on the Promise. This doesn\'t execute the callback - it just tells the Promise "when you resolve, run this function". The callback is stored for later. JavaScript continues to the next line.',
    highlightedLines: [12, 13, 14],
    animationState: {
      callStack: [{ id: 'global', name: 'Global', color: '#8B5CF6' }],
      webAPIs: [
        {
          id: 'timer1',
          type: 'setTimeout',
          label: 'setTimeout(resolve, 1000ms)',
          remaining: 800,
          color: '#F97316',
        },
      ],
      taskQueue: [],
      microtaskQueue: [],
      promises: [{ id: 'p1', name: 'promise', status: 'pending', color: '#FBBF24' }],
      consoleOutput: ['1. Start', '2. Promise executor', '// .then() handler registered'],
      currentPhase: 'sync',
      highlightedPromiseId: 'p1',
    },
    duration: 2500,
  },
  {
    id: 'step-5',
    title: 'More Sync Code',
    explanation:
      'Synchronous code continues. "3. After promise" is logged. The Promise is still pending because setTimeout hasn\'t finished yet. JavaScript doesn\'t wait - it keeps going!',
    highlightedLines: [16],
    animationState: {
      callStack: [
        { id: 'global', name: 'Global', color: '#8B5CF6' },
        { id: 'log3', name: 'console.log("3. After...")', color: '#06B6D4' },
      ],
      webAPIs: [
        {
          id: 'timer1',
          type: 'setTimeout',
          label: 'setTimeout(resolve, 1000ms)',
          remaining: 500,
          color: '#F97316',
        },
      ],
      taskQueue: [],
      microtaskQueue: [],
      promises: [{ id: 'p1', name: 'promise', status: 'pending', color: '#FBBF24' }],
      consoleOutput: ['1. Start', '2. Promise executor', '3. After promise'],
      currentPhase: 'sync',
    },
    duration: 2000,
  },
  {
    id: 'step-6',
    title: 'Async Function Called',
    explanation:
      'The async function fetchData() is called. async functions return a Promise automatically. When the function body starts executing, it runs synchronously until it hits the first await.',
    highlightedLines: [19, 20],
    animationState: {
      callStack: [
        { id: 'global', name: 'Global', color: '#8B5CF6' },
        { id: 'fetchData', name: 'fetchData()', isAsync: true, color: '#10B981' },
      ],
      webAPIs: [
        {
          id: 'timer1',
          type: 'setTimeout',
          label: 'setTimeout(resolve, 1000ms)',
          remaining: 300,
          color: '#F97316',
        },
      ],
      taskQueue: [],
      microtaskQueue: [],
      promises: [
        { id: 'p1', name: 'promise', status: 'pending', color: '#FBBF24' },
        { id: 'p2', name: 'fetchData()', status: 'pending', color: '#10B981' },
      ],
      consoleOutput: ['1. Start', '2. Promise executor', '3. After promise', '4. Fetching...'],
      currentPhase: 'sync',
    },
    duration: 2500,
  },
  {
    id: 'step-7',
    title: 'await Pauses the Async Function',
    explanation:
      'When we hit "await promise", the async function PAUSES. It doesn\'t block anything - it just suspends THIS function and returns control to the caller. The rest of the sync code continues running.',
    highlightedLines: [21],
    animationState: {
      callStack: [{ id: 'global', name: 'Global', color: '#8B5CF6' }],
      webAPIs: [
        {
          id: 'timer1',
          type: 'setTimeout',
          label: 'setTimeout(resolve, 1000ms)',
          remaining: 100,
          color: '#F97316',
        },
        { id: 'await1', type: 'Promise', label: 'await promise', color: '#10B981' },
      ],
      taskQueue: [],
      microtaskQueue: [],
      promises: [
        { id: 'p1', name: 'promise', status: 'pending', color: '#FBBF24' },
        { id: 'p2', name: 'fetchData()', status: 'pending', color: '#10B981' },
      ],
      consoleOutput: [
        '1. Start',
        '2. Promise executor',
        '3. After promise',
        '4. Fetching...',
        '// await - function paused',
      ],
      currentPhase: 'sync',
    },
    duration: 2500,
  },
  {
    id: 'step-8',
    title: 'Remaining Sync Code',
    explanation:
      'After the async function pauses at await, the remaining synchronous code runs. "4. End of sync code" is logged. Now the call stack is empty and the Event Loop can check the queues!',
    highlightedLines: [27],
    animationState: {
      callStack: [
        { id: 'global', name: 'Global', color: '#8B5CF6' },
        { id: 'log4', name: 'console.log("4. End...")', color: '#06B6D4' },
      ],
      webAPIs: [
        {
          id: 'timer1',
          type: 'setTimeout',
          label: 'Timer complete!',
          remaining: 0,
          color: '#22c55e',
        },
        { id: 'await1', type: 'Promise', label: 'await promise', color: '#10B981' },
      ],
      taskQueue: [],
      microtaskQueue: [],
      promises: [
        { id: 'p1', name: 'promise', status: 'pending', color: '#FBBF24' },
        { id: 'p2', name: 'fetchData()', status: 'pending', color: '#10B981' },
      ],
      consoleOutput: [
        '1. Start',
        '2. Promise executor',
        '3. After promise',
        '4. Fetching...',
        '4. End of sync code',
      ],
      currentPhase: 'sync',
    },
    duration: 2500,
  },
  {
    id: 'step-9',
    title: 'Timer Completes → resolve() Called',
    explanation:
      'The setTimeout completes and its callback runs, calling resolve("Success!"). When a Promise resolves, all its .then() handlers are added to the MICROTASK queue - not executed immediately!',
    highlightedLines: [7],
    animationState: {
      callStack: [
        { id: 'callback', name: 'setTimeout callback', color: '#F97316' },
        { id: 'resolve', name: 'resolve("Success!")', color: '#22c55e' },
      ],
      webAPIs: [],
      taskQueue: [],
      microtaskQueue: [
        { id: 'mt1', type: 'promise', label: '.then() handler', promiseId: 'p1', color: '#FBBF24' },
        {
          id: 'mt2',
          type: 'promise',
          label: 'Resume fetchData',
          promiseId: 'p2',
          color: '#10B981',
        },
      ],
      promises: [
        { id: 'p1', name: 'promise', status: 'fulfilled', value: 'Success!', color: '#22c55e' },
        { id: 'p2', name: 'fetchData()', status: 'pending', color: '#10B981' },
      ],
      consoleOutput: [
        '1. Start',
        '2. Promise executor',
        '3. After promise',
        '4. Fetching...',
        '4. End of sync code',
        '// Promise resolved with "Success!"',
      ],
      currentPhase: 'microtask',
      highlightedPromiseId: 'p1',
    },
    duration: 3000,
  },
  {
    id: 'step-10',
    title: 'Microtasks Execute',
    explanation:
      'The Event Loop processes the MICROTASK queue before moving to the next macrotask. First, the .then() handler runs, logging the resolved value. Microtasks have higher priority than regular callbacks!',
    highlightedLines: [13],
    animationState: {
      callStack: [{ id: 'then', name: '.then(result => {...})', color: '#FBBF24' }],
      webAPIs: [],
      taskQueue: [],
      microtaskQueue: [
        {
          id: 'mt2',
          type: 'promise',
          label: 'Resume fetchData',
          promiseId: 'p2',
          color: '#10B981',
        },
      ],
      promises: [
        { id: 'p1', name: 'promise', status: 'fulfilled', value: 'Success!', color: '#22c55e' },
        { id: 'p2', name: 'fetchData()', status: 'pending', color: '#10B981' },
      ],
      consoleOutput: [
        '1. Start',
        '2. Promise executor',
        '3. After promise',
        '4. Fetching...',
        '4. End of sync code',
        '5. Promise resolved: Success!',
      ],
      currentPhase: 'microtask',
    },
    duration: 2500,
  },
  {
    id: 'step-11',
    title: 'Async Function Resumes',
    explanation:
      'Next, the awaited Promise resolved, so fetchData() resumes from where it paused. The result is now available, and it logs "6. Got result: Success!". The async function completes and its own Promise resolves.',
    highlightedLines: [22, 23],
    animationState: {
      callStack: [
        { id: 'fetchData', name: 'fetchData() resumed', isAsync: true, color: '#10B981' },
      ],
      webAPIs: [],
      taskQueue: [],
      microtaskQueue: [],
      promises: [
        { id: 'p1', name: 'promise', status: 'fulfilled', value: 'Success!', color: '#22c55e' },
        { id: 'p2', name: 'fetchData()', status: 'fulfilled', value: 'Success!', color: '#22c55e' },
      ],
      consoleOutput: [
        '1. Start',
        '2. Promise executor',
        '3. After promise',
        '4. Fetching...',
        '4. End of sync code',
        '5. Promise resolved: Success!',
        '6. Got result: Success!',
      ],
      currentPhase: 'microtask',
    },
    duration: 2500,
  },
  {
    id: 'step-12',
    title: 'Execution Complete!',
    explanation:
      'All code has finished executing. The key insight: Promises and async/await let you write asynchronous code that looks synchronous, but under the hood, everything is coordinated through the Event Loop, task queues, and microtask queues.',
    highlightedLines: [30, 31, 32, 33, 34, 35, 36],
    animationState: {
      callStack: [],
      webAPIs: [],
      taskQueue: [],
      microtaskQueue: [],
      promises: [
        { id: 'p1', name: 'promise', status: 'fulfilled', value: 'Success!', color: '#22c55e' },
        { id: 'p2', name: 'fetchData()', status: 'fulfilled', value: 'Success!', color: '#22c55e' },
      ],
      consoleOutput: [
        '// Final output order:',
        '1. Start',
        '2. Promise executor',
        '3. After promise',
        '4. Fetching...',
        '4. End of sync code',
        '5. Promise resolved: Success!',
        '6. Got result: Success!',
      ],
      currentPhase: undefined,
    },
    duration: 3000,
  },
];

/**
 * Key takeaways for Async & Promises topic
 */
export const asyncKeyTakeaways = [
  'Promise executors run synchronously when the Promise is created',
  '.then() handlers are queued as microtasks when the Promise resolves',
  'Microtasks have priority over macrotasks (setTimeout, events)',
  'async/await is syntactic sugar over Promises - same behavior, cleaner code',
  'await pauses the async function, not the entire program',
  'Understanding the Event Loop helps debug async timing issues',
];
