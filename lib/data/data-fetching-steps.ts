/**
 * Step-by-step data for Data Fetching visualization
 *
 * This visualization demonstrates how data fetching works in
 * Next.js App Router — server fetching, loading/error states,
 * parallel vs sequential, streaming, and deduplication.
 */

import type { DataFetchingStep } from '@/lib/types';

export const dataFetchingCode = `// === Fetching in Server Components ===
// The simplest pattern: just use async/await
export default async function PostsPage() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// === loading.tsx — Automatic Loading UI ===
// app/posts/loading.tsx
export default function Loading() {
  return <div>Loading posts...</div>;
}

// === error.tsx — Automatic Error UI ===
// app/posts/error.tsx
'use client'; // error.tsx must be a Client Component
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// === Parallel Fetching (fast) ===
export default async function Dashboard() {
  // Both fetches start at the SAME time
  const [users, revenue] = await Promise.all([
    fetch('https://api.example.com/users').then(r => r.json()),
    fetch('https://api.example.com/revenue').then(r => r.json()),
  ]);

  return <DashboardView users={users} revenue={revenue} />;
}

// === Sequential Fetching (waterfall) ===
export default async function UserProfile({ params }) {
  // Fetch 1 — must complete first
  const user = await fetch(\`/api/users/\${params.id}\`)
    .then(r => r.json());

  // Fetch 2 — depends on Fetch 1
  const posts = await fetch(\`/api/users/\${user.id}/posts\`)
    .then(r => r.json());

  return <Profile user={user} posts={posts} />;
}

// === Streaming with Suspense ===
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading stats...</p>}>
        <SlowStats />  {/* Streams in when ready */}
      </Suspense>
      <Suspense fallback={<p>Loading chart...</p>}>
        <SlowChart />  {/* Streams independently */}
      </Suspense>
    </main>
  );
}`;

export const dataFetchingSteps: DataFetchingStep[] = [
  {
    id: 'step-1',
    title: 'Fetching Data in Server Components',
    explanation: `In Next.js App Router, data fetching is beautifully simple: use \`async/await\` directly in your Server Components.

No useEffect. No useState for loading states. No client-side fetching libraries needed.

export default async function PostsPage() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return <PostList posts={posts} />;
}

Why is this so clean?
• Server Components can be async functions
• The fetch happens on the SERVER, not in the browser
• The browser receives fully rendered HTML with data already in it
• No loading spinner flicker — the page arrives with content

This is fundamentally different from traditional React where you'd fetch in useEffect and manage loading/error states yourself. Here, the framework handles all of that for you.`,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    state: {
      requests: [
        {
          id: 'req-1',
          url: 'https://api.example.com/posts',
          method: 'GET',
          status: 'success',
          environment: 'server',
          cacheOption: 'force-cache (default)',
          duration: '~120ms',
          responseData: '[{id: 1, title: "Hello"}, ...]',
          isHighlighted: true,
          isParallel: false,
        },
      ],
      components: [
        { id: 'comp-page', name: 'PostsPage', type: 'page', status: 'rendered', isHighlighted: true, isActive: true, children: [], depth: 0 },
      ],
      waterfall: [
        { id: 'wf-1', label: 'fetch /posts', startOffset: 0, width: 40, status: 'success', isHighlighted: true, environment: 'server' },
        { id: 'wf-2', label: 'Render HTML', startOffset: 40, width: 20, status: 'success', isHighlighted: false, environment: 'server' },
        { id: 'wf-3', label: 'Send to browser', startOffset: 60, width: 15, status: 'success', isHighlighted: false, environment: 'server' },
      ],
      suspenseBoundaries: [],
      activeConcept: 'server-fetch',
      activePanel: 'requests',
      annotation: 'Server Components fetch data with simple async/await — no useEffect needed',
      showWaterfall: true,
    },
    duration: 5000,
  },
  {
    id: 'step-2',
    title: 'loading.tsx — Instant Loading UI',
    explanation: `What happens while the Server Component is fetching data? The user sees... nothing? No! Next.js has loading.tsx.

By placing a \`loading.tsx\` file in the same folder as your page, Next.js automatically wraps your page in a React Suspense boundary and shows the loading UI while data is being fetched.

app/posts/
├── loading.tsx  ← Shown while page loads
├── page.tsx     ← The actual page (fetching data)

The loading UI appears INSTANTLY because:
1. It's a static component — no data to fetch
2. Next.js streams it to the browser immediately
3. When the page finishes loading, it replaces the loading UI

This means:
• Users see a response immediately (loading skeleton)
• The server fetches data in the background
• When ready, the actual content streams in

No useState, no isLoading flags, no conditional rendering. Just create the file and Next.js handles everything.`,
    highlightedLines: [26, 27, 28, 29, 30],
    state: {
      requests: [
        {
          id: 'req-1',
          url: 'https://api.example.com/posts',
          method: 'GET',
          status: 'loading',
          environment: 'server',
          cacheOption: 'force-cache',
          duration: 'Pending...',
          isHighlighted: true,
          isParallel: false,
        },
      ],
      components: [
        { id: 'comp-layout', name: 'Layout', type: 'layout', status: 'rendered', isHighlighted: false, isActive: false, children: ['comp-loading', 'comp-page'], depth: 0 },
        { id: 'comp-loading', name: 'loading.tsx', type: 'loading', status: 'rendered', isHighlighted: true, isActive: true, children: [], depth: 1 },
        { id: 'comp-page', name: 'page.tsx', type: 'page', status: 'loading', isHighlighted: false, isActive: false, children: [], depth: 1 },
      ],
      waterfall: [
        { id: 'wf-1', label: 'loading.tsx shown', startOffset: 0, width: 10, status: 'success', isHighlighted: true, environment: 'server' },
        { id: 'wf-2', label: 'fetch /posts', startOffset: 5, width: 50, status: 'loading', isHighlighted: true, environment: 'server' },
        { id: 'wf-3', label: 'page.tsx streams in', startOffset: 55, width: 20, status: 'idle', isHighlighted: false, environment: 'server' },
      ],
      suspenseBoundaries: [
        { id: 'sb-1', fallbackLabel: '<Loading />', isLoading: true, isStreamed: false, children: ['comp-page'] },
      ],
      activeConcept: 'loading-ui',
      activePanel: 'components',
      annotation: 'loading.tsx shows instantly while the page fetches data on the server',
      showWaterfall: true,
    },
    duration: 5000,
  },
  {
    id: 'step-3',
    title: 'error.tsx — Automatic Error Boundaries',
    explanation: `What if the fetch fails? Next.js has you covered with \`error.tsx\`.

Like loading.tsx, just place an \`error.tsx\` file in the folder and Next.js automatically wraps your page in a React Error Boundary.

Important: error.tsx MUST be a Client Component ('use client') because:
• It needs to use the reset() function (interactivity)
• Error Boundaries are a client-side React feature

The error component receives:
• error — the Error object
• reset() — a function to retry rendering the page

app/posts/
├── loading.tsx  ← Loading state
├── error.tsx    ← Error state (must be 'use client')
├── page.tsx     ← The page

The hierarchy is: Layout → Error Boundary → Suspense → Page

This means:
• The layout STAYS VISIBLE when an error occurs
• Only the page content is replaced with the error UI
• Users can retry without losing their navigation context`,
    highlightedLines: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
    state: {
      requests: [
        {
          id: 'req-1',
          url: 'https://api.example.com/posts',
          method: 'GET',
          status: 'error',
          environment: 'server',
          cacheOption: 'force-cache',
          duration: 'Failed',
          responseData: '500 Internal Server Error',
          isHighlighted: true,
          isParallel: false,
        },
      ],
      components: [
        { id: 'comp-layout', name: 'Layout', type: 'layout', status: 'rendered', isHighlighted: false, isActive: false, children: ['comp-error', 'comp-page'], depth: 0 },
        { id: 'comp-error', name: 'error.tsx', type: 'error', status: 'rendered', isHighlighted: true, isActive: true, children: [], depth: 1 },
        { id: 'comp-page', name: 'page.tsx', type: 'page', status: 'error', isHighlighted: false, isActive: false, children: [], depth: 1 },
      ],
      waterfall: [
        { id: 'wf-1', label: 'fetch /posts', startOffset: 0, width: 35, status: 'error', isHighlighted: true, environment: 'server' },
        { id: 'wf-2', label: 'error.tsx rendered', startOffset: 35, width: 15, status: 'success', isHighlighted: true, environment: 'server' },
      ],
      suspenseBoundaries: [],
      activeConcept: 'error-handling',
      activePanel: 'components',
      annotation: 'error.tsx catches failures and provides a retry button — layout stays intact',
      showWaterfall: true,
    },
    duration: 5000,
  },
  {
    id: 'step-4',
    title: 'Parallel Fetching — Avoid Waterfalls',
    explanation: `When you need multiple pieces of data, fetch them IN PARALLEL using Promise.all. This is one of the most impactful performance patterns.

BAD (sequential — waterfall):
const users = await fetch('/api/users');     // 200ms
const revenue = await fetch('/api/revenue'); // 200ms
// Total: 400ms (one after another)

GOOD (parallel):
const [users, revenue] = await Promise.all([
  fetch('/api/users'),     // 200ms ─┐
  fetch('/api/revenue'),   // 200ms ─┤ Run simultaneously
]);                                   //
// Total: ~200ms (whichever is slower)

By starting both fetches at the same time, the total wait is only as long as the SLOWEST fetch — not the sum of all fetches.

This is crucial for pages with multiple data sources (dashboards, profiles, etc.). The difference can be dramatic:
• 3 sequential fetches at 200ms each = 600ms
• 3 parallel fetches at 200ms each = ~200ms

Rule of thumb: If fetches don't depend on each other, ALWAYS use Promise.all.`,
    highlightedLines: [45, 46, 47, 48, 49, 50, 51, 52],
    state: {
      requests: [
        {
          id: 'req-1',
          url: '/api/users',
          method: 'GET',
          status: 'success',
          environment: 'server',
          cacheOption: 'force-cache',
          duration: '~180ms',
          responseData: '[{id: 1, name: "Alice"}]',
          isHighlighted: true,
          isParallel: true,
        },
        {
          id: 'req-2',
          url: '/api/revenue',
          method: 'GET',
          status: 'success',
          environment: 'server',
          cacheOption: 'force-cache',
          duration: '~150ms',
          responseData: '{total: 50000}',
          isHighlighted: true,
          isParallel: true,
        },
      ],
      components: [
        { id: 'comp-dash', name: 'Dashboard', type: 'page', status: 'rendered', isHighlighted: true, isActive: true, children: [], depth: 0 },
      ],
      waterfall: [
        { id: 'wf-1', label: 'fetch /users', startOffset: 0, width: 35, status: 'success', isHighlighted: true, environment: 'server' },
        { id: 'wf-2', label: 'fetch /revenue', startOffset: 0, width: 30, status: 'success', isHighlighted: true, environment: 'server' },
        { id: 'wf-3', label: 'Render page', startOffset: 35, width: 15, status: 'success', isHighlighted: false, environment: 'server' },
      ],
      suspenseBoundaries: [],
      activeConcept: 'parallel-fetch',
      activePanel: 'waterfall',
      annotation: 'Promise.all runs fetches in parallel — total time = slowest fetch only',
      showWaterfall: true,
    },
    duration: 5000,
  },
  {
    id: 'step-5',
    title: 'Sequential Fetching — When Order Matters',
    explanation: `Sometimes you NEED sequential fetching — when one fetch depends on the result of another.

// Fetch 1: Get the user (need their ID first)
const user = await fetch(\`/api/users/\${params.id}\`);

// Fetch 2: Get their posts (depends on user.id)
const posts = await fetch(\`/api/users/\${user.id}/posts\`);

This creates a "waterfall": each request must wait for the previous one to complete. The total time is the SUM of all request durations.

Waterfall visualization:
|------ fetch user (200ms) ------|
                                 |------ fetch posts (150ms) ------|
Total: 350ms

When sequential is unavoidable (data dependencies), you can mitigate the impact:
• Use loading.tsx so users see content progressively
• Fetch as much as possible in parallel alongside the sequential chain
• Consider restructuring your API to return all needed data in one call
• Use React Suspense to stream independent parts as they become ready`,
    highlightedLines: [55, 56, 57, 58, 59, 60, 61, 62, 63],
    state: {
      requests: [
        {
          id: 'req-1',
          url: '/api/users/123',
          method: 'GET',
          status: 'success',
          environment: 'server',
          cacheOption: 'force-cache',
          duration: '~200ms',
          responseData: '{id: 123, name: "Alice"}',
          isHighlighted: true,
          isParallel: false,
        },
        {
          id: 'req-2',
          url: '/api/users/123/posts',
          method: 'GET',
          status: 'loading',
          environment: 'server',
          cacheOption: 'force-cache',
          duration: 'Pending...',
          isHighlighted: true,
          isParallel: false,
        },
      ],
      components: [
        { id: 'comp-profile', name: 'UserProfile', type: 'page', status: 'loading', isHighlighted: true, isActive: true, children: [], depth: 0 },
      ],
      waterfall: [
        { id: 'wf-1', label: 'fetch /users/123', startOffset: 0, width: 35, status: 'success', isHighlighted: true, environment: 'server' },
        { id: 'wf-2', label: 'fetch /users/123/posts', startOffset: 35, width: 30, status: 'loading', isHighlighted: true, environment: 'server' },
        { id: 'wf-3', label: 'Render page', startOffset: 65, width: 15, status: 'idle', isHighlighted: false, environment: 'server' },
      ],
      suspenseBoundaries: [],
      activeConcept: 'sequential-fetch',
      activePanel: 'waterfall',
      annotation: 'Sequential fetches create waterfalls — use only when data depends on prior results',
      showWaterfall: true,
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'Streaming with Suspense — Progressive Loading',
    explanation: `Streaming is the most advanced data fetching pattern. Instead of waiting for ALL data before showing anything, you stream parts of the page as they become ready.

Wrap slow components in <Suspense> boundaries:

<main>
  <h1>Dashboard</h1>              ← Sent immediately
  <Suspense fallback={<Spinner/>}>
    <SlowStats />                 ← Streams in when ready
  </Suspense>
  <Suspense fallback={<Spinner/>}>
    <SlowChart />                 ← Streams independently
  </Suspense>
</main>

How streaming works:
1. Next.js sends the shell (layout + fallbacks) immediately
2. Each Suspense boundary independently fetches its data
3. As each component resolves, it streams into the page
4. Users see a progressively loading page

This is different from loading.tsx (which replaces the ENTIRE page). Suspense lets you have multiple loading states on a single page, each resolving independently.

The result: users see content the moment it's ready, without waiting for the slowest part of the page.`,
    highlightedLines: [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    state: {
      requests: [
        {
          id: 'req-1',
          url: '/api/stats',
          method: 'GET',
          status: 'loading',
          environment: 'server',
          cacheOption: 'no-store',
          duration: 'Pending (~500ms)',
          isHighlighted: true,
          isParallel: true,
        },
        {
          id: 'req-2',
          url: '/api/chart-data',
          method: 'GET',
          status: 'success',
          environment: 'server',
          cacheOption: 'no-store',
          duration: '~200ms',
          responseData: '{labels: [...], values: [...]}',
          isHighlighted: true,
          isParallel: true,
        },
      ],
      components: [
        { id: 'comp-page', name: 'Page (shell)', type: 'page', status: 'streaming', isHighlighted: false, isActive: true, children: ['comp-stats', 'comp-chart'], depth: 0 },
        { id: 'comp-stats', name: 'SlowStats', type: 'suspense-boundary', status: 'loading', isHighlighted: true, isActive: true, children: [], depth: 1 },
        { id: 'comp-chart', name: 'SlowChart', type: 'suspense-boundary', status: 'rendered', isHighlighted: true, isActive: false, children: [], depth: 1 },
      ],
      waterfall: [
        { id: 'wf-0', label: 'Shell sent (instant)', startOffset: 0, width: 8, status: 'success', isHighlighted: false, environment: 'server' },
        { id: 'wf-1', label: 'SlowStats fetching', startOffset: 5, width: 55, status: 'loading', isHighlighted: true, environment: 'server' },
        { id: 'wf-2', label: 'SlowChart fetching', startOffset: 5, width: 25, status: 'success', isHighlighted: true, environment: 'server' },
        { id: 'wf-3', label: 'Chart streams in', startOffset: 30, width: 10, status: 'success', isHighlighted: true, environment: 'server' },
      ],
      suspenseBoundaries: [
        { id: 'sb-1', fallbackLabel: '<Spinner />', isLoading: true, isStreamed: false, children: ['comp-stats'] },
        { id: 'sb-2', fallbackLabel: '<Spinner />', isLoading: false, isStreamed: true, children: ['comp-chart'] },
      ],
      activeConcept: 'streaming',
      activePanel: 'suspense',
      annotation: 'Suspense boundaries stream content independently — no all-or-nothing loading',
      showWaterfall: true,
    },
    duration: 5000,
  },
  {
    id: 'step-7',
    title: 'Request Deduplication — Same URL, One Fetch',
    explanation: `Next.js automatically deduplicates fetch requests. If multiple components fetch the same URL during a single render, only ONE actual network request is made.

// Component A
const user = await fetch('/api/user');  // → actual request

// Component B (same render)
const user = await fetch('/api/user');  // → uses cached result from A

This is incredibly useful because:
• Multiple components can independently fetch what they need
• No need for prop drilling or context just to share data
• No performance penalty for "redundant" fetches

The deduplication works because:
1. Next.js extends the native fetch API
2. During a single server render pass, it caches by URL + options
3. Identical requests resolve from the cache
4. This only applies to GET requests with the same URL and options

This means you can design your components to be self-contained — each fetching its own data — without worrying about duplicate network calls.`,
    highlightedLines: [3, 4, 5],
    state: {
      requests: [
        {
          id: 'req-1',
          url: '/api/user',
          method: 'GET',
          status: 'success',
          environment: 'server',
          cacheOption: 'Deduplicated',
          duration: '~100ms (actual)',
          responseData: '{id: 1, name: "Alice"}',
          isHighlighted: true,
          isParallel: false,
        },
        {
          id: 'req-2',
          url: '/api/user',
          method: 'GET',
          status: 'cached',
          environment: 'server',
          cacheOption: 'Deduplicated (cached)',
          duration: '~0ms (from cache)',
          responseData: '{id: 1, name: "Alice"}',
          isHighlighted: true,
          isParallel: false,
        },
      ],
      components: [
        { id: 'comp-a', name: 'ComponentA', type: 'page', status: 'rendered', isHighlighted: true, isActive: false, children: [], depth: 0 },
        { id: 'comp-b', name: 'ComponentB', type: 'page', status: 'rendered', isHighlighted: true, isActive: false, children: [], depth: 0 },
      ],
      waterfall: [
        { id: 'wf-1', label: 'fetch /api/user (actual)', startOffset: 0, width: 25, status: 'success', isHighlighted: true, environment: 'server' },
        { id: 'wf-2', label: 'fetch /api/user (dedupe)', startOffset: 0, width: 3, status: 'cached', isHighlighted: true, environment: 'server' },
      ],
      suspenseBoundaries: [],
      activeConcept: 'deduplication',
      activePanel: 'waterfall',
      annotation: 'Same URL during one render = one network request — components stay self-contained',
      showWaterfall: true,
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'Choosing the Right Pattern',
    explanation: `Here's your decision guide for data fetching in Next.js:

1. SIMPLE PAGE DATA
   → async/await in Server Component + loading.tsx
   → Best for: Blog posts, product pages

2. MULTIPLE INDEPENDENT DATA SOURCES
   → Promise.all for parallel fetching
   → Best for: Dashboards, overview pages

3. DEPENDENT DATA
   → Sequential fetches (unavoidable waterfall)
   → Mitigate with: Suspense streaming, restructured APIs

4. MIXED SPEED DATA
   → Suspense boundaries around slow parts
   → Best for: Pages with fast header + slow analytics

5. REAL-TIME / USER-SPECIFIC DATA
   → cache: 'no-store' for fresh data per request
   → Best for: Shopping carts, user feeds

6. SHARED DATA ACROSS COMPONENTS
   → Just fetch in each component — deduplication handles it
   → No need for prop drilling or context

The golden rule: Fetch data WHERE you need it (in the component), let Next.js handle caching and deduplication. Use parallel fetching when possible, and Suspense for progressive loading.`,
    highlightedLines: [1, 2, 3, 4, 45, 46, 47, 66, 67, 68],
    state: {
      requests: [],
      components: [
        { id: 'comp-page', name: 'Page (Server)', type: 'page', status: 'rendered', isHighlighted: true, isActive: true, children: ['comp-fast', 'comp-slow'], depth: 0 },
        { id: 'comp-fast', name: 'FastSection', type: 'suspense-boundary', status: 'rendered', isHighlighted: false, isActive: false, children: [], depth: 1 },
        { id: 'comp-slow', name: 'SlowSection', type: 'suspense-boundary', status: 'rendered', isHighlighted: false, isActive: false, children: [], depth: 1 },
      ],
      waterfall: [
        { id: 'wf-1', label: 'Parallel: fetch A + B', startOffset: 0, width: 30, status: 'success', isHighlighted: true, environment: 'server' },
        { id: 'wf-2', label: 'Sequential: fetch C', startOffset: 30, width: 25, status: 'success', isHighlighted: false, environment: 'server' },
        { id: 'wf-3', label: 'Stream: Suspense D', startOffset: 10, width: 50, status: 'success', isHighlighted: false, environment: 'server' },
      ],
      suspenseBoundaries: [],
      activeConcept: 'patterns',
      activePanel: 'waterfall',
      annotation: 'Fetch where you need it, parallelize what you can, stream the rest',
      showWaterfall: true,
    },
    duration: 5000,
  },
];

export const dataFetchingKeyTakeaways: string[] = [
  'Server Components use simple async/await for data fetching — no useEffect or client-side state needed',
  'loading.tsx automatically creates a Suspense boundary, showing instant loading UI while the page fetches data',
  "error.tsx creates an automatic Error Boundary — must be a Client Component with 'use client'",
  'Use Promise.all for parallel fetching when data sources are independent — total time = slowest fetch',
  'Sequential fetching creates waterfalls — use only when one fetch depends on another\'s result',
  'Suspense boundaries enable streaming — different parts of the page load independently',
  'Next.js auto-deduplicates identical fetch calls during a render — components can fetch independently without waste',
];
