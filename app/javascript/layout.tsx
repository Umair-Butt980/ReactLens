import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = {
  title: 'JavaScript Concepts | ReactLens',
  description:
    'Learn JavaScript fundamentals through visual animations - Event Loop, Closures, Hoisting, and more.',
};

export default function JavaScriptLayout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
