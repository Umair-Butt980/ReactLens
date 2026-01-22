'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HoistingState, MemorySlot } from '@/lib/types';

interface HoistingVisualProps {
  state: HoistingState;
  className?: string;
}

export function HoistingVisual({ state, className }: HoistingVisualProps) {
  const { phase, creationMemory, executionMemory, output, error } = state;

  return (
    <div
      className={cn('flex h-full flex-col gap-4', className)}
      aria-label="hoisting visualization"
    >
      {/* Two-Phase Split View */}
      <div className="grid flex-1 gap-4 lg:grid-cols-2">
        {/* Creation Phase */}
        <MemoryPhasePanel
          title="Creation Phase"
          subtitle="Before code runs"
          memory={creationMemory}
          isActive={phase === 'creation'}
          icon={<Clock className="h-4 w-4" />}
          accentColor="#F97316"
        />

        {/* Execution Phase */}
        <MemoryPhasePanel
          title="Execution Phase"
          subtitle="Code runs line by line"
          memory={executionMemory}
          isActive={phase === 'execution'}
          icon={<CheckCircle className="h-4 w-4" />}
          accentColor="#10B981"
        />
      </div>

      {/* Output & Error Display */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Console Output */}
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
            <span className="text-muted-foreground text-xs font-medium">Console Output</span>
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

        {/* Error Display */}
        <AnimatePresence>
          {error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4"
              aria-label="error display"
            >
              <div className="mb-2 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" aria-hidden="true" />
                <span className="text-sm font-medium text-red-400">Error!</span>
              </div>
              <p className="font-mono text-sm text-red-300">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-border/30 bg-card/30 rounded-xl border p-4"
            >
              <h4 className="text-foreground mb-2 text-sm font-semibold">Quick Reference</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-emerald-500" />
                  <span className="text-muted-foreground">Function: Fully hoisted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-amber-500" />
                  <span className="text-muted-foreground">var: Hoisted as undefined</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-red-500" />
                  <span className="text-muted-foreground">let/const: TDZ (error if accessed)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface MemoryPhasePanelProps {
  title: string;
  subtitle: string;
  memory: MemorySlot[];
  isActive: boolean;
  icon: React.ReactNode;
  accentColor: string;
}

function MemoryPhasePanel({
  title,
  subtitle,
  memory,
  isActive,
  icon,
  accentColor,
}: MemoryPhasePanelProps) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 transition-all duration-300',
        isActive ? 'ring-offset-background ring-2 ring-offset-2' : 'opacity-60'
      )}
      style={{
        borderColor: isActive ? accentColor : 'var(--border)',
        ringColor: isActive ? accentColor : 'transparent',
      }}
      aria-label={`${title} panel`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span style={{ color: accentColor }}>{icon}</span>
            <h3 className="text-foreground text-sm font-semibold">{title}</h3>
          </div>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
        {isActive && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            Active
          </motion.span>
        )}
      </div>

      {/* Memory Slots */}
      <div className="border-border/30 bg-background/50 rounded-lg border p-3">
        <h4 className="text-muted-foreground mb-3 text-xs font-medium">Memory</h4>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {memory.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground/50 text-xs italic"
              >
                Memory empty...
              </motion.p>
            ) : (
              memory.map((slot) => <MemorySlotItem key={slot.id} slot={slot} />)
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface MemorySlotItemProps {
  slot: MemorySlot;
}

function MemorySlotItem({ slot }: MemorySlotItemProps) {
  const statusIcons = {
    hoisted: <CheckCircle className="h-3 w-3 text-amber-400" />,
    tdz: <AlertTriangle className="h-3 w-3 text-red-400" />,
    initialized: <CheckCircle className="h-3 w-3 text-emerald-400" />,
    uninitialized: <Clock className="text-muted-foreground h-3 w-3" />,
  };

  const statusLabels = {
    hoisted: 'Hoisted',
    tdz: 'TDZ',
    initialized: 'Ready',
    uninitialized: 'Waiting',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className={cn(
        'flex items-center justify-between rounded-lg border p-2 transition-all',
        slot.status === 'tdz' && 'border-red-500/50 bg-red-500/10',
        slot.status === 'hoisted' && 'border-amber-500/50 bg-amber-500/10',
        slot.status === 'initialized' && 'border-emerald-500/50 bg-emerald-500/10',
        slot.status === 'uninitialized' && 'border-border/30 bg-card/30'
      )}
    >
      <div className="flex items-center gap-2">
        {statusIcons[slot.status]}
        <div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium" style={{ color: slot.color }}>
              {slot.type}
            </span>
            <span className="text-foreground text-sm font-semibold">{slot.name}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'font-mono text-sm',
            slot.status === 'tdz' ? 'text-red-400' : 'text-muted-foreground'
          )}
        >
          {slot.value}
        </span>
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
            slot.status === 'tdz' && 'bg-red-500/20 text-red-400',
            slot.status === 'hoisted' && 'bg-amber-500/20 text-amber-400',
            slot.status === 'initialized' && 'bg-emerald-500/20 text-emerald-400',
            slot.status === 'uninitialized' && 'bg-muted text-muted-foreground'
          )}
        >
          {statusLabels[slot.status]}
        </span>
      </div>
    </motion.div>
  );
}
