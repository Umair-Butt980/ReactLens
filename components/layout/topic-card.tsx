'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  RotateCw,
  Layers,
  Box,
  ArrowUp,
  GitBranch,
  Timer,
  HardDrive,
  FileCode,
  Layers2,
  Code2,
  ArrowLeftRight,
  Anchor,
  RefreshCw,
  GitCompare,
  Network,
  FolderTree,
  Server,
  Globe,
  Database,
  Shield,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Topic } from '@/lib/types';
import { difficultyColors, categoryColors } from '@/lib/constants/colors';
import { cardHoverVariants } from '@/lib/types/animation.types';

const iconMap: Record<string, LucideIcon> = {
  RotateCw,
  Layers,
  Box,
  ArrowUp,
  GitBranch,
  Timer,
  HardDrive,
  FileCode,
  Layers2,
  Code2,
  ArrowLeftRight,
  Anchor,
  RefreshCw,
  GitCompare,
  Network,
  FolderTree,
  Server,
  Globe,
  Database,
  Shield,
};

interface TopicCardProps {
  topic: Topic;
  index?: number;
}

export function TopicCard({ topic, index = 0 }: TopicCardProps) {
  const Icon = topic.icon ? iconMap[topic.icon] : Layers;
  const colors = categoryColors[topic.category];

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      custom={index}
    >
      <Link
        href={`/${topic.category}/${topic.slug}`}
        className={cn(
          'group relative block overflow-hidden rounded-2xl border p-6 transition-all duration-300',
          'bg-gradient-to-br',
          colors.bg,
          colors.border,
          'hover:border-primary/50 hover:shadow-primary/10 hover:shadow-lg'
        )}
        aria-label={`learn about ${topic.title}`}
      >
        {/* Icon */}
        <div
          className={cn(
            'mb-4 inline-flex rounded-xl p-3',
            'bg-gradient-to-br from-white/10 to-white/5'
          )}
          aria-hidden="true"
        >
          <Icon className={cn('h-6 w-6', colors.icon)} />
        </div>

        {/* Title */}
        <h3 className="text-foreground group-hover:text-primary mb-2 text-lg font-semibold transition-colors">
          {topic.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{topic.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Difficulty badge */}
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              difficultyColors[topic.difficulty]
            )}
          >
            {topic.difficulty}
          </span>

          {/* Time estimate */}
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Timer className="h-3 w-3" aria-hidden="true" />
            {topic.estimatedTime} min
          </span>
        </div>

        {/* Hover gradient overlay */}
        <div
          className={cn(
            'absolute inset-0 -z-10 opacity-0 transition-opacity duration-300',
            'from-primary/5 to-secondary/5 bg-gradient-to-br',
            'group-hover:opacity-100'
          )}
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}

interface TopicGridProps {
  topics: Topic[];
  className?: string;
}

export function TopicGrid({ topics, className }: TopicGridProps) {
  return (
    <motion.div
      className={cn('grid gap-4', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', className)}
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      aria-label="topics grid"
    >
      {topics.map((topic, index) => (
        <motion.div
          key={topic.id}
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          }}
        >
          <TopicCard topic={topic} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}
