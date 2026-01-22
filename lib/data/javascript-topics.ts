/**
 * JavaScript topics data for Phase 1
 */

import type { Topic, TopicCategory } from '../types';

export const javascriptTopics: Topic[] = [
  {
    id: 'event-loop',
    title: 'Event Loop',
    slug: 'event-loop',
    description:
      'Understand how JavaScript handles asynchronous operations through the event loop, call stack, and task queues.',
    category: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 15,
    icon: 'RotateCw',
    color: '#8B5CF6',
  },
  {
    id: 'call-stack',
    title: 'Call Stack',
    slug: 'call-stack',
    description:
      'Learn how JavaScript tracks function execution using the call stack and execution contexts.',
    category: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 10,
    prerequisites: [],
    icon: 'Layers',
    color: '#06B6D4',
  },
  {
    id: 'closures',
    title: 'Closures & Scope',
    slug: 'closures',
    description:
      'Master closures and understand lexical scoping, scope chains, and variable access patterns.',
    category: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 12,
    prerequisites: ['call-stack'],
    icon: 'Box',
    color: '#EC4899',
  },
  {
    id: 'hoisting',
    title: 'Hoisting',
    slug: 'hoisting',
    description:
      'See how JavaScript hoists variable and function declarations during the creation phase.',
    category: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 8,
    prerequisites: [],
    icon: 'ArrowUp',
    color: '#F97316',
  },
  {
    id: 'prototypes',
    title: 'Prototypes & this',
    slug: 'prototypes',
    description:
      'Understand prototype chains, inheritance, and how the "this" keyword behaves in different contexts.',
    category: 'javascript',
    difficulty: 'advanced',
    estimatedTime: 20,
    prerequisites: ['closures'],
    icon: 'GitBranch',
    color: '#10B981',
  },
  {
    id: 'async-promises',
    title: 'Async & Promises',
    slug: 'async-promises',
    description: 'Deep dive into Promises, async/await, and how they interact with the event loop.',
    category: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 15,
    prerequisites: ['event-loop'],
    icon: 'Timer',
    color: '#FBBF24',
  },
  {
    id: 'memory',
    title: 'Memory Management',
    slug: 'memory',
    description:
      'Learn about garbage collection, memory leaks, and how JavaScript manages memory allocation.',
    category: 'javascript',
    difficulty: 'advanced',
    estimatedTime: 15,
    prerequisites: ['closures'],
    icon: 'HardDrive',
    color: '#EF4444',
  },
  {
    id: 'dom',
    title: 'DOM Basics',
    slug: 'dom',
    description:
      'Understand how the Document Object Model works and how browsers render web pages.',
    category: 'javascript',
    difficulty: 'beginner',
    estimatedTime: 12,
    prerequisites: [],
    icon: 'FileCode',
    color: '#3B82F6',
  },
  {
    id: 'virtual-dom',
    title: 'Virtual DOM',
    slug: 'virtual-dom',
    description:
      'See why the Virtual DOM was created and how it optimizes UI updates compared to direct DOM manipulation.',
    category: 'javascript',
    difficulty: 'intermediate',
    estimatedTime: 15,
    prerequisites: ['dom'],
    icon: 'Layers2',
    color: '#8B5CF6',
  },
];

export const javascriptCategory: TopicCategory = {
  id: 'javascript',
  title: 'JavaScript Fundamentals',
  description: 'Master the core concepts of JavaScript that every developer should know.',
  topics: javascriptTopics,
  color: '#F7DF1E',
};
