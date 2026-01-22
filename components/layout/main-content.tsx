'use client';

import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main className={cn('flex-1 overflow-hidden', className)} aria-label="main content">
      {children}
    </main>
  );
}

interface SplitViewProps {
  animationPanel: React.ReactNode;
  codePanel: React.ReactNode;
  className?: string;
}

export function SplitView({ animationPanel, codePanel, className }: SplitViewProps) {
  return (
    <div
      className={cn('grid h-full gap-4 p-4', 'grid-cols-1 lg:grid-cols-[1.5fr_1fr]', className)}
      aria-label="split view container"
    >
      {/* Animation Panel - Left side on desktop */}
      <div
        className="animation-panel flex min-h-[400px] flex-col lg:min-h-0"
        aria-label="animation panel"
      >
        {animationPanel}
      </div>

      {/* Code Panel - Right side on desktop */}
      <div
        className="code-panel flex min-h-[200px] flex-col overflow-hidden lg:min-h-0"
        aria-label="code panel"
      >
        {codePanel}
      </div>
    </div>
  );
}

interface AnimationPanelWrapperProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function AnimationPanelWrapper({ children, title, className }: AnimationPanelWrapperProps) {
  return (
    <div className={cn('flex h-full flex-col', className)} aria-label="animation wrapper">
      {title && (
        <div className="border-border/30 border-b px-4 py-2">
          <h2 className="text-muted-foreground text-sm font-medium">{title}</h2>
        </div>
      )}
      <div className="relative flex-1 overflow-hidden p-4">{children}</div>
    </div>
  );
}
