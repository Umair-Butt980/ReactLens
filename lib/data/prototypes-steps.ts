/**
 * Prototypes & this visualization data
 * Demonstrates prototype chains, inheritance, and 'this' binding
 */

import type { PrototypesStep } from '@/lib/types/prototypes.types';

/**
 * Code example for Prototypes visualization
 */
export const prototypesCode = `// Creating objects with prototypes
const animal = {
  isAlive: true,
  eat() {
    console.log(this.name + ' is eating');
  }
};

const dog = Object.create(animal);
dog.name = 'Buddy';
dog.bark = function() {
  console.log(this.name + ' says woof!');
};

// Prototype chain lookup
console.log(dog.name);      // 'Buddy' (own property)
console.log(dog.isAlive);   // true (from animal)
console.log(dog.toString);  // [Function] (from Object.prototype)

// 'this' in different contexts
dog.eat();                  // 'Buddy is eating'
dog.bark();                 // 'Buddy says woof!'

// Arrow functions don't have their own 'this'
const cat = {
  name: 'Whiskers',
  meow: () => {
    console.log(this.name); // undefined (global this)
  },
  purr() {
    const inner = () => {
      console.log(this.name); // 'Whiskers' (lexical this)
    };
    inner();
  }
};

// Explicit binding
function greet() {
  console.log('Hello, ' + this.name);
}
greet.call(dog);  // 'Hello, Buddy'
greet.call(cat);  // 'Hello, Whiskers'`;

/**
 * Steps for Prototypes & this visualization
 */
export const prototypesSteps: PrototypesStep[] = [
  {
    id: 'step-1',
    title: 'What is a Prototype?',
    explanation:
      'In JavaScript, every object has a hidden link to another object called its "prototype". When you try to access a property that doesn\'t exist on an object, JavaScript looks up the prototype chain until it finds the property or reaches null.',
    highlightedLines: [2, 3, 4, 5, 6, 7],
    animationState: {
      objects: [
        {
          id: 'animal',
          name: 'animal',
          color: '#8B5CF6',
          properties: [
            { name: 'isAlive', value: 'true', type: 'data', isOwn: true },
            { name: 'eat', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'object-proto',
          name: 'Object.prototype',
          color: '#6B7280',
          prototypeOf: 'animal',
          properties: [
            { name: 'toString', value: '[Function]', type: 'method', isOwn: true },
            { name: 'hasOwnProperty', value: '[Function]', type: 'method', isOwn: true },
            { name: 'valueOf', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'null',
          name: 'null',
          color: '#374151',
          prototypeOf: 'object-proto',
          properties: [],
        },
      ],
      consoleOutput: ['// Every object has a [[Prototype]]', '// animal → Object.prototype → null'],
      focusedObjectId: 'animal',
    },
    duration: 3000,
  },
  {
    id: 'step-2',
    title: 'Creating Objects with Object.create()',
    explanation:
      'Object.create(proto) creates a new object with proto as its prototype. Here, "dog" is created with "animal" as its prototype. This means dog can access animal\'s properties through the prototype chain.',
    highlightedLines: [9, 10, 11, 12, 13],
    animationState: {
      objects: [
        {
          id: 'dog',
          name: 'dog',
          color: '#06B6D4',
          isHighlighted: true,
          properties: [
            { name: 'name', value: '"Buddy"', type: 'data', isOwn: true },
            { name: 'bark', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'animal',
          name: 'animal',
          color: '#8B5CF6',
          prototypeOf: 'dog',
          properties: [
            { name: 'isAlive', value: 'true', type: 'data', isOwn: true },
            { name: 'eat', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'object-proto',
          name: 'Object.prototype',
          color: '#6B7280',
          prototypeOf: 'animal',
          properties: [{ name: 'toString', value: '[Function]', type: 'method', isOwn: true }],
        },
      ],
      consoleOutput: [
        '// dog → animal → Object.prototype → null',
        '// dog.name = "Buddy" (own property)',
        '// dog.isAlive → found on animal',
      ],
      focusedObjectId: 'dog',
    },
    duration: 3000,
  },
  {
    id: 'step-3',
    title: 'Own Property Lookup',
    explanation:
      'When you access dog.name, JavaScript first checks if "name" exists directly on dog (an "own property"). It does! So it returns "Buddy" immediately without looking up the chain.',
    highlightedLines: [16],
    animationState: {
      objects: [
        {
          id: 'dog',
          name: 'dog',
          color: '#06B6D4',
          isHighlighted: true,
          properties: [
            { name: 'name', value: '"Buddy"', type: 'data', isOwn: true, isHighlighted: true },
            { name: 'bark', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'animal',
          name: 'animal',
          color: '#8B5CF6',
          prototypeOf: 'dog',
          properties: [
            { name: 'isAlive', value: 'true', type: 'data', isOwn: true },
            { name: 'eat', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'object-proto',
          name: 'Object.prototype',
          color: '#6B7280',
          prototypeOf: 'animal',
          properties: [{ name: 'toString', value: '[Function]', type: 'method', isOwn: true }],
        },
      ],
      propertyLookup: {
        propertyName: 'name',
        currentObjectId: 'dog',
        found: true,
        path: ['dog'],
      },
      consoleOutput: ['> dog.name', '1. Check dog → ✓ Found "name"', '< "Buddy"'],
      focusedObjectId: 'dog',
    },
    duration: 2500,
  },
  {
    id: 'step-4',
    title: 'Prototype Chain Lookup',
    explanation:
      'When you access dog.isAlive, JavaScript checks dog first - not found. Then it follows the [[Prototype]] link to animal - found! It returns true. This is prototype chain inheritance.',
    highlightedLines: [17],
    animationState: {
      objects: [
        {
          id: 'dog',
          name: 'dog',
          color: '#06B6D4',
          properties: [
            { name: 'name', value: '"Buddy"', type: 'data', isOwn: true },
            { name: 'bark', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'animal',
          name: 'animal',
          color: '#8B5CF6',
          prototypeOf: 'dog',
          isHighlighted: true,
          properties: [
            { name: 'isAlive', value: 'true', type: 'data', isOwn: true, isHighlighted: true },
            { name: 'eat', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'object-proto',
          name: 'Object.prototype',
          color: '#6B7280',
          prototypeOf: 'animal',
          properties: [{ name: 'toString', value: '[Function]', type: 'method', isOwn: true }],
        },
      ],
      propertyLookup: {
        propertyName: 'isAlive',
        currentObjectId: 'animal',
        found: true,
        path: ['dog', 'animal'],
      },
      consoleOutput: [
        '> dog.isAlive',
        '1. Check dog → ✗ Not found',
        '2. Check animal → ✓ Found "isAlive"',
        '< true',
      ],
      focusedObjectId: 'animal',
    },
    duration: 3000,
  },
  {
    id: 'step-5',
    title: 'Deep Prototype Lookup',
    explanation:
      'Accessing dog.toString goes all the way up: dog (not found) → animal (not found) → Object.prototype (found!). Every object ultimately inherits from Object.prototype.',
    highlightedLines: [18],
    animationState: {
      objects: [
        {
          id: 'dog',
          name: 'dog',
          color: '#06B6D4',
          properties: [
            { name: 'name', value: '"Buddy"', type: 'data', isOwn: true },
            { name: 'bark', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'animal',
          name: 'animal',
          color: '#8B5CF6',
          prototypeOf: 'dog',
          properties: [
            { name: 'isAlive', value: 'true', type: 'data', isOwn: true },
            { name: 'eat', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'object-proto',
          name: 'Object.prototype',
          color: '#6B7280',
          prototypeOf: 'animal',
          isHighlighted: true,
          properties: [
            {
              name: 'toString',
              value: '[Function]',
              type: 'method',
              isOwn: true,
              isHighlighted: true,
            },
          ],
        },
      ],
      propertyLookup: {
        propertyName: 'toString',
        currentObjectId: 'object-proto',
        found: true,
        path: ['dog', 'animal', 'object-proto'],
      },
      consoleOutput: [
        '> dog.toString',
        '1. Check dog → ✗ Not found',
        '2. Check animal → ✗ Not found',
        '3. Check Object.prototype → ✓ Found!',
        '< [Function: toString]',
      ],
      focusedObjectId: 'object-proto',
    },
    duration: 3000,
  },
  {
    id: 'step-6',
    title: 'The "this" Keyword in Methods',
    explanation:
      'When you call a method using dot notation (object.method()), "this" inside the method refers to the object before the dot. So in dog.eat(), "this" is dog, giving us "Buddy is eating".',
    highlightedLines: [21],
    animationState: {
      objects: [
        {
          id: 'dog',
          name: 'dog',
          color: '#06B6D4',
          isHighlighted: true,
          properties: [
            { name: 'name', value: '"Buddy"', type: 'data', isOwn: true, isHighlighted: true },
            { name: 'bark', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'animal',
          name: 'animal',
          color: '#8B5CF6',
          prototypeOf: 'dog',
          properties: [
            { name: 'isAlive', value: 'true', type: 'data', isOwn: true },
            { name: 'eat', value: '[Function]', type: 'method', isOwn: true, isHighlighted: true },
          ],
        },
      ],
      thisBinding: {
        context: 'object-method',
        value: 'dog',
        explanation: 'dog.eat() → this = dog',
        color: '#06B6D4',
      },
      consoleOutput: [
        '> dog.eat()',
        '// this = dog (object before the dot)',
        '// this.name = "Buddy"',
        '< "Buddy is eating"',
      ],
      focusedObjectId: 'dog',
    },
    duration: 3000,
  },
  {
    id: 'step-7',
    title: 'Arrow Functions and "this"',
    explanation:
      'Arrow functions do NOT have their own "this". They inherit "this" from the surrounding (lexical) scope. In cat.meow (arrow function at top level), "this" is the global object, so this.name is undefined.',
    highlightedLines: [26, 27, 28, 29],
    animationState: {
      objects: [
        {
          id: 'cat',
          name: 'cat',
          color: '#EC4899',
          isHighlighted: true,
          properties: [
            { name: 'name', value: '"Whiskers"', type: 'data', isOwn: true },
            {
              name: 'meow',
              value: '() => {...}',
              type: 'method',
              isOwn: true,
              isHighlighted: true,
            },
          ],
        },
        {
          id: 'global',
          name: 'globalThis',
          color: '#6B7280',
          properties: [{ name: 'name', value: 'undefined', type: 'data', isOwn: true }],
        },
      ],
      thisBinding: {
        context: 'arrow-function',
        value: 'globalThis',
        explanation: 'Arrow functions inherit "this" from outer scope',
        color: '#EF4444',
      },
      consoleOutput: [
        '> cat.meow()',
        '// Arrow function - no own "this"',
        '// this = globalThis (outer scope)',
        '< undefined',
      ],
      focusedObjectId: 'cat',
    },
    duration: 3500,
  },
  {
    id: 'step-8',
    title: 'Arrow Functions Preserving "this"',
    explanation:
      'Arrow functions are useful when you WANT to preserve the outer "this". In cat.purr(), the regular function sets this=cat. The inner arrow function inherits that "this", so this.name correctly gives "Whiskers".',
    highlightedLines: [30, 31, 32, 33, 34, 35],
    animationState: {
      objects: [
        {
          id: 'cat',
          name: 'cat',
          color: '#EC4899',
          isHighlighted: true,
          properties: [
            { name: 'name', value: '"Whiskers"', type: 'data', isOwn: true, isHighlighted: true },
            { name: 'purr', value: 'function() {...}', type: 'method', isOwn: true },
          ],
        },
      ],
      thisBinding: {
        context: 'arrow-function',
        value: 'cat',
        explanation: 'Inner arrow inherits "this" from purr()',
        color: '#22c55e',
      },
      consoleOutput: [
        '> cat.purr()',
        '// purr() sets this = cat',
        '// inner arrow inherits this = cat',
        '< "Whiskers"',
      ],
      focusedObjectId: 'cat',
    },
    duration: 3000,
  },
  {
    id: 'step-9',
    title: 'Explicit Binding with call/apply/bind',
    explanation:
      'You can explicitly set "this" using call(), apply(), or bind(). call(thisArg) immediately invokes the function with "this" set to thisArg. This lets you borrow methods between objects!',
    highlightedLines: [39, 40, 41, 42],
    animationState: {
      objects: [
        {
          id: 'dog',
          name: 'dog',
          color: '#06B6D4',
          isHighlighted: true,
          properties: [
            { name: 'name', value: '"Buddy"', type: 'data', isOwn: true, isHighlighted: true },
          ],
        },
        {
          id: 'cat',
          name: 'cat',
          color: '#EC4899',
          properties: [{ name: 'name', value: '"Whiskers"', type: 'data', isOwn: true }],
        },
      ],
      thisBinding: {
        context: 'explicit-bind',
        value: 'dog (via call)',
        explanation: 'greet.call(dog) → this = dog',
        color: '#F97316',
      },
      consoleOutput: [
        '> greet.call(dog)',
        '// Explicitly sets this = dog',
        '< "Hello, Buddy"',
        '',
        '> greet.call(cat)',
        '// Explicitly sets this = cat',
        '< "Hello, Whiskers"',
      ],
    },
    duration: 3000,
  },
  {
    id: 'step-10',
    title: 'Summary: The Prototype Chain',
    explanation:
      'JavaScript uses prototypes for inheritance. When a property isn\'t found on an object, JS walks up the prototype chain. Understanding "this" binding rules is crucial: method calls, arrow functions, and explicit binding all affect what "this" refers to.',
    highlightedLines: [],
    animationState: {
      objects: [
        {
          id: 'dog',
          name: 'dog',
          color: '#06B6D4',
          properties: [
            { name: 'name', value: '"Buddy"', type: 'data', isOwn: true },
            { name: 'bark', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'animal',
          name: 'animal',
          color: '#8B5CF6',
          prototypeOf: 'dog',
          properties: [
            { name: 'isAlive', value: 'true', type: 'data', isOwn: true },
            { name: 'eat', value: '[Function]', type: 'method', isOwn: true },
          ],
        },
        {
          id: 'object-proto',
          name: 'Object.prototype',
          color: '#6B7280',
          prototypeOf: 'animal',
          properties: [{ name: 'toString', value: '[Function]', type: 'method', isOwn: true }],
        },
        {
          id: 'null',
          name: 'null',
          color: '#374151',
          prototypeOf: 'object-proto',
          properties: [],
        },
      ],
      consoleOutput: [
        '// Key Takeaways:',
        '',
        '✓ Prototype chain: dog → animal → Object.prototype → null',
        '✓ Own properties checked first, then up the chain',
        '✓ this in methods = object before the dot',
        '✓ Arrow functions inherit this from outer scope',
        '✓ call/apply/bind explicitly set this',
      ],
    },
    duration: 4000,
  },
];

/**
 * Key takeaways for Prototypes & this topic
 */
export const prototypesKeyTakeaways = [
  'Every object has a [[Prototype]] linking it to another object',
  'Property lookup walks up the prototype chain until found or null',
  'Object.create(proto) creates an object with proto as its prototype',
  '"this" in a method = the object before the dot (obj.method())',
  'Arrow functions inherit "this" from their lexical (surrounding) scope',
  'call(), apply(), bind() let you explicitly set "this"',
];
