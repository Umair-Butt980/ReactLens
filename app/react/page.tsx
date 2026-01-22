'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TopicGrid } from '@/components/layout';
import { reactTopics } from '@/lib/data/react-topics';

export default function ReactPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
          aria-label="back to home"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-4 py-1.5">
            <div className="h-3 w-3 rounded-full bg-cyan-400" aria-hidden="true" />
            <span className="text-sm font-medium text-cyan-300">Phase 2</span>
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">React Core Concepts</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Deep dive into React&apos;s internal workings. Understand how Hooks work, visualize the
            component lifecycle, and see the reconciliation process in action.
          </p>
        </motion.div>

        {/* Topic Grid */}
        <TopicGrid topics={reactTopics} />
      </div>
    </div>
  );
}
