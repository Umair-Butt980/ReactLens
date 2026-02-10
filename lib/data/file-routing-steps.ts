/**
 * Step-by-step data for File-based Routing (App Router) visualization
 *
 * This visualization demonstrates how Next.js maps the file system
 * to URL routes, including layouts, dynamic segments, route groups,
 * and special files.
 */

import type { FileRoutingStep } from '@/lib/types';

export const fileRoutingCode = `// Next.js App Router - File System Structure
// Each folder = route segment, page.tsx = route UI

app/
├── layout.tsx          // Root layout (wraps ALL pages)
├── page.tsx            // Home route → "/"
├── about/
│   └── page.tsx        // About route → "/about"
├── blog/
│   ├── layout.tsx      // Blog layout (wraps blog pages)
│   ├── page.tsx        // Blog index → "/blog"
│   └── [slug]/
│       └── page.tsx    // Dynamic route → "/blog/:slug"
├── dashboard/
│   ├── layout.tsx      // Dashboard layout
│   ├── page.tsx        // Dashboard home → "/dashboard"
│   ├── settings/
│   │   └── page.tsx    // Settings → "/dashboard/settings"
│   └── loading.tsx     // Loading UI for dashboard
├── (marketing)/
│   ├── pricing/
│   │   └── page.tsx    // Pricing → "/pricing" (no /marketing)
│   └── features/
│       └── page.tsx    // Features → "/features"
├── api/
│   └── users/
│       └── route.ts    // API route → "/api/users"
└── [...catchAll]/
    └── page.tsx        // Catch-all → any unmatched route`;

export const fileRoutingSteps: FileRoutingStep[] = [
  {
    id: 'step-1',
    title: 'The App Directory - Your Route Blueprint',
    explanation: `In Next.js App Router, your file system IS your router. The \`app/\` directory is the root of all routes.

Every folder inside \`app/\` becomes a URL segment. A \`page.tsx\` file inside a folder makes that route publicly accessible.

Think of it like a map:
• Folder = URL path segment
• page.tsx = "Yes, this route exists and here's what to show"
• No page.tsx = The folder is just for organization (not accessible as a route)

This is fundamentally different from React Router where you define routes in code. Here, the file system IS the configuration.`,
    highlightedLines: [1, 2, 3, 4],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: true,
          isActive: true,
          isExpanded: true,
          children: [
            {
              id: 'root-layout',
              name: 'layout.tsx',
              type: 'file',
              specialType: 'layout',
              isHighlighted: false,
              isActive: false,
              isExpanded: false,
            },
            {
              id: 'root-page',
              name: 'page.tsx',
              type: 'file',
              specialType: 'page',
              isHighlighted: false,
              isActive: false,
              isExpanded: false,
            },
            {
              id: 'about-folder',
              name: 'about/',
              type: 'folder',
              isHighlighted: false,
              isActive: false,
              isExpanded: false,
              children: [
                {
                  id: 'about-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: false,
                },
              ],
            },
            {
              id: 'blog-folder',
              name: 'blog/',
              type: 'folder',
              isHighlighted: false,
              isActive: false,
              isExpanded: false,
            },
          ],
        },
      ],
      browserBar: { url: '/', isNavigating: false },
      matchedSegments: [],
      layoutWrappers: [],
      activeConcept: 'basic-routing',
      annotation: 'The app/ directory is the root of all routes',
      showRouteArrow: false,
    },
    duration: 4000,
  },
  {
    id: 'step-2',
    title: 'Basic Routes - Folders Map to URLs',
    explanation: `The simplest routing pattern: each folder with a \`page.tsx\` becomes a route.

• \`app/page.tsx\` → "/" (the home page)
• \`app/about/page.tsx\` → "/about"

The URL path mirrors the folder path exactly. No configuration needed — just create a folder and add a page.tsx file.

The \`page.tsx\` file is what makes a route segment publicly accessible. Without it, the folder only serves as an organizational container.

This convention-based approach means:
• New route? Create a folder + page.tsx
• Remove a route? Delete the folder
• Rename a route? Rename the folder`,
    highlightedLines: [5, 6, 7, 8],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'root-layout',
              name: 'layout.tsx',
              type: 'file',
              specialType: 'layout',
              isHighlighted: false,
              isActive: false,
              isExpanded: false,
            },
            {
              id: 'root-page',
              name: 'page.tsx',
              type: 'file',
              specialType: 'page',
              isHighlighted: true,
              isActive: true,
              isExpanded: false,
              routePath: '/',
            },
            {
              id: 'about-folder',
              name: 'about/',
              type: 'folder',
              isHighlighted: true,
              isActive: false,
              isExpanded: true,
              routePath: '/about',
              children: [
                {
                  id: 'about-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: true,
                  isActive: true,
                  isExpanded: false,
                  routePath: '/about',
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/about', isNavigating: true },
      matchedSegments: [
        {
          id: 'seg-root',
          segment: '/',
          filePath: 'app/page.tsx',
          isLayout: false,
          isPage: true,
          isDynamic: false,
          isHighlighted: false,
        },
        {
          id: 'seg-about',
          segment: '/about',
          filePath: 'app/about/page.tsx',
          isLayout: false,
          isPage: true,
          isDynamic: false,
          isHighlighted: true,
        },
      ],
      layoutWrappers: [],
      activeConcept: 'basic-routing',
      annotation: 'folder path = URL path',
      showRouteArrow: true,
    },
    duration: 4000,
  },
  {
    id: 'step-3',
    title: 'Nested Routes - Folders Within Folders',
    explanation: `Nesting folders creates nested URL segments. This is how you build deeper paths like "/blog", "/blog/my-post", or "/dashboard/settings".

• \`app/blog/page.tsx\` → "/blog"
• \`app/dashboard/page.tsx\` → "/dashboard"
• \`app/dashboard/settings/page.tsx\` → "/dashboard/settings"

Each level of folder nesting adds a new segment to the URL. This makes it intuitive to organize related pages together.

The file system hierarchy directly represents the URL hierarchy. Parent folders "own" their child routes, making the codebase naturally organized by feature.`,
    highlightedLines: [9, 10, 11, 15, 16, 17, 18, 19],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'root-layout',
              name: 'layout.tsx',
              type: 'file',
              specialType: 'layout',
              isHighlighted: false,
              isActive: false,
              isExpanded: false,
            },
            {
              id: 'root-page',
              name: 'page.tsx',
              type: 'file',
              specialType: 'page',
              isHighlighted: false,
              isActive: false,
              isExpanded: false,
              routePath: '/',
            },
            {
              id: 'blog-folder',
              name: 'blog/',
              type: 'folder',
              isHighlighted: true,
              isActive: false,
              isExpanded: true,
              routePath: '/blog',
              children: [
                {
                  id: 'blog-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: true,
                  isActive: true,
                  isExpanded: false,
                  routePath: '/blog',
                },
              ],
            },
            {
              id: 'dashboard-folder',
              name: 'dashboard/',
              type: 'folder',
              isHighlighted: true,
              isActive: false,
              isExpanded: true,
              routePath: '/dashboard',
              children: [
                {
                  id: 'dashboard-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: false,
                  routePath: '/dashboard',
                },
                {
                  id: 'settings-folder',
                  name: 'settings/',
                  type: 'folder',
                  isHighlighted: true,
                  isActive: false,
                  isExpanded: true,
                  routePath: '/dashboard/settings',
                  children: [
                    {
                      id: 'settings-page',
                      name: 'page.tsx',
                      type: 'file',
                      specialType: 'page',
                      isHighlighted: true,
                      isActive: true,
                      isExpanded: false,
                      routePath: '/dashboard/settings',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/dashboard/settings', isNavigating: true },
      matchedSegments: [
        {
          id: 'seg-dash',
          segment: '/dashboard',
          filePath: 'app/dashboard/',
          isLayout: false,
          isPage: false,
          isDynamic: false,
          isHighlighted: false,
        },
        {
          id: 'seg-settings',
          segment: '/settings',
          filePath: 'app/dashboard/settings/page.tsx',
          isLayout: false,
          isPage: true,
          isDynamic: false,
          isHighlighted: true,
        },
      ],
      layoutWrappers: [],
      activeConcept: 'nested-routes',
      annotation: 'Nested folders = nested URL segments',
      showRouteArrow: true,
    },
    duration: 4000,
  },
  {
    id: 'step-4',
    title: 'Layouts - Shared UI That Persists',
    explanation: `Layouts are one of the most powerful features of the App Router. A \`layout.tsx\` file wraps all pages in its folder AND all nested child routes.

The Root Layout (\`app/layout.tsx\`) wraps the ENTIRE application — it's where you put your <html> and <body> tags, global styles, and providers.

Nested layouts stack on top of each other:
• Root Layout wraps everything
• Blog Layout wraps all blog pages
• Dashboard Layout wraps all dashboard pages

Key insight: Layouts DON'T re-render when navigating between child routes. Only the page content changes. This means shared UI like navigation bars and sidebars stay mounted, preserving state and avoiding unnecessary re-renders.

This is a huge performance win over traditional SPAs where the entire page tree might re-render on navigation.`,
    highlightedLines: [5, 10, 16],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'root-layout',
              name: 'layout.tsx',
              type: 'file',
              specialType: 'layout',
              isHighlighted: true,
              isActive: true,
              isExpanded: false,
            },
            {
              id: 'root-page',
              name: 'page.tsx',
              type: 'file',
              specialType: 'page',
              isHighlighted: false,
              isActive: false,
              isExpanded: false,
            },
            {
              id: 'blog-folder',
              name: 'blog/',
              type: 'folder',
              isHighlighted: false,
              isActive: false,
              isExpanded: true,
              children: [
                {
                  id: 'blog-layout',
                  name: 'layout.tsx',
                  type: 'file',
                  specialType: 'layout',
                  isHighlighted: true,
                  isActive: true,
                  isExpanded: false,
                },
                {
                  id: 'blog-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: false,
                },
              ],
            },
            {
              id: 'dashboard-folder',
              name: 'dashboard/',
              type: 'folder',
              isHighlighted: false,
              isActive: false,
              isExpanded: true,
              children: [
                {
                  id: 'dashboard-layout',
                  name: 'layout.tsx',
                  type: 'file',
                  specialType: 'layout',
                  isHighlighted: true,
                  isActive: true,
                  isExpanded: false,
                },
                {
                  id: 'dashboard-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: false,
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/blog', isNavigating: false },
      matchedSegments: [],
      layoutWrappers: [
        {
          id: 'lw-root',
          name: 'Root Layout',
          filePath: 'app/layout.tsx',
          isActive: true,
          depth: 0,
        },
        {
          id: 'lw-blog',
          name: 'Blog Layout',
          filePath: 'app/blog/layout.tsx',
          isActive: true,
          depth: 1,
        },
      ],
      activeConcept: 'layouts',
      annotation: 'Layouts wrap child routes and persist across navigation',
      showRouteArrow: false,
    },
    duration: 5000,
  },
  {
    id: 'step-5',
    title: 'Layout Nesting - How Wrappers Stack',
    explanation: `Let's visualize how layouts nest. When you navigate to "/blog", the rendering wraps like this:

Root Layout (app/layout.tsx)
  └── Blog Layout (app/blog/layout.tsx)
       └── Blog Page (app/blog/page.tsx)

When navigating to "/dashboard/settings":

Root Layout (app/layout.tsx)
  └── Dashboard Layout (app/dashboard/layout.tsx)
       └── Settings Page (app/dashboard/settings/page.tsx)

Each layout receives its children as a prop and wraps them:

export default function BlogLayout({ children }) {
  return (
    <div>
      <BlogNavbar />
      {children}  {/* ← The page or nested layout goes here */}
    </div>
  );
}

The Root Layout is REQUIRED and must contain <html> and <body> tags. It's the only layout that has this requirement.`,
    highlightedLines: [5, 10, 11, 16, 17],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'root-layout',
              name: 'layout.tsx',
              type: 'file',
              specialType: 'layout',
              isHighlighted: true,
              isActive: true,
              isExpanded: false,
            },
            {
              id: 'dashboard-folder',
              name: 'dashboard/',
              type: 'folder',
              isHighlighted: true,
              isActive: false,
              isExpanded: true,
              children: [
                {
                  id: 'dashboard-layout',
                  name: 'layout.tsx',
                  type: 'file',
                  specialType: 'layout',
                  isHighlighted: true,
                  isActive: true,
                  isExpanded: false,
                },
                {
                  id: 'settings-folder',
                  name: 'settings/',
                  type: 'folder',
                  isHighlighted: true,
                  isActive: false,
                  isExpanded: true,
                  children: [
                    {
                      id: 'settings-page',
                      name: 'page.tsx',
                      type: 'file',
                      specialType: 'page',
                      isHighlighted: true,
                      isActive: true,
                      isExpanded: false,
                      routePath: '/dashboard/settings',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/dashboard/settings', isNavigating: false },
      matchedSegments: [],
      layoutWrappers: [
        {
          id: 'lw-root',
          name: 'Root Layout',
          filePath: 'app/layout.tsx',
          isActive: true,
          depth: 0,
        },
        {
          id: 'lw-dashboard',
          name: 'Dashboard Layout',
          filePath: 'app/dashboard/layout.tsx',
          isActive: true,
          depth: 1,
        },
        {
          id: 'lw-page',
          name: 'Settings Page',
          filePath: 'app/dashboard/settings/page.tsx',
          isActive: true,
          depth: 2,
        },
      ],
      activeConcept: 'layouts',
      annotation: 'Layouts nest like Russian dolls',
      showRouteArrow: false,
    },
    duration: 5000,
  },
  {
    id: 'step-6',
    title: 'Dynamic Routes - [param] Segments',
    explanation: `Square brackets create dynamic route segments that match any value. This is how you handle routes like "/blog/my-first-post" or "/users/123".

• \`app/blog/[slug]/page.tsx\` → "/blog/anything-here"
• The \`slug\` parameter is available in the page component via \`params\`

In your page component:
export default function BlogPost({ params }) {
  const { slug } = params;  // "my-first-post"
  return <h1>Post: {slug}</h1>;
}

Dynamic segments are powerful because:
• One file handles infinite route variations
• The param name (slug, id, etc.) is up to you
• They can be nested: \`/blog/[slug]/comments/[commentId]\`
• Multiple dynamic segments work together

Next.js resolves routes by trying static segments first, then falling back to dynamic ones. So \`/blog/about\` would match \`app/blog/about/page.tsx\` before \`app/blog/[slug]/page.tsx\`.`,
    highlightedLines: [12, 13, 14],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'blog-folder',
              name: 'blog/',
              type: 'folder',
              isHighlighted: false,
              isActive: false,
              isExpanded: true,
              routePath: '/blog',
              children: [
                {
                  id: 'blog-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: false,
                  routePath: '/blog',
                },
                {
                  id: 'slug-folder',
                  name: '[slug]/',
                  type: 'folder',
                  isHighlighted: true,
                  isActive: false,
                  isExpanded: true,
                  isDynamic: true,
                  routePath: '/blog/:slug',
                  children: [
                    {
                      id: 'slug-page',
                      name: 'page.tsx',
                      type: 'file',
                      specialType: 'page',
                      isHighlighted: true,
                      isActive: true,
                      isExpanded: false,
                      isDynamic: true,
                      routePath: '/blog/:slug',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/blog/my-first-post', isNavigating: true },
      matchedSegments: [
        {
          id: 'seg-blog',
          segment: '/blog',
          filePath: 'app/blog/',
          isLayout: false,
          isPage: false,
          isDynamic: false,
          isHighlighted: false,
        },
        {
          id: 'seg-slug',
          segment: '/my-first-post',
          filePath: 'app/blog/[slug]/page.tsx',
          isLayout: false,
          isPage: true,
          isDynamic: true,
          isHighlighted: true,
        },
      ],
      layoutWrappers: [],
      activeConcept: 'dynamic-segments',
      annotation: '[slug] matches any value → params.slug',
      showRouteArrow: true,
    },
    duration: 5000,
  },
  {
    id: 'step-7',
    title: 'Route Groups - Organize Without Affecting URLs',
    explanation: `Parentheses create route groups: folders that organize code WITHOUT adding a URL segment.

\`app/(marketing)/pricing/page.tsx\` → "/pricing" (NOT "/marketing/pricing")

The (marketing) folder is invisible in the URL! This is perfect for:

• Organizing by team: (marketing), (dashboard), (auth)
• Applying different layouts to groups without changing URLs
• Keeping related routes together in the codebase

Each route group can have its own layout.tsx, so you can have completely different layouts for different sections of your app — all at the root URL level.

Example:
• (marketing)/layout.tsx → Public marketing layout with full-width header
• (dashboard)/layout.tsx → Authenticated layout with sidebar
• Both live at the root URL level but have different UIs`,
    highlightedLines: [21, 22, 23, 24, 25],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'marketing-group',
              name: '(marketing)/',
              type: 'folder',
              isHighlighted: true,
              isActive: false,
              isExpanded: true,
              isRouteGroup: true,
              children: [
                {
                  id: 'pricing-folder',
                  name: 'pricing/',
                  type: 'folder',
                  isHighlighted: true,
                  isActive: false,
                  isExpanded: true,
                  routePath: '/pricing',
                  children: [
                    {
                      id: 'pricing-page',
                      name: 'page.tsx',
                      type: 'file',
                      specialType: 'page',
                      isHighlighted: true,
                      isActive: true,
                      isExpanded: false,
                      routePath: '/pricing',
                    },
                  ],
                },
                {
                  id: 'features-folder',
                  name: 'features/',
                  type: 'folder',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: true,
                  routePath: '/features',
                  children: [
                    {
                      id: 'features-page',
                      name: 'page.tsx',
                      type: 'file',
                      specialType: 'page',
                      isHighlighted: false,
                      isActive: false,
                      isExpanded: false,
                      routePath: '/features',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/pricing', isNavigating: true },
      matchedSegments: [
        {
          id: 'seg-pricing',
          segment: '/pricing',
          filePath: 'app/(marketing)/pricing/page.tsx',
          isLayout: false,
          isPage: true,
          isDynamic: false,
          isHighlighted: true,
        },
      ],
      layoutWrappers: [],
      activeConcept: 'route-groups',
      annotation: '(parentheses) = invisible in URL',
      showRouteArrow: true,
    },
    duration: 5000,
  },
  {
    id: 'step-8',
    title: 'Special Files - loading.tsx and error.tsx',
    explanation: `Next.js reserves certain file names for special behavior. These files automatically create UI for common states:

• \`loading.tsx\` → Shown while the page or layout is loading (wraps page in Suspense)
• \`error.tsx\` → Shown when an error occurs (wraps page in Error Boundary)
• \`not-found.tsx\` → Shown for 404 errors
• \`template.tsx\` → Like layout, but re-mounts on every navigation

The magic: These files are AUTOMATIC. Just by placing a loading.tsx in a folder, Next.js wraps the page content in a React Suspense boundary and shows your loading UI while the page loads.

This is especially powerful with Server Components, where data fetching happens on the server — the loading.tsx shows instantly while the server prepares the page.

The hierarchy matters:
Root Layout → Error Boundary → Loading → Page

Each folder can have its own loading/error files, creating granular loading and error states throughout your app.`,
    highlightedLines: [20, 26, 27],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'dashboard-folder',
              name: 'dashboard/',
              type: 'folder',
              isHighlighted: false,
              isActive: false,
              isExpanded: true,
              children: [
                {
                  id: 'dashboard-layout',
                  name: 'layout.tsx',
                  type: 'file',
                  specialType: 'layout',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: false,
                },
                {
                  id: 'dashboard-loading',
                  name: 'loading.tsx',
                  type: 'file',
                  specialType: 'loading',
                  isHighlighted: true,
                  isActive: true,
                  isExpanded: false,
                },
                {
                  id: 'dashboard-error',
                  name: 'error.tsx',
                  type: 'file',
                  specialType: 'error',
                  isHighlighted: true,
                  isActive: true,
                  isExpanded: false,
                },
                {
                  id: 'dashboard-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: false,
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/dashboard', isNavigating: false },
      matchedSegments: [],
      layoutWrappers: [
        {
          id: 'lw-layout',
          name: 'Layout',
          filePath: 'app/dashboard/layout.tsx',
          isActive: true,
          depth: 0,
        },
        {
          id: 'lw-error',
          name: 'Error Boundary',
          filePath: 'app/dashboard/error.tsx',
          isActive: true,
          depth: 1,
        },
        {
          id: 'lw-loading',
          name: 'Suspense (Loading)',
          filePath: 'app/dashboard/loading.tsx',
          isActive: true,
          depth: 2,
        },
        {
          id: 'lw-page',
          name: 'Page',
          filePath: 'app/dashboard/page.tsx',
          isActive: true,
          depth: 3,
        },
      ],
      activeConcept: 'special-files',
      annotation: 'Special files create automatic UI wrappers',
      showRouteArrow: false,
    },
    duration: 5000,
  },
  {
    id: 'step-9',
    title: 'API Routes - route.ts',
    explanation: `The App Router also handles API endpoints. Instead of \`page.tsx\`, you create a \`route.ts\` file to define API handlers.

\`app/api/users/route.ts\` → "GET /api/users", "POST /api/users"

In route.ts, you export HTTP method handlers:

export async function GET(request: Request) {
  const users = await getUsers();
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ created: true });
}

Important rules:
• A folder CANNOT have both page.tsx and route.ts — they'd conflict
• route.ts supports GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
• They run on the server only — perfect for database queries, auth, etc.
• They use the standard Web API Request/Response objects`,
    highlightedLines: [28, 29, 30],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'api-folder',
              name: 'api/',
              type: 'folder',
              isHighlighted: true,
              isActive: false,
              isExpanded: true,
              children: [
                {
                  id: 'users-folder',
                  name: 'users/',
                  type: 'folder',
                  isHighlighted: true,
                  isActive: false,
                  isExpanded: true,
                  routePath: '/api/users',
                  children: [
                    {
                      id: 'users-route',
                      name: 'route.ts',
                      type: 'file',
                      specialType: 'route',
                      isHighlighted: true,
                      isActive: true,
                      isExpanded: false,
                      routePath: '/api/users',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/api/users', isNavigating: true },
      matchedSegments: [
        {
          id: 'seg-api',
          segment: '/api',
          filePath: 'app/api/',
          isLayout: false,
          isPage: false,
          isDynamic: false,
          isHighlighted: false,
        },
        {
          id: 'seg-users',
          segment: '/users',
          filePath: 'app/api/users/route.ts',
          isLayout: false,
          isPage: false,
          isDynamic: false,
          isHighlighted: true,
        },
      ],
      layoutWrappers: [],
      activeConcept: 'special-files',
      annotation: 'route.ts = server-only API endpoint',
      showRouteArrow: true,
    },
    duration: 4000,
  },
  {
    id: 'step-10',
    title: 'Catch-All Routes - [...param]',
    explanation: `Catch-all segments match any number of subsequent URL segments using the spread syntax.

\`app/[...catchAll]/page.tsx\` matches:
• "/anything" → catchAll = ["anything"]
• "/a/b/c" → catchAll = ["a", "b", "c"]

This is useful for:
• CMS pages with nested paths: /docs/getting-started/installation
• Wildcard matching for custom 404 pages
• Multi-level category pages

You can also use optional catch-all with double brackets:
\`[[...catchAll]]\` — This also matches the parent route (e.g., "/" as well).

Route resolution priority:
1. Static routes (exact match) — highest priority
2. Dynamic routes [param] — single segment
3. Catch-all routes [...param] — multiple segments
4. Optional catch-all [[...param]] — zero or more segments

This priority system means specific routes always win over generic ones.`,
    highlightedLines: [31, 32, 33],
    state: {
      fileTree: [
        {
          id: 'app',
          name: 'app/',
          type: 'folder',
          isHighlighted: false,
          isActive: false,
          isExpanded: true,
          children: [
            {
              id: 'about-folder',
              name: 'about/',
              type: 'folder',
              isHighlighted: false,
              isActive: false,
              isExpanded: true,
              routePath: '/about',
              children: [
                {
                  id: 'about-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: false,
                  isActive: false,
                  isExpanded: false,
                  routePath: '/about',
                },
              ],
            },
            {
              id: 'catchall-folder',
              name: '[...catchAll]/',
              type: 'folder',
              isHighlighted: true,
              isActive: false,
              isExpanded: true,
              isDynamic: true,
              isCatchAll: true,
              routePath: '/*',
              children: [
                {
                  id: 'catchall-page',
                  name: 'page.tsx',
                  type: 'file',
                  specialType: 'page',
                  isHighlighted: true,
                  isActive: true,
                  isExpanded: false,
                  isDynamic: true,
                  isCatchAll: true,
                  routePath: '/*',
                },
              ],
            },
          ],
        },
      ],
      browserBar: { url: '/docs/guide/intro', isNavigating: true },
      matchedSegments: [
        {
          id: 'seg-catchall',
          segment: '/docs/guide/intro',
          filePath: 'app/[...catchAll]/page.tsx',
          isLayout: false,
          isPage: true,
          isDynamic: true,
          isHighlighted: true,
        },
      ],
      layoutWrappers: [],
      activeConcept: 'catch-all',
      annotation: '[...param] catches all remaining segments',
      showRouteArrow: true,
    },
    duration: 4000,
  },
];

export const fileRoutingKeyTakeaways: string[] = [
  'The app/ directory IS the router — folders map directly to URL segments',
  'page.tsx makes a route publicly accessible; layout.tsx wraps child routes and persists across navigation',
  'Dynamic segments [param] match single values; catch-all [...param] matches multiple segments',
  'Route groups (folder) organize code without affecting URLs — great for applying different layouts',
  'Special files like loading.tsx and error.tsx automatically create Suspense and Error Boundaries',
  'route.ts creates server-only API endpoints using standard Web API Request/Response',
  'Route priority: static > dynamic > catch-all — specific routes always win',
];
