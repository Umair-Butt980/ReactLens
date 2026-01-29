/**
 * Step-by-step data for JSX & Components visualization
 *
 * This visualization demonstrates how JSX is syntactic sugar for React.createElement(),
 * how components work as functions that return UI descriptions, and how React
 * processes these descriptions to render actual DOM elements.
 */

import type { JSXComponentsStep } from '@/lib/types';

export const jsxComponentsCode = `// A simple React component using JSX
function Greeting({ name, isLoggedIn }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      {isLoggedIn && <p>Welcome back!</p>}
      <Button onClick={() => alert('Clicked!')}>
        Say Hello
      </Button>
    </div>
  );
}

// What Babel transforms it to:
function Greeting({ name, isLoggedIn }) {
  return React.createElement(
    'div',
    { className: 'greeting' },
    React.createElement('h1', null, 'Hello, ', name, '!'),
    isLoggedIn && React.createElement('p', null, 'Welcome back!'),
    React.createElement(
      Button,
      { onClick: () => alert('Clicked!') },
      'Say Hello'
    )
  );
}`;

export const jsxComponentsSteps: JSXComponentsStep[] = [
  {
    id: 'step-1',
    title: "Understanding JSX - It's Not HTML!",
    explanation: `Let's start with a fundamental truth: JSX is NOT HTML. It looks like HTML, and that's intentional - it makes React code intuitive to write. But under the hood, JSX is just syntactic sugar for JavaScript function calls.

When you write JSX, you're actually writing instructions for creating objects that describe your UI. These objects are called "React Elements" - lightweight descriptions of what you want to see on screen.

Think of JSX like a recipe. The recipe (JSX) describes the dish, but it's not the actual food. React reads this recipe and then does the cooking (rendering to the real DOM).

Key insight: JSX exists because writing nested React.createElement() calls by hand is tedious and hard to read. JSX lets us write UI code in a familiar, declarative style.`,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    state: {
      jsxTree: {
        id: 'root',
        tag: 'div',
        type: 'html',
        props: [
          {
            id: 'class',
            name: 'className',
            value: 'greeting',
            valueType: 'string',
            isHighlighted: false,
          },
        ],
        children: [
          {
            id: 'h1',
            tag: 'h1',
            type: 'html',
            props: [],
            children: [
              {
                id: 'text-1',
                content: 'Hello, {name}!',
                isExpression: true,
                expressionValue: 'name',
              },
            ],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'p',
            tag: 'p',
            type: 'html',
            props: [],
            children: [{ id: 'text-2', content: 'Welcome back!', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'button',
            tag: 'Button',
            type: 'component',
            props: [
              {
                id: 'onclick',
                name: 'onClick',
                value: '() => alert(...)',
                valueType: 'function',
                isHighlighted: false,
              },
            ],
            children: [{ id: 'text-3', content: 'Say Hello', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
        ],
        isHighlighted: true,
        depth: 0,
      },
      createElementCalls: null,
      virtualDOM: null,
      phase: 'jsx-written',
      component: {
        id: 'greeting',
        name: 'Greeting',
        type: 'function',
        props: [
          { id: 'name', name: 'name', type: 'string', isRequired: true, isDestructured: true },
          {
            id: 'isLoggedIn',
            name: 'isLoggedIn',
            type: 'boolean',
            isRequired: false,
            isDestructured: true,
          },
        ],
        hasState: false,
        hasEffects: false,
        returnsJSX: true,
        isHighlighted: true,
      },
      showTransformation: false,
      highlightedPath: ['root'],
      output: [
        { id: 'msg-1', type: 'info', message: 'JSX is syntactic sugar for React.createElement()' },
      ],
      activePanel: 'jsx',
    },
    duration: 5000,
  },
  {
    id: 'step-2',
    title: 'Components - Functions That Return UI',
    explanation: `A React component is fundamentally a JavaScript function (or class) that returns a description of UI. That's it! No magic - just a function.

When you write "function Greeting({ name, isLoggedIn })", you're creating a reusable UI factory. Every time React calls this function with different props, it returns a new UI description tailored to those props.

Why functions? Because functions are composable, testable, and predictable. Given the same inputs (props), a component should always return the same output (UI description). This is called being "pure" - and it's what makes React predictable.

The destructuring syntax "{ name, isLoggedIn }" extracts specific properties from the props object. Props flow DOWN from parent to child - this is React's "one-way data flow" that makes apps easier to reason about.

Mental model: Think of components like LEGO blocks. Each block (component) is a self-contained unit that can be combined with others to build complex structures (UIs).`,
    highlightedLines: [2],
    state: {
      jsxTree: {
        id: 'root',
        tag: 'div',
        type: 'html',
        props: [
          {
            id: 'class',
            name: 'className',
            value: 'greeting',
            valueType: 'string',
            isHighlighted: false,
          },
        ],
        children: [
          {
            id: 'h1',
            tag: 'h1',
            type: 'html',
            props: [],
            children: [
              {
                id: 'text-1',
                content: 'Hello, {name}!',
                isExpression: true,
                expressionValue: 'name',
              },
            ],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'p',
            tag: 'p',
            type: 'html',
            props: [],
            children: [{ id: 'text-2', content: 'Welcome back!', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'button',
            tag: 'Button',
            type: 'component',
            props: [
              {
                id: 'onclick',
                name: 'onClick',
                value: '() => alert(...)',
                valueType: 'function',
                isHighlighted: false,
              },
            ],
            children: [{ id: 'text-3', content: 'Say Hello', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
        ],
        isHighlighted: false,
        depth: 0,
      },
      createElementCalls: null,
      virtualDOM: null,
      phase: 'jsx-written',
      component: {
        id: 'greeting',
        name: 'Greeting',
        type: 'function',
        props: [
          { id: 'name', name: 'name', type: 'string', isRequired: true, isDestructured: true },
          {
            id: 'isLoggedIn',
            name: 'isLoggedIn',
            type: 'boolean',
            isRequired: false,
            isDestructured: true,
          },
        ],
        hasState: false,
        hasEffects: false,
        returnsJSX: true,
        isHighlighted: true,
      },
      showTransformation: false,
      highlightedPath: [],
      output: [
        { id: 'msg-1', type: 'info', message: 'Component receives props: { name, isLoggedIn }' },
        {
          id: 'msg-2',
          type: 'info',
          message: 'Components are pure functions: same props = same UI',
        },
      ],
      activePanel: 'component',
    },
    duration: 5000,
  },
  {
    id: 'step-3',
    title: 'JSX Expressions - JavaScript Inside Your Markup',
    explanation: `One of JSX's superpowers is the ability to embed any JavaScript expression inside curly braces {}. This isn't string interpolation like template literals - it's actual JavaScript execution.

In "{name}", React evaluates the variable "name" and inserts its value. In "{isLoggedIn && <p>...</p>}", React evaluates the logical AND - if isLoggedIn is true, the JSX is included; if false, nothing renders.

This is called "conditional rendering" and it's deeply powerful. You can use:
• && for "render if true"
• ternary (? :) for "render this OR that"
• Variables containing JSX
• Function calls that return JSX

Important: Only EXPRESSIONS work in {}. Statements like if/else, for loops, or variable declarations won't work directly. But you can call functions that contain those statements!

Why expressions only? Because JSX compiles to function arguments. You can't pass a statement as a function argument, but you can pass the result of an expression.`,
    highlightedLines: [5, 6],
    state: {
      jsxTree: {
        id: 'root',
        tag: 'div',
        type: 'html',
        props: [
          {
            id: 'class',
            name: 'className',
            value: 'greeting',
            valueType: 'string',
            isHighlighted: false,
          },
        ],
        children: [
          {
            id: 'h1',
            tag: 'h1',
            type: 'html',
            props: [],
            children: [
              {
                id: 'text-1',
                content: 'Hello, {name}!',
                isExpression: true,
                expressionValue: 'John',
              },
            ],
            isHighlighted: true,
            depth: 1,
          },
          {
            id: 'p',
            tag: 'p',
            type: 'html',
            props: [],
            children: [{ id: 'text-2', content: 'Welcome back!', isExpression: false }],
            isHighlighted: true,
            depth: 1,
          },
          {
            id: 'button',
            tag: 'Button',
            type: 'component',
            props: [
              {
                id: 'onclick',
                name: 'onClick',
                value: '() => alert(...)',
                valueType: 'function',
                isHighlighted: false,
              },
            ],
            children: [{ id: 'text-3', content: 'Say Hello', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
        ],
        isHighlighted: false,
        depth: 0,
      },
      createElementCalls: null,
      virtualDOM: null,
      phase: 'jsx-written',
      component: null,
      showTransformation: false,
      highlightedPath: ['h1', 'p'],
      output: [
        { id: 'msg-1', type: 'info', message: '{name} → evaluates to "John"' },
        { id: 'msg-2', type: 'info', message: '{isLoggedIn && <p>} → conditional render' },
      ],
      activePanel: 'jsx',
    },
    duration: 5000,
  },
  {
    id: 'step-4',
    title: 'Babel Transformation Begins',
    explanation: `Here's where the magic happens! When you save your JSX file, a tool called Babel transforms it before the browser ever sees it. Browsers don't understand JSX - they only understand JavaScript.

Babel is a "transpiler" - it transforms modern JavaScript (and JSX) into code that browsers can run. Every JSX element becomes a React.createElement() call.

The transformation follows a simple pattern:
• <tag> becomes the first argument (as a string for HTML, as a reference for components)
• Attributes become the second argument (as a props object)
• Children become the remaining arguments

This is why we import React at the top of files with JSX (in older React) - the compiled code directly calls React.createElement. Modern React 17+ can use a new JSX transform that doesn't require this import.

Understanding this transformation is crucial because it reveals that JSX has NO special runtime behavior - it's 100% compile-time syntax transformation.`,
    highlightedLines: [13, 14, 15, 16, 17],
    state: {
      jsxTree: {
        id: 'root',
        tag: 'div',
        type: 'html',
        props: [
          {
            id: 'class',
            name: 'className',
            value: 'greeting',
            valueType: 'string',
            isHighlighted: true,
          },
        ],
        children: [
          {
            id: 'h1',
            tag: 'h1',
            type: 'html',
            props: [],
            children: [
              {
                id: 'text-1',
                content: 'Hello, {name}!',
                isExpression: true,
                expressionValue: 'name',
              },
            ],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'p',
            tag: 'p',
            type: 'html',
            props: [],
            children: [{ id: 'text-2', content: 'Welcome back!', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'button',
            tag: 'Button',
            type: 'component',
            props: [
              {
                id: 'onclick',
                name: 'onClick',
                value: '() => alert(...)',
                valueType: 'function',
                isHighlighted: false,
              },
            ],
            children: [{ id: 'text-3', content: 'Say Hello', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
        ],
        isHighlighted: true,
        depth: 0,
      },
      createElementCalls: {
        id: 'ce-1',
        type: 'div',
        typeCategory: 'string',
        props: { className: 'greeting' },
        children: [],
        isHighlighted: true,
        nestingLevel: 0,
      },
      virtualDOM: null,
      phase: 'babel-parsing',
      component: null,
      showTransformation: true,
      highlightedPath: ['root'],
      output: [
        {
          id: 'msg-1',
          type: 'transform',
          message: 'Babel transforms: <div> → React.createElement("div", ...)',
        },
        { id: 'msg-2', type: 'info', message: 'Props object: { className: "greeting" }' },
      ],
      activePanel: 'createElement',
    },
    duration: 4500,
  },
  {
    id: 'step-5',
    title: 'React.createElement - The Real Function Call',
    explanation: `React.createElement() is the foundation of React's rendering system. Every piece of UI you write eventually becomes a call to this function. Let's understand its signature:

React.createElement(type, props, ...children)

• type: What to render - a string ('div', 'span') for HTML elements, or a function/class for components
• props: An object of attributes/properties, or null if none
• children: Any number of child elements (more createElement calls) or text

When type is a STRING (like 'div'), React knows to create an HTML element. When type is a FUNCTION (like Button), React knows to call that function with the props to get its JSX.

This is why component names must be Capitalized! Babel uses capitalization to decide whether to output a string ('div') or a variable reference (Button). <button> → 'button', but <Button> → Button.

The result of createElement is NOT a DOM node - it's a plain JavaScript object called a "React Element" that describes what should be rendered.`,
    highlightedLines: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    state: {
      jsxTree: null,
      createElementCalls: {
        id: 'ce-1',
        type: 'div',
        typeCategory: 'string',
        props: { className: 'greeting' },
        children: [
          {
            id: 'ce-2',
            type: 'h1',
            typeCategory: 'string',
            props: {},
            children: ['Hello, ', 'name', '!'],
            isHighlighted: false,
            nestingLevel: 1,
          },
          {
            id: 'ce-3',
            type: 'p',
            typeCategory: 'string',
            props: {},
            children: ['Welcome back!'],
            isHighlighted: false,
            nestingLevel: 1,
          },
          {
            id: 'ce-4',
            type: 'Button',
            typeCategory: 'function',
            props: { onClick: '() => alert(...)' },
            children: ['Say Hello'],
            isHighlighted: true,
            nestingLevel: 1,
          },
        ],
        isHighlighted: true,
        nestingLevel: 0,
      },
      virtualDOM: null,
      phase: 'createElement',
      component: null,
      showTransformation: true,
      highlightedPath: [],
      output: [
        {
          id: 'msg-1',
          type: 'transform',
          message: 'createElement("div", {className: "greeting"}, ...)',
        },
        {
          id: 'msg-2',
          type: 'transform',
          message: 'createElement(Button, {onClick: fn}, "Say Hello")',
        },
        {
          id: 'msg-3',
          type: 'info',
          message: 'Note: Button is a variable reference, not a string!',
        },
      ],
      activePanel: 'createElement',
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'React Elements - Plain JavaScript Objects',
    explanation: `When React.createElement() runs, it returns a plain JavaScript object - a "React Element". This object is a lightweight description of what you want on screen. Let's look at its structure:

{
  $$typeof: Symbol(react.element),  // Security marker
  type: 'div',                       // What to render
  props: { className: 'greeting', children: [...] },
  key: null,                         // For list reconciliation
  ref: null,                         // For DOM access
}

The $$typeof field is a Symbol that React uses to verify this is a real React element (protecting against XSS attacks - JSON can't contain Symbols).

These objects form a tree structure - the Virtual DOM! Each element's props.children contains more elements, creating a hierarchy that mirrors your component structure.

Key insight: React Elements are IMMUTABLE. Once created, you can't change them. To update the UI, you create NEW elements. React then compares old vs new to determine what changed - this is "reconciliation".

This immutability is why React is fast - comparing objects is cheap, and React can skip unchanged parts entirely.`,
    highlightedLines: [],
    state: {
      jsxTree: null,
      createElementCalls: null,
      virtualDOM: {
        id: 'vdom-1',
        type: 'div',
        props: { className: 'greeting' },
        children: [
          {
            id: 'vdom-2',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            ref: null,
            isHighlighted: false,
            $$typeof: 'Symbol(react.element)',
          },
          {
            id: 'vdom-3',
            type: 'p',
            props: {},
            children: [],
            key: null,
            ref: null,
            isHighlighted: false,
            $$typeof: 'Symbol(react.element)',
          },
          {
            id: 'vdom-4',
            type: 'Button',
            props: { onClick: 'fn' },
            children: [],
            key: null,
            ref: null,
            isHighlighted: true,
            $$typeof: 'Symbol(react.element)',
          },
        ],
        key: null,
        ref: null,
        isHighlighted: true,
        $$typeof: 'Symbol(react.element)',
      },
      phase: 'virtual-dom',
      component: null,
      showTransformation: false,
      highlightedPath: [],
      output: [
        {
          id: 'msg-1',
          type: 'info',
          message: 'React Element created: { $$typeof, type, props, key, ref }',
        },
        {
          id: 'msg-2',
          type: 'info',
          message: "Elements are immutable - can't be changed after creation",
        },
        {
          id: 'msg-3',
          type: 'render',
          message: 'Virtual DOM tree is now ready for reconciliation',
        },
      ],
      activePanel: 'virtualDOM',
    },
    duration: 5500,
  },
  {
    id: 'step-7',
    title: 'Component vs Element - A Crucial Distinction',
    explanation: `Many developers confuse React Components and React Elements. Understanding the difference is crucial:

COMPONENT: A function (or class) that RETURNS elements
• It's a template/blueprint
• Defined once, called many times
• Can have logic, state, effects
• Example: function Button() { return <button>Click</button> }

ELEMENT: A plain object describing what to render
• It's a single instance
• Created by calling the component or createElement
• Immutable, no behavior
• Example: { type: Button, props: {}, ... }

When you write <Button />, you're NOT calling the Button function directly. You're creating an ELEMENT with type: Button. React later calls Button() when it needs to render.

This separation matters because:
1. React controls WHEN components are called (for batching, prioritization)
2. Elements can be stored, compared, and passed around cheaply
3. The same component can produce different elements with different props

Think: Component = Cookie Cutter, Element = Cookie, DOM Node = Cookie on the Plate`,
    highlightedLines: [7, 8, 9],
    state: {
      jsxTree: {
        id: 'button-jsx',
        tag: 'Button',
        type: 'component',
        props: [
          {
            id: 'onclick',
            name: 'onClick',
            value: '() => alert(...)',
            valueType: 'function',
            isHighlighted: true,
          },
        ],
        children: [{ id: 'text', content: 'Say Hello', isExpression: false }],
        isHighlighted: true,
        depth: 0,
      },
      createElementCalls: {
        id: 'ce-btn',
        type: 'Button',
        typeCategory: 'function',
        props: { onClick: '() => alert(...)' },
        children: ['Say Hello'],
        isHighlighted: true,
        nestingLevel: 0,
      },
      virtualDOM: {
        id: 'vdom-btn',
        type: 'Button',
        props: { onClick: 'fn', children: 'Say Hello' },
        children: [],
        key: null,
        ref: null,
        isHighlighted: true,
        $$typeof: 'Symbol(react.element)',
      },
      phase: 'createElement',
      component: {
        id: 'button-comp',
        name: 'Button',
        type: 'function',
        props: [
          {
            id: 'onclick',
            name: 'onClick',
            type: 'function',
            isRequired: false,
            isDestructured: true,
          },
          {
            id: 'children',
            name: 'children',
            type: 'ReactNode',
            isRequired: false,
            isDestructured: true,
          },
        ],
        hasState: false,
        hasEffects: false,
        returnsJSX: true,
        isHighlighted: true,
      },
      showTransformation: false,
      highlightedPath: [],
      output: [
        {
          id: 'msg-1',
          type: 'info',
          message: 'Component: function Button() {...} - the blueprint',
        },
        {
          id: 'msg-2',
          type: 'info',
          message: 'Element: { type: Button, props: {...} } - the instance',
        },
        {
          id: 'msg-3',
          type: 'render',
          message: 'React calls Button() to get the actual JSX to render',
        },
      ],
      activePanel: 'component',
    },
    duration: 5500,
  },
  {
    id: 'step-8',
    title: 'The Rendering Pipeline - From JSX to Screen',
    explanation: `Let's trace the complete journey from your JSX code to pixels on screen:

1. WRITE: You write JSX in your component
   function App() { return <h1>Hello</h1> }

2. COMPILE: Babel transforms JSX to createElement calls
   React.createElement('h1', null, 'Hello')

3. EXECUTE: React calls your component, getting element objects
   { type: 'h1', props: { children: 'Hello' }, ... }

4. RECONCILE: React compares new elements with previous ones
   "What changed? What stayed the same?"

5. COMMIT: React updates only the changed DOM nodes
   document.createElement('h1').textContent = 'Hello'

This is React's "Render then Commit" model. The render phase (steps 1-4) can be interrupted, repeated, or discarded. The commit phase (step 5) is synchronous and applies changes to the DOM.

Understanding this pipeline helps you write better React code because you know exactly what happens at each stage. Performance problems often come from triggering too many renders or doing expensive work during render.`,
    highlightedLines: [],
    state: {
      jsxTree: {
        id: 'root',
        tag: 'div',
        type: 'html',
        props: [
          {
            id: 'class',
            name: 'className',
            value: 'greeting',
            valueType: 'string',
            isHighlighted: false,
          },
        ],
        children: [
          {
            id: 'h1',
            tag: 'h1',
            type: 'html',
            props: [],
            children: [{ id: 'text-1', content: 'Hello, John!', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'p',
            tag: 'p',
            type: 'html',
            props: [],
            children: [{ id: 'text-2', content: 'Welcome back!', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'button',
            tag: 'button',
            type: 'html',
            props: [],
            children: [{ id: 'text-3', content: 'Say Hello', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
        ],
        isHighlighted: false,
        depth: 0,
      },
      createElementCalls: null,
      virtualDOM: {
        id: 'vdom-1',
        type: 'div',
        props: { className: 'greeting' },
        children: [
          {
            id: 'vdom-2',
            type: 'h1',
            props: {},
            children: [],
            key: null,
            ref: null,
            isHighlighted: false,
            $$typeof: 'Symbol(react.element)',
          },
          {
            id: 'vdom-3',
            type: 'p',
            props: {},
            children: [],
            key: null,
            ref: null,
            isHighlighted: false,
            $$typeof: 'Symbol(react.element)',
          },
          {
            id: 'vdom-4',
            type: 'button',
            props: {},
            children: [],
            key: null,
            ref: null,
            isHighlighted: false,
            $$typeof: 'Symbol(react.element)',
          },
        ],
        key: null,
        ref: null,
        isHighlighted: true,
        $$typeof: 'Symbol(react.element)',
      },
      phase: 'reconciliation',
      component: null,
      showTransformation: false,
      highlightedPath: [],
      output: [
        { id: 'msg-1', type: 'render', message: '1. JSX written → 2. Babel compiles' },
        { id: 'msg-2', type: 'render', message: '3. Elements created → 4. Reconciliation' },
        { id: 'msg-3', type: 'render', message: '5. DOM committed → Pixels on screen!' },
      ],
      activePanel: 'virtualDOM',
    },
    duration: 5500,
  },
  {
    id: 'step-9',
    title: 'JSX & Components - Key Takeaways',
    explanation: `Congratulations! You now understand the fundamentals of how JSX and React components work internally. Let's summarize the key insights:

1. JSX is syntactic sugar - it compiles to React.createElement() calls at build time. Browsers never see JSX.

2. Components are functions that return UI descriptions. They're called by React, not by you directly. This gives React control over when and how rendering happens.

3. React Elements are plain objects describing UI. They're immutable, lightweight, and form the Virtual DOM tree.

4. The distinction between Component (blueprint) and Element (instance) is crucial for understanding React's rendering model.

5. The rendering pipeline goes: JSX → Babel → createElement → Elements → Reconciliation → DOM.

6. Component names must be Capitalized so Babel knows to treat them as components, not HTML tags.

These concepts form the foundation for everything else in React - state, hooks, reconciliation, and performance optimization all build on this mental model. Keep this pipeline in mind as you learn more advanced React patterns!`,
    highlightedLines: [],
    state: {
      jsxTree: {
        id: 'root',
        tag: 'div',
        type: 'html',
        props: [
          {
            id: 'class',
            name: 'className',
            value: 'greeting',
            valueType: 'string',
            isHighlighted: false,
          },
        ],
        children: [
          {
            id: 'h1',
            tag: 'h1',
            type: 'html',
            props: [],
            children: [{ id: 'text-1', content: 'Hello, {name}!', isExpression: true }],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'p',
            tag: 'p',
            type: 'html',
            props: [],
            children: [{ id: 'text-2', content: 'Welcome back!', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
          {
            id: 'button',
            tag: 'Button',
            type: 'component',
            props: [
              {
                id: 'onclick',
                name: 'onClick',
                value: '() => alert(...)',
                valueType: 'function',
                isHighlighted: false,
              },
            ],
            children: [{ id: 'text-3', content: 'Say Hello', isExpression: false }],
            isHighlighted: false,
            depth: 1,
          },
        ],
        isHighlighted: true,
        depth: 0,
      },
      createElementCalls: {
        id: 'ce-1',
        type: 'div',
        typeCategory: 'string',
        props: { className: 'greeting' },
        children: [],
        isHighlighted: true,
        nestingLevel: 0,
      },
      virtualDOM: {
        id: 'vdom-1',
        type: 'div',
        props: { className: 'greeting' },
        children: [],
        key: null,
        ref: null,
        isHighlighted: true,
        $$typeof: 'Symbol(react.element)',
      },
      phase: 'dom-update',
      component: {
        id: 'greeting',
        name: 'Greeting',
        type: 'function',
        props: [
          { id: 'name', name: 'name', type: 'string', isRequired: true, isDestructured: true },
          {
            id: 'isLoggedIn',
            name: 'isLoggedIn',
            type: 'boolean',
            isRequired: false,
            isDestructured: true,
          },
        ],
        hasState: false,
        hasEffects: false,
        returnsJSX: true,
        isHighlighted: true,
      },
      showTransformation: false,
      highlightedPath: [],
      output: [
        { id: 'msg-1', type: 'info', message: 'JSX + Components = Declarative UI Programming' },
        { id: 'msg-2', type: 'info', message: 'Next: Learn how Props & State power dynamic UIs!' },
      ],
      activePanel: 'jsx',
    },
    duration: 6000,
  },
];

export const jsxComponentsKeyTakeaways = [
  'JSX is syntactic sugar that compiles to React.createElement() calls - browsers never see JSX',
  'Components are functions that return UI descriptions (React Elements)',
  'React Elements are immutable plain objects that form the Virtual DOM tree',
  'Component (blueprint) vs Element (instance) - React controls when components are called',
  'Component names must be Capitalized so Babel treats them as components, not HTML tags',
  'The render pipeline: JSX → Babel → createElement → Elements → Reconciliation → DOM',
  "Understanding this foundation is crucial for mastering React's advanced patterns",
];
