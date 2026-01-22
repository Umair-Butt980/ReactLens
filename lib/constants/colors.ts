/**
 * Color palette for ReactLens - Playful Educational Vibe
 */

export const colors = {
  // Primary colors
  primary: {
    purple: '#8B5CF6',
    purpleLight: '#A78BFA',
    purpleDark: '#7C3AED',
  },

  // Secondary colors
  secondary: {
    cyan: '#06B6D4',
    cyanLight: '#22D3EE',
    cyanDark: '#0891B2',
  },

  // Accent colors
  accent: {
    coral: '#F97316',
    coralLight: '#FB923C',
    pink: '#EC4899',
    pinkLight: '#F472B6',
    yellow: '#FBBF24',
    lime: '#84CC16',
  },

  // Success/Status
  success: {
    emerald: '#10B981',
    emeraldLight: '#34D399',
  },

  // Background
  background: {
    dark: '#0F172A',
    darkLighter: '#1E293B',
    darkCard: '#1E293B',
  },

  // Visualization specific colors
  visualization: {
    callStack: '#8B5CF6', // Purple
    webApi: '#F97316', // Coral
    callbackQueue: '#06B6D4', // Cyan
    microtaskQueue: '#EC4899', // Pink
    eventLoop: '#10B981', // Emerald
    output: '#FBBF24', // Yellow
  },

  // Code syntax colors (matching theme)
  syntax: {
    keyword: '#C084FC', // Purple light
    string: '#34D399', // Emerald light
    number: '#FB923C', // Coral light
    function: '#22D3EE', // Cyan light
    comment: '#64748B', // Slate
    variable: '#F472B6', // Pink light
  },
} as const;

// Category colors for topic cards
export const categoryColors = {
  javascript: {
    bg: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
  },
  react: {
    bg: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    icon: 'text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300',
  },
  nextjs: {
    bg: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
  },
} as const;

// Difficulty colors
export const difficultyColors = {
  beginner: 'text-emerald-400 bg-emerald-500/20',
  intermediate: 'text-amber-400 bg-amber-500/20',
  advanced: 'text-rose-400 bg-rose-500/20',
} as const;
