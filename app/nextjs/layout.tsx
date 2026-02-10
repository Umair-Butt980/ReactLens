import type { Metadata } from 'next';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = {
  title: 'Next.js Concepts | ReactLens',
  description:
    'Learn Next.js key concepts through visual animations - File Routing, Server Components, Rendering Strategies, and more.',
};

export default function NextJSLayout({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
