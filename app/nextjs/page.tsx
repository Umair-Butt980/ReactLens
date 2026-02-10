'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TopicGrid } from '@/components/layout';
import { nextjsTopics } from '@/lib/data/nextjs-topics';

export default function NextJSPage() {
  return (
    <div className="bg-background min-h-screen" aria-label="nextjs concepts page">
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-1.5">
            <div className="h-3 w-3 rounded-md bg-purple-400" aria-hidden="true" />
            <span className="text-sm font-medium text-purple-300">Phase 3</span>
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">Next.js Key Concepts</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Explore Next.js essentials from file-based routing to rendering strategies. See how
            server and client components work together to build modern web applications.
          </p>
        </motion.div>

        {/* Topic Grid */}
        <TopicGrid topics={nextjsTopics} />
      </div>
    </div>
  );
}
