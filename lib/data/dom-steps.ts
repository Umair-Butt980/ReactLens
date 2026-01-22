/**
 * DOM Basics visualization data
 * Demonstrates how the Document Object Model works
 */

import type { DOMStep, DOMTree } from '@/lib/types/dom.types';

/**
 * Code example for DOM visualization
 */
export const domCode = `// HTML Structure
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <div id="app">
      <h1>Hello DOM!</h1>
      <p class="intro">Welcome</p>
      <button id="btn">Click me</button>
    </div>
  </body>
</html>

// JavaScript DOM Manipulation
const app = document.getElementById('app');
const heading = document.querySelector('h1');
const paragraph = document.querySelector('.intro');
const button = document.getElementById('btn');

// Reading content
console.log(heading.textContent);

// Modifying content
paragraph.textContent = 'Modified!';

// Adding event listener
button.addEventListener('click', () => {
  heading.style.color = 'blue';
});`;

/**
 * Initial DOM tree structure
 */
const initialTree: DOMTree = {
  root: {
    id: 'html',
    tagName: 'html',
    children: [
      {
        id: 'head',
        tagName: 'head',
        children: [
          {
            id: 'title',
            tagName: 'title',
            textContent: 'My Page',
            children: [],
          },
        ],
      },
      {
        id: 'body',
        tagName: 'body',
        children: [
          {
            id: 'app',
            tagName: 'div',
            attributes: { id: 'app' },
            children: [
              {
                id: 'h1',
                tagName: 'h1',
                textContent: 'Hello DOM!',
                children: [],
              },
              {
                id: 'p',
                tagName: 'p',
                attributes: { class: 'intro' },
                textContent: 'Welcome',
                children: [],
              },
              {
                id: 'btn',
                tagName: 'button',
                attributes: { id: 'btn' },
                textContent: 'Click me',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
};

/**
 * Steps for DOM visualization
 */
export const domSteps: DOMStep[] = [
  {
    id: 'step-1',
    title: 'What is the DOM?',
    explanation:
      'The Document Object Model (DOM) is a tree-like representation of your HTML document. The browser parses HTML and creates this tree structure, where each HTML element becomes a "node" in the tree. JavaScript can then interact with these nodes to read, modify, or delete content.',
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    animationState: {
      tree: initialTree,
      highlightedNodeIds: [],
      consoleOutput: [],
      browserPreview:
        '<div id="app"><h1>Hello DOM!</h1><p class="intro">Welcome</p><button id="btn">Click me</button></div>',
    },
    duration: 3000,
  },
  {
    id: 'step-2',
    title: 'The Root Element',
    explanation:
      'Every DOM tree starts with the document root, which contains the <html> element. This is the top of the tree. The <html> element has two main children: <head> (for metadata) and <body> (for visible content).',
    highlightedLines: [2, 3, 4, 5],
    animationState: {
      tree: {
        root: {
          ...initialTree.root,
          isHighlighted: true,
          highlightColor: '#8B5CF6',
        },
      },
      highlightedNodeIds: ['html'],
      consoleOutput: [],
      browserPreview:
        '<div id="app"><h1>Hello DOM!</h1><p class="intro">Welcome</p><button id="btn">Click me</button></div>',
    },
    duration: 2500,
  },
  {
    id: 'step-3',
    title: 'Selecting Elements by ID',
    explanation:
      'document.getElementById() is the fastest way to select a single element. It searches the entire DOM tree for an element with the matching id attribute and returns it. IDs should be unique in your document.',
    highlightedLines: [16],
    animationState: {
      tree: initialTree,
      selectedNodeId: 'app',
      highlightedNodeIds: ['app'],
      currentOperation: {
        type: 'select',
        targetId: 'app',
        description: 'getElementById("app")',
      },
      consoleOutput: ['> document.getElementById("app")', '< <div id="app">...</div>'],
      browserPreview:
        '<div id="app" style="outline: 2px solid #8B5CF6"><h1>Hello DOM!</h1><p class="intro">Welcome</p><button id="btn">Click me</button></div>',
    },
    duration: 2500,
  },
  {
    id: 'step-4',
    title: 'Selecting with querySelector',
    explanation:
      'querySelector() uses CSS selectors to find elements. You can select by tag name, class (.className), ID (#id), or any valid CSS selector. It returns the FIRST matching element.',
    highlightedLines: [17],
    animationState: {
      tree: initialTree,
      selectedNodeId: 'h1',
      highlightedNodeIds: ['h1'],
      currentOperation: {
        type: 'select',
        targetId: 'h1',
        description: 'querySelector("h1")',
      },
      consoleOutput: ['> document.querySelector("h1")', '< <h1>Hello DOM!</h1>'],
      browserPreview:
        '<div id="app"><h1 style="outline: 2px solid #06B6D4">Hello DOM!</h1><p class="intro">Welcome</p><button id="btn">Click me</button></div>',
    },
    duration: 2500,
  },
  {
    id: 'step-5',
    title: 'Selecting by Class',
    explanation:
      'You can select elements by their class using a dot (.) prefix in querySelector, just like in CSS. This is useful when elements share the same class for styling or functionality.',
    highlightedLines: [18],
    animationState: {
      tree: initialTree,
      selectedNodeId: 'p',
      highlightedNodeIds: ['p'],
      currentOperation: {
        type: 'select',
        targetId: 'p',
        description: 'querySelector(".intro")',
      },
      consoleOutput: ['> document.querySelector(".intro")', '< <p class="intro">Welcome</p>'],
      browserPreview:
        '<div id="app"><h1>Hello DOM!</h1><p class="intro" style="outline: 2px solid #EC4899">Welcome</p><button id="btn">Click me</button></div>',
    },
    duration: 2500,
  },
  {
    id: 'step-6',
    title: 'Reading Content',
    explanation:
      'Once you have a reference to an element, you can read its content using textContent or innerHTML. textContent returns just the text, while innerHTML includes any HTML tags inside the element.',
    highlightedLines: [22],
    animationState: {
      tree: initialTree,
      selectedNodeId: 'h1',
      highlightedNodeIds: ['h1'],
      currentOperation: {
        type: 'getText',
        targetId: 'h1',
        description: 'heading.textContent',
        value: 'Hello DOM!',
      },
      consoleOutput: ['> heading.textContent', '< "Hello DOM!"'],
      browserPreview:
        '<div id="app"><h1 style="background: rgba(139, 92, 246, 0.2)">Hello DOM!</h1><p class="intro">Welcome</p><button id="btn">Click me</button></div>',
    },
    duration: 2500,
  },
  {
    id: 'step-7',
    title: 'Modifying Content',
    explanation:
      'You can change element content by assigning a new value to textContent. This immediately updates the DOM and the browser re-renders that part of the page. This is how JavaScript makes web pages dynamic!',
    highlightedLines: [25],
    animationState: {
      tree: {
        root: {
          ...initialTree.root,
          children: [
            initialTree.root.children[0],
            {
              ...initialTree.root.children[1],
              children: [
                {
                  ...initialTree.root.children[1].children[0],
                  children: [
                    initialTree.root.children[1].children[0].children[0],
                    {
                      ...initialTree.root.children[1].children[0].children[1],
                      textContent: 'Modified!',
                      isModified: true,
                    },
                    initialTree.root.children[1].children[0].children[2],
                  ],
                },
              ],
            },
          ],
        },
      },
      selectedNodeId: 'p',
      highlightedNodeIds: ['p'],
      currentOperation: {
        type: 'modify',
        targetId: 'p',
        description: 'paragraph.textContent = "Modified!"',
        value: 'Modified!',
      },
      consoleOutput: ['> paragraph.textContent = "Modified!"', '< "Modified!"'],
      browserPreview:
        '<div id="app"><h1>Hello DOM!</h1><p class="intro" style="background: rgba(34, 197, 94, 0.3)">Modified!</p><button id="btn">Click me</button></div>',
    },
    duration: 2500,
  },
  {
    id: 'step-8',
    title: 'Event Listeners',
    explanation:
      'The DOM also lets you respond to user actions through event listeners. addEventListener() attaches a function that runs when an event (like "click") occurs on an element. This is how interactive web apps work!',
    highlightedLines: [28, 29, 30],
    animationState: {
      tree: initialTree,
      selectedNodeId: 'btn',
      highlightedNodeIds: ['btn', 'h1'],
      currentOperation: {
        type: 'select',
        targetId: 'btn',
        description: 'button.addEventListener("click", ...)',
      },
      consoleOutput: [
        '> button.addEventListener("click", handler)',
        '// Click event listener attached!',
      ],
      browserPreview:
        '<div id="app"><h1>Hello DOM!</h1><p class="intro">Welcome</p><button id="btn" style="outline: 2px solid #F97316">Click me</button></div>',
    },
    duration: 2500,
  },
  {
    id: 'step-9',
    title: 'DOM Tree Traversal',
    explanation:
      'You can navigate the DOM tree using properties like parentNode, children, firstChild, lastChild, nextSibling, and previousSibling. This lets you move between related elements without needing to select them directly.',
    highlightedLines: [16, 17],
    animationState: {
      tree: initialTree,
      highlightedNodeIds: ['app', 'h1', 'p', 'btn'],
      currentOperation: {
        type: 'traverse',
        targetId: 'app',
        description: 'app.children',
      },
      consoleOutput: [
        '> app.children',
        '< HTMLCollection(3) [h1, p, button]',
        '> app.firstElementChild',
        '< <h1>Hello DOM!</h1>',
      ],
      browserPreview:
        '<div id="app" style="outline: 2px dashed #8B5CF6"><h1>Hello DOM!</h1><p class="intro">Welcome</p><button id="btn">Click me</button></div>',
    },
    duration: 3000,
  },
  {
    id: 'step-10',
    title: 'The DOM is Live',
    explanation:
      'Important: The DOM is a "live" representation. When you change it with JavaScript, the browser immediately updates what the user sees. However, frequent DOM updates can be slow, which is why frameworks like React use a Virtual DOM to optimize this process.',
    highlightedLines: [],
    animationState: {
      tree: initialTree,
      highlightedNodeIds: [],
      consoleOutput: [
        '// Key Takeaway:',
        '// DOM manipulation is powerful but can be slow',
        '// Each change triggers browser reflow/repaint',
        '// This is why Virtual DOM was invented!',
      ],
      browserPreview:
        '<div id="app"><h1>Hello DOM!</h1><p class="intro">Welcome</p><button id="btn">Click me</button></div>',
    },
    duration: 3000,
  },
];

/**
 * Key takeaways for DOM topic
 */
export const domKeyTakeaways = [
  'The DOM is a tree representation of HTML that JavaScript can manipulate',
  'Use getElementById() for fast single-element selection by ID',
  'Use querySelector() with CSS selectors for flexible element selection',
  'textContent and innerHTML let you read and modify element content',
  'addEventListener() enables interactive, event-driven web apps',
  'DOM changes are immediately rendered but can be performance-heavy',
];
