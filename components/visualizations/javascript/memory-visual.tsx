'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Layers, Box, Trash2, ArrowRight, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MemoryState, HeapObject, StackFrame, StackVariable } from '@/lib/types/memory.types';

interface MemoryVisualProps {
  state: MemoryState;
}

/**
 * Memory Management visualization component
 * Shows stack, heap, references, and garbage collection
 */
export function MemoryVisual({ state }: MemoryVisualProps) {
  const { stack, heap, gcPhase, consoleOutput, metrics, highlightedPath } = state;

  return (
    <div
      className="flex h-full flex-col gap-3 overflow-hidden p-4"
      aria-label="Memory management visualization"
    >
      {/* GC Phase Indicator */}
      {gcPhase !== 'idle' && (
        <div className="flex justify-center">
          <GCPhaseIndicator phase={gcPhase} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Stack Memory */}
        <div className="flex w-56 flex-col overflow-hidden rounded-xl border border-blue-500/30 bg-[#1e1e2e]">
          <div className="flex items-center gap-2 border-b border-blue-500/30 px-4 py-2">
            <Layers className="h-4 w-4 text-blue-400" aria-hidden="true" />
            <span className="text-xs font-medium text-blue-400">Stack Memory</span>
          </div>
          <div className="flex flex-1 flex-col-reverse gap-2 overflow-auto p-3">
            <AnimatePresence mode="sync">
              {stack.map((frame) => (
                <StackFrameCard key={frame.id} frame={frame} highlightedPath={highlightedPath} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* References Arrow Area */}
        <div className="flex w-16 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="h-6 w-6 text-white/30" aria-hidden="true" />
            <span className="text-[10px] text-white/30">refs</span>
          </div>
        </div>

        {/* Heap Memory */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-green-500/30 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 border-b border-green-500/30 px-4 py-2">
            <HardDrive className="h-4 w-4 text-green-400" aria-hidden="true" />
            <span className="text-xs font-medium text-green-400">Heap Memory</span>
            {metrics && (
              <span className="ml-auto text-[10px] text-white/40">
                {metrics.heapUsed}/{metrics.heapTotal} used
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-wrap content-start gap-3 overflow-auto p-4">
            <AnimatePresence mode="sync">
              {heap.map((obj) => (
                <HeapObjectCard
                  key={obj.id}
                  object={obj}
                  gcPhase={gcPhase}
                  highlightedPath={highlightedPath}
                />
              ))}
            </AnimatePresence>
            {heap.length === 0 && (
              <div className="flex flex-1 items-center justify-center text-xs text-white/30">
                Heap is empty
              </div>
            )}
          </div>
        </div>

        {/* Console & Metrics */}
        <div className="flex w-64 flex-col gap-3">
          {/* Metrics */}
          {metrics && (
            <div className="rounded-xl border border-white/10 bg-[#1e1e2e] p-3">
              <div className="mb-2 text-xs font-medium text-white/70">Memory Metrics</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Heap Used:</span>
                  <span className="font-mono text-green-400">{metrics.heapUsed}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(metrics.heapUsed / metrics.heapTotal) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Objects:</span>
                  <span className="font-mono text-blue-400">{metrics.objectCount}</span>
                </div>
                {metrics.collectedCount !== undefined && metrics.collectedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between text-xs"
                  >
                    <span className="text-white/50">Collected:</span>
                    <span className="font-mono text-amber-400">{metrics.collectedCount}</span>
                  </motion.div>
                )}
              </div>
            </div>
          )}

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
                      line.startsWith('>') && 'text-blue-400',
                      line.startsWith('⚠️') && 'text-amber-400',
                      line.startsWith('🔍') && 'text-purple-400',
                      line.startsWith('🧹') && 'text-cyan-400',
                      line.startsWith('🗑️') && 'text-red-400',
                      line.startsWith('📊') && 'text-green-400',
                      line.startsWith('✓') && 'text-green-400',
                      line.startsWith('❌') && 'text-red-400',
                      !line.startsWith('//') &&
                        !line.startsWith('>') &&
                        !line.startsWith('⚠️') &&
                        !line.startsWith('🔍') &&
                        !line.startsWith('🧹') &&
                        !line.startsWith('🗑️') &&
                        !line.startsWith('📊') &&
                        !line.startsWith('✓') &&
                        !line.startsWith('❌') &&
                        'text-white/70'
                    )}
                  >
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
 * GC Phase indicator
 */
function GCPhaseIndicator({ phase }: { phase: MemoryState['gcPhase'] }) {
  const config = {
    mark: { label: 'Mark Phase', color: 'bg-purple-500', icon: Check },
    sweep: { label: 'Sweep Phase', color: 'bg-cyan-500', icon: Trash2 },
    compact: { label: 'Compact Phase', color: 'bg-amber-500', icon: Box },
    idle: { label: 'Idle', color: 'bg-gray-500', icon: Box },
  };

  const current = config[phase];
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
 * Stack frame card
 */
function StackFrameCard({
  frame,
  highlightedPath,
}: {
  frame: StackFrame;
  highlightedPath?: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-lg border border-white/10 bg-white/5"
      style={{ borderColor: frame.color ? `${frame.color}40` : undefined }}
    >
      <div
        className="rounded-t-lg border-b border-white/10 px-3 py-1.5"
        style={{ backgroundColor: frame.color ? `${frame.color}20` : undefined }}
      >
        <span className="text-xs font-medium" style={{ color: frame.color }}>
          {frame.name}
        </span>
      </div>
      <div className="space-y-1 p-2">
        {frame.variables.map((variable) => (
          <StackVariableItem
            key={variable.id}
            variable={variable}
            isHighlighted={highlightedPath?.includes(variable.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Stack variable item
 */
function StackVariableItem({
  variable,
  isHighlighted,
}: {
  variable: StackVariable;
  isHighlighted?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 rounded px-2 py-1 text-xs',
        isHighlighted && 'bg-white/10 ring-1 ring-cyan-500'
      )}
      animate={isHighlighted ? { scale: [1, 1.02, 1] } : {}}
    >
      <span className="font-mono text-white/80">{variable.name}</span>
      <span className="text-white/30">→</span>
      {variable.pointsTo ? (
        <span className="truncate font-mono" style={{ color: variable.color || '#06B6D4' }}>
          [{variable.pointsTo}]
        </span>
      ) : (
        <span className="font-mono text-white/50">{variable.value || 'undefined'}</span>
      )}
    </motion.div>
  );
}

/**
 * Heap object card
 */
function HeapObjectCard({
  object,
  gcPhase,
  highlightedPath,
}: {
  object: HeapObject;
  gcPhase: MemoryState['gcPhase'];
  highlightedPath?: string[];
}) {
  const isHighlighted = highlightedPath?.includes(object.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: object.isCollected ? 0 : 1,
        scale: object.isCollected ? 0.5 : 1,
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative rounded-xl border p-3',
        object.isReachable === false && !object.isCollected && 'opacity-50',
        object.isMarked && gcPhase === 'mark' && 'ring-2 ring-green-500',
        object.isCollected && 'ring-2 ring-red-500',
        isHighlighted && 'ring-2 ring-cyan-500'
      )}
      style={{
        width: object.size + 60,
        borderColor: object.color,
        backgroundColor: `${object.color}10`,
      }}
    >
      {/* Status Badge */}
      {object.isMarked && gcPhase === 'mark' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 rounded-full bg-green-500 p-1"
        >
          <Check className="h-3 w-3 text-white" />
        </motion.div>
      )}
      {object.isCollected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1"
        >
          <X className="h-3 w-3 text-white" />
        </motion.div>
      )}
      {object.isReachable === false && !object.isMarked && !object.isCollected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 rounded-full bg-amber-500 p-1"
        >
          <Trash2 className="h-3 w-3 text-white" />
        </motion.div>
      )}

      {/* Object Info */}
      <div className="flex items-center gap-2">
        <Box className="h-4 w-4" style={{ color: object.color }} aria-hidden="true" />
        <span className="text-xs font-medium" style={{ color: object.color }}>
          {object.name}
        </span>
      </div>
      <div className="mt-1 text-[10px] text-white/50">
        {object.type} • {object.size} bytes
      </div>

      {/* References */}
      {object.references.length > 0 && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <div className="text-[10px] text-white/40">refs:</div>
          <div className="flex flex-wrap gap-1">
            {object.references.map((ref) => (
              <span
                key={ref}
                className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60"
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default MemoryVisual;
