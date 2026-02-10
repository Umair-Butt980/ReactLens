'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Monitor,
  ArrowRight,
  Check,
  X,
  Zap,
  ShieldCheck,
  Circle,
  Layout,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ServerClientState,
  ComponentNode,
  DataFlowArrow,
  RenderTimelineEntry,
  ComponentCapability,
} from '@/lib/types';

interface ServerClientComponentsVisualProps {
  state: ServerClientState;
  className?: string;
}

export function ServerClientComponentsVisual({
  state,
  className,
}: ServerClientComponentsVisualProps) {
  const { components, dataFlows, boundary, renderTimeline, currentPhase, annotation, activePanel } =
    state;

  const renderContent = () => {
    try {
      return (
        <div
          className={cn('flex h-full flex-col gap-4', className)}
          aria-label="server client components visualization"
        >
          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            {/* Left Column: Component Tree */}
            <div
              className={cn(
                'rounded-xl border p-4 transition-all duration-300',
                activePanel === 'tree'
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="component tree panel"
            >
              <div className="mb-3 flex items-center gap-2">
                <Layout className="h-4 w-4 text-purple-400" aria-hidden="true" />
                <h3 className="text-foreground text-sm font-semibold">Component Tree</h3>
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {components.map((comp) => (
                    <ComponentNodeItem key={comp.id} component={comp} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Boundary indicator */}
              {boundary.isVisible && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  className="my-3 flex items-center gap-2"
                  aria-label="server client boundary"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-semibold text-amber-300">
                    {boundary.label}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                </motion.div>
              )}

              {/* Data Flow Arrows */}
              {dataFlows.length > 0 && (
                <div className="mt-3 space-y-2" aria-label="data flow arrows">
                  {dataFlows.map((flow) => (
                    <DataFlowItem key={flow.id} flow={flow} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Capabilities / Timeline */}
            <div className="flex flex-col gap-4">
              {/* Capabilities Panel */}
              {components.some((c) => c.capabilities.length > 0) && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'capabilities'
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="capabilities panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Capabilities</h3>
                  </div>
                  <div className="space-y-3">
                    {components
                      .filter((c) => c.capabilities.length > 0)
                      .map((comp) => (
                        <CapabilitiesList key={comp.id} component={comp} />
                      ))}
                  </div>
                </div>
              )}

              {/* Render Timeline */}
              {renderTimeline.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'timeline'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="render timeline panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Render Pipeline</h3>
                  </div>
                  <RenderTimeline entries={renderTimeline} currentPhase={currentPhase} />
                </div>
              )}

              {/* Annotation */}
              {annotation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
                  aria-label="annotation"
                >
                  <span className="text-sm text-amber-300">{annotation}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('ServerClientComponentsVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Component node item
function ComponentNodeItem({ component }: { component: ComponentNode }) {
  const isServer = component.environment === 'server';
  const envColor = isServer
    ? {
        border: 'border-blue-500/50',
        bg: 'bg-blue-500/10',
        text: 'text-blue-300',
        badge: 'bg-blue-500/20 text-blue-300',
      }
    : {
        border: 'border-orange-500/50',
        bg: 'bg-orange-500/10',
        text: 'text-orange-300',
        badge: 'bg-orange-500/20 text-orange-300',
      };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        'rounded-lg border-2 p-3 transition-all',
        component.isHighlighted ? envColor.border : 'border-border/30',
        component.isHighlighted ? envColor.bg : 'bg-card/20'
      )}
      style={{ marginLeft: `${component.depth * 16}px` }}
      aria-label={`component ${component.name}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isServer ? (
            <Server className={cn('h-4 w-4', envColor.text)} aria-hidden="true" />
          ) : (
            <Monitor className={cn('h-4 w-4', envColor.text)} aria-hidden="true" />
          )}
          <span className={cn('font-mono text-sm font-semibold', envColor.text)}>
            {component.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', envColor.badge)}
          >
            {isServer ? 'SERVER' : 'CLIENT'}
          </span>
          {component.isRendering && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Circle className="h-3 w-3 fill-current text-yellow-400" aria-hidden="true" />
            </motion.div>
          )}
          {component.isHydrated && (
            <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400">
              Hydrated
            </span>
          )}
        </div>
      </div>

      {/* Boundary directive indicator */}
      {component.hasBoundaryDirective && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 rounded bg-amber-500/20 px-2 py-1"
        >
          <span className="font-mono text-[10px] text-amber-300">&apos;use client&apos;</span>
        </motion.div>
      )}

      {/* Props */}
      {component.props.length > 0 && (
        <div className="mt-2 space-y-1">
          {component.props.map((prop) => (
            <div
              key={prop.id}
              className={cn(
                'flex items-center justify-between rounded px-2 py-0.5 text-[10px]',
                prop.isHighlighted ? 'bg-purple-500/20' : 'bg-card/30'
              )}
            >
              <span className="text-purple-300">{prop.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-foreground/60 font-mono">{prop.value}</span>
                {prop.isSerializable ? (
                  <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                ) : (
                  <X className="h-3 w-3 text-red-400" aria-hidden="true" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Data flow arrow
function DataFlowItem({ flow }: { flow: DataFlowArrow }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-xs',
        flow.isBlocked
          ? 'bg-red-500/10 ring-1 ring-red-500/30'
          : flow.isHighlighted
            ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30'
            : 'bg-card/30'
      )}
      aria-label={`data flow from ${flow.from} to ${flow.to}`}
    >
      <span className="text-muted-foreground">{flow.from}</span>
      <ArrowRight
        className={cn('h-3 w-3', flow.isBlocked ? 'text-red-400' : 'text-emerald-400')}
        aria-hidden="true"
      />
      <span className="text-muted-foreground">{flow.to}</span>
      {flow.label && (
        <span
          className={cn(
            'ml-auto font-mono',
            flow.isBlocked ? 'text-red-300' : 'text-foreground/60'
          )}
        >
          {flow.label}
        </span>
      )}
      {flow.isBlocked && (
        <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-300">
          BLOCKED
        </span>
      )}
      {flow.blockReason && <span className="text-[10px] text-red-400">{flow.blockReason}</span>}
    </motion.div>
  );
}

// Capabilities list for a component
function CapabilitiesList({ component }: { component: ComponentNode }) {
  const isServer = component.environment === 'server';
  const headerColor = isServer ? 'text-blue-300' : 'text-orange-300';

  return (
    <div aria-label={`${component.name} capabilities`}>
      <div className="mb-2 flex items-center gap-2">
        {isServer ? (
          <Server className="h-3 w-3 text-blue-400" aria-hidden="true" />
        ) : (
          <Monitor className="h-3 w-3 text-orange-400" aria-hidden="true" />
        )}
        <span className={cn('text-xs font-semibold', headerColor)}>{component.name}</span>
      </div>
      <div className="space-y-1">
        {component.capabilities.map((cap) => (
          <CapabilityItem key={cap.id} capability={cap} />
        ))}
      </div>
    </div>
  );
}

// Single capability item
function CapabilityItem({ capability }: { capability: ComponentCapability }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center justify-between rounded px-2 py-1 text-[11px]',
        capability.allowed ? 'bg-emerald-500/10' : 'bg-red-500/10'
      )}
    >
      <div className="flex items-center gap-2">
        {capability.allowed ? (
          <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
        ) : (
          <X className="h-3 w-3 text-red-400" aria-hidden="true" />
        )}
        <span className={capability.allowed ? 'text-emerald-300' : 'text-red-300'}>
          {capability.name}
        </span>
      </div>
      <span className="text-muted-foreground">{capability.description}</span>
    </motion.div>
  );
}

// Render timeline
function RenderTimeline({
  entries,
  currentPhase,
}: {
  entries: RenderTimelineEntry[];
  currentPhase: string;
}) {
  const phaseIcons: Record<string, React.ReactNode> = {
    'server-render': <Server className="h-4 w-4" />,
    serialization: <ArrowRight className="h-4 w-4" />,
    'client-hydration': <Monitor className="h-4 w-4" />,
    interactive: <Zap className="h-4 w-4" />,
  };

  return (
    <div className="space-y-2" aria-label="render timeline">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all',
            entry.isActive
              ? 'bg-emerald-500/20 ring-1 ring-emerald-500/50'
              : entry.isComplete
                ? 'bg-card/50 opacity-70'
                : 'bg-card/20 opacity-40'
          )}
          aria-label={`timeline phase ${entry.phase}`}
        >
          <div
            className={cn(
              'rounded-full p-1.5',
              entry.isActive
                ? 'bg-emerald-500/30 text-emerald-400'
                : entry.isComplete
                  ? 'bg-muted text-foreground/50'
                  : 'bg-muted/50 text-foreground/30'
            )}
          >
            {phaseIcons[entry.phase] || <Circle className="h-4 w-4" />}
          </div>
          <div className="flex-1">
            <span
              className={cn(
                'font-semibold',
                entry.isActive ? 'text-emerald-300' : 'text-foreground/70'
              )}
            >
              {entry.phase.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
            <p className="text-muted-foreground">{entry.description}</p>
          </div>
          {entry.isComplete && <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />}
          {entry.isActive && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Circle className="h-3 w-3 fill-current text-emerald-400" aria-hidden="true" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default ServerClientComponentsVisual;
