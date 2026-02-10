'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Globe,
  HardDrive,
  ArrowRight,
  Check,
  Clock,
  Zap,
  RefreshCw,
  Monitor,
  Circle,
  Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  RenderingStrategiesState,
  TimelinePhase,
  RequestFlowStep,
  StrategyComparison,
  CacheStatus,
  RenderingStrategy,
} from '@/lib/types';

interface RenderingStrategiesVisualProps {
  state: RenderingStrategiesState;
  className?: string;
}

export function RenderingStrategiesVisual({ state, className }: RenderingStrategiesVisualProps) {
  const {
    activeStrategy,
    timeline,
    cache,
    requestFlow,
    comparison,
    annotation,
    activePanel,
    showComparison,
  } = state;

  const renderContent = () => {
    try {
      return (
        <div
          className={cn('flex h-full flex-col gap-4', className)}
          aria-label="rendering strategies visualization"
        >
          {/* Active Strategy Badge */}
          {activeStrategy && <StrategyBadge strategy={activeStrategy} />}

          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            {/* Left Column: Timeline / Comparison */}
            <div className="flex flex-col gap-4">
              {/* Timeline */}
              {timeline.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'timeline'
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="rendering timeline panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Rendering Timeline</h3>
                  </div>
                  <TimelineView phases={timeline} />
                </div>
              )}

              {/* Comparison Table */}
              {showComparison && comparison.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'comparison'
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="strategy comparison panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Strategy Comparison</h3>
                  </div>
                  <ComparisonTable rows={comparison} />
                </div>
              )}
            </div>

            {/* Right Column: Request Flow / Cache */}
            <div className="flex flex-col gap-4">
              {/* Request Flow */}
              {requestFlow.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'flow'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="request flow panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Request Flow</h3>
                  </div>
                  <RequestFlow steps={requestFlow} />
                </div>
              )}

              {/* Cache Status */}
              {cache.cacheType !== 'none' && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'cache'
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="cache status panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4 text-amber-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Cache Status</h3>
                  </div>
                  <CacheStatusView cache={cache} />
                </div>
              )}

              {/* Annotation */}
              {annotation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-3"
                  aria-label="annotation"
                >
                  <span className="text-sm text-purple-300">{annotation}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('RenderingStrategiesVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Strategy badge
function StrategyBadge({ strategy }: { strategy: RenderingStrategy }) {
  const config: Record<
    RenderingStrategy,
    { color: string; bg: string; label: string; icon: React.ReactNode }
  > = {
    SSG: {
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20 border-emerald-500/40',
      label: 'Static Site Generation (SSG)',
      icon: <HardDrive className="h-4 w-4" />,
    },
    SSR: {
      color: 'text-blue-300',
      bg: 'bg-blue-500/20 border-blue-500/40',
      label: 'Server-Side Rendering (SSR)',
      icon: <Server className="h-4 w-4" />,
    },
    ISR: {
      color: 'text-purple-300',
      bg: 'bg-purple-500/20 border-purple-500/40',
      label: 'Incremental Static Regeneration (ISR)',
      icon: <RefreshCw className="h-4 w-4" />,
    },
  };

  const c = config[strategy];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5', c.bg)}
      aria-label={`active strategy ${strategy}`}
    >
      <span className={c.color}>{c.icon}</span>
      <span className={cn('text-sm font-semibold', c.color)}>{c.label}</span>
    </motion.div>
  );
}

// Timeline view
function TimelineView({ phases }: { phases: TimelinePhase[] }) {
  const envIcons: Record<string, React.ReactNode> = {
    build: <HardDrive className="h-4 w-4" />,
    server: <Server className="h-4 w-4" />,
    cdn: <Globe className="h-4 w-4" />,
    browser: <Monitor className="h-4 w-4" />,
  };

  const envColors: Record<string, { text: string; bg: string; ring: string }> = {
    build: { text: 'text-amber-300', bg: 'bg-amber-500/20', ring: 'ring-amber-500/50' },
    server: { text: 'text-blue-300', bg: 'bg-blue-500/20', ring: 'ring-blue-500/50' },
    cdn: { text: 'text-emerald-300', bg: 'bg-emerald-500/20', ring: 'ring-emerald-500/50' },
    browser: { text: 'text-purple-300', bg: 'bg-purple-500/20', ring: 'ring-purple-500/50' },
  };

  return (
    <div className="space-y-2" aria-label="timeline phases">
      {phases.map((phase, index) => {
        const colors = envColors[phase.environment];
        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-all',
              phase.isActive
                ? `${colors.bg} ring-1 ${colors.ring}`
                : phase.isComplete
                  ? 'bg-card/50 opacity-60'
                  : 'bg-card/20 opacity-40'
            )}
            aria-label={`phase ${phase.label}`}
          >
            {/* Environment icon */}
            <div
              className={cn(
                'rounded-full p-1.5',
                phase.isActive ? `${colors.bg} ${colors.text}` : 'bg-muted/50 text-foreground/30'
              )}
            >
              {envIcons[phase.environment]}
            </div>

            {/* Phase info */}
            <div className="flex-1">
              <span
                className={cn('font-semibold', phase.isActive ? colors.text : 'text-foreground/70')}
              >
                {phase.label}
              </span>
              <p className="text-muted-foreground">{phase.description}</p>
            </div>

            {/* Duration */}
            <span
              className={cn(
                'font-mono text-[10px]',
                phase.isActive ? colors.text : 'text-muted-foreground'
              )}
            >
              {phase.duration}
            </span>

            {/* Status indicators */}
            {phase.isComplete && <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />}
            {phase.isActive && !phase.isComplete && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Circle className={cn('h-3 w-3 fill-current', colors.text)} aria-hidden="true" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Request flow visualization
function RequestFlow({ steps }: { steps: RequestFlowStep[] }) {
  return (
    <div className="space-y-2" aria-label="request flow steps">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all',
            step.isHighlighted
              ? 'bg-emerald-500/20 ring-1 ring-emerald-500/50'
              : step.isActive
                ? 'bg-card/50'
                : 'bg-card/20 opacity-50'
          )}
          aria-label={`flow from ${step.from} to ${step.to}`}
        >
          <span
            className={cn(
              'font-semibold',
              step.isHighlighted ? 'text-emerald-300' : 'text-foreground/70'
            )}
          >
            {step.from}
          </span>
          <ArrowRight
            className={cn(
              'h-3 w-3',
              step.isHighlighted ? 'text-emerald-400' : 'text-muted-foreground'
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              'font-semibold',
              step.isHighlighted ? 'text-emerald-300' : 'text-foreground/70'
            )}
          >
            {step.to}
          </span>
          <span
            className={cn(
              'ml-auto font-mono',
              step.isHighlighted ? 'text-emerald-300' : 'text-muted-foreground'
            )}
          >
            {step.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Comparison table
function ComparisonTable({ rows }: { rows: StrategyComparison[] }) {
  return (
    <div className="overflow-x-auto" aria-label="strategy comparison table">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-border/30 border-b">
            <th
              className="text-muted-foreground px-2 py-2 text-left font-medium"
              aria-label="property column"
            />
            <th className="px-2 py-2 text-center">
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-semibold text-emerald-300">
                SSG
              </span>
            </th>
            <th className="px-2 py-2 text-center">
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 font-semibold text-blue-300">
                SSR
              </span>
            </th>
            <th className="px-2 py-2 text-center">
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 font-semibold text-purple-300">
                ISR
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 }}
              className="border-border/20 border-b"
            >
              <td className="text-foreground/80 px-2 py-2 font-medium">{row.property}</td>
              <td
                className={cn(
                  'px-2 py-2 text-center',
                  row.highlightedStrategy === 'SSG'
                    ? 'font-semibold text-emerald-300'
                    : 'text-muted-foreground'
                )}
              >
                {row.ssg}
              </td>
              <td
                className={cn(
                  'px-2 py-2 text-center',
                  row.highlightedStrategy === 'SSR'
                    ? 'font-semibold text-blue-300'
                    : 'text-muted-foreground'
                )}
              >
                {row.ssr}
              </td>
              <td
                className={cn(
                  'px-2 py-2 text-center',
                  row.highlightedStrategy === 'ISR'
                    ? 'font-semibold text-purple-300'
                    : 'text-muted-foreground'
                )}
              >
                {row.isr}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Cache status view
function CacheStatusView({ cache }: { cache: CacheStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
      aria-label="cache status details"
    >
      {/* Cache indicator */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Status</span>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
            cache.isCached
              ? cache.isStale
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-emerald-500/20 text-emerald-300'
              : 'bg-red-500/20 text-red-300'
          )}
        >
          {cache.isCached ? (cache.isStale ? 'STALE' : 'CACHED') : 'NO CACHE'}
        </span>
      </div>

      {/* Cache type */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Cache type</span>
        <span className="text-foreground/70 font-mono text-xs">{cache.cacheType}</span>
      </div>

      {/* Last generated */}
      {cache.lastGenerated && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Last generated</span>
          <span className="text-foreground/70 text-xs">{cache.lastGenerated}</span>
        </div>
      )}

      {/* Revalidate after */}
      {cache.revalidateAfter && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">Revalidate after</span>
          <span className="font-mono text-xs text-purple-300">{cache.revalidateAfter}</span>
        </div>
      )}

      {/* Visual cache bar */}
      {cache.isCached && (
        <div className="pt-1">
          <div className="bg-muted/30 h-2 w-full overflow-hidden rounded-full">
            <motion.div
              className={cn(
                'h-full rounded-full',
                cache.isStale ? 'bg-amber-500' : 'bg-emerald-500'
              )}
              initial={{ width: 0 }}
              animate={{ width: cache.isStale ? '90%' : '40%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="text-muted-foreground mt-1 flex justify-between text-[10px]">
            <span>Generated</span>
            <span>
              {cache.revalidateAfter ? `Revalidate: ${cache.revalidateAfter}` : 'Cached forever'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default RenderingStrategiesVisual;
