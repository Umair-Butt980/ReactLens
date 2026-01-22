'use client';

import { cn } from '@/lib/utils';

interface ExplanationPanelProps {
  title: string;
  explanation: string;
  controls: React.ReactNode;
  className?: string;
}

export function ExplanationPanel({
  title,
  explanation,
  controls,
  className,
}: ExplanationPanelProps) {
  return (
    <section
      className={cn('border-border/40 bg-card/50 border-t backdrop-blur-sm', className)}
      aria-label="explanation panel"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Step Title */}
        <h2 className="text-foreground mb-3 text-lg font-semibold">{title}</h2>

        {/* Explanation Text */}
        <div className="prose prose-sm prose-invert mb-6 max-w-none" aria-label="step explanation">
          <p className="text-muted-foreground leading-relaxed">{explanation}</p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center">{controls}</div>
      </div>
    </section>
  );
}

interface KeyTakeawaysProps {
  takeaways: string[];
  className?: string;
}

export function KeyTakeaways({ takeaways, className }: KeyTakeawaysProps) {
  if (takeaways.length === 0) return null;

  return (
    <div
      className={cn('rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4', className)}
      aria-label="key takeaways"
    >
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
        <span aria-hidden="true">✨</span>
        Key Takeaways
      </h3>
      <ul className="space-y-2" role="list">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="text-muted-foreground flex items-start gap-2 text-sm">
            <span
              className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400"
              aria-hidden="true"
            />
            {takeaway}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface OutputConsoleProps {
  output: string[];
  className?: string;
}

export function OutputConsole({ output, className }: OutputConsoleProps) {
  return (
    <div
      className={cn('border-border/30 rounded-xl border bg-[#1a1b26] p-4', className)}
      aria-label="console output"
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" aria-hidden="true" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" aria-hidden="true" />
        </div>
        <span className="text-muted-foreground text-xs">Console Output</span>
      </div>
      <div className="font-mono text-sm">
        {output.length === 0 ? (
          <p className="text-muted-foreground/50 italic">No output yet...</p>
        ) : (
          output.map((line, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-muted-foreground/50 select-none">&gt;</span>
              <span className="text-emerald-400">{line}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
