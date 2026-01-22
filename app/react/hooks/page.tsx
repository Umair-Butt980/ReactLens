'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Construction } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HooksPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/react"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            aria-label="back to react topics"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back to React</span>
          </Link>
          <h1 className="text-foreground text-lg font-bold tracking-tight">React Hooks</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="rounded-2xl bg-purple-500/20 p-6">
            <Construction className="h-12 w-12 text-purple-400" aria-hidden="true" />
          </div>
          <h2 className="text-foreground text-2xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            Deep dive into how useState, useEffect, useRef, useMemo, and useCallback work internally
            with beautiful visualizations.
          </p>
          <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-left">
            <h3 className="mb-2 text-sm font-semibold text-purple-300">Hooks to visualize:</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• useState - State updates and re-renders</li>
              <li>• useEffect - Lifecycle and cleanup</li>
              <li>• useRef - Persistent values without re-renders</li>
              <li>• useMemo - Memoization and dependencies</li>
              <li>• useCallback - Function memoization</li>
              <li>• useContext - Context propagation</li>
            </ul>
          </div>
          <Link
            href="/javascript/event-loop"
            className={cn(
              'mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium',
              'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            aria-label="go to event loop visualization"
          >
            View Event Loop
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
