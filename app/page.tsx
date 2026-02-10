'use client';

import { motion } from 'framer-motion';
import { Sparkles, Code2, Layers, Zap, Server } from 'lucide-react';
import Link from 'next/link';
import { TopicGrid } from '@/components/layout';
import { javascriptTopics } from '@/lib/data/javascript-topics';
import { reactTopics } from '@/lib/data/react-topics';
import { nextjsTopics } from '@/lib/data/nextjs-topics';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden" aria-label="hero section">
        {/* Background gradient */}
        <div
          className="from-primary/10 via-background to-secondary/10 absolute inset-0 bg-gradient-to-br"
          aria-hidden="true"
        />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            className="bg-primary/20 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="bg-secondary/20 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="border-primary/30 bg-primary/10 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="text-primary h-4 w-4" aria-hidden="true" />
              <span className="text-primary text-sm font-medium">Visual learning made simple</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Master <span className="text-gradient">JavaScript, React & Next.js</span>
              <br />
              Through Animations
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground mb-10 text-lg md:text-xl">
              Understand complex concepts like the Event Loop, Closures, Hooks, Server Components,
              and more through beautiful, step-by-step visual explanations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#javascript"
                className={cn(
                  'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8 text-base font-medium',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90 transition-all hover:scale-105',
                  'glow-purple'
                )}
                aria-label="start with javascript"
              >
                <Zap className="h-5 w-5" aria-hidden="true" />
                Start learning
              </Link>
              <Link
                href="#react"
                className={cn(
                  'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8 text-base font-medium',
                  'border-border bg-card/50 text-foreground border',
                  'hover:bg-card hover:border-primary/50 transition-all'
                )}
                aria-label="explore react topics"
              >
                <Code2 className="h-5 w-5" aria-hidden="true" />
                Explore React
              </Link>
              <Link
                href="#nextjs"
                className={cn(
                  'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8 text-base font-medium',
                  'border-border bg-card/50 text-foreground border',
                  'hover:bg-card transition-all hover:border-purple-500/50'
                )}
                aria-label="explore next.js topics"
              >
                <Server className="h-5 w-5" aria-hidden="true" />
                Explore Next.js
              </Link>
            </div>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="mt-20 grid gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={cn(
                  'border-border/50 bg-card/50 rounded-2xl border p-6 backdrop-blur-sm',
                  'hover:border-primary/30 hover:bg-card/80 transition-all'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div
                  className={cn('mb-4 inline-flex rounded-xl p-3', feature.bgColor)}
                  aria-hidden="true"
                >
                  <feature.icon className={cn('h-6 w-6', feature.iconColor)} />
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* JavaScript Section */}
      <section
        id="javascript"
        className="border-border/40 border-t py-20"
        aria-label="javascript topics"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5">
              <div className="h-3 w-3 rounded-sm bg-amber-400" aria-hidden="true" />
              <span className="text-sm font-medium text-amber-300">Phase 1</span>
            </div>
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              JavaScript Fundamentals
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Start with the foundation. Understand how JavaScript works under the hood, from the
              Event Loop to Closures, and see why the Virtual DOM was created.
            </p>
          </motion.div>

          <TopicGrid topics={javascriptTopics} />
        </div>
      </section>

      {/* React Section */}
      <section
        id="react"
        className="border-border/40 bg-card/30 border-t py-20"
        aria-label="react topics"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-1.5">
              <div className="h-3 w-3 rounded-full bg-cyan-400" aria-hidden="true" />
              <span className="text-sm font-medium text-cyan-300">Phase 2</span>
            </div>
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              React Core Concepts
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Dive deep into React&apos;s internal workings. See how Hooks work, understand the
              component lifecycle, and visualize the reconciliation process.
            </p>
          </motion.div>

          <TopicGrid topics={reactTopics} />
        </div>
      </section>

      {/* Next.js Section */}
      <section id="nextjs" className="border-border/40 border-t py-20" aria-label="nextjs topics">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-1.5">
              <div className="h-3 w-3 rounded-md bg-purple-400" aria-hidden="true" />
              <span className="text-sm font-medium text-purple-300">Phase 3</span>
            </div>
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              Next.js Key Concepts
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Level up with Next.js essentials. Learn file-based routing, server vs client
              components, and rendering strategies that power modern web applications.
            </p>
          </motion.div>

          <TopicGrid topics={nextjsTopics} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border/40 border-t py-8" aria-label="footer">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Built with{' '}
            <span className="text-primary" aria-label="love">
              ♥
            </span>{' '}
            for visual learners
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'Visual Animations',
    description:
      'Watch concepts come to life with smooth, step-by-step animations that make abstract ideas concrete.',
    icon: Layers,
    bgColor: 'bg-primary/20',
    iconColor: 'text-primary',
  },
  {
    title: 'Deep Explanations',
    description:
      "Each visualization comes with detailed explanations that help you truly understand what's happening.",
    icon: Code2,
    bgColor: 'bg-secondary/20',
    iconColor: 'text-secondary',
  },
  {
    title: 'Learn at Your Pace',
    description:
      'Control the animation speed, step through at your own pace, or let it play automatically.',
    icon: Zap,
    bgColor: 'bg-accent/20',
    iconColor: 'text-accent',
  },
];
