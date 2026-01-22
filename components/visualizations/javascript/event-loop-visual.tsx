'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EventLoopState, CallStackItem, QueueItem, WebApiItem } from '@/lib/types';
import {
  stackItemVariants,
  queueItemVariants,
  webApiVariants,
  pulseVariants,
} from '@/lib/types/animation.types';

interface EventLoopVisualProps {
  state: EventLoopState;
  className?: string;
}

export function EventLoopVisual({ state, className }: EventLoopVisualProps) {
  const { callStack, callbackQueue, microtaskQueue, webApis, currentPhase, output } = state;

  return (
    <div
      className={cn('grid h-full gap-4', 'grid-cols-1 lg:grid-cols-[1fr_auto_1fr]', className)}
      aria-label="event loop visualization"
    >
      {/* Left Column - Call Stack & Output */}
      <div className="flex flex-col gap-4">
        {/* Call Stack */}
        <CallStackVisual items={callStack} isActive={currentPhase === 'stack'} />

        {/* Output Console */}
        <OutputVisual output={output} />
      </div>

      {/* Center - Event Loop Arrow */}
      <div className="hidden flex-col items-center justify-center px-4 lg:flex">
        <EventLoopArrow currentPhase={currentPhase} />
      </div>

      {/* Right Column - Web APIs & Queues */}
      <div className="flex flex-col gap-4">
        {/* Web APIs */}
        <WebApisVisual items={webApis} isActive={currentPhase === 'webapi'} />

        {/* Microtask Queue */}
        <QueueVisual
          title="Microtask Queue"
          items={microtaskQueue}
          color="pink"
          isActive={currentPhase === 'microtask'}
        />

        {/* Callback Queue */}
        <QueueVisual
          title="Callback Queue"
          items={callbackQueue}
          color="cyan"
          isActive={currentPhase === 'callback'}
        />
      </div>
    </div>
  );
}

interface CallStackVisualProps {
  items: CallStackItem[];
  isActive: boolean;
}

function CallStackVisual({ items, isActive }: CallStackVisualProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border p-4 transition-all duration-300',
        isActive ? 'border-primary/50 bg-primary/10 glow-purple' : 'border-border/30 bg-card/30'
      )}
      aria-label="call stack"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-semibold">Call Stack</h3>
        <span className="text-muted-foreground text-xs">LIFO</span>
      </div>

      <div className="relative min-h-[180px] flex-1">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <p className="text-muted-foreground/50 text-sm italic">Stack is empty</p>
            </motion.div>
          ) : (
            <div className="flex flex-col-reverse gap-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={stackItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium text-white',
                    'border border-white/20 shadow-lg'
                  )}
                  style={{ backgroundColor: item.color }}
                >
                  <span className="truncate">{item.name}</span>
                  {index === items.length - 1 && (
                    <span className="ml-2 text-xs opacity-70">← executing</span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface WebApisVisualProps {
  items: WebApiItem[];
  isActive: boolean;
}

function WebApisVisual({ items, isActive }: WebApisVisualProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-300',
        isActive ? 'border-accent/50 bg-accent/10 glow-coral' : 'border-border/30 bg-card/30'
      )}
      aria-label="web apis"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-semibold">Web APIs</h3>
        <span className="text-muted-foreground text-xs">Browser</span>
      </div>

      <div className="min-h-[80px]">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[80px] items-center justify-center"
            >
              <p className="text-muted-foreground/50 text-sm italic">No active timers</p>
            </motion.div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={webApiVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={cn(
                    'border-accent/30 bg-accent/20 relative overflow-hidden rounded-lg border px-3 py-2'
                  )}
                >
                  <span className="text-accent text-sm font-medium">{item.name}</span>
                  {item.progress !== undefined && (
                    <motion.div
                      className="bg-accent absolute bottom-0 left-0 h-0.5"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface QueueVisualProps {
  title: string;
  items: QueueItem[];
  color: 'pink' | 'cyan';
  isActive: boolean;
}

function QueueVisual({ title, items, color, isActive }: QueueVisualProps) {
  const colorClasses = {
    pink: {
      active: 'border-pink-500/50 bg-pink-500/10 glow-pink',
      item: 'border-pink-500/30 bg-pink-500/20 text-pink-300',
    },
    cyan: {
      active: 'border-cyan-500/50 bg-cyan-500/10 glow-cyan',
      item: 'border-cyan-500/30 bg-cyan-500/20 text-cyan-300',
    },
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-300',
        isActive ? colorClasses[color].active : 'border-border/30 bg-card/30'
      )}
      aria-label={title.toLowerCase()}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        <span className="text-muted-foreground text-xs">FIFO</span>
      </div>

      <div className="min-h-[60px]">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-[60px] items-center justify-center"
            >
              <p className="text-muted-foreground/50 text-sm italic">Queue is empty</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={queueItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2',
                    colorClasses[color].item
                  )}
                >
                  {index === 0 && (
                    <ArrowRight className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                  )}
                  <span className="truncate text-sm font-medium">{item.name}</span>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface EventLoopArrowProps {
  currentPhase: EventLoopState['currentPhase'];
}

function EventLoopArrow({ currentPhase }: EventLoopArrowProps) {
  const isActive = currentPhase === 'microtask' || currentPhase === 'callback';

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-300',
        isActive
          ? 'glow-emerald border-emerald-500/50 bg-emerald-500/10'
          : 'border-border/30 bg-card/30'
      )}
      variants={isActive ? pulseVariants : undefined}
      initial="initial"
      animate={isActive ? 'animate' : 'initial'}
      aria-label="event loop"
    >
      <RotateCw
        className={cn(
          'h-8 w-8 transition-colors',
          isActive ? 'text-emerald-400' : 'text-muted-foreground'
        )}
        aria-hidden="true"
      />
      <span className="text-muted-foreground text-xs font-medium">Event Loop</span>

      {/* Arrows */}
      <div className="text-muted-foreground/50 flex flex-col items-center gap-1">
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </div>
    </motion.div>
  );
}

interface OutputVisualProps {
  output: string[];
}

function OutputVisual({ output }: OutputVisualProps) {
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

      <div className="min-h-[80px] font-mono text-sm">
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
