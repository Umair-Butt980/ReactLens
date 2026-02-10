/**
 * Next.js topics data for Phase 3
 */

import type { Topic, TopicCategory } from '../types';

export const nextjsTopics: Topic[] = [
  {
    id: 'file-routing',
    title: 'File-based Routing',
    slug: 'file-routing',
    description:
      'Understand how Next.js App Router maps folders and files to URL routes automatically.',
    category: 'nextjs',
    difficulty: 'beginner',
    estimatedTime: 10,
    prerequisites: ['jsx-components'],
    icon: 'FolderTree',
    color: '#8B5CF6',
  },
  {
    id: 'server-client-components',
    title: 'Server vs Client Components',
    slug: 'server-client-components',
    description:
      "Learn how React Server Components and Client Components work together in Next.js's architecture.",
    category: 'nextjs',
    difficulty: 'intermediate',
    estimatedTime: 15,
    prerequisites: ['file-routing'],
    icon: 'Server',
    color: '#EC4899',
  },
  {
    id: 'rendering-strategies',
    title: 'Rendering Strategies',
    slug: 'rendering-strategies',
    description:
      'Explore SSR, SSG, and ISR — how Next.js renders and caches pages for optimal performance.',
    category: 'nextjs',
    difficulty: 'intermediate',
    estimatedTime: 18,
    prerequisites: ['server-client-components'],
    icon: 'Globe',
    color: '#06B6D4',
  },
];

export const nextjsCategory: TopicCategory = {
  id: 'nextjs',
  title: 'Next.js Key Concepts',
  description: 'Master the fundamentals of Next.js and modern full-stack React development.',
  topics: nextjsTopics,
  color: '#8B5CF6',
};
