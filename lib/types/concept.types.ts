/**
 * Types for concept pages and steps
 */

export interface ConceptStep {
  id: string;
  title: string;
  explanation: string;
  highlightedLines: number[];
  animationState: Record<string, unknown>;
  duration: number;
}

export interface ConceptPageData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'javascript' | 'react' | 'nextjs';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  codeExample: string;
  steps: ConceptStep[];
  totalDuration: number;
  keyTakeaways: string[];
  nextTopic?: string;
  prevTopic?: string;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'javascript' | 'react' | 'nextjs';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  prerequisites?: string[];
  icon?: string;
  color?: string;
}

export interface TopicCategory {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  color: string;
}
