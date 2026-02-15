'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Server,
  Loader2,
  Check,
  X,
  Database,
  Clock,
  ArrowRight,
  Layers,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  DataFetchingState,
  FetchRequest,
  FetchComponent,
  WaterfallItem,
  SuspenseBoundary,
} from '@/lib/types';

interface DataFetchingVisualProps {
  state: DataFetchingState;
  className?: string;
}

export function DataFetchingVisual({ state, className }: DataFetchingVisualProps) {
  const {
    requests,
    components,
    waterfall,
    suspenseBoundaries,
    annotation,
    activePanel,
    showWaterfall,
  } = state;

  const renderContent = () => {
    try {
      return (
        <div
          className={cn('flex h-full flex-col gap-4', className)}
          aria-label="data fetching visualization"
        >
          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            {/* Left Column: Requests / Components */}
            <div className="flex flex-col gap-4">
              {/* Fetch Requests */}
              {requests.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'requests'
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="fetch requests panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Fetch Requests</h3>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {requests.map((req) => (
                        <FetchRequestItem key={req.id} request={req} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Component Hierarchy */}
              {components.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'components'
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="component hierarchy panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Component Hierarchy</h3>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {components.map((comp) => (
                        <ComponentItem key={comp.id} component={comp} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Waterfall / Suspense */}
            <div className="flex flex-col gap-4">
              {/* Waterfall Timeline */}
              {showWaterfall && waterfall.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'waterfall'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="waterfall timeline panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Waterfall Timeline</h3>
                  </div>
                  <WaterfallView items={waterfall} />
                </div>
              )}

              {/* Suspense Boundaries */}
              {suspenseBoundaries.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'suspense'
                      ? 'border-pink-500/50 bg-pink-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="suspense boundaries panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-pink-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Suspense Boundaries</h3>
                  </div>
                  <div className="space-y-2">
                    {suspenseBoundaries.map((sb) => (
                      <SuspenseItem key={sb.id} boundary={sb} />
                    ))}
                  </div>
                </div>
              )}

              {/* Annotation */}
              {annotation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3"
                  aria-label="annotation"
                >
                  <span className="text-sm text-cyan-300">{annotation}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('DataFetchingVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Fetch request item
function FetchRequestItem({ request }: { request: FetchRequest }) {
  const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    idle: { icon: <Clock className="h-3.5 w-3.5" />, color: 'text-muted-foreground', bg: 'bg-muted/20' },
    loading: { icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    success: { icon: <Check className="h-3.5 w-3.5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    error: { icon: <X className="h-3.5 w-3.5" />, color: 'text-red-400', bg: 'bg-red-500/20' },
    cached: { icon: <Database className="h-3.5 w-3.5" />, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  };

  const config = statusConfig[request.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        'rounded-lg border px-3 py-2.5 text-xs transition-all',
        request.isHighlighted
          ? `${config.bg} ring-1 ring-${request.status === 'error' ? 'red' : 'cyan'}-500/50`
          : 'border-border/30 bg-card/20'
      )}
      aria-label={`fetch request ${request.url}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={config.color}>{config.icon}</span>
          <span className="font-mono text-foreground/80">{request.method}</span>
          <span className="font-mono text-cyan-300">{request.url}</span>
          {request.isParallel && (
            <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] text-purple-300">
              PARALLEL
            </span>
          )}
        </div>
        <span className={cn('font-mono', config.color)}>{request.duration}</span>
      </div>
      {request.cacheOption && (
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-muted-foreground">Cache:</span>
          <span className="font-mono text-amber-300">{request.cacheOption}</span>
        </div>
      )}
      {request.responseData && (
        <div className="mt-1 rounded bg-background/30 px-2 py-1 font-mono text-[10px] text-foreground/50">
          {request.responseData}
        </div>
      )}
    </motion.div>
  );
}

// Component hierarchy item
function ComponentItem({ component }: { component: FetchComponent }) {
  const statusConfig: Record<string, { color: string; badge: string }> = {
    idle: { color: 'text-muted-foreground', badge: 'bg-muted/20 text-muted-foreground' },
    loading: { color: 'text-yellow-300', badge: 'bg-yellow-500/20 text-yellow-300' },
    rendered: { color: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-300' },
    error: { color: 'text-red-300', badge: 'bg-red-500/20 text-red-300' },
    streaming: { color: 'text-purple-300', badge: 'bg-purple-500/20 text-purple-300' },
  };

  const config = statusConfig[component.status];
  const typeIcons: Record<string, React.ReactNode> = {
    page: <Server className="h-3.5 w-3.5" />,
    layout: <Layers className="h-3.5 w-3.5" />,
    loading: <Loader2 className="h-3.5 w-3.5" />,
    error: <X className="h-3.5 w-3.5" />,
    'suspense-boundary': <Zap className="h-3.5 w-3.5" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-all',
        component.isHighlighted
          ? `bg-purple-500/15 ring-1 ring-purple-500/40`
          : 'bg-card/20'
      )}
      style={{ marginLeft: `${component.depth * 16}px` }}
      aria-label={`component ${component.name}`}
    >
      <div className="flex items-center gap-2">
        <span className={config.color}>{typeIcons[component.type]}</span>
        <span className={cn('font-semibold', config.color)}>{component.name}</span>
      </div>
      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', config.badge)}>
        {component.status}
      </span>
    </motion.div>
  );
}

// Waterfall timeline view
function WaterfallView({ items }: { items: WaterfallItem[] }) {
  const statusColors: Record<string, string> = {
    idle: 'bg-muted/40',
    loading: 'bg-yellow-500',
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    cached: 'bg-purple-500',
  };

  return (
    <div className="space-y-2.5" aria-label="waterfall chart">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3"
        >
          <span className={cn(
            'w-32 truncate text-right text-[11px]',
            item.isHighlighted ? 'text-foreground font-semibold' : 'text-muted-foreground'
          )}>
            {item.label}
          </span>
          <div className="relative h-5 flex-1 rounded-full bg-muted/10">
            <motion.div
              className={cn(
                'absolute top-0 h-full rounded-full',
                statusColors[item.status],
                item.status === 'loading' && 'animate-pulse'
              )}
              initial={{ width: 0, left: `${item.startOffset}%` }}
              animate={{ width: `${item.width}%`, left: `${item.startOffset}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ opacity: item.isHighlighted ? 1 : 0.5 }}
            />
          </div>
        </motion.div>
      ))}
      {/* Time axis */}
      <div className="mt-1 flex items-center gap-3">
        <span className="w-32" />
        <div className="flex flex-1 justify-between text-[10px] text-muted-foreground">
          <span>0ms</span>
          <span>~200ms</span>
          <span>~400ms</span>
        </div>
      </div>
    </div>
  );
}

// Suspense boundary item
function SuspenseItem({ boundary }: { boundary: SuspenseBoundary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border-2 border-dashed p-3 transition-all',
        boundary.isLoading
          ? 'border-yellow-500/40 bg-yellow-500/5'
          : boundary.isStreamed
            ? 'border-emerald-500/40 bg-emerald-500/5'
            : 'border-border/30 bg-card/20'
      )}
      aria-label={`suspense boundary ${boundary.fallbackLabel}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-pink-300">&lt;Suspense&gt;</span>
          {boundary.isLoading && (
            <Loader2 className="h-3 w-3 animate-spin text-yellow-400" aria-hidden="true" />
          )}
          {boundary.isStreamed && (
            <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
          )}
        </div>
        <span className={cn(
          'rounded-full px-2 py-0.5 text-[10px] font-semibold',
          boundary.isLoading
            ? 'bg-yellow-500/20 text-yellow-300'
            : boundary.isStreamed
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-muted/20 text-muted-foreground'
        )}>
          {boundary.isLoading ? 'Loading...' : boundary.isStreamed ? 'Streamed' : 'Idle'}
        </span>
      </div>
      <div className="mt-2 rounded bg-background/30 px-2 py-1">
        <span className="font-mono text-[10px] text-muted-foreground">
          fallback: {boundary.fallbackLabel}
        </span>
      </div>
    </motion.div>
  );
}

export default DataFetchingVisual;
