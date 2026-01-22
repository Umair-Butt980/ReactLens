'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Clock,
  ListOrdered,
  Sparkles,
  CheckCircle,
  XCircle,
  Loader2,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  AsyncState,
  PromiseState,
  AsyncQueueItem,
  AsyncCallFrame,
} from '@/lib/types/async.types';

interface AsyncVisualProps {
  state: AsyncState;
}

/**
 * Async & Promises visualization component
 * Shows Promise states, queues, and how they interact with the Event Loop
 */
export function AsyncVisual({ state }: AsyncVisualProps) {
  const {
    callStack,
    webAPIs,
    taskQueue,
    microtaskQueue,
    promises,
    consoleOutput,
    currentPhase,
    highlightedPromiseId,
  } = state;

  return (
    <div
      className="flex h-full flex-col gap-3 overflow-hidden p-4"
      aria-label="Async & Promises visualization"
    >
      {/* Phase Indicator */}
      {currentPhase && (
        <div className="flex justify-center">
          <PhaseIndicator phase={currentPhase} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 gap-3 overflow-hidden">
        {/* Left Column - Call Stack & Queues */}
        <div className="flex w-64 flex-col gap-3">
          {/* Call Stack */}
          <div className="flex flex-col rounded-xl border border-white/10 bg-[#1e1e2e]">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <Layers className="h-4 w-4 text-purple-400" aria-hidden="true" />
              <span className="text-xs font-medium text-white/70">Call Stack</span>
            </div>
            <div className="flex min-h-[100px] flex-col-reverse gap-1 p-2">
              <AnimatePresence mode="sync">
                {callStack.map((frame, i) => (
                  <CallStackFrame key={frame.id} frame={frame} isTop={i === callStack.length - 1} />
                ))}
              </AnimatePresence>
              {callStack.length === 0 && (
                <div className="flex items-center justify-center py-4 text-xs text-white/30">
                  Empty
                </div>
              )}
            </div>
          </div>

          {/* Microtask Queue */}
          <div className="flex flex-col rounded-xl border border-amber-500/30 bg-[#1e1e2e]">
            <div className="flex items-center gap-2 border-b border-amber-500/30 px-3 py-2">
              <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span className="text-xs font-medium text-amber-400">Microtask Queue</span>
              <span className="ml-auto text-[10px] text-white/40">High Priority</span>
            </div>
            <div className="flex min-h-[60px] flex-col gap-1 p-2">
              <AnimatePresence mode="sync">
                {microtaskQueue.map((item) => (
                  <QueueItemCard key={item.id} item={item} variant="microtask" />
                ))}
              </AnimatePresence>
              {microtaskQueue.length === 0 && (
                <div className="flex items-center justify-center py-2 text-xs text-white/30">
                  Empty
                </div>
              )}
            </div>
          </div>

          {/* Task Queue */}
          <div className="flex flex-col rounded-xl border border-blue-500/30 bg-[#1e1e2e]">
            <div className="flex items-center gap-2 border-b border-blue-500/30 px-3 py-2">
              <ListOrdered className="h-4 w-4 text-blue-400" aria-hidden="true" />
              <span className="text-xs font-medium text-blue-400">Task Queue</span>
              <span className="ml-auto text-[10px] text-white/40">Macrotasks</span>
            </div>
            <div className="flex min-h-[60px] flex-col gap-1 p-2">
              <AnimatePresence mode="sync">
                {taskQueue.map((item) => (
                  <QueueItemCard key={item.id} item={item} variant="task" />
                ))}
              </AnimatePresence>
              {taskQueue.length === 0 && (
                <div className="flex items-center justify-center py-2 text-xs text-white/30">
                  Empty
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Web APIs */}
        <div className="flex w-48 flex-col rounded-xl border border-white/10 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <Clock className="h-4 w-4 text-orange-400" aria-hidden="true" />
            <span className="text-xs font-medium text-white/70">Web APIs</span>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-auto p-2">
            <AnimatePresence mode="sync">
              {webAPIs.map((api) => (
                <motion.div
                  key={api.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-lg border border-white/10 bg-white/5 p-2"
                >
                  <div className="mb-1 flex items-center gap-2">
                    {api.type === 'setTimeout' && (
                      <Clock className="h-3 w-3" style={{ color: api.color }} />
                    )}
                    {api.type === 'Promise' && (
                      <Zap className="h-3 w-3" style={{ color: api.color }} />
                    )}
                    <span className="text-xs font-medium" style={{ color: api.color }}>
                      {api.type}
                    </span>
                  </div>
                  <div className="text-xs text-white/60">{api.label}</div>
                  {api.remaining !== undefined && (
                    <div className="mt-1">
                      <div className="h-1 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: api.color }}
                          initial={{ width: '100%' }}
                          animate={{ width: `${(api.remaining / 1000) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40">{api.remaining}ms</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {webAPIs.length === 0 && (
              <div className="flex flex-1 items-center justify-center text-xs text-white/30">
                No pending APIs
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Promises & Console */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Promises */}
          <div className="flex flex-col rounded-xl border border-white/10 bg-[#1e1e2e]">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <Zap className="h-4 w-4 text-yellow-400" aria-hidden="true" />
              <span className="text-xs font-medium text-white/70">Promises</span>
            </div>
            <div className="flex flex-wrap gap-2 p-3">
              <AnimatePresence mode="sync">
                {promises.map((promise) => (
                  <PromiseCard
                    key={promise.id}
                    promise={promise}
                    isHighlighted={promise.id === highlightedPromiseId}
                  />
                ))}
              </AnimatePresence>
              {promises.length === 0 && (
                <div className="w-full py-4 text-center text-xs text-white/30">No promises</div>
              )}
            </div>
          </div>

          {/* Console Output */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d14]">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-2 text-xs text-white/50">Console</span>
            </div>
            <div className="flex-1 overflow-auto p-3">
              <AnimatePresence mode="sync">
                {consoleOutput.map((line, i) => (
                  <motion.div
                    key={`${line}-${i}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      'font-mono text-xs',
                      line.startsWith('//') && 'text-white/40 italic',
                      !line.startsWith('//') && 'text-white/80'
                    )}
                  >
                    {!line.startsWith('//') && <span className="mr-2 text-green-400">&gt;</span>}
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Phase indicator
 */
function PhaseIndicator({ phase }: { phase: NonNullable<AsyncState['currentPhase']> }) {
  const phases = {
    sync: { label: 'Synchronous Execution', color: 'bg-purple-500', icon: Layers },
    webapi: { label: 'Web API Processing', color: 'bg-orange-500', icon: Clock },
    microtask: { label: 'Microtask Queue', color: 'bg-amber-500', icon: Sparkles },
    macrotask: { label: 'Task Queue', color: 'bg-blue-500', icon: ListOrdered },
  };

  const current = phases[phase];
  const Icon = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center gap-2 rounded-full px-4 py-1.5', current.color)}
    >
      <Icon className="h-4 w-4 text-white" aria-hidden="true" />
      <span className="text-xs font-medium text-white">{current.label}</span>
    </motion.div>
  );
}

/**
 * Call stack frame
 */
function CallStackFrame({ frame, isTop }: { frame: AsyncCallFrame; isTop: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-2',
        isTop ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5'
      )}
      style={
        {
          borderColor: isTop ? frame.color : undefined,
          '--tw-ring-color': frame.color,
        } as React.CSSProperties
      }
    >
      {frame.isAsync && (
        <span className="rounded bg-green-500/20 px-1 text-[10px] font-medium text-green-400">
          async
        </span>
      )}
      <span className="truncate text-xs text-white/80">{frame.name}</span>
    </motion.div>
  );
}

/**
 * Queue item card
 */
function QueueItemCard({ item, variant }: { item: AsyncQueueItem; variant: 'task' | 'microtask' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: variant === 'microtask' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: variant === 'microtask' ? 20 : -20 }}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-2 py-1.5',
        variant === 'microtask' && 'border-amber-500/30 bg-amber-500/10',
        variant === 'task' && 'border-blue-500/30 bg-blue-500/10',
        item.isExecuting && 'ring-2 ring-green-500'
      )}
    >
      {item.type === 'promise' && <Zap className="h-3 w-3 text-yellow-400" aria-hidden="true" />}
      {item.type === 'callback' && <Layers className="h-3 w-3 text-blue-400" aria-hidden="true" />}
      <span className="truncate text-xs text-white/70">{item.label}</span>
    </motion.div>
  );
}

/**
 * Promise state card
 */
function PromiseCard({
  promise,
  isHighlighted,
}: {
  promise: PromiseState;
  isHighlighted: boolean;
}) {
  const statusConfig = {
    pending: { icon: Loader2, color: 'text-yellow-400', bg: 'bg-yellow-500/10', spin: true },
    fulfilled: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', spin: false },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', spin: false },
  };

  const config = statusConfig[promise.status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'flex flex-col gap-1 rounded-lg border px-3 py-2',
        config.bg,
        isHighlighted && 'ring-2 ring-white/50'
      )}
      style={{ borderColor: promise.color || '#ffffff20' }}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={cn('h-4 w-4', config.color, config.spin && 'animate-spin')}
          aria-hidden="true"
        />
        <span className="text-xs font-medium text-white/80">{promise.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={cn('text-[10px] font-medium uppercase', config.color)}>
          {promise.status}
        </span>
        {promise.value !== undefined && (
          <span className="text-[10px] text-white/50">: {String(promise.value)}</span>
        )}
        {promise.error && <span className="text-[10px] text-red-400">: {promise.error}</span>}
      </div>
    </motion.div>
  );
}

export default AsyncVisual;
