/**
 * Step-by-step data for Closures & Scope visualization
 */

import type { ClosureStep } from '@/lib/types';

export const closureCode = `function createCounter() {
  let count = 0;
  
  function increment() {
    count++;
    console.log(count);
  }
  
  return increment;
}

const counter = createCounter();
counter();  // 1
counter();  // 2
counter();  // 3`;

export const closureSteps: ClosureStep[] = [
  {
    id: 'step-1',
    title: 'Global Scope Established',
    explanation: `We start with the Global Scope. The function "createCounter" is declared and stored in global memory. At this point, no inner functions exist yet - they'll be created when createCounter is called. Notice that createCounter has access to the global scope, but we can't see inside it until it's executed.`,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    state: {
      scopes: [
        {
          id: 'global',
          name: 'Global Scope',
          type: 'global',
          variables: [
            {
              id: 'createCounter',
              name: 'createCounter',
              value: 'ƒ createCounter()',
              type: 'function',
            },
          ],
          color: '#8B5CF6',
          isActive: true,
        },
      ],
      scopeChain: [
        {
          id: 'global-chain',
          contextName: 'Global',
          variables: [{ id: 'createCounter', name: 'createCounter', value: 'ƒ', type: 'function' }],
          isActive: true,
          color: '#8B5CF6',
        },
      ],
      closureFormed: false,
      output: [],
      currentScope: 'global',
    },
    duration: 3500,
  },
  {
    id: 'step-2',
    title: 'createCounter() is Called',
    explanation: `Line 12 calls createCounter(). A new execution context is created with its own scope. Inside this scope, the variable "count" is declared and initialized to 0. This is a LOCAL variable - it only exists within createCounter's scope. The inner function "increment" is also being defined but hasn't been called yet.`,
    highlightedLines: [12],
    state: {
      scopes: [
        {
          id: 'global',
          name: 'Global Scope',
          type: 'global',
          variables: [
            {
              id: 'createCounter',
              name: 'createCounter',
              value: 'ƒ createCounter()',
              type: 'function',
            },
            { id: 'counter', name: 'counter', value: '<uninitialized>', type: 'const' },
          ],
          color: '#8B5CF6',
          isActive: false,
        },
        {
          id: 'createCounter',
          name: 'createCounter() Scope',
          type: 'function',
          variables: [{ id: 'count', name: 'count', value: '0', type: 'let' }],
          color: '#06B6D4',
          isActive: true,
        },
      ],
      scopeChain: [
        {
          id: 'global-chain',
          contextName: 'Global',
          variables: [{ id: 'createCounter', name: 'createCounter', value: 'ƒ', type: 'function' }],
          isActive: false,
          color: '#8B5CF6',
        },
        {
          id: 'createCounter-chain',
          contextName: 'createCounter()',
          variables: [{ id: 'count', name: 'count', value: '0', type: 'let' }],
          isActive: true,
          color: '#06B6D4',
        },
      ],
      closureFormed: false,
      output: [],
      currentScope: 'createCounter',
    },
    duration: 3500,
  },
  {
    id: 'step-3',
    title: 'increment Function is Defined',
    explanation: `Inside createCounter, the "increment" function is defined. Here's the magic: when a function is created, it captures a reference to its surrounding scope (lexical environment). The increment function now has a hidden [[Scope]] property that points to createCounter's scope where "count" lives. This is the foundation of closures!`,
    highlightedLines: [4, 5, 6, 7],
    state: {
      scopes: [
        {
          id: 'global',
          name: 'Global Scope',
          type: 'global',
          variables: [
            {
              id: 'createCounter',
              name: 'createCounter',
              value: 'ƒ createCounter()',
              type: 'function',
            },
            { id: 'counter', name: 'counter', value: '<uninitialized>', type: 'const' },
          ],
          color: '#8B5CF6',
          isActive: false,
        },
        {
          id: 'createCounter',
          name: 'createCounter() Scope',
          type: 'function',
          variables: [
            { id: 'count', name: 'count', value: '0', type: 'let' },
            { id: 'increment', name: 'increment', value: 'ƒ increment()', type: 'function' },
          ],
          color: '#06B6D4',
          isActive: true,
        },
      ],
      scopeChain: [
        {
          id: 'global-chain',
          contextName: 'Global',
          variables: [{ id: 'createCounter', name: 'createCounter', value: 'ƒ', type: 'function' }],
          isActive: false,
          color: '#8B5CF6',
        },
        {
          id: 'createCounter-chain',
          contextName: 'createCounter()',
          variables: [
            { id: 'count', name: 'count', value: '0', type: 'let' },
            { id: 'increment', name: 'increment', value: 'ƒ', type: 'function' },
          ],
          isActive: true,
          color: '#06B6D4',
        },
      ],
      closureFormed: false,
      closureInfo: {
        functionName: 'increment',
        capturedVariables: ['count'],
        fromScope: 'createCounter()',
      },
      output: [],
      currentScope: 'createCounter',
    },
    duration: 4000,
  },
  {
    id: 'step-4',
    title: 'Closure is Formed - increment Returned',
    explanation: `Line 9 returns the increment function. Now something amazing happens: createCounter() finishes executing and its execution context is popped off the stack. Normally, local variables like "count" would be garbage collected. BUT - because increment has a reference to createCounter's scope, that scope is kept alive! This is a CLOSURE: a function bundled with its lexical environment.`,
    highlightedLines: [9],
    state: {
      scopes: [
        {
          id: 'global',
          name: 'Global Scope',
          type: 'global',
          variables: [
            {
              id: 'createCounter',
              name: 'createCounter',
              value: 'ƒ createCounter()',
              type: 'function',
            },
            { id: 'counter', name: 'counter', value: 'ƒ increment()', type: 'const' },
          ],
          color: '#8B5CF6',
          isActive: true,
        },
        {
          id: 'closure',
          name: '🔒 Closed-over Scope',
          type: 'function',
          variables: [{ id: 'count', name: 'count', value: '0', type: 'let' }],
          color: '#EC4899',
          isActive: false,
        },
      ],
      scopeChain: [
        {
          id: 'global-chain',
          contextName: 'Global',
          variables: [{ id: 'counter', name: 'counter', value: 'ƒ increment()', type: 'const' }],
          isActive: true,
          color: '#8B5CF6',
        },
        {
          id: 'closure-chain',
          contextName: '🔒 Closure (count)',
          variables: [{ id: 'count', name: 'count', value: '0', type: 'let' }],
          isActive: false,
          color: '#EC4899',
        },
      ],
      closureFormed: true,
      closureInfo: {
        functionName: 'counter (increment)',
        capturedVariables: ['count'],
        fromScope: 'createCounter()',
      },
      output: [],
      currentScope: 'global',
    },
    duration: 4500,
  },
  {
    id: 'step-5',
    title: 'First counter() Call',
    explanation: `Line 13 calls counter() (which is the increment function). A new execution context is created for increment. When increment looks for "count", it's not in its own scope - so it follows the scope chain to the closure. It finds count = 0, increments it to 1, and logs it. The closure's "count" is modified!`,
    highlightedLines: [13],
    state: {
      scopes: [
        {
          id: 'global',
          name: 'Global Scope',
          type: 'global',
          variables: [
            {
              id: 'createCounter',
              name: 'createCounter',
              value: 'ƒ createCounter()',
              type: 'function',
            },
            { id: 'counter', name: 'counter', value: 'ƒ increment()', type: 'const' },
          ],
          color: '#8B5CF6',
          isActive: false,
        },
        {
          id: 'closure',
          name: '🔒 Closed-over Scope',
          type: 'function',
          variables: [{ id: 'count', name: 'count', value: '1', type: 'let' }],
          color: '#EC4899',
          isActive: true,
        },
        {
          id: 'increment',
          name: 'increment() Scope',
          type: 'function',
          variables: [],
          color: '#F97316',
          isActive: true,
        },
      ],
      scopeChain: [
        {
          id: 'global-chain',
          contextName: 'Global',
          variables: [{ id: 'counter', name: 'counter', value: 'ƒ', type: 'const' }],
          isActive: false,
          color: '#8B5CF6',
        },
        {
          id: 'closure-chain',
          contextName: '🔒 Closure',
          variables: [{ id: 'count', name: 'count', value: '1', type: 'let' }],
          isActive: true,
          color: '#EC4899',
        },
        {
          id: 'increment-chain',
          contextName: 'increment()',
          variables: [],
          isActive: true,
          color: '#F97316',
        },
      ],
      closureFormed: true,
      accessedVariable: { name: 'count', fromScope: 'Closure' },
      output: ['1'],
      currentScope: 'increment',
    },
    duration: 4000,
  },
  {
    id: 'step-6',
    title: 'Second counter() Call',
    explanation: `Line 14 calls counter() again. The same closure is accessed - and count is still 1 from the previous call! The increment function accesses count through the scope chain, increments it to 2, and logs it. The closure maintains STATE between function calls - this is incredibly powerful for creating private variables and encapsulation.`,
    highlightedLines: [14],
    state: {
      scopes: [
        {
          id: 'global',
          name: 'Global Scope',
          type: 'global',
          variables: [
            {
              id: 'createCounter',
              name: 'createCounter',
              value: 'ƒ createCounter()',
              type: 'function',
            },
            { id: 'counter', name: 'counter', value: 'ƒ increment()', type: 'const' },
          ],
          color: '#8B5CF6',
          isActive: false,
        },
        {
          id: 'closure',
          name: '🔒 Closed-over Scope',
          type: 'function',
          variables: [{ id: 'count', name: 'count', value: '2', type: 'let' }],
          color: '#EC4899',
          isActive: true,
        },
        {
          id: 'increment',
          name: 'increment() Scope',
          type: 'function',
          variables: [],
          color: '#F97316',
          isActive: true,
        },
      ],
      scopeChain: [
        {
          id: 'global-chain',
          contextName: 'Global',
          variables: [{ id: 'counter', name: 'counter', value: 'ƒ', type: 'const' }],
          isActive: false,
          color: '#8B5CF6',
        },
        {
          id: 'closure-chain',
          contextName: '🔒 Closure',
          variables: [{ id: 'count', name: 'count', value: '2', type: 'let' }],
          isActive: true,
          color: '#EC4899',
        },
        {
          id: 'increment-chain',
          contextName: 'increment()',
          variables: [],
          isActive: true,
          color: '#F97316',
        },
      ],
      closureFormed: true,
      accessedVariable: { name: 'count', fromScope: 'Closure' },
      output: ['1', '2'],
      currentScope: 'increment',
    },
    duration: 3500,
  },
  {
    id: 'step-7',
    title: 'Third counter() Call',
    explanation: `Line 15 calls counter() one more time. Again, the closure persists! Count goes from 2 to 3. Notice that "count" is completely private - there's no way to access it from outside except through the counter function. This is the Module Pattern in action: closures enable private state in JavaScript, which doesn't have built-in private variables.`,
    highlightedLines: [15],
    state: {
      scopes: [
        {
          id: 'global',
          name: 'Global Scope',
          type: 'global',
          variables: [
            {
              id: 'createCounter',
              name: 'createCounter',
              value: 'ƒ createCounter()',
              type: 'function',
            },
            { id: 'counter', name: 'counter', value: 'ƒ increment()', type: 'const' },
          ],
          color: '#8B5CF6',
          isActive: false,
        },
        {
          id: 'closure',
          name: '🔒 Closed-over Scope',
          type: 'function',
          variables: [{ id: 'count', name: 'count', value: '3', type: 'let' }],
          color: '#EC4899',
          isActive: true,
        },
        {
          id: 'increment',
          name: 'increment() Scope',
          type: 'function',
          variables: [],
          color: '#F97316',
          isActive: true,
        },
      ],
      scopeChain: [
        {
          id: 'global-chain',
          contextName: 'Global',
          variables: [{ id: 'counter', name: 'counter', value: 'ƒ', type: 'const' }],
          isActive: false,
          color: '#8B5CF6',
        },
        {
          id: 'closure-chain',
          contextName: '🔒 Closure',
          variables: [{ id: 'count', name: 'count', value: '3', type: 'let' }],
          isActive: true,
          color: '#EC4899',
        },
        {
          id: 'increment-chain',
          contextName: 'increment()',
          variables: [],
          isActive: true,
          color: '#F97316',
        },
      ],
      closureFormed: true,
      accessedVariable: { name: 'count', fromScope: 'Closure' },
      output: ['1', '2', '3'],
      currentScope: 'increment',
    },
    duration: 3500,
  },
  {
    id: 'step-8',
    title: 'Closures Explained!',
    explanation: `You've just seen closures in action! A closure is created when a function "remembers" its lexical scope even when executed outside that scope. Key points: 1) Functions capture their surrounding scope at creation time, 2) This scope persists even after the outer function returns, 3) Multiple calls share the same closure, 4) This enables private variables and stateful functions. Closures are used everywhere: event handlers, callbacks, React hooks, and module patterns!`,
    highlightedLines: [],
    state: {
      scopes: [
        {
          id: 'global',
          name: 'Global Scope',
          type: 'global',
          variables: [
            {
              id: 'createCounter',
              name: 'createCounter',
              value: 'ƒ createCounter()',
              type: 'function',
            },
            { id: 'counter', name: 'counter', value: 'ƒ increment()', type: 'const' },
          ],
          color: '#8B5CF6',
          isActive: true,
        },
        {
          id: 'closure',
          name: '🔒 Closed-over Scope',
          type: 'function',
          variables: [{ id: 'count', name: 'count', value: '3', type: 'let' }],
          color: '#EC4899',
          isActive: true,
        },
      ],
      scopeChain: [
        {
          id: 'global-chain',
          contextName: 'Global',
          variables: [{ id: 'counter', name: 'counter', value: 'ƒ', type: 'const' }],
          isActive: true,
          color: '#8B5CF6',
        },
        {
          id: 'closure-chain',
          contextName: '🔒 Closure (persists!)',
          variables: [{ id: 'count', name: 'count', value: '3', type: 'let' }],
          isActive: true,
          color: '#EC4899',
        },
      ],
      closureFormed: true,
      closureInfo: {
        functionName: 'counter',
        capturedVariables: ['count'],
        fromScope: 'createCounter()',
      },
      output: ['1', '2', '3'],
      currentScope: 'global',
    },
    duration: 5000,
  },
];

export const closureKeyTakeaways = [
  'A closure is a function bundled with its lexical environment (surrounding scope)',
  'Functions "remember" variables from their outer scope, even after that scope closes',
  'Closures enable private variables - encapsulation without classes',
  'Each call to a factory function creates a NEW closure with its own state',
  'The scope chain is used to look up variables: local → closure → global',
  'Closures are used in callbacks, event handlers, React hooks, and module patterns',
];
