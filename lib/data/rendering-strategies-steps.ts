/**
 * Step-by-step data for Rendering Strategies (SSR, SSG, ISR) visualization
 *
 * This visualization demonstrates how Next.js renders pages using
 * Static Site Generation, Server-Side Rendering, and Incremental
 * Static Regeneration.
 */

import type { RenderingStrategiesStep } from '@/lib/types';

export const renderingStrategiesCode = `// === Static Site Generation (SSG) ===
// Default behavior — pages built at build time
export default async function BlogPage() {
  // fetch with default caching (force-cache)
  const posts = await fetch('https://api.example.com/posts');

  return <PostList posts={await posts.json()} />;
}

// === Server-Side Rendering (SSR) ===
// Fresh data on every request
export default async function DashboardPage() {
  // no-store = fetch fresh data every request
  const stats = await fetch('https://api.example.com/stats', {
    cache: 'no-store',
  });

  return <Dashboard stats={await stats.json()} />;
}

// === Incremental Static Regeneration (ISR) ===
// Static + periodic revalidation
export default async function ProductPage() {
  // Revalidate cached data every 60 seconds
  const product = await fetch('https://api.example.com/product', {
    next: { revalidate: 60 },
  });

  return <Product data={await product.json()} />;
}

// === Route Segment Config (alternative) ===
// Force dynamic rendering for the entire route
export const dynamic = 'force-dynamic';  // SSR
export const revalidate = 60;            // ISR (60s)
export const dynamic = 'force-static';   // SSG

// === generateStaticParams (SSG for dynamic routes) ===
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts');
  return (await posts.json()).map((post) => ({
    slug: post.slug,
  }));
}`;

export const renderingStrategiesSteps: RenderingStrategiesStep[] = [
  {
    id: 'step-1',
    title: 'Three Ways to Render - The Big Picture',
    explanation: `Next.js gives you three rendering strategies, each optimized for different scenarios:

1. SSG (Static Site Generation)
   • Pages built ONCE at build time
   • Served as static HTML from CDN
   • Fastest — no server processing per request

2. SSR (Server-Side Rendering)
   • Pages rendered on the SERVER for EVERY request
   • Always shows the latest data
   • Slower — server must render each request

3. ISR (Incremental Static Regeneration)
   • Pages built at build time THEN periodically re-generated
   • Serves static HTML but refreshes in the background
   • Best of both worlds — fast + reasonably fresh

The choice depends on your data: How often does it change? How critical is freshness? How fast must the page load?

In Next.js App Router, the strategy is determined by HOW you fetch data — specifically the caching options you pass to \`fetch()\`.`,
    highlightedLines: [1, 2, 3, 20, 21, 22, 32, 33],
    state: {
      activeStrategy: null,
      timeline: [],
      cache: { isCached: false, isStale: false, lastGenerated: '', cacheType: 'none' },
      requestFlow: [],
      comparison: [
        {
          id: 'cmp-1',
          property: 'When rendered',
          ssg: 'Build time',
          ssr: 'Every request',
          isr: 'Build + revalidate',
        },
        { id: 'cmp-2', property: 'Speed', ssg: 'Fastest', ssr: 'Slowest', isr: 'Fast' },
        {
          id: 'cmp-3',
          property: 'Data freshness',
          ssg: 'Build-time data',
          ssr: 'Always fresh',
          isr: 'Periodically fresh',
        },
        { id: 'cmp-4', property: 'Server load', ssg: 'None (CDN)', ssr: 'High', isr: 'Low' },
      ],
      activeConcept: 'overview',
      activePanel: 'comparison',
      annotation: 'Three strategies for three different needs',
      showComparison: true,
    },
    duration: 5000,
  },
  {
    id: 'step-2',
    title: 'SSG - Static Site Generation',
    explanation: `Static Site Generation is the DEFAULT in Next.js. Pages are rendered at BUILD TIME and served as static HTML files.

How it works:
1. You run \`next build\`
2. Next.js renders ALL pages to HTML files
3. These static files are deployed to a CDN
4. Every user gets the same pre-built HTML — instantly

The \`fetch()\` call uses the default cache behavior (\`force-cache\`), which means the data is fetched ONCE during build and cached forever.

This is ideal for:
• Blog posts and documentation
• Marketing pages and landing pages
• Product pages that don't change frequently
• Any content that's the same for all users

The performance advantage is enormous: the HTML is already generated, so the server doesn't need to do ANY work per request. The CDN serves the file directly — typically in under 50ms globally.`,
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8],
    state: {
      activeStrategy: 'SSG',
      timeline: [
        {
          id: 'tl-1',
          phase: 'build-time',
          label: 'Build Time',
          description: 'next build runs',
          isActive: true,
          isComplete: false,
          duration: 'Once',
          environment: 'build',
        },
        {
          id: 'tl-2',
          phase: 'html-generation',
          label: 'HTML Generated',
          description: 'Page rendered to static HTML',
          isActive: true,
          isComplete: false,
          duration: '~500ms',
          environment: 'build',
        },
        {
          id: 'tl-3',
          phase: 'cache-store',
          label: 'CDN Deploy',
          description: 'Static files uploaded to CDN',
          isActive: false,
          isComplete: false,
          duration: '-',
          environment: 'cdn',
        },
        {
          id: 'tl-4',
          phase: 'request-received',
          label: 'User Request',
          description: 'CDN serves cached HTML',
          isActive: false,
          isComplete: false,
          duration: '~20ms',
          environment: 'cdn',
        },
        {
          id: 'tl-5',
          phase: 'response-sent',
          label: 'Response',
          description: 'Pre-built HTML delivered instantly',
          isActive: false,
          isComplete: false,
          duration: '~20ms',
          environment: 'browser',
        },
      ],
      cache: {
        isCached: true,
        isStale: false,
        lastGenerated: 'Build time',
        cacheType: 'full-route',
      },
      requestFlow: [
        {
          id: 'rf-1',
          from: 'Build',
          to: 'Server',
          label: 'next build',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-2',
          from: 'Server',
          to: 'CDN',
          label: 'Static HTML',
          isActive: true,
          isHighlighted: false,
        },
        {
          id: 'rf-3',
          from: 'User',
          to: 'CDN',
          label: 'Request',
          isActive: false,
          isHighlighted: false,
        },
        {
          id: 'rf-4',
          from: 'CDN',
          to: 'User',
          label: 'Cached HTML',
          isActive: false,
          isHighlighted: false,
        },
      ],
      comparison: [],
      activeConcept: 'ssg-flow',
      activePanel: 'timeline',
      annotation: 'SSG: Build once, serve forever — fastest possible page loads',
      showComparison: false,
    },
    duration: 5000,
  },
  {
    id: 'step-3',
    title: 'SSG - The Request Flow',
    explanation: `When a user visits an SSG page, here's what happens:

1. User's browser sends request to CDN
2. CDN already has the pre-built HTML file
3. CDN sends the HTML directly — no server involved
4. Browser renders the page

The server is completely OUT of the picture for SSG pages. Once built, the CDN handles everything. This gives you:

• Global performance — CDN edge nodes are everywhere
• Infinite scale — static files can serve millions of users
• Zero server cost — no compute per request
• Maximum reliability — no server means no server errors

The tradeoff: the data is frozen at build time. If your blog post content changes, you need to rebuild and redeploy. For many use cases, this is perfectly acceptable.

In the code, the default \`fetch()\` behavior (or explicitly \`cache: 'force-cache'\`) makes the route static.`,
    highlightedLines: [4, 5, 6, 7, 8],
    state: {
      activeStrategy: 'SSG',
      timeline: [
        {
          id: 'tl-1',
          phase: 'build-time',
          label: 'Build Time',
          description: 'HTML pre-generated',
          isActive: false,
          isComplete: true,
          duration: 'Done',
          environment: 'build',
        },
        {
          id: 'tl-2',
          phase: 'html-generation',
          label: 'HTML Generated',
          description: 'Static file created',
          isActive: false,
          isComplete: true,
          duration: 'Done',
          environment: 'build',
        },
        {
          id: 'tl-3',
          phase: 'cache-store',
          label: 'CDN Deploy',
          description: 'Files on CDN edge',
          isActive: false,
          isComplete: true,
          duration: 'Done',
          environment: 'cdn',
        },
        {
          id: 'tl-4',
          phase: 'request-received',
          label: 'User Request',
          description: 'Hits CDN edge node',
          isActive: true,
          isComplete: false,
          duration: '~10ms',
          environment: 'cdn',
        },
        {
          id: 'tl-5',
          phase: 'response-sent',
          label: 'Response',
          description: 'Cached HTML served instantly',
          isActive: true,
          isComplete: false,
          duration: '~20ms',
          environment: 'browser',
        },
      ],
      cache: {
        isCached: true,
        isStale: false,
        lastGenerated: 'Build time',
        cacheType: 'full-route',
      },
      requestFlow: [
        {
          id: 'rf-1',
          from: 'Build',
          to: 'Server',
          label: 'Completed',
          isActive: false,
          isHighlighted: false,
        },
        {
          id: 'rf-2',
          from: 'Server',
          to: 'CDN',
          label: 'Deployed',
          isActive: false,
          isHighlighted: false,
        },
        {
          id: 'rf-3',
          from: 'User',
          to: 'CDN',
          label: 'GET /blog',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-4',
          from: 'CDN',
          to: 'User',
          label: 'Static HTML',
          isActive: true,
          isHighlighted: true,
        },
      ],
      comparison: [],
      activeConcept: 'ssg-flow',
      activePanel: 'flow',
      annotation: 'No server needed — CDN serves pre-built HTML directly',
      showComparison: false,
    },
    duration: 4000,
  },
  {
    id: 'step-4',
    title: 'SSR - Server-Side Rendering',
    explanation: `Server-Side Rendering generates a FRESH page on the server for EVERY request. The page is never cached — each user gets a freshly rendered page.

How it works:
1. User sends request to server
2. Server runs your component code
3. Server fetches data from APIs/database
4. Server renders HTML with the latest data
5. Fresh HTML sent back to user

You trigger SSR by using \`cache: 'no-store'\` on your fetch calls, or by setting \`export const dynamic = 'force-dynamic'\` in the route segment config.

This is ideal for:
• Dashboards with real-time data
• User-specific pages (profiles, settings)
• Search results pages
• Any page where data changes frequently and staleness is unacceptable

The tradeoff: every request hits the server, which means:
• Slower page loads (server must render each time)
• Higher server costs (more compute per request)
• Less scalable than static (can't cache on CDN)`,
    highlightedLines: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    state: {
      activeStrategy: 'SSR',
      timeline: [
        {
          id: 'tl-1',
          phase: 'request-received',
          label: 'Request Received',
          description: 'Server receives user request',
          isActive: true,
          isComplete: false,
          duration: '~5ms',
          environment: 'server',
        },
        {
          id: 'tl-2',
          phase: 'server-render',
          label: 'Server Render',
          description: 'Component executes, data fetched',
          isActive: true,
          isComplete: false,
          duration: '~200ms',
          environment: 'server',
        },
        {
          id: 'tl-3',
          phase: 'html-generation',
          label: 'HTML Generated',
          description: 'Fresh HTML built from data',
          isActive: false,
          isComplete: false,
          duration: '~50ms',
          environment: 'server',
        },
        {
          id: 'tl-4',
          phase: 'response-sent',
          label: 'Response Sent',
          description: 'HTML streamed to browser',
          isActive: false,
          isComplete: false,
          duration: '~100ms',
          environment: 'browser',
        },
      ],
      cache: { isCached: false, isStale: false, lastGenerated: 'Per request', cacheType: 'none' },
      requestFlow: [
        {
          id: 'rf-1',
          from: 'User',
          to: 'Server',
          label: 'GET /dashboard',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-2',
          from: 'Server',
          to: 'API',
          label: 'Fetch data',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-3',
          from: 'API',
          to: 'Server',
          label: 'Fresh data',
          isActive: true,
          isHighlighted: false,
        },
        {
          id: 'rf-4',
          from: 'Server',
          to: 'User',
          label: 'Fresh HTML',
          isActive: false,
          isHighlighted: false,
        },
      ],
      comparison: [],
      activeConcept: 'ssr-flow',
      activePanel: 'timeline',
      annotation: 'SSR: Fresh data on every request — always up to date',
      showComparison: false,
    },
    duration: 5000,
  },
  {
    id: 'step-5',
    title: 'SSR - Every Request Gets Fresh Data',
    explanation: `With SSR, every request triggers the full rendering pipeline on the server. Let's see the complete flow:

Request 1 (User A): Server fetches data → renders → sends HTML
Request 2 (User B): Server fetches data → renders → sends HTML (again!)
Request 3 (User C): Server fetches data → renders → sends HTML (again!)

Each request is independent. There's no caching. The server does the FULL work for every single request.

The \`cache: 'no-store'\` option on fetch tells Next.js:
"Do NOT cache this data. Always get it fresh."

This also means the route cannot be statically generated — Next.js automatically makes it a dynamic (SSR) route.

Performance characteristics:
• TTFB (Time to First Byte): 200-500ms+ depending on data fetching
• Data freshness: Instant (always latest)
• Server load: Proportional to traffic
• Cost: Higher (compute per request)

Use this when freshness is more important than speed.`,
    highlightedLines: [23, 24, 25, 26],
    state: {
      activeStrategy: 'SSR',
      timeline: [
        {
          id: 'tl-1',
          phase: 'request-received',
          label: 'Request Received',
          description: 'Server receives request',
          isActive: false,
          isComplete: true,
          duration: '~5ms',
          environment: 'server',
        },
        {
          id: 'tl-2',
          phase: 'server-render',
          label: 'Server Render',
          description: 'Data fetched, component rendered',
          isActive: false,
          isComplete: true,
          duration: '~200ms',
          environment: 'server',
        },
        {
          id: 'tl-3',
          phase: 'html-generation',
          label: 'HTML Generated',
          description: 'HTML built with fresh data',
          isActive: false,
          isComplete: true,
          duration: '~50ms',
          environment: 'server',
        },
        {
          id: 'tl-4',
          phase: 'response-sent',
          label: 'Response Sent',
          description: 'Fresh HTML delivered to user',
          isActive: true,
          isComplete: false,
          duration: '~100ms',
          environment: 'browser',
        },
      ],
      cache: { isCached: false, isStale: false, lastGenerated: 'Just now', cacheType: 'none' },
      requestFlow: [
        {
          id: 'rf-1',
          from: 'User',
          to: 'Server',
          label: 'Every request',
          isActive: true,
          isHighlighted: false,
        },
        {
          id: 'rf-2',
          from: 'Server',
          to: 'API',
          label: 'Fresh fetch',
          isActive: true,
          isHighlighted: false,
        },
        {
          id: 'rf-3',
          from: 'API',
          to: 'Server',
          label: 'Latest data',
          isActive: true,
          isHighlighted: false,
        },
        {
          id: 'rf-4',
          from: 'Server',
          to: 'User',
          label: 'Fresh HTML',
          isActive: true,
          isHighlighted: true,
        },
      ],
      comparison: [],
      activeConcept: 'ssr-flow',
      activePanel: 'flow',
      annotation: "cache: 'no-store' = always fresh, never cached",
      showComparison: false,
    },
    duration: 4000,
  },
  {
    id: 'step-6',
    title: 'ISR - The Best of Both Worlds',
    explanation: `Incremental Static Regeneration combines the speed of SSG with the freshness of SSR. Pages are statically generated but periodically refreshed in the background.

How it works:
1. Page is built at build time (like SSG)
2. Served as static HTML (like SSG — fast!)
3. After \`revalidate\` seconds, the page becomes "stale"
4. Next request still gets the stale (cached) page instantly
5. In the background, Next.js regenerates the page with fresh data
6. Future requests get the new page

The key: \`next: { revalidate: 60 }\` means:
"Cache this for 60 seconds. After that, regenerate on the next request."

This is the "stale-while-revalidate" pattern:
• Users ALWAYS get a fast response (cached HTML)
• Data is EVENTUALLY fresh (background regeneration)
• Server load is minimal (only regenerates periodically)

Think of it like a newspaper: you read today's edition (cached), and in the background, tomorrow's edition is being printed.`,
    highlightedLines: [32, 33, 34, 35, 36, 37, 38, 39, 40],
    state: {
      activeStrategy: 'ISR',
      timeline: [
        {
          id: 'tl-1',
          phase: 'build-time',
          label: 'Build Time',
          description: 'Initial page generated',
          isActive: false,
          isComplete: true,
          duration: 'Once',
          environment: 'build',
        },
        {
          id: 'tl-2',
          phase: 'cache-store',
          label: 'Cached',
          description: 'Static HTML served from cache',
          isActive: true,
          isComplete: false,
          duration: '60s TTL',
          environment: 'cdn',
        },
        {
          id: 'tl-3',
          phase: 'request-received',
          label: 'Request (stale)',
          description: 'Cache expired, serve stale',
          isActive: false,
          isComplete: false,
          duration: '~20ms',
          environment: 'cdn',
        },
        {
          id: 'tl-4',
          phase: 'revalidation',
          label: 'Background Regen',
          description: 'Server regenerates page',
          isActive: false,
          isComplete: false,
          duration: '~200ms',
          environment: 'server',
        },
        {
          id: 'tl-5',
          phase: 'cache-store',
          label: 'Cache Updated',
          description: 'Fresh page replaces stale',
          isActive: false,
          isComplete: false,
          duration: '-',
          environment: 'cdn',
        },
      ],
      cache: {
        isCached: true,
        isStale: false,
        lastGenerated: 'Build time',
        revalidateAfter: '60s',
        cacheType: 'full-route',
      },
      requestFlow: [
        {
          id: 'rf-1',
          from: 'Build',
          to: 'CDN',
          label: 'Static HTML',
          isActive: false,
          isHighlighted: false,
        },
        {
          id: 'rf-2',
          from: 'User',
          to: 'CDN',
          label: 'Request',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-3',
          from: 'CDN',
          to: 'User',
          label: 'Cached HTML (fast)',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-4',
          from: 'CDN',
          to: 'Server',
          label: 'Background regen',
          isActive: false,
          isHighlighted: false,
        },
      ],
      comparison: [],
      activeConcept: 'isr-flow',
      activePanel: 'timeline',
      annotation: 'ISR: Static speed + background freshness — best of both worlds',
      showComparison: false,
    },
    duration: 5000,
  },
  {
    id: 'step-7',
    title: 'ISR - Stale-While-Revalidate in Action',
    explanation: `Let's see ISR's stale-while-revalidate pattern in action with a timeline:

T=0s (Build): Page generated with data V1
T=1s-59s: All requests get cached V1 (instant)
T=60s: Cache becomes STALE

T=61s (Request A):
  → User A gets stale V1 (still instant!)
  → Background: Server fetches fresh data, renders V2
  → V2 stored in cache

T=62s+ (Request B):
  → User B gets fresh V2

The user who triggered revalidation (Request A) gets the stale page — they DON'T wait for the regeneration. This means:

• NO user ever waits for server rendering
• Data is at most \`revalidate\` seconds old
• Server only regenerates once per revalidation period

The revalidate value is your freshness dial:
• \`revalidate: 10\` → Data is at most 10s old (almost real-time)
• \`revalidate: 3600\` → Data is at most 1 hour old (good for blog posts)
• \`revalidate: 86400\` → Data refreshes daily`,
    highlightedLines: [35, 36, 37, 38],
    state: {
      activeStrategy: 'ISR',
      timeline: [
        {
          id: 'tl-1',
          phase: 'build-time',
          label: 'Build (V1)',
          description: 'Initial page V1 generated',
          isActive: false,
          isComplete: true,
          duration: 'Done',
          environment: 'build',
        },
        {
          id: 'tl-2',
          phase: 'cache-store',
          label: 'Serving V1',
          description: 'Cached V1 served for 60s',
          isActive: false,
          isComplete: true,
          duration: '60s',
          environment: 'cdn',
        },
        {
          id: 'tl-3',
          phase: 'stale-while-revalidate',
          label: 'Stale Request',
          description: 'User gets stale V1 instantly',
          isActive: true,
          isComplete: false,
          duration: '~20ms',
          environment: 'cdn',
        },
        {
          id: 'tl-4',
          phase: 'revalidation',
          label: 'Background Regen',
          description: 'Server building V2 in background',
          isActive: true,
          isComplete: false,
          duration: '~200ms',
          environment: 'server',
        },
        {
          id: 'tl-5',
          phase: 'cache-store',
          label: 'V2 Ready',
          description: 'Fresh V2 replaces V1 in cache',
          isActive: false,
          isComplete: false,
          duration: '-',
          environment: 'cdn',
        },
      ],
      cache: {
        isCached: true,
        isStale: true,
        lastGenerated: '60s ago',
        revalidateAfter: '60s',
        cacheType: 'full-route',
      },
      requestFlow: [
        {
          id: 'rf-1',
          from: 'User A',
          to: 'CDN',
          label: 'Request',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-2',
          from: 'CDN',
          to: 'User A',
          label: 'Stale V1 (instant)',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-3',
          from: 'CDN',
          to: 'Server',
          label: 'Trigger regen',
          isActive: true,
          isHighlighted: false,
        },
        {
          id: 'rf-4',
          from: 'Server',
          to: 'CDN',
          label: 'Fresh V2',
          isActive: true,
          isHighlighted: false,
        },
      ],
      comparison: [],
      activeConcept: 'isr-flow',
      activePanel: 'flow',
      annotation: 'Stale-while-revalidate: serve fast now, refresh in background',
      showComparison: false,
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'How fetch() Options Control the Strategy',
    explanation: `In Next.js App Router, the rendering strategy is determined by your \`fetch()\` options. No special configuration files needed.

Default (SSG):
fetch('https://api.example.com/data')
// OR explicitly:
fetch('...', { cache: 'force-cache' })
→ Data cached forever, page is static

SSR (no caching):
fetch('...', { cache: 'no-store' })
→ Data fetched fresh every request

ISR (timed revalidation):
fetch('...', { next: { revalidate: 60 } })
→ Data cached for 60 seconds, then refreshed

You can also use Route Segment Config as an alternative:
export const dynamic = 'force-dynamic'  // SSR
export const revalidate = 60            // ISR
export const dynamic = 'force-static'   // SSG

IMPORTANT: If ANY fetch in a page uses \`no-store\`, the ENTIRE page becomes dynamic (SSR). The most dynamic fetch "wins" and determines the page's strategy.`,
    highlightedLines: [4, 5, 24, 25, 26, 36, 37, 38, 44, 45, 46, 47],
    state: {
      activeStrategy: null,
      timeline: [],
      cache: { isCached: false, isStale: false, lastGenerated: '', cacheType: 'none' },
      requestFlow: [],
      comparison: [
        {
          id: 'cmp-1',
          property: 'fetch option',
          ssg: "cache: 'force-cache'",
          ssr: "cache: 'no-store'",
          isr: 'next: { revalidate: N }',
        },
        {
          id: 'cmp-2',
          property: 'Route config',
          ssg: "dynamic = 'force-static'",
          ssr: "dynamic = 'force-dynamic'",
          isr: 'revalidate = N',
        },
        {
          id: 'cmp-3',
          property: 'Data caching',
          ssg: 'Forever (until rebuild)',
          ssr: 'Never',
          isr: 'N seconds',
        },
        {
          id: 'cmp-4',
          property: 'Behavior',
          ssg: 'Build once, serve static',
          ssr: 'Render per request',
          isr: 'Static + background refresh',
        },
      ],
      activeConcept: 'fetch-options',
      activePanel: 'comparison',
      annotation: 'fetch() options determine the rendering strategy — no config needed',
      showComparison: true,
    },
    duration: 5000,
  },
  {
    id: 'step-9',
    title: 'Side-by-Side Comparison',
    explanation: `Let's compare all three strategies directly:

              SSG          SSR           ISR
Speed:        Fastest      Slowest       Fast
Freshness:    Build-time   Always fresh  Periodic
Server load:  None (CDN)   High          Low
Cost:         Lowest       Highest       Low
Scale:        Infinite     Limited       High

When to use each:

SSG — Content that rarely changes
  Blog posts, docs, marketing pages, FAQ

SSR — Content that MUST be real-time
  Dashboards, search results, user feeds, checkout

ISR — Content that changes but staleness is OK
  Product pages, news articles, social media profiles

The golden rule: Start with SSG (the default). Only use SSR when you absolutely need real-time data. Use ISR as the middle ground when data changes but a few seconds of staleness is acceptable.

Most production Next.js apps use a MIX of all three strategies — different pages use different strategies based on their data requirements.`,
    highlightedLines: [1, 2, 20, 21, 32, 33],
    state: {
      activeStrategy: null,
      timeline: [],
      cache: { isCached: false, isStale: false, lastGenerated: '', cacheType: 'none' },
      requestFlow: [],
      comparison: [
        {
          id: 'cmp-1',
          property: 'Speed',
          ssg: 'Fastest (~20ms)',
          ssr: 'Slow (~300ms)',
          isr: 'Fast (~20ms)',
        },
        {
          id: 'cmp-2',
          property: 'Data freshness',
          ssg: 'Build-time only',
          ssr: 'Always latest',
          isr: 'Every N seconds',
        },
        {
          id: 'cmp-3',
          property: 'Server load',
          ssg: 'None (CDN)',
          ssr: 'Per request',
          isr: 'Per revalidation',
        },
        {
          id: 'cmp-4',
          property: 'Best for',
          ssg: 'Static content',
          ssr: 'Real-time data',
          isr: 'Semi-dynamic content',
          highlightedStrategy: 'ISR',
        },
        {
          id: 'cmp-5',
          property: 'Example',
          ssg: 'Blog, Docs',
          ssr: 'Dashboard, Cart',
          isr: 'Product, News',
        },
        { id: 'cmp-6', property: 'CDN cacheable', ssg: 'Yes', ssr: 'No', isr: 'Yes' },
      ],
      activeConcept: 'comparison',
      activePanel: 'comparison',
      annotation: 'Mix strategies across your app — each page can use its own',
      showComparison: true,
    },
    duration: 5000,
  },
  {
    id: 'step-10',
    title: 'Dynamic Routes + SSG with generateStaticParams',
    explanation: `Dynamic routes (like /blog/[slug]) can ALSO be statically generated! The \`generateStaticParams\` function tells Next.js which paths to pre-build at build time.

export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts');
  return posts.map(post => ({
    slug: post.slug,
  }));
}

This generates static pages for each slug:
• /blog/intro-to-nextjs → Static HTML
• /blog/react-server-components → Static HTML
• /blog/rendering-strategies → Static HTML

Without \`generateStaticParams\`, dynamic routes are rendered on-demand (SSR) and then optionally cached.

You can combine this with ISR:
export const revalidate = 3600; // Revalidate every hour

This gives you:
• Pre-built pages at build time (fast initial deploy)
• Automatic updates every hour (ISR keeps content fresh)
• New pages generated on first visit (dynamic fallback)

This is how large sites (millions of pages) work with Next.js — you pre-build the most important pages, and the rest are generated on demand.`,
    highlightedLines: [49, 50, 51, 52, 53, 54, 55],
    state: {
      activeStrategy: 'SSG',
      timeline: [
        {
          id: 'tl-1',
          phase: 'build-time',
          label: 'generateStaticParams',
          description: 'Fetch list of all slugs',
          isActive: true,
          isComplete: false,
          duration: '~100ms',
          environment: 'build',
        },
        {
          id: 'tl-2',
          phase: 'html-generation',
          label: 'Generate Pages',
          description: 'Build HTML for each slug',
          isActive: true,
          isComplete: false,
          duration: '~2s',
          environment: 'build',
        },
        {
          id: 'tl-3',
          phase: 'cache-store',
          label: 'Deploy',
          description: 'All pages deployed as static',
          isActive: false,
          isComplete: false,
          duration: '-',
          environment: 'cdn',
        },
        {
          id: 'tl-4',
          phase: 'request-received',
          label: 'User Request',
          description: 'CDN serves pre-built page',
          isActive: false,
          isComplete: false,
          duration: '~20ms',
          environment: 'cdn',
        },
      ],
      cache: {
        isCached: true,
        isStale: false,
        lastGenerated: 'Build time',
        cacheType: 'full-route',
      },
      requestFlow: [
        {
          id: 'rf-1',
          from: 'Build',
          to: 'API',
          label: 'Get all slugs',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-2',
          from: 'Build',
          to: 'CDN',
          label: '/blog/post-1, /blog/post-2...',
          isActive: true,
          isHighlighted: true,
        },
        {
          id: 'rf-3',
          from: 'User',
          to: 'CDN',
          label: '/blog/post-1',
          isActive: false,
          isHighlighted: false,
        },
        {
          id: 'rf-4',
          from: 'CDN',
          to: 'User',
          label: 'Static HTML',
          isActive: false,
          isHighlighted: false,
        },
      ],
      comparison: [],
      activeConcept: 'ssg-flow',
      activePanel: 'timeline',
      annotation: 'generateStaticParams pre-builds dynamic routes at build time',
      showComparison: false,
    },
    duration: 5000,
  },
];

export const renderingStrategiesKeyTakeaways: string[] = [
  'SSG (default): Pages built at build time, served as static HTML from CDN — fastest and cheapest',
  "SSR: Pages rendered per request with cache: 'no-store' — always fresh but slower and more expensive",
  'ISR: Static pages with periodic background revalidation via next: { revalidate: N } — fast and reasonably fresh',
  'fetch() options determine the strategy: force-cache (SSG), no-store (SSR), revalidate: N (ISR)',
  'If ANY fetch in a route uses no-store, the entire route becomes dynamic (SSR)',
  'generateStaticParams pre-builds dynamic routes at build time for SSG',
  "Most production apps mix all three strategies — choose based on each page's data freshness needs",
];
