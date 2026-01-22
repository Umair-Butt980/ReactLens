import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ReactLens - Visual Learning for React & JavaScript',
  description:
    'Master JavaScript, React, and Next.js concepts through beautiful animations and visual explanations.',
  keywords: [
    'React',
    'JavaScript',
    'Learning',
    'Visual',
    'Animation',
    'Tutorial',
    'Event Loop',
    'Hooks',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background min-h-screen font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
