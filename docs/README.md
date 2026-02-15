# ReactLens Documentation

Welcome to the ReactLens documentation. This folder contains detailed documentation for developers working on the project.

## Contents

| Document                                               | Description                                           |
| ------------------------------------------------------ | ----------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                   | Project structure, tech stack, data flow, and theming |
| [COMPONENTS.md](./COMPONENTS.md)                       | Detailed component API reference with usage examples  |
| [ADDING-VISUALIZATIONS.md](./ADDING-VISUALIZATIONS.md) | Step-by-step guide to add new concept visualizations  |
| [TYPES.md](./TYPES.md)                                 | TypeScript type definitions reference                 |

## Quick Links

### For Contributors

- Start with [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the project structure
- Read [ADDING-VISUALIZATIONS.md](./ADDING-VISUALIZATIONS.md) to add new concepts

### For Developers

- Check [COMPONENTS.md](./COMPONENTS.md) for component APIs
- Reference [TYPES.md](./TYPES.md) for TypeScript types

## Project Overview

ReactLens is organized into three main areas:

### 1. Pages (`app/`)

- Landing page and section overviews
- Individual concept visualization pages across three sections:
  - **JavaScript** - Event Loop, Call Stack, Closures, Hoisting, and more
  - **React** - Hooks, Lifecycle, Reconciliation, Fiber, and more
  - **Next.js** - File-based Routing, Server/Client Components, Rendering Strategies, Data Fetching, Middleware
- Each concept page follows the same three-section layout

### 2. Components (`components/`)

- **Layout components** - Reusable page structure components
- **Visualizations** - Animated concept visualizations organized by category (`javascript/`, `react/`, `nextjs/`)
- **UI** - shadcn/ui base components

### 3. Library (`lib/`)

- **Types** - TypeScript type definitions (per concept)
- **Data** - Topic metadata and step-by-step content (per concept)
- **Constants** - Theme colors and configuration
- **Utils** - Helper functions

## Development Workflow

1. **Adding a new visualization:**
   - Define types in `lib/types/`
   - Create step data in `lib/data/`
   - Build visualization component in `components/visualizations/`
   - Create page in `app/[category]/[concept]/`

2. **Modifying existing visualizations:**
   - Update step data in `lib/data/`
   - Modify visualization component as needed

3. **Styling changes:**
   - Global styles in `app/globals.css`
   - Component styles use Tailwind CSS classes
   - Theme colors defined in CSS custom properties

## Code Style

- **TypeScript** for all code
- **ESLint** for linting
- **Prettier** for formatting
- **Tailwind CSS** for styling
- **Framer Motion** for animations

Run formatting:

```bash
npm run format
```

Check for issues:

```bash
npm run lint
npm run prettier
npm run typecheck
```
