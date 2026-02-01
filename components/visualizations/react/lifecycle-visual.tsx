'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Play, 
  Square, 
  Circle,
  ArrowRight,
  Zap,
  Trash2,
  CheckCircle,
  Clock,
  Box,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  LifecycleState,
  ComponentInstance,
  LifecycleEvent,
  LifecycleEffect,
  LifecycleStateValue,
  DOMNodeSimple,
  LifecycleOutput,
  LifecyclePhaseName,
} from '@/lib/types';

interface LifecycleVisualProps {
  state: LifecycleState;
  className?: string;
}

export function LifecycleVisual({ state, className }: LifecycleVisualProps) {
  const {
    component,
    timeline,
    dom,
    activePhaseSegment,
    output,
    showDiagram,
    activePanel,
  } = state;

  const renderContent = () => {
    try {
      return (
        <div
          className={cn('grid h-full gap-4 lg:grid-cols-2', className)}
          aria-label="component lifecycle visualization"
        >
          {/* Left Column: Diagram & Component */}
          <div className="flex flex-col gap-4">
            {/* Lifecycle Diagram */}
            {showDiagram && (
              <div
                className={cn(
                  'rounded-xl border p-4 transition-all duration-300',
                  activePanel === 'diagram'
                    ? 'border-pink-500/50 bg-pink-500/10'
                    : 'border-border/30 bg-card/30'
                )}
                aria-label="lifecycle diagram"
              >
                <div className="mb-3 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-pink-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Lifecycle Phases</h3>
                </div>
                <LifecycleDiagram activePhase={activePhaseSegment} progress={component.phase.progress} />
              </div>
            )}

            {/* Component Instance */}
            <div
              className={cn(
                'flex-1 rounded-xl border p-4 transition-all duration-300',
                activePanel === 'component'
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="component instance"
            >
              <div className="mb-3 flex items-center gap-2">
                <Box className="h-4 w-4 text-purple-400" aria-hidden="true" />
                <h3 className="text-foreground text-sm font-semibold">Component Instance</h3>
              </div>
              <ComponentInstanceView component={component} />
            </div>
          </div>

          {/* Right Column: Timeline, DOM, Output */}
          <div className="flex flex-col gap-4">
            {/* Timeline */}
            <div
              className={cn(
                'rounded-xl border p-4 transition-all duration-300',
                activePanel === 'timeline'
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="lifecycle timeline"
            >
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <h3 className="text-foreground text-sm font-semibold">Timeline</h3>
              </div>
              <TimelineView events={timeline} />
            </div>

            {/* DOM State */}
            {dom.length > 0 && (
              <div
                className={cn(
                  'rounded-xl border p-4 transition-all duration-300',
                  activePanel === 'dom'
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-border/30 bg-card/30'
                )}
                aria-label="dom state"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">DOM</h3>
                </div>
                <DOMView nodes={dom} />
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
                <span className="text-muted-foreground text-xs font-medium">Lifecycle Log</span>
              </div>
              <div className="min-h-[60px] space-y-1 font-mono text-xs">
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
      console.error('LifecycleVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Lifecycle diagram showing the three phases
function LifecycleDiagram({ activePhase, progress }: { activePhase: LifecyclePhaseName; progress: number }) {
  const phases: { name: LifecyclePhaseName; label: string; color: string; icon: React.ReactNode }[] = [
    { name: 'mount', label: 'Mount', color: '#22C55E', icon: <Play className="h-4 w-4" /> },
    { name: 'update', label: 'Update', color: '#F59E0B', icon: <RefreshCw className="h-4 w-4" /> },
    { name: 'unmount', label: 'Unmount', color: '#EF4444', icon: <Square className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {phases.map((phase, index) => {
        const isActive = phase.name === activePhase;
        return (
          <div key={phase.name} className="flex items-center">
            <motion.div
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl p-4 transition-all',
                isActive ? 'ring-2 ring-offset-2 ring-offset-background' : 'opacity-50'
              )}
              style={{
                backgroundColor: isActive ? `${phase.color}20` : 'transparent',
                borderColor: phase.color,
                '--tw-ring-color': phase.color,
              } as React.CSSProperties}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
            >
              <div
                className="rounded-full p-2"
                style={{ backgroundColor: `${phase.color}30`, color: phase.color }}
              >
                {phase.icon}
              </div>
              <span className="text-xs font-semibold" style={{ color: phase.color }}>
                {phase.label}
              </span>
              {isActive && (
                <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: phase.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </motion.div>
            {index < phases.length - 1 && (
              <ArrowRight className="mx-2 h-5 w-5 text-muted-foreground/50" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Component instance visualization
function ComponentInstanceView({ component }: { component: ComponentInstance }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-lg border-2 p-3 transition-all',
        component.isHighlighted ? 'border-purple-500 bg-purple-500/20' : 'border-border/50 bg-card/50',
        !component.isMounted && 'opacity-50'
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-purple-300">
          {component.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Render #{component.renderCount}
          </span>
          {component.isMounted ? (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
              Mounted
            </span>
          ) : (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
              Unmounted
            </span>
          )}
        </div>
      </div>

      {/* Current Phase */}
      <div className="mb-3 rounded bg-pink-500/10 px-2 py-1">
        <span className="text-xs text-pink-400">
          Phase: {component.phase.name} / {component.phase.stage}
        </span>
      </div>

      {/* State */}
      {component.state.length > 0 && (
        <div className="mb-2">
          <span className="text-xs font-medium text-emerald-400">State:</span>
          <div className="mt-1 space-y-1">
            {component.state.map((s) => (
              <StateItem key={s.id} state={s} />
            ))}
          </div>
        </div>
      )}

      {/* Props */}
      {component.props.length > 0 && (
        <div className="mb-2">
          <span className="text-xs font-medium text-cyan-400">Props:</span>
          <div className="mt-1 space-y-1">
            {component.props.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <span className="text-cyan-300">{p.name}</span>
                <span className="font-mono text-foreground/70">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Effects */}
      {component.effects.length > 0 && (
        <div>
          <span className="text-xs font-medium text-amber-400">Effects:</span>
          <div className="mt-1 space-y-1">
            {component.effects.map((effect) => (
              <EffectItem key={effect.id} effect={effect} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// State item
function StateItem({ state }: { state: LifecycleStateValue }) {
  return (
    <motion.div
      className={cn(
        'flex items-center justify-between rounded px-2 py-1 text-xs',
        state.hasChanged && 'bg-amber-500/20'
      )}
      animate={state.hasChanged ? { scale: [1, 1.02, 1] } : {}}
    >
      <span className="text-emerald-300">{state.name}</span>
      <div className="flex items-center gap-1">
        {state.previousValue && state.hasChanged && (
          <>
            <span className="text-muted-foreground line-through">{state.previousValue}</span>
            <span className="text-muted-foreground">→</span>
          </>
        )}
        <span className={cn('font-mono', state.hasChanged ? 'text-amber-300' : 'text-foreground/70')}>
          {state.value}
        </span>
      </div>
    </motion.div>
  );
}

// Effect item
function EffectItem({ effect }: { effect: LifecycleEffect }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    running: 'bg-blue-500/20 text-blue-300',
    complete: 'bg-emerald-500/20 text-emerald-300',
    cleanup: 'bg-red-500/20 text-red-300',
  };

  return (
    <div className="flex items-center justify-between rounded bg-card/50 px-2 py-1 text-xs">
      <span className="text-amber-300">{effect.name}</span>
      <div className="flex items-center gap-2">
        <span className={cn('rounded px-1.5 py-0.5', statusColors[effect.status])}>
          {effect.status}
        </span>
        <span className="text-muted-foreground">×{effect.runCount}</span>
      </div>
    </div>
  );
}

// Timeline visualization
function TimelineView({ events }: { events: LifecycleEvent[] }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground/50 text-xs italic">No events yet</p>;
  }

  const categoryColors: Record<string, string> = {
    render: 'bg-purple-500',
    commit: 'bg-emerald-500',
    effect: 'bg-blue-500',
    cleanup: 'bg-red-500',
  };

  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-xs',
            event.isActive ? 'bg-cyan-500/20 ring-1 ring-cyan-500' : 'bg-card/50'
          )}
        >
          <div
            className={cn('h-2 w-2 rounded-full', categoryColors[event.category])}
            aria-hidden="true"
          />
          <span className="text-muted-foreground">{event.phase}</span>
          <span className="text-foreground">{event.description}</span>
          {event.isActive && (
            <Circle className="h-3 w-3 animate-pulse fill-current text-cyan-400 ml-auto" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// DOM visualization
function DOMView({ nodes }: { nodes: DOMNodeSimple[] }) {
  return (
    <div className="space-y-2 font-mono text-xs">
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'rounded-lg border px-3 py-2',
            node.isNew && 'border-emerald-500 bg-emerald-500/10',
            node.isUpdated && 'border-amber-500 bg-amber-500/10',
            node.isRemoved && 'border-red-500 bg-red-500/10 opacity-50'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn(
              node.isNew ? 'text-emerald-400' :
              node.isUpdated ? 'text-amber-400' :
              node.isRemoved ? 'text-red-400' :
              'text-foreground'
            )}>
              &lt;{node.tagName}&gt;
            </span>
            {node.isNew && <span className="text-emerald-400 text-[10px]">NEW</span>}
            {node.isUpdated && <span className="text-amber-400 text-[10px]">UPDATED</span>}
            {node.isRemoved && <span className="text-red-400 text-[10px]">REMOVED</span>}
          </div>
          {node.content && (
            <p className="mt-1 text-muted-foreground">{node.content}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Output message
function OutputMessage({ message }: { message: LifecycleOutput }) {
  const icons: Record<string, string> = {
    info: 'ℹ',
    render: '🔄',
    effect: '⚡',
    cleanup: '🧹',
    commit: '✓',
    warning: '⚠',
  };

  const colors: Record<string, string> = {
    info: 'text-cyan-400',
    render: 'text-purple-400',
    effect: 'text-blue-400',
    cleanup: 'text-red-400',
    commit: 'text-emerald-400',
    warning: 'text-amber-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2"
    >
      <span className={cn('select-none', colors[message.type])}>
        {icons[message.type]}
      </span>
      <span className="text-foreground/80">{message.message}</span>
    </motion.div>
  );
}

export default LifecycleVisual;
