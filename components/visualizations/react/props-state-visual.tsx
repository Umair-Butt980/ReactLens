'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  Box,
  RefreshCw,
  Database,
  Zap,
  ChevronRight,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  PropsStateState,
  ComponentNode,
  PropValue,
  StateValue,
  DataFlow,
  RenderPhase,
  RenderEvent,
  PropsStateOutput,
} from '@/lib/types';

interface PropsStateVisualProps {
  state: PropsStateState;
  className?: string;
}

export function PropsStateVisual({ state, className }: PropsStateVisualProps) {
  const { componentTree, dataFlows, renderPhase, renderEvents, output, showDataFlow, activeView } =
    state;

  // Safely render with error handling
  const renderContent = () => {
    try {
      return (
        <div
          className={cn(
            'grid h-full gap-4',
            activeView === 'both' ? 'lg:grid-cols-[1.2fr_1fr]' : '',
            className
          )}
          aria-label="props and state visualization"
        >
          {/* Left: Component Tree */}
          <div className="flex flex-col gap-4">
            {/* Component Tree Panel */}
            <div
              className="flex-1 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4"
              aria-label="component tree panel"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Component Tree</h3>
                </div>
                <RenderPhaseIndicator phase={renderPhase} />
              </div>

              <div className="min-h-[300px]">
                {componentTree ? (
                  <ComponentTreeView
                    node={componentTree}
                    dataFlows={dataFlows}
                    showDataFlow={showDataFlow}
                  />
                ) : (
                  <EmptyState message="Component tree will appear here" />
                )}
              </div>
            </div>

            {/* Console Output */}
            <div
              className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4"
              aria-label="output console"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
                </div>
                <span className="text-muted-foreground text-xs font-medium">Data Flow Log</span>
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

          {/* Right: Render Timeline & Data Flow */}
          {activeView === 'both' && (
            <div className="flex flex-col gap-4">
              {/* Render Timeline */}
              <div
                className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4"
                aria-label="render timeline"
              >
                <div className="mb-3 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-purple-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Render Cycle</h3>
                </div>

                <RenderTimeline phase={renderPhase} events={renderEvents} />
              </div>

              {/* Data Flow Legend */}
              <div
                className="border-border/30 bg-card/30 rounded-xl border p-4"
                aria-label="data flow legend"
              >
                <h4 className="text-foreground mb-3 text-sm font-semibold">Data Flow</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <span className="text-muted-foreground">Props flow DOWN (parent → child)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-amber-400" aria-hidden="true" />
                    <span className="text-muted-foreground">
                      Callbacks flow UP (child → parent)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <span className="text-muted-foreground">State lives in component</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-pink-400" aria-hidden="true" />
                    <span className="text-muted-foreground">State change triggers re-render</span>
                  </div>
                </div>
              </div>

              {/* Active Data Flows */}
              {showDataFlow && dataFlows.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4"
                  aria-label="active data flows"
                >
                  <h4 className="text-foreground mb-3 text-sm font-semibold">Active Flows</h4>
                  <div className="space-y-2">
                    {dataFlows
                      .filter((f) => f.isActive)
                      .map((flow) => (
                        <DataFlowItem key={flow.id} flow={flow} />
                      ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.error('PropsStateVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Component Tree visualization
interface ComponentTreeViewProps {
  node: ComponentNode;
  dataFlows: DataFlow[];
  showDataFlow: boolean;
  depth?: number;
}

function ComponentTreeView({ node, dataFlows, showDataFlow, depth = 0 }: ComponentTreeViewProps) {
  const isParent = node.type === 'parent';
  const hasState = node.state.length > 0;

  // Get flows related to this component
  const outgoingFlows = dataFlows.filter((f) => f.from === node.id && f.isActive);
  const incomingFlows = dataFlows.filter((f) => f.to === node.id && f.isActive);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth * 0.1 }}
      className={cn('relative', depth > 0 && 'mt-3 ml-6')}
    >
      {/* Connection line */}
      {depth > 0 && (
        <div className="absolute top-0 -left-3 h-full w-px bg-gradient-to-b from-cyan-500/50 to-transparent" />
      )}

      {/* Component Card */}
      <div
        className={cn(
          'rounded-xl border-2 p-3 transition-all duration-300',
          node.isHighlighted && 'ring-offset-background ring-2 ring-offset-2',
          node.isRendering && 'animate-pulse',
          isParent ? 'border-purple-500/50 bg-purple-500/10' : 'border-cyan-500/50 bg-cyan-500/10',
          node.isHighlighted && (isParent ? 'ring-purple-500' : 'ring-cyan-500')
        )}
        aria-label={`${node.name} component`}
      >
        {/* Component Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-semibold',
                isParent ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
              )}
            >
              {node.name}
            </span>
            {node.isRendering && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs text-emerald-400"
              >
                rendering...
              </motion.span>
            )}
          </div>
          <span className="text-muted-foreground text-xs">Render #{node.renderCount}</span>
        </div>

        {/* State Section */}
        {hasState && (
          <div className="mb-2">
            <div className="mb-1 flex items-center gap-1 text-xs text-emerald-400">
              <Database className="h-3 w-3" aria-hidden="true" />
              <span>State</span>
            </div>
            <div className="space-y-1">
              {node.state.map((s) => (
                <StateValueItem key={s.id} state={s} />
              ))}
            </div>
          </div>
        )}

        {/* Props Section */}
        {node.props.length > 0 && (
          <div>
            <div className="mb-1 flex items-center gap-1 text-xs text-pink-400">
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span>Props</span>
            </div>
            <div className="space-y-1">
              {node.props.map((p) => (
                <PropValueItem key={p.id} prop={p} />
              ))}
            </div>
          </div>
        )}

        {/* Outgoing flow indicators */}
        {showDataFlow && outgoingFlows.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 flex items-center gap-1"
          >
            <ArrowDown className="h-3 w-3 text-cyan-400" aria-hidden="true" />
            <span className="text-xs text-cyan-400">
              Passing: {outgoingFlows.map((f) => f.propName).join(', ')}
            </span>
          </motion.div>
        )}
      </div>

      {/* Children */}
      {node.children.length > 0 && (
        <div className="relative">
          {node.children.map((child) => (
            <ComponentTreeView
              key={child.id}
              node={child}
              dataFlows={dataFlows}
              showDataFlow={showDataFlow}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// State value display
function StateValueItem({ state }: { state: StateValue }) {
  return (
    <motion.div
      className={cn(
        'flex items-center justify-between rounded px-2 py-1 text-xs',
        state.isHighlighted && 'bg-emerald-500/20 ring-1 ring-emerald-500',
        state.isChanged && 'bg-amber-500/20'
      )}
      animate={state.isChanged ? { scale: [1, 1.02, 1] } : {}}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium text-emerald-400">{state.name}</span>
        {state.updateFunction && (
          <span className="text-muted-foreground/50">({state.updateFunction})</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {state.previousValue && state.isChanged && (
          <>
            <span className="text-muted-foreground line-through">{state.previousValue}</span>
            <span className="text-muted-foreground">→</span>
          </>
        )}
        <span className={cn('font-mono', state.isChanged ? 'text-amber-300' : 'text-foreground')}>
          {state.value}
        </span>
      </div>
    </motion.div>
  );
}

// Prop value display
function PropValueItem({ prop }: { prop: PropValue }) {
  return (
    <motion.div
      className={cn(
        'flex items-center justify-between rounded px-2 py-1 text-xs',
        prop.isHighlighted && 'bg-pink-500/20 ring-1 ring-pink-500',
        prop.isChanged && 'bg-amber-500/20'
      )}
      animate={prop.isChanged ? { scale: [1, 1.02, 1] } : {}}
    >
      <span className="font-medium text-pink-400">{prop.name}</span>
      <span className={cn('font-mono', prop.isChanged ? 'text-amber-300' : 'text-foreground/70')}>
        {prop.value}
      </span>
    </motion.div>
  );
}

// Data flow item
function DataFlowItem({ flow }: { flow: DataFlow }) {
  const isCallback = flow.direction === 'callback';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-xs"
    >
      {isCallback ? (
        <ArrowUp className="h-4 w-4 text-amber-400" aria-hidden="true" />
      ) : (
        <ArrowDown className="h-4 w-4 text-cyan-400" aria-hidden="true" />
      )}
      <span className="text-muted-foreground">
        {flow.from} → {flow.to}:
      </span>
      <span className={cn('font-mono', isCallback ? 'text-amber-300' : 'text-cyan-300')}>
        {flow.propName}={flow.value}
      </span>
    </motion.div>
  );
}

// Render phase indicator
function RenderPhaseIndicator({ phase }: { phase: RenderPhase }) {
  const phaseColors: Record<RenderPhase, string> = {
    idle: 'text-muted-foreground',
    'state-update': 'text-amber-400',
    'schedule-render': 'text-purple-400',
    'render-parent': 'text-pink-400',
    'props-passed': 'text-cyan-400',
    'render-children': 'text-blue-400',
    commit: 'text-emerald-400',
    complete: 'text-green-400',
  };

  const phaseLabels: Record<RenderPhase, string> = {
    idle: 'Idle',
    'state-update': 'State Update',
    'schedule-render': 'Scheduling',
    'render-parent': 'Rendering Parent',
    'props-passed': 'Props Passed',
    'render-children': 'Rendering Children',
    commit: 'Committing',
    complete: 'Complete',
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={cn('h-2 w-2 rounded-full', phase !== 'idle' && 'animate-pulse')}
        style={{ backgroundColor: phase === 'idle' ? 'rgb(100, 100, 100)' : 'rgb(34, 197, 94)' }}
        aria-hidden="true"
      />
      <span className={cn('text-xs font-medium', phaseColors[phase])}>{phaseLabels[phase]}</span>
    </div>
  );
}

// Render timeline component
function RenderTimeline({ phase, events }: { phase: RenderPhase; events: RenderEvent[] }) {
  const phases: RenderPhase[] = [
    'idle',
    'state-update',
    'schedule-render',
    'render-parent',
    'props-passed',
    'render-children',
    'commit',
    'complete',
  ];

  const currentIndex = phases.indexOf(phase);

  return (
    <div className="space-y-3">
      {/* Phase Progress */}
      <div className="flex items-center gap-1">
        {phases.slice(1).map((p, index) => {
          const isActive = index < currentIndex;
          const isCurrent = index === currentIndex - 1;

          return (
            <div key={p} className="flex items-center">
              <motion.div
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  isActive ? 'bg-emerald-400' : 'bg-muted-foreground/30',
                  isCurrent && 'ring-offset-background ring-2 ring-emerald-400/50 ring-offset-1'
                )}
                animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: isCurrent ? Infinity : 0, duration: 1 }}
              />
              {index < phases.length - 2 && (
                <div
                  className={cn(
                    'h-0.5 w-4',
                    isActive ? 'bg-emerald-400/50' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Events */}
      {events.length > 0 && (
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">Recent:</span>
          {events.slice(-3).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-xs"
            >
              <Circle className="h-2 w-2 fill-current text-purple-400" aria-hidden="true" />
              <span className="text-foreground">{event.componentName}</span>
              <span className="text-muted-foreground">({event.reason})</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Output message component
function OutputMessage({ message }: { message: PropsStateOutput }) {
  const icons: Record<string, string> = {
    info: 'ℹ',
    state: '📦',
    render: '🔄',
    prop: '→',
    warning: '⚠',
  };

  const colors: Record<string, string> = {
    info: 'text-cyan-400',
    state: 'text-emerald-400',
    render: 'text-purple-400',
    prop: 'text-pink-400',
    warning: 'text-amber-400',
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

// Empty state component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[100px] items-center justify-center">
      <p className="text-muted-foreground/50 text-sm italic">{message}</p>
    </div>
  );
}

export default PropsStateVisual;
