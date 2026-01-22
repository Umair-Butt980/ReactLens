# ReactLens 🔍

**Visual Learning Platform for JavaScript, React & Next.js**

ReactLens is an educational platform that teaches programming concepts through beautiful, step-by-step animated visualizations. Perfect for visual learners who want to truly understand how JavaScript and React work under the hood.

![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

- **Visual Animations** - Watch concepts come to life with smooth, step-by-step animations
- **Deep Explanations** - Each visualization includes detailed explanations of what's happening
- **Interactive Controls** - Play, pause, step through, and control animation speed
- **Code Highlighting** - See which lines of code are executing in real-time
- **Modular Learning** - Jump to any concept or follow the recommended path
- **Dark Theme** - Beautiful, eye-friendly dark UI with colorful accents

## 📚 Topics Covered

### Phase 1: JavaScript Fundamentals
- ✅ Event Loop & Call Stack
- 🔜 Closures & Scope
- 🔜 Hoisting
- 🔜 Prototypes & `this`
- 🔜 Async & Promises
- 🔜 Memory Management
- 🔜 DOM Basics
- 🔜 Virtual DOM

### Phase 2: React Core Concepts
- 🔜 JSX & Components
- 🔜 Props & State
- 🔜 React Hooks
- 🔜 Component Lifecycle
- 🔜 Reconciliation
- 🔜 React Fiber

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/reactlens.git
cd reactlens
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Check for ESLint errors |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run prettier` | Check code formatting |
| `npm run prettier:fix` | Fix code formatting |
| `npm run format` | Run Prettier + ESLint fix |
| `npm run typecheck` | Check TypeScript types |

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Code Highlighting:** [Shiki](https://shiki.style/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## 📁 Project Structure

```
reactlens/
├── app/                    # Next.js App Router pages
│   ├── javascript/         # JavaScript concept pages
│   └── react/              # React concept pages
├── components/
│   ├── layout/             # Layout components
│   ├── visualizations/     # Visualization components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── types/              # TypeScript types
│   ├── data/               # Topic and step data
│   └── constants/          # Theme colors, etc.
└── docs/                   # Documentation
```

## 📖 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Components Reference](./docs/COMPONENTS.md)
- [Adding New Visualizations](./docs/ADDING-VISUALIZATIONS.md)
- [Types Reference](./docs/TYPES.md)

## 🎨 Design System

ReactLens uses a playful, educational dark theme:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#8B5CF6` | Purple - Main accent |
| Secondary | `#06B6D4` | Cyan - Secondary accent |
| Accent | `#F97316` | Coral - Highlights |
| Background | `#0F172A` | Deep Navy - Page background |

## 🤝 Contributing

Contributions are welcome! See [ADDING-VISUALIZATIONS.md](./docs/ADDING-VISUALIZATIONS.md) for how to add new concept visualizations.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by [JavaScript Visualizer 9000](https://www.jsv9000.app/)
- Built for visual learners everywhere

---

<p align="center">
  Built with ♥ for visual learners
</p>
