/**
 * Step-by-step data for Server vs Client Components visualization
 *
 * This visualization demonstrates how React Server Components and
 * Client Components work together in Next.js, the 'use client'
 * boundary, composition patterns, and the rendering pipeline.
 */

import type { ServerClientStep } from '@/lib/types';

export const serverClientCode = `// Server Component (default in Next.js App Router)
// No directive needed — runs on the server only
import { db } from '@/lib/db';

export default async function BlogPage() {
  // ✅ Direct database access — server only
  const posts = await db.posts.findMany();

  return (
    <main>
      <h1>Blog Posts</h1>
      {/* Server Component renders Client Component */}
      <SearchBar />
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}

// ------ Client Component ------
'use client';  // ← This directive marks the boundary

import { useState } from 'react';

export function SearchBar() {
  // ✅ Client-side interactivity
  const [query, setQuery] = useState('');

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

// ------ Server Component (child) ------
// No 'use client' → runs on server
export async function PostCard({ post }) {
  // ✅ Can access server-only resources
  const author = await db.users.findById(post.authorId);

  return (
    <article>
      <h2>{post.title}</h2>
      <p>By {author.name}</p>
      {/* Client Component nested in Server Component */}
      <LikeButton postId={post.id} />
    </article>
  );
}

// ------ Client Component (nested) ------
'use client';

import { useState } from 'react';

export function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'} Like
    </button>
  );
}`;

export const serverClientSteps: ServerClientStep[] = [
  {
    id: 'step-1',
    title: 'The Default: Server Components',
    explanation: `In Next.js App Router, ALL components are Server Components by default. This is a major shift from traditional React where everything runs in the browser.

Server Components:
• Run ONLY on the server — their code never reaches the browser
• Can directly access databases, file systems, and server-only APIs
• Can use async/await at the component level
• Have ZERO impact on client-side JavaScript bundle size

This means your component code stays on the server. The browser only receives the rendered HTML output, not the JavaScript that created it.

Think of it like a restaurant: the kitchen (server) prepares the food (HTML), and only the finished plate (rendered output) goes to the customer (browser). The recipes (component code) stay in the kitchen.`,
    highlightedLines: [1, 2, 3, 5, 6, 7],
    state: {
      components: [
        {
          id: 'blog-page',
          name: 'BlogPage',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [
            {
              id: 'cap-db',
              name: 'Database access',
              allowed: true,
              description: 'Direct DB queries',
            },
            { id: 'cap-async', name: 'async/await', allowed: true, description: 'Async component' },
            { id: 'cap-fs', name: 'File system', allowed: true, description: 'Read server files' },
            { id: 'cap-state', name: 'useState', allowed: false, description: 'No client state' },
            {
              id: 'cap-effects',
              name: 'useEffect',
              allowed: false,
              description: 'No browser effects',
            },
          ],
          props: [],
          children: ['post-card'],
          isHighlighted: true,
          isRendering: true,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'post-card',
          name: 'PostCard',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [
            {
              id: 'prop-post',
              name: 'post',
              value: '{...}',
              isSerializable: true,
              isHighlighted: false,
            },
          ],
          children: [],
          isHighlighted: false,
          isRendering: false,
          isHydrated: false,
          depth: 1,
        },
      ],
      dataFlows: [],
      boundary: { isVisible: false, label: '', position: 0 },
      renderTimeline: [
        {
          id: 'rt-1',
          phase: 'server-render',
          description: 'Server components render on server',
          isActive: true,
          isComplete: false,
        },
        {
          id: 'rt-2',
          phase: 'serialization',
          description: 'HTML sent to browser',
          isActive: false,
          isComplete: false,
        },
        {
          id: 'rt-3',
          phase: 'interactive',
          description: 'Page displayed (no JS needed)',
          isActive: false,
          isComplete: false,
        },
      ],
      currentPhase: 'server-render',
      activeConcept: 'default-server',
      activePanel: 'tree',
      annotation: 'All components are Server Components by default',
    },
    duration: 5000,
  },
  {
    id: 'step-2',
    title: "The 'use client' Directive - Opting Into the Browser",
    explanation: `When you need interactivity — state, effects, event handlers, browser APIs — you add the \`'use client'\` directive at the TOP of the file.

'use client';  // Must be the FIRST line (before imports)

This tells Next.js: "This component and ALL its imports should be included in the client JavaScript bundle."

It's like drawing a line in the sand:
• ABOVE the line → Server (no JS sent to browser)
• BELOW the line → Client (JS included in bundle)

The 'use client' directive is NOT a comment — it's a module-level directive that the bundler uses to split your code between server and client.

Important: 'use client' doesn't mean the component ONLY runs on the client. It still gets server-rendered (SSR) for the initial HTML, then hydrates on the client for interactivity.`,
    highlightedLines: [32, 33, 34, 36, 37, 38],
    state: {
      components: [
        {
          id: 'blog-page',
          name: 'BlogPage',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [],
          children: ['search-bar'],
          isHighlighted: false,
          isRendering: false,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'search-bar',
          name: 'SearchBar',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [
            {
              id: 'cap-state',
              name: 'useState',
              allowed: true,
              description: 'Client state management',
            },
            {
              id: 'cap-effects',
              name: 'useEffect',
              allowed: true,
              description: 'Browser side effects',
            },
            {
              id: 'cap-events',
              name: 'onClick/onChange',
              allowed: true,
              description: 'Event handlers',
            },
            {
              id: 'cap-db',
              name: 'Database access',
              allowed: false,
              description: 'No direct DB access',
            },
            {
              id: 'cap-async',
              name: 'async component',
              allowed: false,
              description: 'Cannot be async',
            },
          ],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 1,
        },
      ],
      dataFlows: [],
      boundary: { isVisible: true, label: "'use client'", position: 1 },
      renderTimeline: [
        {
          id: 'rt-1',
          phase: 'server-render',
          description: 'Server renders all components',
          isActive: false,
          isComplete: true,
        },
        {
          id: 'rt-2',
          phase: 'serialization',
          description: 'RSC payload + client JS sent',
          isActive: true,
          isComplete: false,
        },
        {
          id: 'rt-3',
          phase: 'client-hydration',
          description: 'Client components hydrate',
          isActive: false,
          isComplete: false,
        },
        {
          id: 'rt-4',
          phase: 'interactive',
          description: 'SearchBar becomes interactive',
          isActive: false,
          isComplete: false,
        },
      ],
      currentPhase: 'serialization',
      activeConcept: 'use-client-directive',
      activePanel: 'capabilities',
      annotation: "'use client' marks the server/client boundary",
    },
    duration: 5000,
  },
  {
    id: 'step-3',
    title: 'What Each Component Can Do',
    explanation: `Server and Client Components have different capabilities. Understanding what each can do is key to choosing the right type.

SERVER Components can:
✅ Fetch data with async/await directly
✅ Access databases, file systems, env variables
✅ Keep sensitive data on server (API keys, tokens)
✅ Reduce client bundle size (large dependencies stay on server)

CLIENT Components can:
✅ Use React hooks (useState, useEffect, useRef, etc.)
✅ Add event handlers (onClick, onChange, onSubmit)
✅ Use browser APIs (localStorage, window, navigator)
✅ Use third-party libraries that depend on browser features

Neither is "better" — they serve different purposes. The goal is to keep as much as possible on the server, and only use 'use client' when you truly need interactivity.`,
    highlightedLines: [5, 6, 7, 36, 37, 38, 39],
    state: {
      components: [
        {
          id: 'server-example',
          name: 'BlogPage (Server)',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [
            {
              id: 'cap-1',
              name: 'async/await',
              allowed: true,
              description: 'Direct data fetching',
            },
            { id: 'cap-2', name: 'Database access', allowed: true, description: 'Direct queries' },
            {
              id: 'cap-3',
              name: 'File system',
              allowed: true,
              description: 'Server-only resources',
            },
            {
              id: 'cap-4',
              name: 'Env secrets',
              allowed: true,
              description: 'Access API keys safely',
            },
            { id: 'cap-5', name: 'useState', allowed: false, description: 'Cannot use hooks' },
            { id: 'cap-6', name: 'Event handlers', allowed: false, description: 'No onClick etc.' },
          ],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'client-example',
          name: 'SearchBar (Client)',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [
            { id: 'cap-7', name: 'useState', allowed: true, description: 'State management' },
            { id: 'cap-8', name: 'useEffect', allowed: true, description: 'Side effects' },
            {
              id: 'cap-9',
              name: 'Event handlers',
              allowed: true,
              description: 'onClick, onChange',
            },
            {
              id: 'cap-10',
              name: 'Browser APIs',
              allowed: true,
              description: 'localStorage, window',
            },
            { id: 'cap-11', name: 'Database access', allowed: false, description: 'No direct DB' },
            {
              id: 'cap-12',
              name: 'Env secrets',
              allowed: false,
              description: 'Exposed to browser',
            },
          ],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 0,
        },
      ],
      dataFlows: [],
      boundary: { isVisible: true, label: 'Capabilities comparison', position: 0 },
      renderTimeline: [],
      currentPhase: 'idle',
      activeConcept: 'boundary-rules',
      activePanel: 'capabilities',
      annotation: 'Each type has distinct capabilities — use the right one for the job',
    },
    duration: 5000,
  },
  {
    id: 'step-4',
    title: 'The Boundary Rules - What Cannot Cross',
    explanation: `The server/client boundary has strict rules about what can be passed as props:

✅ CAN cross the boundary (serializable):
• Strings, numbers, booleans, null, undefined
• Plain objects and arrays (of serializable values)
• Date objects, FormData, typed arrays
• Server Actions (special server functions)

❌ CANNOT cross the boundary:
• Functions (except Server Actions)
• Classes and class instances
• Symbols
• React elements that are Client Components

Why? Because data crossing the boundary must be SERIALIZED — converted to a format that can travel from server to client. Functions can't be serialized into JSON.

This is like sending a package through the mail: you can send letters and objects, but you can't mail a person (function) — you can only send their written instructions (data).`,
    highlightedLines: [23, 24, 25, 26],
    state: {
      components: [
        {
          id: 'blog-page',
          name: 'BlogPage',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [],
          children: ['search-bar', 'post-card'],
          isHighlighted: true,
          isRendering: false,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'search-bar',
          name: 'SearchBar',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [],
          props: [],
          children: [],
          isHighlighted: false,
          isRendering: false,
          isHydrated: true,
          depth: 1,
        },
        {
          id: 'post-card',
          name: 'PostCard',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [
            {
              id: 'prop-post',
              name: 'post',
              value: '{title, id}',
              isSerializable: true,
              isHighlighted: true,
            },
          ],
          children: ['like-button'],
          isHighlighted: false,
          isRendering: false,
          isHydrated: false,
          depth: 1,
        },
        {
          id: 'like-button',
          name: 'LikeButton',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [],
          props: [
            {
              id: 'prop-postid',
              name: 'postId',
              value: '"abc123"',
              isSerializable: true,
              isHighlighted: true,
            },
          ],
          children: [],
          isHighlighted: false,
          isRendering: false,
          isHydrated: true,
          depth: 2,
        },
      ],
      dataFlows: [
        {
          id: 'df-1',
          from: 'blog-page',
          to: 'post-card',
          label: 'post={...}',
          type: 'props',
          isHighlighted: true,
          isBlocked: false,
        },
        {
          id: 'df-2',
          from: 'post-card',
          to: 'like-button',
          label: 'postId="abc123"',
          type: 'props',
          isHighlighted: true,
          isBlocked: false,
        },
        {
          id: 'df-3',
          from: 'blog-page',
          to: 'search-bar',
          label: 'onSearch={fn}',
          type: 'props',
          isHighlighted: true,
          isBlocked: true,
          blockReason: 'Functions cannot be serialized',
        },
      ],
      boundary: { isVisible: true, label: 'Serialization boundary', position: 1 },
      renderTimeline: [],
      currentPhase: 'idle',
      activeConcept: 'boundary-rules',
      activePanel: 'data-flow',
      annotation: 'Only serializable data can cross the server/client boundary',
    },
    duration: 5000,
  },
  {
    id: 'step-5',
    title: 'Composition Pattern - Server Children in Client Parents',
    explanation: `Here's a powerful pattern: you can pass Server Components as CHILDREN to Client Components. This works because the children are already rendered on the server before being passed.

// Server Component
export default function Page() {
  return (
    <ClientSidebar>
      <ServerContent />  {/* ← Rendered on server, passed as children */}
    </ClientSidebar>
  );
}

The key insight: \`children\` is just a React element (already rendered HTML from the server). It doesn't need to be serialized as a function — it's already rendered output.

This pattern lets you:
• Have interactive wrappers (modals, tabs, sidebars) as Client Components
• Keep the CONTENT inside them as Server Components
• Get the best of both worlds: interactivity + server rendering

This is the recommended composition pattern in Next.js — push 'use client' to the leaves of the tree, and keep the majority of your components as Server Components.`,
    highlightedLines: [9, 10, 11, 12, 23, 24, 25, 26, 27],
    state: {
      components: [
        {
          id: 'page',
          name: 'Page (Server)',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [],
          children: ['client-sidebar'],
          isHighlighted: true,
          isRendering: false,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'client-sidebar',
          name: 'ClientSidebar (Client)',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [
            { id: 'cap-1', name: 'useState', allowed: true, description: 'Toggle sidebar' },
          ],
          props: [],
          children: ['server-content'],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 1,
        },
        {
          id: 'server-content',
          name: 'ServerContent (Server)',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [
            {
              id: 'cap-2',
              name: 'async/await',
              allowed: true,
              description: 'Fetch data on server',
            },
          ],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: false,
          depth: 2,
        },
      ],
      dataFlows: [
        {
          id: 'df-1',
          from: 'page',
          to: 'client-sidebar',
          label: 'children={<ServerContent/>}',
          type: 'children',
          isHighlighted: true,
          isBlocked: false,
        },
      ],
      boundary: { isVisible: true, label: 'Server component passed as children', position: 1 },
      renderTimeline: [
        {
          id: 'rt-1',
          phase: 'server-render',
          description: 'ServerContent rendered on server',
          isActive: true,
          isComplete: false,
        },
        {
          id: 'rt-2',
          phase: 'serialization',
          description: 'Rendered output passed as children',
          isActive: false,
          isComplete: false,
        },
        {
          id: 'rt-3',
          phase: 'client-hydration',
          description: 'ClientSidebar hydrates with children',
          isActive: false,
          isComplete: false,
        },
      ],
      currentPhase: 'server-render',
      activeConcept: 'composition-pattern',
      activePanel: 'tree',
      annotation: 'Server Components can be passed as children to Client Components',
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'The Full Component Tree - Mixed Environments',
    explanation: `In a real app, your component tree is a MIX of server and client components. Let's see the full picture of our blog example:

BlogPage (Server) ← Direct DB access
├── SearchBar (Client) ← Interactive search input
└── PostCard (Server) ← Async data for each post
    └── LikeButton (Client) ← Interactive like toggle

Notice the interleaving pattern:
• Server → Client → Server → Client
• This is perfectly valid and encouraged!

The 'use client' boundary only flows DOWNWARD. A Client Component's imports become client code, but Server Components can always render Client Components by using them in JSX.

Best practice: Keep Server Components at the top and push Client Components to the "leaves" (edges) of the tree. This maximizes server-rendered content and minimizes client JavaScript.`,
    highlightedLines: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 23, 24, 25, 26, 27, 28],
    state: {
      components: [
        {
          id: 'blog-page',
          name: 'BlogPage',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [
            { id: 'cap-1', name: 'Database access', allowed: true, description: 'Direct queries' },
          ],
          props: [],
          children: ['search-bar', 'post-card'],
          isHighlighted: true,
          isRendering: false,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'search-bar',
          name: 'SearchBar',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [
            { id: 'cap-2', name: 'useState', allowed: true, description: 'Search query state' },
          ],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 1,
        },
        {
          id: 'post-card',
          name: 'PostCard',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [
            { id: 'cap-3', name: 'async/await', allowed: true, description: 'Fetch author data' },
          ],
          props: [
            {
              id: 'prop-post',
              name: 'post',
              value: '{...}',
              isSerializable: true,
              isHighlighted: false,
            },
          ],
          children: ['like-button'],
          isHighlighted: true,
          isRendering: false,
          isHydrated: false,
          depth: 1,
        },
        {
          id: 'like-button',
          name: 'LikeButton',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [
            { id: 'cap-4', name: 'useState', allowed: true, description: 'Liked state' },
          ],
          props: [
            {
              id: 'prop-postid',
              name: 'postId',
              value: '"abc123"',
              isSerializable: true,
              isHighlighted: false,
            },
          ],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 2,
        },
      ],
      dataFlows: [
        {
          id: 'df-1',
          from: 'blog-page',
          to: 'search-bar',
          label: '',
          type: 'children',
          isHighlighted: false,
          isBlocked: false,
        },
        {
          id: 'df-2',
          from: 'blog-page',
          to: 'post-card',
          label: 'post={...}',
          type: 'props',
          isHighlighted: false,
          isBlocked: false,
        },
        {
          id: 'df-3',
          from: 'post-card',
          to: 'like-button',
          label: 'postId',
          type: 'props',
          isHighlighted: false,
          isBlocked: false,
        },
      ],
      boundary: { isVisible: true, label: 'Mixed server/client tree', position: 1 },
      renderTimeline: [],
      currentPhase: 'idle',
      activeConcept: 'data-flow',
      activePanel: 'tree',
      annotation: 'Server and Client Components interleave freely in the tree',
    },
    duration: 4000,
  },
  {
    id: 'step-7',
    title: 'The Rendering Pipeline - Server to Browser',
    explanation: `Let's trace the full rendering pipeline when a user visits the page:

1. SERVER RENDER
   → Server Components execute on the server
   → They fetch data, query databases, access file system
   → Output: Rendered HTML + RSC Payload

2. SERIALIZATION
   → React serializes the component tree into RSC Payload
   → Server Component output becomes plain HTML
   → Client Component references become placeholders

3. HTML STREAMING
   → Initial HTML sent to browser immediately
   → User sees content before any JS loads!
   → Client Component placeholders show server-rendered HTML

4. CLIENT HYDRATION
   → Client JS bundle loads
   → React "hydrates" Client Components — attaching event handlers
   → Server Components stay as static HTML (no hydration needed)

5. INTERACTIVE
   → Client Components are now fully interactive
   → Server Components remain as-is (no JS overhead)

This pipeline gives you the BEST of both worlds: fast initial load (server HTML) + rich interactivity (client JS only where needed).`,
    highlightedLines: [1, 2, 3, 5, 32, 33, 34, 36],
    state: {
      components: [
        {
          id: 'blog-page',
          name: 'BlogPage',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [],
          children: ['search-bar'],
          isHighlighted: false,
          isRendering: true,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'search-bar',
          name: 'SearchBar',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [],
          props: [],
          children: [],
          isHighlighted: false,
          isRendering: false,
          isHydrated: false,
          depth: 1,
        },
      ],
      dataFlows: [],
      boundary: { isVisible: true, label: 'RSC Rendering Pipeline', position: 1 },
      renderTimeline: [
        {
          id: 'rt-1',
          phase: 'server-render',
          description: 'Server Components execute on server',
          isActive: true,
          isComplete: false,
        },
        {
          id: 'rt-2',
          phase: 'serialization',
          description: 'RSC Payload serialized',
          isActive: false,
          isComplete: false,
        },
        {
          id: 'rt-3',
          phase: 'client-hydration',
          description: 'Client Components hydrate in browser',
          isActive: false,
          isComplete: false,
        },
        {
          id: 'rt-4',
          phase: 'interactive',
          description: 'Page fully interactive',
          isActive: false,
          isComplete: false,
        },
      ],
      currentPhase: 'server-render',
      activeConcept: 'rendering-pipeline',
      activePanel: 'timeline',
      annotation: 'Server renders first, then client hydrates for interactivity',
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'Hydration - Making Client Components Interactive',
    explanation: `Hydration is the process where React "attaches" to server-rendered HTML and makes it interactive.

For Server Components: NO hydration needed. They're already rendered as pure HTML. No JavaScript is ever sent for them.

For Client Components:
1. Server renders them to HTML first (for fast initial display)
2. The client JS bundle includes only the Client Component code
3. React "hydrates" — it walks the existing HTML and attaches event listeners, state, and effects
4. The component becomes fully interactive

Think of hydration like a puppet show:
• The server builds the puppet (HTML structure)
• The client adds the strings (event handlers)
• Now the puppet can move (be interactive)

The beauty: Server Components have ZERO hydration cost. The less 'use client' you use, the less JavaScript the browser needs to download and execute.

This is why the principle is: "Server by default, client when needed."`,
    highlightedLines: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
    state: {
      components: [
        {
          id: 'blog-page',
          name: 'BlogPage',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [],
          children: ['search-bar', 'post-card'],
          isHighlighted: false,
          isRendering: false,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'search-bar',
          name: 'SearchBar',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 1,
        },
        {
          id: 'post-card',
          name: 'PostCard',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [],
          children: ['like-button'],
          isHighlighted: false,
          isRendering: false,
          isHydrated: false,
          depth: 1,
        },
        {
          id: 'like-button',
          name: 'LikeButton',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 2,
        },
      ],
      dataFlows: [],
      boundary: { isVisible: true, label: 'Hydration in progress', position: 1 },
      renderTimeline: [
        {
          id: 'rt-1',
          phase: 'server-render',
          description: 'All components server-rendered',
          isActive: false,
          isComplete: true,
        },
        {
          id: 'rt-2',
          phase: 'serialization',
          description: 'HTML + RSC Payload sent',
          isActive: false,
          isComplete: true,
        },
        {
          id: 'rt-3',
          phase: 'client-hydration',
          description: 'SearchBar & LikeButton hydrating',
          isActive: true,
          isComplete: false,
        },
        {
          id: 'rt-4',
          phase: 'interactive',
          description: 'Client Components interactive',
          isActive: false,
          isComplete: false,
        },
      ],
      currentPhase: 'client-hydration',
      activeConcept: 'rendering-pipeline',
      activePanel: 'timeline',
      annotation: 'Only Client Components need hydration — Server Components are zero-JS',
    },
    duration: 5000,
  },
  {
    id: 'step-9',
    title: 'Best Practices - When to Use Which',
    explanation: `Here's a practical guide for deciding between Server and Client Components:

USE SERVER COMPONENTS for:
• Data fetching — keep API calls and DB queries on the server
• Accessing backend resources — file system, env secrets, microservices
• Large dependencies — keep heavy libraries (markdown parsers, syntax highlighters) off the client bundle
• Static content — any UI that doesn't need interactivity

USE CLIENT COMPONENTS for:
• Interactivity — forms, buttons, toggles, search bars
• State management — anything using useState, useReducer
• Browser APIs — localStorage, geolocation, clipboard
• Effects — useEffect for subscriptions, animations, timers
• Third-party UI libraries — most component libraries need 'use client'

THE GOLDEN RULE: Start with Server Components. Only add 'use client' when you hit a wall that requires interactivity. Push Client Components to the leaves of your component tree.

Think of it as an optimization: the default (server) is already optimal for performance. You opt into client rendering only when the user experience demands it.`,
    highlightedLines: [1, 2, 3, 5, 6, 32, 33, 36, 37],
    state: {
      components: [
        {
          id: 'page',
          name: 'Page (Server)',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [
            { id: 'bp-1', name: 'Data fetching', allowed: true, description: 'Keep on server' },
            { id: 'bp-2', name: 'Large deps', allowed: true, description: 'Zero bundle impact' },
          ],
          props: [],
          children: ['header', 'content'],
          isHighlighted: true,
          isRendering: false,
          isHydrated: false,
          depth: 0,
        },
        {
          id: 'header',
          name: 'Header (Server)',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [],
          props: [],
          children: ['nav-menu'],
          isHighlighted: false,
          isRendering: false,
          isHydrated: false,
          depth: 1,
        },
        {
          id: 'nav-menu',
          name: 'NavMenu (Client)',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [
            { id: 'bp-3', name: 'useState', allowed: true, description: 'Mobile menu toggle' },
          ],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 2,
        },
        {
          id: 'content',
          name: 'Content (Server)',
          environment: 'server',
          hasBoundaryDirective: false,
          capabilities: [
            { id: 'bp-4', name: 'async/await', allowed: true, description: 'Fetch page data' },
          ],
          props: [],
          children: ['like-btn'],
          isHighlighted: false,
          isRendering: false,
          isHydrated: false,
          depth: 1,
        },
        {
          id: 'like-btn',
          name: 'LikeButton (Client)',
          environment: 'client',
          hasBoundaryDirective: true,
          capabilities: [
            { id: 'bp-5', name: 'onClick', allowed: true, description: 'User interaction' },
          ],
          props: [],
          children: [],
          isHighlighted: true,
          isRendering: false,
          isHydrated: true,
          depth: 2,
        },
      ],
      dataFlows: [],
      boundary: { isVisible: true, label: 'Client Components at the leaves', position: 2 },
      renderTimeline: [],
      currentPhase: 'interactive',
      activeConcept: 'best-practices',
      activePanel: 'tree',
      annotation: 'Push Client Components to the leaves — keep the trunk server-rendered',
    },
    duration: 5000,
  },
];

export const serverClientKeyTakeaways: string[] = [
  "All components are Server Components by default in Next.js App Router — no 'use client' needed",
  "Add 'use client' only when you need hooks, event handlers, or browser APIs",
  'Only serializable data (strings, numbers, objects) can be passed from Server to Client Components',
  'Server Components can render Client Components, and Client Components can accept Server Components as children',
  'Server Components have ZERO JavaScript bundle cost — their code never reaches the browser',
  'Hydration only applies to Client Components — keeping them minimal improves performance',
  "Golden rule: Server by default, client only when interactivity demands it — push 'use client' to the leaves",
];
