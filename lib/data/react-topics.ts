/**
 * React topics data for Phase 2
 */

import type { Topic, TopicCategory } from '../types';

export const reactTopics: Topic[] = [
  {
    id: 'jsx-components',
    title: 'JSX & Components',
    slug: 'jsx-components',
    description: 'Learn how JSX works under the hood and how React components are structured.',
    category: 'react',
    difficulty: 'beginner',
    estimatedTime: 10,
    prerequisites: ['virtual-dom'],
    icon: 'Code2',
    color: '#61DAFB',
  },
  {
    id: 'props-state',
    title: 'Props & State',
    slug: 'props-state',
    description: 'Understand the flow of data through props and how state triggers re-renders.',
    category: 'react',
    difficulty: 'beginner',
    estimatedTime: 12,
    prerequisites: ['jsx-components'],
    icon: 'ArrowLeftRight',
    color: '#06B6D4',
  },
  {
    id: 'hooks',
    title: 'React Hooks',
    slug: 'hooks',
    description:
      'Visualize how useState, useEffect, useRef, useMemo, and useCallback work internally.',
    category: 'react',
    difficulty: 'intermediate',
    estimatedTime: 20,
    prerequisites: ['props-state'],
    icon: 'Anchor',
    color: '#8B5CF6',
  },
  {
    id: 'lifecycle',
    title: 'Component Lifecycle',
    slug: 'lifecycle',
    description: 'See the complete lifecycle of a React component from mount to unmount.',
    category: 'react',
    difficulty: 'intermediate',
    estimatedTime: 15,
    prerequisites: ['hooks'],
    icon: 'RefreshCw',
    color: '#EC4899',
  },
  {
    id: 'reconciliation',
    title: 'Reconciliation',
    slug: 'reconciliation',
    description: "Understand React's diffing algorithm and how it efficiently updates the DOM.",
    category: 'react',
    difficulty: 'advanced',
    estimatedTime: 18,
    prerequisites: ['lifecycle', 'virtual-dom'],
    icon: 'GitCompare',
    color: '#F97316',
  },
  {
    id: 'fiber',
    title: 'React Fiber',
    slug: 'fiber',
    description: "Explore React's Fiber architecture and how it enables concurrent rendering.",
    category: 'react',
    difficulty: 'advanced',
    estimatedTime: 20,
    prerequisites: ['reconciliation'],
    icon: 'Network',
    color: '#10B981',
  },
];

export const reactCategory: TopicCategory = {
  id: 'react',
  title: 'React Core Concepts',
  description: "Deep dive into React's internal workings and modern patterns.",
  topics: reactTopics,
  color: '#61DAFB',
};
