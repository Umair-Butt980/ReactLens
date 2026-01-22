/**
 * Framer Motion animation types and variants
 */

import type { Variants, Transition } from 'framer-motion';

// Stack item animations (push/pop)
export const stackItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: -30,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

// Queue item animations (slide in from right)
export const queueItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: 50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

// Web API item animations
export const webApiVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: {
      duration: 0.3,
    },
  },
};

// Container stagger animations
export const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Fade in animation
export const fadeInVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Card hover animation
export const cardHoverVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  tap: { scale: 0.98 },
};

// Pulse animation for active elements
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Arrow/pointer animation
export const arrowVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Spring transition config
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
};

// Smooth transition config
export const smoothTransition: Transition = {
  duration: 0.3,
  ease: 'easeInOut',
};
