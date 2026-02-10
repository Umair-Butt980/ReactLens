'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCompare,
  ArrowRight,
  Plus,
  Minus,
  RefreshCw,
  Key,
  Layers,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ReconciliationState,
  VDOMNode,
  DiffResult,
  ReconciliationDOMOperation,
  ListReconciliation,
  KeyMatch,
  ReconciliationOutput,
  ReconciliationPhase,
  DiffStatus,
} from '@/lib/types';

interface ReconciliationVisualProps {
  state: ReconciliationState;
  className?: string;
}

export function ReconciliationVisual({ state, className }: ReconciliationVisualProps) {
  const {
    oldTree,
    newTree,
    diffResults,
    domOperations,
    listReconciliation,
    phase,
    output,
    activePanel,
    showConnections,
  } = state;

  const renderContent = () => {
    try {
      return (
        <div
          className={cn('grid h-full gap-4 lg:grid-cols-2', className)}
          aria-label="reconciliation visualization"
        >
          {/* Left Column: Trees Comparison */}
          <div className="flex flex-col gap-4">
            {/* Trees Panel */}
            <div
              className={cn(
                'flex-1 rounded-xl border p-4 transition-all duration-300',
                activePanel === 'trees'
                  ? 'border-orange-500/50 bg-orange-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="virtual dom trees"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-orange-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Virtual DOM Comparison</h3>
                </div>
                <PhaseIndicator phase={phase} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Old Tree */}
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                  <h4 className="mb-2 text-xs font-semibold text-red-400">Previous VDOM</h4>
                  {oldTree ? (
                    <VDOMTreeView node={oldTree} side="old" />
                  ) : (
                    <p className="text-muted-foreground/50 text-xs italic">No previous tree</p>
                  )}
                </div>

                {/* New Tree */}
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <h4 className="mb-2 text-xs font-semibold text-emerald-400">New VDOM</h4>
                  {newTree ? (
                    <VDOMTreeView node={newTree} side="new" />
                  ) : (
                    <p className="text-muted-foreground/50 text-xs italic">Waiting for render...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Key Matching Panel */}
            {listReconciliation && (
              <div
                className={cn(
                  'rounded-xl border p-4 transition-all duration-300',
                  activePanel === 'keys'
                    ? 'border-purple-500/50 bg-purple-500/10'
                    : 'border-border/30 bg-card/30'
                )}
                aria-label="key matching"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Key className="h-4 w-4 text-purple-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Key Matching</h3>
                </div>
                <KeyMatchingView reconciliation={listReconciliation} />
              </div>
            )}
          </div>

          {/* Right Column: Operations & Output */}
          <div className="flex flex-col gap-4">
            {/* Diff Results */}
            {diffResults.length > 0 && (
              <div
                className={cn(
                  'rounded-xl border p-4 transition-all duration-300',
                  activePanel === 'diff'
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-border/30 bg-card/30'
                )}
                aria-label="diff results"
              >
                <div className="mb-3 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Diff Results</h3>
                </div>
                <DiffResultsView results={diffResults} />
              </div>
            )}

            {/* DOM Operations */}
            {domOperations.length > 0 && (
              <div
                className={cn(
                  'rounded-xl border p-4 transition-all duration-300',
                  activePanel === 'operations'
                    ? 'border-cyan-500/50 bg-cyan-500/10'
                    : 'border-border/30 bg-card/30'
                )}
                aria-label="dom operations"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">DOM Operations</h3>
                </div>
                <DOMOperationsView operations={domOperations} />
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
                <span className="text-muted-foreground text-xs font-medium">
                  Reconciliation Log
                </span>
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
      console.error('ReconciliationVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// VDOM Tree visualization
function VDOMTreeView({
  node,
  side,
  depth = 0,
}: {
  node: VDOMNode;
  side: 'old' | 'new';
  depth?: number;
}) {
  const statusColors: Record<DiffStatus, string> = {
    unchanged: 'border-muted-foreground/30',
    updated: 'border-amber-500 bg-amber-500/10',
    replaced: 'border-red-500 bg-red-500/10',
    added: 'border-emerald-500 bg-emerald-500/10',
    removed: 'border-red-500 bg-red-500/10 opacity-50',
    reordered: 'border-purple-500 bg-purple-500/10',
    comparing: 'border-cyan-500 bg-cyan-500/20 ring-2 ring-cyan-500/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('relative', depth > 0 && 'mt-1 ml-3')}
    >
      <div
        className={cn(
          'rounded border px-2 py-1 text-xs transition-all',
          statusColors[node.diffStatus],
          node.isHighlighted && 'ring-offset-background ring-2 ring-orange-500 ring-offset-1'
        )}
      >
        <div className="flex items-center gap-1">
          <span className="text-foreground font-medium">&lt;{node.type}&gt;</span>
          {node.key && (
            <span className="rounded bg-purple-500/20 px-1 text-purple-300">
              key=&quot;{node.key}&quot;
            </span>
          )}
          <DiffStatusBadge status={node.diffStatus} />
        </div>
        {Object.keys(node.props).length > 0 && (
          <div className="text-muted-foreground mt-1">
            {Object.entries(node.props)
              .filter(([k]) => k !== 'key')
              .map(([key, value]) => (
                <span key={key} className="mr-1">
                  {key}=&quot;{value}&quot;
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Children */}
      {node.children.length > 0 && (
        <div className="border-muted-foreground/30 border-l border-dashed pl-2">
          {node.children.map((child) => (
            <VDOMTreeView key={child.id} node={child} side={side} depth={depth + 1} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Diff status badge
function DiffStatusBadge({ status }: { status: DiffStatus }) {
  if (status === 'unchanged') return null;

  const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    updated: { icon: <RefreshCw className="h-3 w-3" />, color: 'text-amber-400', label: 'Updated' },
    replaced: { icon: <RefreshCw className="h-3 w-3" />, color: 'text-red-400', label: 'Replaced' },
    added: { icon: <Plus className="h-3 w-3" />, color: 'text-emerald-400', label: 'Added' },
    removed: { icon: <Minus className="h-3 w-3" />, color: 'text-red-400', label: 'Removed' },
    reordered: {
      icon: <ArrowRight className="h-3 w-3" />,
      color: 'text-purple-400',
      label: 'Moved',
    },
    comparing: {
      icon: <Circle className="h-3 w-3 animate-pulse" />,
      color: 'text-cyan-400',
      label: 'Comparing',
    },
  };

  const cfg = config[status];
  if (!cfg) return null;

  return (
    <span className={cn('ml-auto flex items-center gap-0.5', cfg.color)}>
      {cfg.icon}
      <span className="text-[10px]">{cfg.label}</span>
    </span>
  );
}

// Key matching visualization
function KeyMatchingView({ reconciliation }: { reconciliation: ListReconciliation }) {
  return (
    <div className="space-y-3">
      {/* Key Lists */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-muted-foreground">Old keys:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {reconciliation.oldKeys.map((key) => (
              <span key={key} className="rounded bg-red-500/20 px-2 py-0.5 text-red-300">
                {key}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">New keys:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {reconciliation.newKeys.map((key) => {
              const match = reconciliation.matches.find((m) => m.key === key);
              const isNew = match?.status === 'new';
              return (
                <span
                  key={key}
                  className={cn(
                    'rounded px-2 py-0.5',
                    isNew
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-500/10 text-emerald-200'
                  )}
                >
                  {key}
                  {isNew && ' (new)'}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-1">
        {reconciliation.matches.map((match) => (
          <KeyMatchItem key={match.key} match={match} />
        ))}
      </div>
    </div>
  );
}

// Key match item
function KeyMatchItem({ match }: { match: KeyMatch }) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    matched: { color: 'text-muted-foreground', label: 'Unchanged' },
    new: { color: 'text-emerald-400', label: 'New' },
    removed: { color: 'text-red-400', label: 'Removed' },
    moved: { color: 'text-purple-400', label: 'Moved' },
  };

  const cfg = statusConfig[match.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card/50 flex items-center gap-2 rounded px-2 py-1 text-xs"
    >
      <span className="text-foreground font-mono">key=&quot;{match.key}&quot;</span>
      {match.status === 'moved' && (
        <span className="text-muted-foreground">
          [{match.oldIndex}] → [{match.newIndex}]
        </span>
      )}
      <span className={cn('ml-auto', cfg.color)}>{cfg.label}</span>
    </motion.div>
  );
}

// Diff results view
function DiffResultsView({ results }: { results: DiffResult[] }) {
  return (
    <div className="max-h-[150px] space-y-2 overflow-y-auto">
      {results.map((result) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-xs',
            result.isActive ? 'bg-amber-500/20 ring-1 ring-amber-500' : 'bg-card/50'
          )}
        >
          <span className="text-muted-foreground">{result.nodePath}</span>
          <span className="text-foreground font-medium">{result.action}</span>
          {result.propChanges && result.propChanges.length > 0 && (
            <span className="text-amber-400">
              ({result.propChanges.map((p) => p.name).join(', ')})
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// DOM operations view
function DOMOperationsView({ operations }: { operations: ReconciliationDOMOperation[] }) {
  return (
    <div className="max-h-[150px] space-y-2 overflow-y-auto">
      {operations.map((op, index) => (
        <motion.div
          key={op.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-xs',
            op.isHighlighted && !op.isExecuted && 'bg-cyan-500/20 ring-1 ring-cyan-500',
            op.isExecuted && 'bg-emerald-500/10'
          )}
        >
          {op.isExecuted ? (
            <CheckCircle className="h-3 w-3 text-emerald-400" />
          ) : (
            <Circle className="text-muted-foreground h-3 w-3" />
          )}
          <span className="font-mono text-cyan-400">{op.type}</span>
          <span className="text-muted-foreground">{op.details}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Phase indicator
function PhaseIndicator({ phase }: { phase: ReconciliationPhase }) {
  const phaseLabels: Record<ReconciliationPhase, string> = {
    idle: 'Idle',
    start: 'Starting',
    'compare-root': 'Comparing Root',
    'compare-props': 'Comparing Props',
    'compare-children': 'Comparing Children',
    'key-matching': 'Key Matching',
    'generate-ops': 'Generating Ops',
    complete: 'Complete',
  };

  const isActive = phase !== 'idle' && phase !== 'complete';

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={cn(
          'h-2 w-2 rounded-full',
          phase === 'complete'
            ? 'bg-emerald-400'
            : isActive
              ? 'bg-orange-400'
              : 'bg-muted-foreground/50'
        )}
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <span
        className={cn(
          'text-xs font-medium',
          phase === 'complete'
            ? 'text-emerald-400'
            : isActive
              ? 'text-orange-400'
              : 'text-muted-foreground'
        )}
      >
        {phaseLabels[phase]}
      </span>
    </div>
  );
}

// Output message
function OutputMessage({ message }: { message: ReconciliationOutput }) {
  const icons: Record<string, string> = {
    info: 'ℹ',
    compare: '🔍',
    diff: '↔',
    dom: '📦',
    key: '🔑',
    warning: '⚠',
  };

  const colors: Record<string, string> = {
    info: 'text-cyan-400',
    compare: 'text-orange-400',
    diff: 'text-amber-400',
    dom: 'text-emerald-400',
    key: 'text-purple-400',
    warning: 'text-red-400',
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

export default ReconciliationVisual;
