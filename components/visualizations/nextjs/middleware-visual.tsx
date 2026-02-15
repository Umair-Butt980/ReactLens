'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Check,
  X,
  Globe,
  FileCode,
  Fingerprint,
  RefreshCw,
  Circle,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  MiddlewareState,
  MiddlewarePipeline,
  MatcherPattern,
  ResponseModification,
  FlowNode,
  MiddlewareAction,
} from '@/lib/types';

interface MiddlewareVisualProps {
  state: MiddlewareState;
  className?: string;
}

export function MiddlewareVisual({ state, className }: MiddlewareVisualProps) {
  const {
    request,
    pipeline,
    matchers,
    modifications,
    flowNodes,
    annotation,
    activePanel,
    finalAction,
    destinationPath,
  } = state;

  const renderContent = () => {
    try {
      return (
        <div
          className={cn('flex h-full flex-col gap-4', className)}
          aria-label="middleware visualization"
        >
          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            {/* Left Column: Flow / Pipeline */}
            <div className="flex flex-col gap-4">
              {/* Request Flow */}
              {flowNodes.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'flow'
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="request flow panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-purple-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Request Flow</h3>
                  </div>
                  <FlowView nodes={flowNodes} />
                </div>
              )}

              {/* Pipeline */}
              {pipeline.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'request'
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="middleware pipeline panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Pipeline</h3>
                  </div>
                  <PipelineView steps={pipeline} />
                </div>
              )}
            </div>

            {/* Right Column: Matchers / Response */}
            <div className="flex flex-col gap-4">
              {/* Matchers */}
              {matchers.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'matchers'
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="matcher patterns panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-amber-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Matchers</h3>
                  </div>
                  <MatchersList matchers={matchers} />
                </div>
              )}

              {/* Response Modifications */}
              {modifications.length > 0 && (
                <div
                  className={cn(
                    'rounded-xl border p-4 transition-all duration-300',
                    activePanel === 'response'
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-border/30 bg-card/30'
                  )}
                  aria-label="response modifications panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Response</h3>
                  </div>
                  <ModificationsList modifications={modifications} />
                </div>
              )}

              {/* Final Action */}
              <FinalActionBadge action={finalAction} destination={destinationPath} />

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
      console.error('MiddlewareVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Flow visualization
function FlowView({ nodes }: { nodes: FlowNode[] }) {
  const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    request: { icon: <Globe className="h-4 w-4" />, color: 'text-cyan-400' },
    middleware: { icon: <Shield className="h-4 w-4" />, color: 'text-purple-400' },
    matcher: { icon: <Fingerprint className="h-4 w-4" />, color: 'text-amber-400' },
    action: { icon: <RefreshCw className="h-4 w-4" />, color: 'text-pink-400' },
    destination: { icon: <FileCode className="h-4 w-4" />, color: 'text-emerald-400' },
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="flow nodes">
      {nodes.map((node, index) => {
        const config = typeConfig[node.type];
        return (
          <div key={node.id} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all',
                node.isHighlighted
                  ? 'ring-2 ring-offset-1 ring-offset-transparent'
                  : '',
                node.isActive
                  ? 'bg-card/60'
                  : 'bg-card/20 opacity-50'
              )}
              style={{
                '--tw-ring-color': node.isHighlighted
                  ? node.type === 'destination' ? 'rgba(16,185,129,0.5)' : 'rgba(139,92,246,0.5)'
                  : 'transparent',
              } as React.CSSProperties}
              aria-label={`flow node ${node.label}`}
            >
              <span className={config.color}>{config.icon}</span>
              <span className={cn('font-semibold', node.isHighlighted ? config.color : 'text-foreground/70')}>
                {node.label}
              </span>
              {node.isActive && node.isHighlighted && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Circle className={cn('h-2 w-2 fill-current', config.color)} aria-hidden="true" />
                </motion.div>
              )}
            </motion.div>
            {index < nodes.length - 1 && (
              <ArrowRight className="h-3 w-3 text-muted-foreground/40" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Pipeline view
function PipelineView({ steps }: { steps: MiddlewarePipeline[] }) {
  const actionIcons: Record<MiddlewareAction, React.ReactNode> = {
    next: <Check className="h-3.5 w-3.5 text-emerald-400" />,
    redirect: <ArrowRight className="h-3.5 w-3.5 text-amber-400" />,
    rewrite: <RefreshCw className="h-3.5 w-3.5 text-purple-400" />,
    response: <FileCode className="h-3.5 w-3.5 text-cyan-400" />,
    block: <X className="h-3.5 w-3.5 text-red-400" />,
  };

  return (
    <div className="space-y-2" aria-label="pipeline steps">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-all',
            step.isActive
              ? 'bg-cyan-500/15 ring-1 ring-cyan-500/40'
              : step.isComplete
                ? 'bg-card/40 opacity-60'
                : 'bg-card/20 opacity-40'
          )}
          aria-label={`pipeline step ${step.label}`}
        >
          <div className={cn(
            'rounded-full p-1',
            step.isActive ? 'bg-cyan-500/20' : 'bg-muted/30'
          )}>
            {step.isComplete ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            ) : (
              actionIcons[step.action]
            )}
          </div>
          <div className="flex-1">
            <span className={cn('font-semibold', step.isActive ? 'text-cyan-300' : 'text-foreground/70')}>
              {step.label}
            </span>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Matchers list
function MatchersList({ matchers }: { matchers: MatcherPattern[] }) {
  return (
    <div className="space-y-2" aria-label="matcher patterns">
      {matchers.map((matcher) => (
        <motion.div
          key={matcher.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-all',
            matcher.isHighlighted
              ? matcher.matches
                ? 'bg-emerald-500/15 ring-1 ring-emerald-500/40'
                : 'bg-red-500/10 ring-1 ring-red-500/30'
              : 'bg-card/20'
          )}
          aria-label={`matcher ${matcher.pattern}`}
        >
          <div className="flex items-center gap-2">
            {matcher.matches ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
            )}
            <span className="font-mono text-amber-300">{matcher.pattern}</span>
          </div>
          <span className="text-muted-foreground">{matcher.description}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Response modifications list
function ModificationsList({ modifications }: { modifications: ResponseModification[] }) {
  const typeIcons: Record<string, React.ReactNode> = {
    header: <FileCode className="h-3.5 w-3.5 text-cyan-400" />,
    cookie: <Lock className="h-3.5 w-3.5 text-amber-400" />,
    redirect: <ArrowRight className="h-3.5 w-3.5 text-pink-400" />,
    rewrite: <RefreshCw className="h-3.5 w-3.5 text-purple-400" />,
    status: <Shield className="h-3.5 w-3.5 text-emerald-400" />,
  };

  return (
    <div className="space-y-2" aria-label="response modifications">
      {modifications.map((mod) => (
        <motion.div
          key={mod.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'flex items-center justify-between rounded-lg px-3 py-2 text-xs',
            mod.isHighlighted ? 'bg-emerald-500/15 ring-1 ring-emerald-500/40' : 'bg-card/20'
          )}
          aria-label={`modification ${mod.label}`}
        >
          <div className="flex items-center gap-2">
            {typeIcons[mod.type]}
            <span className="text-foreground/80">{mod.label}</span>
          </div>
          <span className="font-mono text-emerald-300">{mod.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Final action badge
function FinalActionBadge({ action, destination }: { action: MiddlewareAction; destination: string }) {
  const config: Record<MiddlewareAction, { label: string; color: string; bg: string }> = {
    next: { label: 'Continue', color: 'text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-500/40' },
    redirect: { label: 'Redirect', color: 'text-amber-300', bg: 'bg-amber-500/20 border-amber-500/40' },
    rewrite: { label: 'Rewrite', color: 'text-purple-300', bg: 'bg-purple-500/20 border-purple-500/40' },
    response: { label: 'Custom Response', color: 'text-cyan-300', bg: 'bg-cyan-500/20 border-cyan-500/40' },
    block: { label: 'Blocked', color: 'text-red-300', bg: 'bg-red-500/20 border-red-500/40' },
  };

  const c = config[action];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex items-center justify-between rounded-xl border px-4 py-2.5', c.bg)}
      aria-label={`final action ${action}`}
    >
      <span className={cn('text-xs font-semibold', c.color)}>Action: {c.label}</span>
      <span className="font-mono text-xs text-foreground/70">→ {destination}</span>
    </motion.div>
  );
}

export default MiddlewareVisual;
