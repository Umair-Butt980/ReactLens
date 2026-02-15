# ReactLens Architecture

## Overview

ReactLens is a visual learning platform built with Next.js 16 that teaches JavaScript, React, and Next.js concepts through animated, step-by-step visualizations. The architecture is designed for modularity, making it easy to add new concept visualizations. The platform currently covers three sections: JavaScript fundamentals, React core concepts, and Next.js key concepts.

## Tech Stack

| Technology          | Purpose                                       |
| ------------------- | --------------------------------------------- |
| **Next.js 16**      | React framework with App Router               |
| **React 19**        | UI library                                    |
| **TypeScript**      | Type safety                                   |
| **Tailwind CSS v4** | Styling                                       |
| **Framer Motion**   | Animations                                    |
| **Shiki**           | Code syntax highlighting                      |
| **Zustand**         | State management (for complex visualizations) |
| **Lucide React**    | Icons                                         |

## Application Structure

```
reactlens/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles & theme
│   ├── javascript/               # JavaScript concepts section
│   │   ├── layout.tsx
│   │   ├── page.tsx              # JS topics overview
│   │   ├── event-loop/           # Event Loop visualization
│   │   ├── call-stack/           # Call Stack visualization
│   │   ├── closures/             # Closures visualization
│   │   └── ...                   # Other JS concepts
│   ├── react/                    # React concepts section
│   │   ├── layout.tsx
│   │   ├── page.tsx              # React topics overview
│   │   ├── hooks/                # Hooks visualization
│   │   └── ...                   # Other React concepts
│   └── nextjs/                   # Next.js concepts section
│       ├── layout.tsx            # Next.js section layout
│       ├── page.tsx              # Next.js topics overview
│       ├── file-routing/         # File-based Routing visualization
│       ├── server-client-components/  # Server vs Client Components
│       ├── rendering-strategies/ # SSR, SSG, ISR visualization
│       ├── data-fetching/        # Data Fetching visualization
│       └── middleware/           # Middleware visualization
│
├── components/
│   ├── layout/                   # Layout components
│   │   ├── concept-header.tsx    # Page header with navigation
│   │   ├── main-content.tsx      # Split view container
│   │   ├── code-panel.tsx        # Syntax highlighted code
│   │   ├── explanation-panel.tsx # Explanation section
│   │   ├── playback-controls.tsx # Animation controls
│   │   └── topic-card.tsx        # Topic grid cards
│   │
│   ├── visualizations/           # Visualization components
│   │   ├── javascript/
│   │   │   ├── event-loop-visual.tsx
│   │   │   └── ...
│   │   ├── react/
│   │   │   └── ...
│   │   └── nextjs/
│   │       ├── file-routing-visual.tsx
│   │       ├── server-client-components-visual.tsx
│   │       ├── rendering-strategies-visual.tsx
│   │       ├── data-fetching-visual.tsx
│   │       ├── middleware-visual.tsx
│   │       └── index.ts
│   │
│   └── ui/                       # shadcn/ui components
│
├── lib/
│   ├── types/                    # TypeScript type definitions
│   │   ├── concept.types.ts      # Concept & Topic types
│   │   ├── visualization.types.ts # Animation types
│   │   ├── event-loop.types.ts   # Event Loop specific types
│   │   ├── animation.types.ts    # Framer Motion variants
│   │   ├── file-routing.types.ts # File-based Routing types
│   │   ├── server-client-components.types.ts # Server/Client types
│   │   ├── rendering-strategies.types.ts # Rendering types
│   │   ├── data-fetching.types.ts # Data Fetching types
│   │   ├── middleware.types.ts   # Middleware types
│   │   └── index.ts              # Barrel exports
│   │
│   ├── data/                     # Static data
│   │   ├── javascript-topics.ts  # JS topic metadata
│   │   ├── react-topics.ts       # React topic metadata
│   │   ├── nextjs-topics.ts      # Next.js topic metadata
│   │   ├── event-loop-steps.ts   # Event Loop step data
│   │   ├── file-routing-steps.ts # File Routing step data
│   │   ├── server-client-components-steps.ts
│   │   ├── rendering-strategies-steps.ts
│   │   ├── data-fetching-steps.ts
│   │   ├── middleware-steps.ts
│   │   └── index.ts              # Barrel exports
│   │
│   ├── constants/
│   │   └── colors.ts             # Theme colors
│   │
│   └── utils.ts                  # Utility functions
│
└── docs/                         # Documentation
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Page Component                        │
│                   (app/javascript/event-loop)               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │ Step Data   │───▶│ State Hook  │───▶│ Current Step    │ │
│  │ (lib/data)  │    │ (useState)  │    │ Data            │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
│                            │                                 │
│           ┌────────────────┼────────────────┐               │
│           ▼                ▼                ▼               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Visualization│  │ Code Panel  │  │ Explanation Panel   │ │
│  │ Component   │  │ (highlighted│  │ (title, description,│ │
│  │             │  │  lines)     │  │  playback controls) │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Page Layout Structure

Each concept visualization page follows a three-section layout:

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Back button | Title | Step indicator               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌─────────────────────────────┐ │
│  │                      │  │   CODE PANEL                │ │
│  │   ANIMATION PANEL    │  │                             │ │
│  │   (Visualization)    │  │   - Syntax highlighted      │ │
│  │                      │  │   - Line numbers            │ │
│  │   ~60% width         │  │   - Current line highlight  │ │
│  │                      │  │                             │ │
│  └──────────────────────┘  └─────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  EXPLANATION PANEL                                          │
│  - Step title                                               │
│  - Detailed explanation                                     │
│  - Playback controls (play/pause, prev/next, speed)        │
└─────────────────────────────────────────────────────────────┘
```

## State Management

### Local State (useState)

Used for most visualization pages:

- `currentStep` - Current animation step
- `isPlaying` - Auto-play status
- `speed` - Playback speed (0.5x, 1x, 1.5x, 2x)

### Zustand (for complex visualizations)

Available for visualizations that need shared state across components or persistent state.

## Error Handling

Every concept page follows a consistent error handling pattern:

### Error Boundaries

- **Layout-level**: Each section layout (`app/nextjs/layout.tsx`, etc.) wraps its children in an `ErrorBoundary` to catch rendering errors gracefully.
- **Visualization-level**: Each visualization component is wrapped in a `VisualizationErrorBoundary` within the `AnimationPanelWrapper` for granular error containment.

### Try-Catch Blocks

- **Auto-play `useEffect`**: The auto-play timer logic is wrapped in try-catch to handle edge cases (e.g., invalid step data) without crashing the page.
- **Callback handlers**: All playback callbacks (`handleNext`, `handlePrev`, `handlePlay`, etc.) include try-catch to prevent unhandled errors from breaking UI interactions.

### Guard Clauses

- Pages validate that `currentStepData` exists before rendering, returning `null` or a fallback if step data is missing.

## Animation System

All animations use Framer Motion with predefined variants in `lib/types/animation.types.ts`:

- `stackItemVariants` - Push/pop animations for stack items
- `queueItemVariants` - Slide animations for queue items
- `webApiVariants` - Scale animations for Web API items
- `fadeInVariants` - General fade-in animations
- `cardHoverVariants` - Hover effects for cards

## Theming

The theme is defined in `app/globals.css` with CSS custom properties:

### Colors

- **Primary**: Purple (#8B5CF6)
- **Secondary**: Cyan (#06B6D4)
- **Accent**: Coral (#F97316)
- **Background**: Deep Navy (#0F172A)

### Utility Classes

- `.glass` - Glassmorphism effect
- `.glow-purple`, `.glow-cyan`, etc. - Glow effects
- `.gradient-*` - Gradient backgrounds
- `.text-gradient` - Gradient text
- `.animation-panel` - Animation container styling
- `.code-panel` - Code block styling
