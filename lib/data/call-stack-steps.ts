/**
 * Step-by-step data for Call Stack visualization
 */

import type { CallStackStep } from '@/lib/types';

export const callStackCode = `function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return message;
}

function main() {
  const result = greet("World");
  console.log("Done!");
}

main();`;

export const callStackSteps: CallStackStep[] = [
  {
    id: 'step-1',
    title: 'Global Execution Context Created',
    explanation: `When JavaScript starts running your code, the first thing it does is create a Global Execution Context. This is the base environment where your top-level code runs. The Global Execution Context has two phases: Creation Phase (where functions and variables are hoisted) and Execution Phase (where code runs line by line). The "this" keyword in the global context refers to the global object (window in browsers, global in Node.js).`,
    highlightedLines: [],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
      ],
      currentLine: 0,
      phase: 'creation',
      output: [],
    },
    duration: 3000,
  },
  {
    id: 'step-2',
    title: 'Functions Hoisted to Memory',
    explanation: `During the Creation Phase, JavaScript scans your code and allocates memory for function declarations. Both "greet" and "main" functions are stored in the Global Execution Context's variable environment. Function declarations are fully hoisted - meaning the entire function definition is available before any code runs. This is why you can call functions before they appear in your code!`,
    highlightedLines: [1, 2, 3, 4, 5, 7, 8, 9, 10],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
      ],
      currentLine: 0,
      phase: 'creation',
      output: [],
    },
    duration: 3500,
  },
  {
    id: 'step-3',
    title: 'Execution Phase Begins',
    explanation: `Now the Execution Phase begins. JavaScript reads your code line by line. It encounters the function declarations but doesn't execute them - they're just definitions. The engine moves to the actual function call at line 12: main(). When a function is called, JavaScript creates a brand new Execution Context for that function.`,
    highlightedLines: [12],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
      ],
      currentLine: 12,
      phase: 'execution',
      output: [],
    },
    duration: 3000,
  },
  {
    id: 'step-4',
    title: 'main() Context Created & Pushed',
    explanation: `When main() is called, a new Function Execution Context is created and PUSHED onto the Call Stack on top of the Global Context. This new context has its own variable environment. The "outer reference" points to the Global Context, allowing main() to access global variables and functions. The Call Stack follows LIFO (Last In, First Out) - the most recent context is always on top.`,
    highlightedLines: [7],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
        {
          id: 'main',
          name: 'main()',
          type: 'function',
          variableEnvironment: [],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#06B6D4',
        },
      ],
      currentLine: 7,
      phase: 'creation',
      output: [],
    },
    duration: 3500,
  },
  {
    id: 'step-5',
    title: 'main() Variable Environment Setup',
    explanation: `Inside main(), the variable "result" is declared with const. During the creation phase of main()'s execution context, "result" is allocated in memory but not yet initialized (it's in the Temporal Dead Zone until the assignment runs). JavaScript is now ready to execute the code inside main().`,
    highlightedLines: [8],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
        {
          id: 'main',
          name: 'main()',
          type: 'function',
          variableEnvironment: [
            { id: 'result', name: 'result', value: '<uninitialized>', type: 'const' },
          ],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#06B6D4',
        },
      ],
      currentLine: 8,
      phase: 'execution',
      output: [],
    },
    duration: 3000,
  },
  {
    id: 'step-6',
    title: 'greet() Called - New Context Pushed',
    explanation: `Line 8 calls greet("World"). Another new Execution Context is created for greet() and pushed onto the stack. Notice we now have THREE contexts stacked! The parameter "name" receives the value "World" and is stored in greet's variable environment. JavaScript always executes the TOP context on the stack.`,
    highlightedLines: [1],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
        {
          id: 'main',
          name: 'main()',
          type: 'function',
          variableEnvironment: [
            { id: 'result', name: 'result', value: '<uninitialized>', type: 'const' },
          ],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#06B6D4',
        },
        {
          id: 'greet',
          name: 'greet("World")',
          type: 'function',
          variableEnvironment: [{ id: 'name', name: 'name', value: '"World"', type: 'parameter' }],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#F97316',
        },
      ],
      currentLine: 1,
      phase: 'creation',
      output: [],
    },
    duration: 3500,
  },
  {
    id: 'step-7',
    title: 'greet() Executes - Variables Created',
    explanation: `Inside greet(), the const "message" is created and assigned the concatenated string "Hello, World". The variable is stored in greet's local variable environment. Each function has its own isolated scope - "message" only exists within greet() and cannot be accessed from main() or Global.`,
    highlightedLines: [2],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
        {
          id: 'main',
          name: 'main()',
          type: 'function',
          variableEnvironment: [
            { id: 'result', name: 'result', value: '<uninitialized>', type: 'const' },
          ],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#06B6D4',
        },
        {
          id: 'greet',
          name: 'greet("World")',
          type: 'function',
          variableEnvironment: [
            { id: 'name', name: 'name', value: '"World"', type: 'parameter' },
            { id: 'message', name: 'message', value: '"Hello, World"', type: 'const' },
          ],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#F97316',
        },
      ],
      currentLine: 2,
      phase: 'execution',
      output: [],
    },
    duration: 3000,
  },
  {
    id: 'step-8',
    title: 'console.log() in greet()',
    explanation: `The console.log(message) executes, printing "Hello, World" to the console. Note that console.log itself briefly pushes its own context onto the stack (though we simplify this in the visualization). The important thing is that greet() can access its local "message" variable.`,
    highlightedLines: [3],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
        {
          id: 'main',
          name: 'main()',
          type: 'function',
          variableEnvironment: [
            { id: 'result', name: 'result', value: '<uninitialized>', type: 'const' },
          ],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#06B6D4',
        },
        {
          id: 'greet',
          name: 'greet("World")',
          type: 'function',
          variableEnvironment: [
            { id: 'name', name: 'name', value: '"World"', type: 'parameter' },
            { id: 'message', name: 'message', value: '"Hello, World"', type: 'const' },
          ],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#F97316',
        },
      ],
      currentLine: 3,
      phase: 'execution',
      output: ['Hello, World'],
    },
    duration: 3000,
  },
  {
    id: 'step-9',
    title: 'greet() Returns - Context Popped',
    explanation: `The greet() function returns "message" and its Execution Context is POPPED off the Call Stack. All local variables (name, message) are destroyed - they no longer exist in memory! The return value is passed back to main(), where it will be assigned to "result". Control returns to main().`,
    highlightedLines: [4],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
        {
          id: 'main',
          name: 'main()',
          type: 'function',
          variableEnvironment: [
            { id: 'result', name: 'result', value: '"Hello, World"', type: 'const' },
          ],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#06B6D4',
        },
      ],
      currentLine: 8,
      phase: 'execution',
      output: ['Hello, World'],
    },
    duration: 3500,
  },
  {
    id: 'step-10',
    title: 'main() Continues Execution',
    explanation: `Back in main(), the "result" variable now holds "Hello, World" (the return value from greet). The next line executes console.log("Done!"), which prints "Done!" to the console. We're almost finished with main().`,
    highlightedLines: [9],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
        {
          id: 'main',
          name: 'main()',
          type: 'function',
          variableEnvironment: [
            { id: 'result', name: 'result', value: '"Hello, World"', type: 'const' },
          ],
          outerReference: 'Global',
          thisBinding: 'window',
          color: '#06B6D4',
        },
      ],
      currentLine: 9,
      phase: 'execution',
      output: ['Hello, World', 'Done!'],
    },
    duration: 3000,
  },
  {
    id: 'step-11',
    title: 'main() Completes - Context Popped',
    explanation: `main() finishes executing and its Execution Context is popped off the stack. The "result" variable is destroyed. Only the Global Execution Context remains. All global variables and functions (greet, main) still exist and could be called again.`,
    highlightedLines: [10],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
      ],
      currentLine: 12,
      phase: 'execution',
      output: ['Hello, World', 'Done!'],
    },
    duration: 3000,
  },
  {
    id: 'step-12',
    title: 'Execution Complete!',
    explanation: `The program has finished! The Call Stack is back to just the Global Context. Key takeaways: 1) Each function call creates a new Execution Context, 2) Contexts are stacked in LIFO order, 3) Each context has its own variable environment, 4) When a function returns, its context is destroyed, 5) The outer reference allows access to parent scopes (scope chain).`,
    highlightedLines: [],
    state: {
      contexts: [
        {
          id: 'global',
          name: 'Global',
          type: 'global',
          variableEnvironment: [
            { id: 'greet', name: 'greet', value: 'ƒ greet(name)', type: 'function' },
            { id: 'main', name: 'main', value: 'ƒ main()', type: 'function' },
          ],
          outerReference: null,
          thisBinding: 'window',
          color: '#8B5CF6',
        },
      ],
      currentLine: 0,
      phase: 'execution',
      output: ['Hello, World', 'Done!'],
    },
    duration: 4000,
  },
];

export const callStackKeyTakeaways = [
  'Every JavaScript program starts with a Global Execution Context',
  'Each function call creates a new Execution Context pushed onto the stack',
  'The Call Stack follows LIFO (Last In, First Out) order',
  'Each context has its own Variable Environment storing local variables',
  'The Outer Reference creates the scope chain for variable lookup',
  'When a function returns, its Execution Context is popped and destroyed',
];
