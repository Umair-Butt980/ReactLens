'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Construction } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VirtualDomPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/javascript"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            aria-label="back to javascript topics"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back to JavaScript</span>
          </Link>
          <h1 className="text-foreground text-lg font-bold tracking-tight">Virtual DOM</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Coming Soon Content */}
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
            The Virtual DOM visualization will demonstrate why it was created, how it compares to
            direct DOM manipulation, and show the diffing algorithm in action with side-by-side
            comparisons.
          </p>
          <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-left">
            <h3 className="mb-2 text-sm font-semibold text-purple-300">What you&apos;ll learn:</h3>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Why direct DOM manipulation is expensive</li>
              <li>• How the Virtual DOM creates a lightweight copy</li>
              <li>• The diffing algorithm that finds minimal changes</li>
              <li>• Batch updates and reconciliation</li>
              <li>• Performance benefits visualized</li>
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
