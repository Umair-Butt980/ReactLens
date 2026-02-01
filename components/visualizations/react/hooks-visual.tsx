'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2,
  Box,
  Zap,
  RefreshCw,
  Clock,
  CheckCircle,
  Circle,
  ArrowRight,
  Database,
  Play,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  HooksState,
  HookInstance,
  FiberNodeSimple,
  HookCall,
  EffectTimelineItem,
  HookRenderPhase,
  HooksOutput,
  HookType,
  DependencyValue,
} from '@/lib/types';

interface HooksVisualProps {
  state: HooksState;
  className?: string;
}

export function HooksVisual({ state, className }: HooksVisualProps) {
  const {
    fiberNode,
    hookCalls,
    currentHookIndex,
    renderPhase,
    effectTimeline,
    output,
    activePanel,
    showDepsComparison,
  } = state;

  // Safe render with error handling
  const renderContent = () => {
    try {
      return (
        <div
          className={cn('grid h-full gap-4 lg:grid-cols-2', className)}
          aria-label="react hooks visualization"
        >
          {/* Left Column: Fiber Node & Hooks List */}
          <div className="flex flex-col gap-4">
            {/* Fiber Node Panel */}
            <div
              className={cn(
                'rounded-xl border p-4 transition-all duration-300',
                activePanel === 'fiber'
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="fiber node panel"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-purple-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Fiber Node</h3>
                </div>
                <RenderPhaseIndicator phase={renderPhase} />
              </div>

              <FiberNodeView node={fiberNode} currentHookIndex={currentHookIndex} />
            </div>

            {/* Hooks Linked List */}
            <div
              className={cn(
                'flex-1 rounded-xl border p-4 transition-all duration-300',
                activePanel === 'hooks'
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="hooks list panel"
            >
              <div className="mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <h3 className="text-foreground text-sm font-semibold">Hooks (memoizedState)</h3>
              </div>

              <div className="min-h-[200px]">
                {fiberNode.memoizedState.length > 0 ? (
                  <HooksListView
                    hooks={fiberNode.memoizedState}
                    currentIndex={currentHookIndex}
                    showDepsComparison={showDepsComparison}
                  />
                ) : (
                  <EmptyState message="Hooks will appear here as they're called" />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Call Order, Effects, Output */}
          <div className="flex flex-col gap-4">
            {/* Hook Call Order */}
            {hookCalls.length > 0 && (
              <div
                className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"
                aria-label="hook call order"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Call Order</h3>
                </div>

                <div className="space-y-2">
                  {hookCalls.map((call) => (
                    <HookCallItem key={call.id} call={call} />
                  ))}
                </div>
              </div>
            )}

            {/* Effect Timeline */}
            {effectTimeline.length > 0 && (
              <div
                className={cn(
                  'rounded-xl border p-4 transition-all duration-300',
                  activePanel === 'effects'
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-border/30 bg-card/30'
                )}
                aria-label="effect timeline"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Effect Timeline</h3>
                </div>

                <EffectTimelineView timeline={effectTimeline} />
              </div>
            )}

            {/* Console Output */}
            <div
              className="flex-1 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4"
              aria-label="output console"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
                </div>
                <span className="text-muted-foreground text-xs font-medium">Hooks Log</span>
              </div>

              <div className="min-h-[80px] space-y-1 font-mono text-xs">
                <AnimatePresence mode="popLayout">
                  {output.map((msg) => (
                    <OutputMessage key={msg.id} message={msg} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('HooksVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Fiber Node visualization
function FiberNodeView({
  node,
  currentHookIndex,
}: {
  node: FiberNodeSimple;
  currentHookIndex: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-lg border-2 p-3 transition-all',
        node.isHighlighted ? 'border-purple-500 bg-purple-500/20' : 'border-border/50 bg-card/50',
        node.isRendering && 'animate-pulse'
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-purple-300">
          {node.componentName}
        </span>
        <span className="text-muted-foreground text-xs">Render #{node.renderCount}</span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">memoizedState:</span>
          <span className="text-cyan-400">[{node.memoizedState.length} hooks]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">updateQueue:</span>
          <span className="text-emerald-400">[{node.updateQueue.length} effects]</span>
        </div>
        {currentHookIndex >= 0 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">currentHook:</span>
            <span className="text-amber-400">#{currentHookIndex}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Hooks linked list visualization
function HooksListView({
  hooks,
  currentIndex,
  showDepsComparison,
}: {
  hooks: HookInstance[];
  currentIndex: number;
  showDepsComparison: boolean;
}) {
  return (
    <div className="space-y-2">
      {hooks.map((hook, index) => (
        <div key={hook.id} className="flex items-center gap-2">
          <HookItem hook={hook} isCurrent={index === currentIndex} showDeps={showDepsComparison} />
          {index < hooks.length - 1 && (
            <ArrowRight
              className="text-muted-foreground/50 h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Individual hook item
function HookItem({
  hook,
  isCurrent,
  showDeps,
}: {
  hook: HookInstance;
  isCurrent: boolean;
  showDeps: boolean;
}) {
  const hookColors: Record<HookType, string> = {
    useState: 'border-blue-500 bg-blue-500/10',
    useEffect: 'border-emerald-500 bg-emerald-500/10',
    useRef: 'border-amber-500 bg-amber-500/10',
    useMemo: 'border-pink-500 bg-pink-500/10',
    useCallback: 'border-purple-500 bg-purple-500/10',
    useContext: 'border-cyan-500 bg-cyan-500/10',
  };

  const hookTextColors: Record<HookType, string> = {
    useState: 'text-blue-400',
    useEffect: 'text-emerald-400',
    useRef: 'text-amber-400',
    useMemo: 'text-pink-400',
    useCallback: 'text-purple-400',
    useContext: 'text-cyan-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex-1 rounded-lg border p-2 transition-all',
        hookColors[hook.type],
        hook.isHighlighted && 'ring-offset-background ring-2 ring-offset-1',
        hook.isExecuting && 'animate-pulse',
        isCurrent && 'ring-2 ring-white/50'
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground font-mono text-xs">#{hook.index}</span>
          <span className={cn('text-xs font-semibold', hookTextColors[hook.type])}>
            {hook.type}
          </span>
        </div>
        {hook.isExecuting && <Play className="h-3 w-3 text-emerald-400" aria-hidden="true" />}
      </div>

      <div className="font-mono text-xs">
        <span className="text-foreground">{hook.name}</span>
        <span className="text-muted-foreground"> = </span>
        <span
          className={cn(
            hook.type === 'useState'
              ? 'text-blue-300'
              : hook.type === 'useRef'
                ? 'text-amber-300'
                : 'text-foreground/70'
          )}
        >
          {hook.value}
        </span>
      </div>

      {/* Dependencies */}
      {showDeps && hook.dependencies && hook.dependencies.length > 0 && (
        <div className="border-border/30 mt-2 border-t pt-2">
          <span className="text-muted-foreground text-xs">deps: </span>
          <div className="mt-1 flex flex-wrap gap-1">
            {hook.dependencies.map((dep) => (
              <DependencyBadge key={dep.id} dep={dep} />
            ))}
          </div>
        </div>
      )}

      {/* Effect phase */}
      {hook.type === 'useEffect' && hook.effectPhase && (
        <div className="mt-1">
          <EffectPhaseBadge phase={hook.effectPhase} />
        </div>
      )}

      {/* Cached indicator */}
      {(hook.type === 'useMemo' || hook.type === 'useCallback') && hook.isCached && (
        <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
          <CheckCircle className="h-3 w-3" aria-hidden="true" />
          <span>cached</span>
        </div>
      )}
    </motion.div>
  );
}

// Dependency badge
function DependencyBadge({ dep }: { dep: DependencyValue }) {
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 font-mono text-xs',
        dep.hasChanged
          ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {dep.name}
      {dep.hasChanged && ' ✓'}
    </span>
  );
}

// Effect phase badge
function EffectPhaseBadge({ phase }: { phase: string }) {
  const phaseStyles: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    cleanup: 'bg-red-500/20 text-red-300',
    running: 'bg-emerald-500/20 text-emerald-300',
    complete: 'bg-green-500/20 text-green-300',
    skipped: 'bg-gray-500/20 text-gray-300',
  };

  return (
    <span
      className={cn('rounded px-1.5 py-0.5 text-xs', phaseStyles[phase] || phaseStyles.pending)}
    >
      {phase}
    </span>
  );
}

// Hook call item
function HookCallItem({ call }: { call: HookCall }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all',
        call.isCurrentCall
          ? 'bg-amber-500/20 ring-1 ring-amber-500'
          : call.isComplete
            ? 'bg-card/50'
            : 'bg-muted/30'
      )}
    >
      <span className="text-muted-foreground font-mono">#{call.index}</span>
      <span className="text-foreground font-medium">{call.type}</span>
      <span className="text-muted-foreground">({call.name})</span>
      {call.isComplete && (
        <>
          <ArrowRight className="text-muted-foreground h-3 w-3" aria-hidden="true" />
          <span className="text-emerald-400">{call.result}</span>
        </>
      )}
      {call.isCurrentCall && (
        <RefreshCw className="h-3 w-3 animate-spin text-amber-400" aria-hidden="true" />
      )}
    </motion.div>
  );
}

// Effect timeline view
function EffectTimelineView({ timeline }: { timeline: EffectTimelineItem[] }) {
  return (
    <div className="space-y-2">
      {timeline.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-xs',
            item.isActive ? 'bg-emerald-500/20' : 'bg-card/50'
          )}
        >
          <Circle
            className={cn(
              'h-3 w-3',
              item.isActive ? 'fill-emerald-400 text-emerald-400' : 'text-muted-foreground'
            )}
            aria-hidden="true"
          />
          <span className="text-foreground font-medium">{item.hookName}</span>
          <EffectPhaseBadge phase={item.phase} />
          {item.dependencies.length > 0 && (
            <span className="text-muted-foreground">deps: [{item.dependencies.join(', ')}]</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Render phase indicator
function RenderPhaseIndicator({ phase }: { phase: HookRenderPhase }) {
  const phaseLabels: Record<HookRenderPhase, string> = {
    idle: 'Idle',
    'render-start': 'Render Starting',
    'hooks-executing': 'Executing Hooks',
    'render-complete': 'Render Complete',
    'effects-cleanup': 'Cleanup Phase',
    'effects-running': 'Effects Running',
    complete: 'Complete',
  };

  const phaseColors: Record<HookRenderPhase, string> = {
    idle: 'text-muted-foreground',
    'render-start': 'text-amber-400',
    'hooks-executing': 'text-cyan-400',
    'render-complete': 'text-blue-400',
    'effects-cleanup': 'text-red-400',
    'effects-running': 'text-emerald-400',
    complete: 'text-green-400',
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={cn(
          'h-2 w-2 rounded-full',
          phase === 'idle' ? 'bg-muted-foreground/50' : 'bg-emerald-400'
        )}
        animate={phase !== 'idle' && phase !== 'complete' ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
        aria-hidden="true"
      />
      <span className={cn('text-xs font-medium', phaseColors[phase])}>{phaseLabels[phase]}</span>
    </div>
  );
}

// Output message
function OutputMessage({ message }: { message: HooksOutput }) {
  const icons: Record<string, string> = {
    info: 'ℹ',
    hook: '🪝',
    effect: '⚡',
    cleanup: '🧹',
    warning: '⚠',
    error: '❌',
  };

  const colors: Record<string, string> = {
    info: 'text-cyan-400',
    hook: 'text-blue-400',
    effect: 'text-emerald-400',
    cleanup: 'text-red-400',
    warning: 'text-amber-400',
    error: 'text-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2"
    >
      <span className={cn('select-none', colors[message.type])}>{icons[message.type]}</span>
      <span className="text-foreground/80">{message.message}</span>
    </motion.div>
  );
}

// Empty state
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[100px] items-center justify-center">
      <p className="text-muted-foreground/50 text-sm italic">{message}</p>
    </div>
  );
}

export default HooksVisual;
