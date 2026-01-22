'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CallStackState, ExecutionContext, Variable } from '@/lib/types';
import { stackItemVariants } from '@/lib/types/animation.types';

interface CallStackVisualProps {
  state: CallStackState;
  className?: string;
}

export function CallStackVisual({ state, className }: CallStackVisualProps) {
  const { contexts, output } = state;

  return (
    <div
      className={cn('grid h-full gap-4 lg:grid-cols-[1fr_auto]', className)}
      aria-label="call stack visualization"
    >
      {/* Main Stack View */}
      <div className="flex flex-col gap-4">
        {/* Stack Container */}
        <div
          className={cn(
            'border-primary/30 bg-primary/5 flex-1 rounded-xl border p-4',
            'flex flex-col'
          )}
          aria-label="execution contexts stack"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="text-primary h-4 w-4" aria-hidden="true" />
              <h3 className="text-foreground text-sm font-semibold">Call Stack</h3>
            </div>
            <span className="text-muted-foreground text-xs">
              {contexts.length} context{contexts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Stack Items - Reversed to show top at top */}
          <div className="relative flex min-h-[300px] flex-1 flex-col-reverse justify-end gap-2">
            <AnimatePresence mode="popLayout">
              {contexts.map((context, index) => (
                <ExecutionContextCard
                  key={context.id}
                  context={context}
                  isTop={index === contexts.length - 1}
                  index={index}
                />
              ))}
            </AnimatePresence>

            {contexts.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground/50 text-sm italic">Stack is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Console Output */}
        <OutputConsole output={output} />
      </div>

      {/* Legend */}
      <div className="hidden w-48 flex-col gap-3 lg:flex">
        <div className="border-border/30 bg-card/30 rounded-xl border p-4">
          <h4 className="text-foreground mb-3 text-sm font-semibold">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#8B5CF6]" />
              <span className="text-muted-foreground">Global Context</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-[#06B6D4]" />
              <span className="text-muted-foreground">Function Context</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUp className="h-3 w-3 text-emerald-400" />
              <span className="text-muted-foreground">Currently Executing</span>
            </div>
          </div>
        </div>

        <div className="border-border/30 bg-card/30 rounded-xl border p-4">
          <h4 className="text-foreground mb-2 text-sm font-semibold">How it works</h4>
          <p className="text-muted-foreground text-xs leading-relaxed">
            The Call Stack tracks function execution. When a function is called, its context is{' '}
            <strong className="text-foreground">pushed</strong> onto the stack. When it returns,
            it&apos;s <strong className="text-foreground">popped</strong> off.
          </p>
        </div>
      </div>
    </div>
  );
}

interface ExecutionContextCardProps {
  context: ExecutionContext;
  isTop: boolean;
  index: number;
}

function ExecutionContextCard({ context, isTop }: ExecutionContextCardProps) {
  return (
    <motion.div
      variants={stackItemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className={cn(
        'rounded-xl border-2 p-4 transition-all duration-300',
        isTop ? 'ring-offset-background ring-2 ring-offset-2' : ''
      )}
      style={
        {
          borderColor: context.color,
          backgroundColor: `${context.color}15`,
          '--tw-ring-color': isTop ? context.color : 'transparent',
        } as React.CSSProperties
      }
      aria-label={`${context.name} execution context`}
    >
      {/* Context Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${context.color}30`, color: context.color }}
          >
            {context.type === 'global' ? '🌐' : '⚡'} {context.name}
          </span>
          {isTop && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-xs text-emerald-400"
            >
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
              executing
            </motion.span>
          )}
        </div>
      </div>

      {/* Variable Environment */}
      <div className="border-border/30 bg-background/50 rounded-lg border p-3">
        <h4 className="text-muted-foreground mb-2 text-xs font-medium">Variable Environment</h4>
        {context.variableEnvironment.length === 0 ? (
          <p className="text-muted-foreground/50 text-xs italic">No variables</p>
        ) : (
          <div className="space-y-1">
            {context.variableEnvironment.map((variable) => (
              <VariableItem key={variable.id} variable={variable} />
            ))}
          </div>
        )}
      </div>

      {/* Outer Reference */}
      {context.outerReference && (
        <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
          <span>↗ Outer:</span>
          <span className="text-foreground font-medium">{context.outerReference}</span>
        </div>
      )}
    </motion.div>
  );
}

interface VariableItemProps {
  variable: Variable;
}

function VariableItem({ variable }: VariableItemProps) {
  const typeColors: Record<string, string> = {
    function: 'text-emerald-400',
    var: 'text-amber-400',
    let: 'text-cyan-400',
    const: 'text-purple-400',
    parameter: 'text-pink-400',
  };

  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className={cn('font-mono', typeColors[variable.type] || 'text-foreground')}>
          {variable.type === 'function' ? 'ƒ' : variable.type}
        </span>
        <span className="text-foreground font-medium">{variable.name}</span>
      </div>
      <span className="text-muted-foreground max-w-[120px] truncate font-mono">
        {variable.value}
      </span>
    </div>
  );
}

interface OutputConsoleProps {
  output: string[];
}

function OutputConsole({ output }: OutputConsoleProps) {
  return (
    <div
      className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4"
      aria-label="console output"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
        </div>
        <span className="text-muted-foreground text-xs font-medium">Console</span>
      </div>

      <div className="min-h-[60px] font-mono text-sm">
        <AnimatePresence mode="popLayout">
          {output.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground/50 italic"
            >
              No output yet...
            </motion.p>
          ) : (
            output.map((line, index) => (
              <motion.div
                key={`${line}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <span className="text-muted-foreground/50 select-none">&gt;</span>
                <span className="text-yellow-300">{line}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
