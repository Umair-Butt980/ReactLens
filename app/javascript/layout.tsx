import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JavaScript Concepts | ReactLens',
  description:
    'Learn JavaScript fundamentals through visual animations - Event Loop, Closures, Hoisting, and more.',
};

export default function JavaScriptLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
