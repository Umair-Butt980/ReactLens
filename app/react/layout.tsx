import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'React Concepts | ReactLens',
  description:
    'Learn React core concepts through visual animations - Hooks, Lifecycle, Reconciliation, and more.',
};

export default function ReactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
