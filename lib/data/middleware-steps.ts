/**
 * Step-by-step data for Middleware visualization
 *
 * This visualization demonstrates how Next.js Middleware works:
 * request interception, matchers, redirects, rewrites, headers,
 * cookies, and authentication patterns.
 */

import type { MiddlewareStep } from '@/lib/types';

export const middlewareCode = `// middleware.ts (root of your project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Runs BEFORE every matched request

  // 1. Read the request
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token');

  // 2. Authentication check
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    );
  }

  // 3. Add custom headers
  const response = NextResponse.next();
  response.headers.set('x-request-id', crypto.randomUUID());
  response.headers.set('x-pathname', pathname);

  // 4. Geolocation-based rewrite
  const country = request.geo?.country || 'US';
  if (pathname === '/pricing') {
    return NextResponse.rewrite(
      new URL(\`/pricing/\${country.toLowerCase()}\`, request.url)
    );
  }

  return response;
}

// === Matcher Configuration ===
// Only run middleware on specific paths
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico).*)',

    // Or match specific paths:
    '/dashboard/:path*',
    '/api/:path*',
    '/admin/:path*',
  ],
};

// === Common Patterns ===

// Rate limiting
export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for');
  // Check rate limit for this IP...
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
    });
  }
  return NextResponse.next();
}

// A/B Testing
export function middleware(request: NextRequest) {
  const bucket = request.cookies.get('ab-bucket');
  if (!bucket) {
    const response = NextResponse.next();
    response.cookies.set('ab-bucket',
      Math.random() > 0.5 ? 'A' : 'B'
    );
    return response;
  }
  return NextResponse.next();
}`;

export const middlewareSteps: MiddlewareStep[] = [
  {
    id: 'step-1',
    title: 'What is Middleware? — The Request Gatekeeper',
    explanation: `Middleware is code that runs BEFORE a request reaches your page or API route. Think of it as a security guard at the entrance to your app.

The middleware function:
1. Intercepts every matched incoming request
2. Can read the request (headers, cookies, URL)
3. Can modify the response (add headers, set cookies)
4. Can redirect, rewrite, or block the request
5. All before the page even starts rendering

The middleware.ts file lives at the ROOT of your project (next to app/):

project/
├── middleware.ts  ← Runs before every matched request
├── app/
│   ├── page.tsx
│   └── dashboard/

Key insight: Middleware runs on the Edge Runtime, meaning it executes at CDN edge nodes close to the user. This makes it extremely fast — typically under 1ms of added latency.

It's perfect for: authentication, redirects, A/B testing, geolocation, rate limiting, and header manipulation.`,
    highlightedLines: [1, 2, 3, 4, 5, 6],
    state: {
      request: {
        id: 'req-1',
        method: 'GET',
        path: '/dashboard',
        headers: [
          { id: 'h-1', name: 'Host', value: 'myapp.com', isModified: false, isAdded: false },
          { id: 'h-2', name: 'User-Agent', value: 'Chrome/120', isModified: false, isAdded: false },
        ],
        cookies: [
          { id: 'c-1', name: 'auth-token', value: 'abc123', isChecked: false },
        ],
        isHighlighted: true,
      },
      pipeline: [
        { id: 'pl-1', label: 'Request received', description: 'Incoming HTTP request', isActive: true, isComplete: false, action: 'next' },
        { id: 'pl-2', label: 'Middleware executes', description: 'middleware.ts runs', isActive: false, isComplete: false, action: 'next' },
        { id: 'pl-3', label: 'Route matched', description: 'Destination page found', isActive: false, isComplete: false, action: 'next' },
        { id: 'pl-4', label: 'Page renders', description: 'Content served', isActive: false, isComplete: false, action: 'next' },
      ],
      matchers: [],
      modifications: [],
      flowNodes: [
        { id: 'fn-1', label: 'User Request', type: 'request', isActive: true, isHighlighted: true },
        { id: 'fn-2', label: 'Middleware', type: 'middleware', isActive: false, isHighlighted: false },
        { id: 'fn-3', label: 'Route Handler', type: 'destination', isActive: false, isHighlighted: false },
      ],
      activeConcept: 'overview',
      activePanel: 'flow',
      annotation: 'Middleware runs BEFORE your pages — the first line of defense',
      finalAction: 'next',
      destinationPath: '/dashboard',
    },
    duration: 5000,
  },
  {
    id: 'step-2',
    title: 'The Request Flow — How Middleware Intercepts',
    explanation: `Let's trace the full lifecycle of a request through middleware:

1. USER → sends GET /dashboard
2. EDGE → middleware.ts intercepts the request
3. MIDDLEWARE reads:
   • The URL path (/dashboard)
   • Cookies (auth-token)
   • Headers (User-Agent, Accept-Language)
   • Geo location (country, region, city)
4. MIDDLEWARE decides:
   • NextResponse.next() → continue to the page
   • NextResponse.redirect() → send user elsewhere
   • NextResponse.rewrite() → serve different content
   • new NextResponse() → return custom response

5. DESTINATION → page renders (or redirect happens)

The middleware function receives a NextRequest object (extending the Web API Request) and must return a NextResponse.

This happens on EVERY matched request, so middleware must be FAST. It runs on the Edge Runtime which has a limited API set but is optimized for speed.`,
    highlightedLines: [5, 6, 7, 8, 9, 10],
    state: {
      request: {
        id: 'req-1',
        method: 'GET',
        path: '/dashboard',
        headers: [
          { id: 'h-1', name: 'Host', value: 'myapp.com', isModified: false, isAdded: false },
        ],
        cookies: [
          { id: 'c-1', name: 'auth-token', value: 'abc123', isChecked: true },
        ],
        isHighlighted: true,
      },
      pipeline: [
        { id: 'pl-1', label: 'Request received', description: 'GET /dashboard', isActive: false, isComplete: true, action: 'next' },
        { id: 'pl-2', label: 'Read request data', description: 'pathname, cookies, headers', isActive: true, isComplete: false, action: 'next' },
        { id: 'pl-3', label: 'Execute logic', description: 'Auth check, redirects...', isActive: false, isComplete: false, action: 'next' },
        { id: 'pl-4', label: 'Return response', description: 'next() / redirect() / rewrite()', isActive: false, isComplete: false, action: 'next' },
      ],
      matchers: [],
      modifications: [],
      flowNodes: [
        { id: 'fn-1', label: 'GET /dashboard', type: 'request', isActive: false, isHighlighted: false },
        { id: 'fn-2', label: 'Middleware', type: 'middleware', isActive: true, isHighlighted: true },
        { id: 'fn-3', label: 'Read cookies/headers', type: 'action', isActive: true, isHighlighted: true },
        { id: 'fn-4', label: '/dashboard page', type: 'destination', isActive: false, isHighlighted: false },
      ],
      activeConcept: 'request-flow',
      activePanel: 'flow',
      annotation: 'Middleware reads the request, makes a decision, returns a response',
      finalAction: 'next',
      destinationPath: '/dashboard',
    },
    duration: 5000,
  },
  {
    id: 'step-3',
    title: 'Matchers — Control Which Paths Run Middleware',
    explanation: `By default, middleware runs on EVERY request. The \`config.matcher\` option lets you control which paths trigger your middleware.

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
};

Matcher patterns:
• '/dashboard' — exact match
• '/dashboard/:path*' — matches /dashboard and all sub-paths
• '/((?!_next/static|favicon.ico).*)' — regex: match all except static files

Why use matchers?
• Performance — skip middleware for static files and images
• Separation — different paths might need different logic
• Efficiency — don't run auth checks on public pages

Common pattern — exclude static assets:
'/((?!_next/static|_next/image|favicon.ico).*)'

This regex matches everything EXCEPT Next.js internal files, preventing middleware from running on every CSS, JS, and image request.

Without matchers, middleware would run on hundreds of requests per page load (every static file), wasting compute.`,
    highlightedLines: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
    state: {
      request: {
        id: 'req-1',
        method: 'GET',
        path: '/dashboard/settings',
        headers: [],
        cookies: [],
        isHighlighted: false,
      },
      pipeline: [],
      matchers: [
        { id: 'm-1', pattern: '/dashboard/:path*', description: 'Dashboard and sub-paths', matches: true, testPath: '/dashboard/settings', isHighlighted: true },
        { id: 'm-2', pattern: '/api/:path*', description: 'API routes', matches: false, testPath: '/dashboard/settings', isHighlighted: false },
        { id: 'm-3', pattern: '/admin/:path*', description: 'Admin pages', matches: false, testPath: '/dashboard/settings', isHighlighted: false },
        { id: 'm-4', pattern: '/_next/static/*', description: 'Static files (excluded)', matches: false, testPath: '/dashboard/settings', isHighlighted: false },
      ],
      modifications: [],
      flowNodes: [
        { id: 'fn-1', label: 'GET /dashboard/settings', type: 'request', isActive: true, isHighlighted: true },
        { id: 'fn-2', label: 'Matcher check', type: 'matcher', isActive: true, isHighlighted: true },
        { id: 'fn-3', label: 'Middleware runs', type: 'middleware', isActive: false, isHighlighted: false },
      ],
      activeConcept: 'matchers',
      activePanel: 'matchers',
      annotation: 'Matchers control which paths trigger middleware — skip static files for performance',
      finalAction: 'next',
      destinationPath: '/dashboard/settings',
    },
    duration: 5000,
  },
  {
    id: 'step-4',
    title: 'Redirects — Sending Users Elsewhere',
    explanation: `One of the most common middleware patterns: redirect users based on conditions.

if (pathname.startsWith('/dashboard') && !token) {
  return NextResponse.redirect(new URL('/login', request.url));
}

This checks if the user is visiting /dashboard without an auth token, and redirects them to /login.

How redirects work:
1. Middleware reads the request
2. Checks a condition (auth, locale, feature flag)
3. Returns NextResponse.redirect(url)
4. Browser receives a 307 redirect response
5. Browser navigates to the new URL

Common redirect patterns:
• Auth guard — redirect unauthenticated users to /login
• Locale — redirect /about to /en/about based on Accept-Language
• Migration — redirect old URLs to new ones
• Maintenance — redirect all traffic to /maintenance page

The redirect URL must be absolute — that's why we create a new URL object using request.url as the base.`,
    highlightedLines: [12, 13, 14, 15, 16],
    state: {
      request: {
        id: 'req-1',
        method: 'GET',
        path: '/dashboard',
        headers: [],
        cookies: [],
        isHighlighted: true,
      },
      pipeline: [
        { id: 'pl-1', label: 'Request: /dashboard', description: 'User wants dashboard', isActive: false, isComplete: true, action: 'next' },
        { id: 'pl-2', label: 'Check auth cookie', description: 'No auth-token found!', isActive: true, isComplete: false, action: 'redirect' },
        { id: 'pl-3', label: 'Redirect to /login', description: '307 Temporary Redirect', isActive: true, isComplete: false, action: 'redirect' },
      ],
      matchers: [],
      modifications: [
        { id: 'mod-1', type: 'redirect', label: 'Location', value: '/login', isHighlighted: true },
        { id: 'mod-2', type: 'status', label: 'Status', value: '307 Redirect', isHighlighted: true },
      ],
      flowNodes: [
        { id: 'fn-1', label: 'GET /dashboard', type: 'request', isActive: false, isHighlighted: false },
        { id: 'fn-2', label: 'Middleware', type: 'middleware', isActive: true, isHighlighted: true },
        { id: 'fn-3', label: 'No auth token!', type: 'action', isActive: true, isHighlighted: true },
        { id: 'fn-4', label: '→ /login', type: 'destination', isActive: true, isHighlighted: true },
      ],
      activeConcept: 'redirects',
      activePanel: 'flow',
      annotation: 'Redirect unauthenticated users before the page even starts rendering',
      finalAction: 'redirect',
      destinationPath: '/login',
    },
    duration: 5000,
  },
  {
    id: 'step-5',
    title: 'Rewrites — Serve Different Content Silently',
    explanation: `Rewrites are like redirects, but INVISIBLE to the user. The URL stays the same, but the content comes from a different path.

if (pathname === '/pricing') {
  return NextResponse.rewrite(
    new URL('/pricing/us', request.url)
  );
}

The user sees: /pricing (URL unchanged)
The server serves: /pricing/us (different page)

Redirect vs Rewrite:
• Redirect: URL changes in browser, user sees the new URL
• Rewrite: URL stays the same, content comes from elsewhere

Common rewrite patterns:
• Geolocation — /pricing → /pricing/us or /pricing/eu based on location
• A/B testing — /landing → /landing-v2 for test group
• Multi-tenant — app.com → app.com/tenant/acme (invisible tenant routing)
• Legacy URLs — keep old URLs working while serving new pages
• Feature flags — serve different versions based on cookies/headers

Rewrites are powerful for creating clean URLs while serving complex routing logic behind the scenes.`,
    highlightedLines: [19, 20, 21, 22, 23, 24, 25],
    state: {
      request: {
        id: 'req-1',
        method: 'GET',
        path: '/pricing',
        headers: [],
        cookies: [],
        isHighlighted: true,
      },
      pipeline: [
        { id: 'pl-1', label: 'Request: /pricing', description: 'User visits pricing page', isActive: false, isComplete: true, action: 'next' },
        { id: 'pl-2', label: 'Detect geo: US', description: 'Country from request.geo', isActive: true, isComplete: false, action: 'rewrite' },
        { id: 'pl-3', label: 'Rewrite to /pricing/us', description: 'URL stays /pricing', isActive: true, isComplete: false, action: 'rewrite' },
      ],
      matchers: [],
      modifications: [
        { id: 'mod-1', type: 'rewrite', label: 'Rewrite target', value: '/pricing/us', isHighlighted: true },
        { id: 'mod-2', type: 'header', label: 'x-country', value: 'US', isHighlighted: false },
      ],
      flowNodes: [
        { id: 'fn-1', label: 'GET /pricing', type: 'request', isActive: false, isHighlighted: false },
        { id: 'fn-2', label: 'Middleware', type: 'middleware', isActive: true, isHighlighted: true },
        { id: 'fn-3', label: 'Geo: US', type: 'action', isActive: true, isHighlighted: true },
        { id: 'fn-4', label: '/pricing/us (silent)', type: 'destination', isActive: true, isHighlighted: true },
      ],
      activeConcept: 'rewrites',
      activePanel: 'flow',
      annotation: 'Rewrite: URL stays /pricing, content served from /pricing/us — invisible to user',
      finalAction: 'rewrite',
      destinationPath: '/pricing/us',
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'Headers & Cookies — Modify the Request/Response',
    explanation: `Middleware can read AND modify both request and response headers and cookies.

Adding response headers:
const response = NextResponse.next();
response.headers.set('x-request-id', crypto.randomUUID());
response.headers.set('x-pathname', pathname);

Reading/setting cookies:
const token = request.cookies.get('auth-token');
response.cookies.set('visited', 'true', { maxAge: 86400 });

Common uses:
• Security headers — CSP, X-Frame-Options, HSTS
• Request tracing — add unique IDs to every request
• Feature flags — read cookies to determine which features to show
• Analytics — track request paths and user segments
• CORS — add cross-origin headers for API routes

Middleware is the perfect place for headers because:
• It runs on every request (consistent application)
• It's centralized (one place to manage)
• It's fast (Edge Runtime)
• It's before the page renders (headers are ready for SSR)`,
    highlightedLines: [18, 19, 20, 21, 22],
    state: {
      request: {
        id: 'req-1',
        method: 'GET',
        path: '/dashboard',
        headers: [
          { id: 'h-1', name: 'Host', value: 'myapp.com', isModified: false, isAdded: false },
          { id: 'h-2', name: 'Cookie', value: 'auth-token=abc123', isModified: false, isAdded: false },
        ],
        cookies: [
          { id: 'c-1', name: 'auth-token', value: 'abc123', isChecked: true },
        ],
        isHighlighted: false,
      },
      pipeline: [
        { id: 'pl-1', label: 'Read cookies', description: 'auth-token found', isActive: false, isComplete: true, action: 'next' },
        { id: 'pl-2', label: 'Add headers', description: 'x-request-id, x-pathname', isActive: true, isComplete: false, action: 'next' },
        { id: 'pl-3', label: 'Continue', description: 'NextResponse.next()', isActive: false, isComplete: false, action: 'next' },
      ],
      matchers: [],
      modifications: [
        { id: 'mod-1', type: 'header', label: 'x-request-id', value: 'a1b2c3d4-e5f6', isHighlighted: true },
        { id: 'mod-2', type: 'header', label: 'x-pathname', value: '/dashboard', isHighlighted: true },
        { id: 'mod-3', type: 'cookie', label: 'visited', value: 'true (maxAge: 86400)', isHighlighted: false },
      ],
      flowNodes: [
        { id: 'fn-1', label: 'Request', type: 'request', isActive: false, isHighlighted: false },
        { id: 'fn-2', label: 'Read cookies', type: 'middleware', isActive: true, isHighlighted: true },
        { id: 'fn-3', label: 'Add headers', type: 'action', isActive: true, isHighlighted: true },
        { id: 'fn-4', label: 'Modified response', type: 'destination', isActive: false, isHighlighted: false },
      ],
      activeConcept: 'headers-cookies',
      activePanel: 'response',
      annotation: 'Middleware can read/write headers and cookies on every request',
      finalAction: 'next',
      destinationPath: '/dashboard',
    },
    duration: 5000,
  },
  {
    id: 'step-7',
    title: 'Authentication Pattern — Protecting Routes',
    explanation: `The most common middleware pattern: protecting routes from unauthenticated users.

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Public paths — no auth needed
  const publicPaths = ['/login', '/signup', '/'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected paths — require auth
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated — continue
  return NextResponse.next();
}

Key details:
• The \`from\` search param remembers where the user was going
• After login, you can redirect back to the original page
• This runs at the Edge — super fast, no SSR delay
• The protected page NEVER starts rendering for unauthenticated users
• Token validation can be done here (JWT decode, session check)

This is far more secure than client-side auth checks because the page code never even executes.`,
    highlightedLines: [10, 11, 12, 13, 14, 15, 16],
    state: {
      request: {
        id: 'req-1',
        method: 'GET',
        path: '/dashboard/analytics',
        headers: [],
        cookies: [
          { id: 'c-1', name: 'auth-token', value: '(none)', isChecked: true },
        ],
        isHighlighted: true,
      },
      pipeline: [
        { id: 'pl-1', label: 'Request: /dashboard/analytics', description: 'Protected route', isActive: false, isComplete: true, action: 'next' },
        { id: 'pl-2', label: 'Check auth cookie', description: 'No token found!', isActive: true, isComplete: false, action: 'redirect' },
        { id: 'pl-3', label: 'Redirect to /login', description: 'with ?from=/dashboard/analytics', isActive: true, isComplete: false, action: 'redirect' },
      ],
      matchers: [
        { id: 'm-1', pattern: '/login, /signup, /', description: 'Public paths', matches: false, testPath: '/dashboard/analytics', isHighlighted: false },
        { id: 'm-2', pattern: '/dashboard/:path*', description: 'Protected paths', matches: true, testPath: '/dashboard/analytics', isHighlighted: true },
      ],
      modifications: [
        { id: 'mod-1', type: 'redirect', label: 'Location', value: '/login?from=/dashboard/analytics', isHighlighted: true },
      ],
      flowNodes: [
        { id: 'fn-1', label: 'GET /dashboard/analytics', type: 'request', isActive: false, isHighlighted: false },
        { id: 'fn-2', label: 'Check auth cookie', type: 'middleware', isActive: true, isHighlighted: true },
        { id: 'fn-3', label: 'No token!', type: 'action', isActive: true, isHighlighted: true },
        { id: 'fn-4', label: '→ /login?from=...', type: 'destination', isActive: true, isHighlighted: true },
      ],
      activeConcept: 'auth-pattern',
      activePanel: 'flow',
      annotation: 'Auth middleware prevents protected pages from rendering for unauthenticated users',
      finalAction: 'redirect',
      destinationPath: '/login?from=/dashboard/analytics',
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'Putting It All Together — Best Practices',
    explanation: `Here's how to use middleware effectively:

DO use middleware for:
✅ Authentication/authorization checks
✅ Redirects (locale, legacy URLs, marketing)
✅ Rewrites (A/B tests, geo-based content)
✅ Adding security/tracking headers
✅ Rate limiting
✅ Bot detection

DON'T use middleware for:
❌ Heavy computation (it runs on Edge, limited runtime)
❌ Database queries (Edge has limited DB access)
❌ Complex business logic (keep in Server Components)
❌ File operations (no filesystem on Edge)

Performance tips:
• Always use matchers to skip static files
• Keep middleware logic simple and fast (<1ms target)
• Use early returns for common cases
• Cache expensive checks where possible

File location:
• middleware.ts at project root (next to app/)
• Only ONE middleware file per project
• Use if/else or a helper function to handle different routes

Remember: Middleware is your app's bouncer — quick decisions at the door, not the main show inside.`,
    highlightedLines: [1, 2, 3, 4, 5, 45, 46, 47],
    state: {
      request: {
        id: 'req-1',
        method: 'GET',
        path: '/dashboard',
        headers: [
          { id: 'h-1', name: 'Host', value: 'myapp.com', isModified: false, isAdded: false },
        ],
        cookies: [
          { id: 'c-1', name: 'auth-token', value: 'valid-jwt', isChecked: true },
        ],
        isHighlighted: false,
      },
      pipeline: [
        { id: 'pl-1', label: 'Matcher check', description: '/dashboard matched', isActive: false, isComplete: true, action: 'next' },
        { id: 'pl-2', label: 'Auth check', description: 'Token valid', isActive: false, isComplete: true, action: 'next' },
        { id: 'pl-3', label: 'Add headers', description: 'x-request-id added', isActive: false, isComplete: true, action: 'next' },
        { id: 'pl-4', label: 'NextResponse.next()', description: 'Continue to page', isActive: true, isComplete: false, action: 'next' },
      ],
      matchers: [
        { id: 'm-1', pattern: '/dashboard/:path*', description: 'Protected', matches: true, testPath: '/dashboard', isHighlighted: true },
        { id: 'm-2', pattern: '/_next/static/*', description: 'Excluded', matches: false, testPath: '/dashboard', isHighlighted: false },
      ],
      modifications: [
        { id: 'mod-1', type: 'header', label: 'x-request-id', value: 'generated-uuid', isHighlighted: false },
      ],
      flowNodes: [
        { id: 'fn-1', label: 'Request', type: 'request', isActive: false, isHighlighted: false },
        { id: 'fn-2', label: 'Matcher: match', type: 'matcher', isActive: false, isHighlighted: false },
        { id: 'fn-3', label: 'Auth: pass', type: 'middleware', isActive: false, isHighlighted: false },
        { id: 'fn-4', label: 'Headers added', type: 'action', isActive: false, isHighlighted: false },
        { id: 'fn-5', label: '/dashboard', type: 'destination', isActive: true, isHighlighted: true },
      ],
      activeConcept: 'chaining',
      activePanel: 'flow',
      annotation: 'Middleware: quick decisions at the Edge — fast, centralized, secure',
      finalAction: 'next',
      destinationPath: '/dashboard',
    },
    duration: 5000,
  },
];

export const middlewareKeyTakeaways: string[] = [
  'Middleware runs BEFORE every matched request at the Edge — extremely fast (<1ms overhead)',
  'Use config.matcher to control which paths trigger middleware — always exclude static files',
  'NextResponse.redirect() changes the URL; NextResponse.rewrite() changes content silently',
  'Middleware can read/write headers and cookies — perfect for auth tokens, tracking, and security headers',
  'The auth pattern (check cookie → redirect to /login) prevents protected pages from even rendering',
  'Keep middleware light — no heavy computation, database queries, or complex business logic',
  'Only ONE middleware.ts file per project, at the root — use conditionals for different route logic',
];
