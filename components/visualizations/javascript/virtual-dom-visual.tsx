'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  GitCompare,
  Monitor,
  Code2,
  ArrowRight,
  Check,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  VirtualDOMState,
  VNode,
  DiffEntry,
  PatchOperation,
} from '@/lib/types/virtual-dom.types';

interface VirtualDOMVisualProps {
  state: VirtualDOMState;
}

/**
 * Virtual DOM visualization component
 * Shows side-by-side comparison of Real DOM vs Virtual DOM with diffing animation
 */
export function VirtualDOMVisual({ state }: VirtualDOMVisualProps) {
  const {
    realDOM,
    currentVDOM,
    diffs,
    patches,
    phase,
    highlightedRealNodes,
    highlightedVirtualNodes,
    consoleOutput,
    metrics,
  } = state;

  return (
    <div
      className="flex h-full flex-col gap-3 overflow-hidden p-4"
      aria-label="Virtual DOM visualization"
    >
      {/* Phase Indicator */}
      <div className="flex items-center justify-center gap-2">
        <PhaseIndicator phase={phase} />
      </div>

      {/* Main Content - Side by Side */}
      <div className="flex flex-1 gap-3 overflow-hidden">
        {/* Real DOM Panel */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1e1e2e]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <Monitor className="h-4 w-4 text-blue-400" aria-hidden="true" />
            <span className="text-xs font-medium text-white/70">Real DOM</span>
          </div>
          <div className="flex-1 overflow-auto p-3">
            <VNodeTree
              node={realDOM}
              depth={0}
              highlightedNodes={highlightedRealNodes}
              variant="real"
            />
          </div>
        </div>

        {/* Arrow / Diff Indicator */}
        <div className="flex flex-col items-center justify-center gap-2">
          <motion.div
            animate={{
              scale: phase === 'diff' ? [1, 1.2, 1] : 1,
              opacity: phase === 'diff' ? 1 : 0.5,
            }}
            transition={{ duration: 0.5, repeat: phase === 'diff' ? Infinity : 0 }}
            className="rounded-full bg-purple-500/20 p-2"
          >
            <GitCompare className="h-5 w-5 text-purple-400" aria-hidden="true" />
          </motion.div>
          <ArrowRight className="h-4 w-4 text-white/30" aria-hidden="true" />
        </div>

        {/* Virtual DOM Panel */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <Code2 className="h-4 w-4 text-purple-400" aria-hidden="true" />
            <span className="text-xs font-medium text-white/70">Virtual DOM</span>
          </div>
          <div className="flex-1 overflow-auto p-3">
            <VNodeTree
              node={currentVDOM}
              depth={0}
              highlightedNodes={highlightedVirtualNodes}
              variant="virtual"
            />
          </div>
        </div>
      </div>

      {/* Bottom Panel - Diffs, Patches, Console */}
      <div className="flex gap-3">
        {/* Diffs & Patches */}
        {(diffs.length > 0 || patches.length > 0) && (
          <div className="flex-1 rounded-xl border border-white/10 bg-[#1e1e2e] p-3">
            <div className="mb-2 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span className="text-xs font-medium text-white/70">
                {phase === 'diff' ? 'Differences Found' : 'Patch Operations'}
              </span>
            </div>
            <div className="space-y-1">
              {diffs.length > 0 && diffs.map((diff) => <DiffItem key={diff.id} diff={diff} />)}
              {patches.length > 0 &&
                patches.map((patch) => <PatchItem key={patch.id} patch={patch} />)}
            </div>
          </div>
        )}

        {/* Console Output */}
        <div className="w-72 rounded-xl border border-white/10 bg-[#0d0d14] p-3">
          <div className="mb-2 text-xs text-white/50">Console</div>
          <div className="space-y-0.5 font-mono text-xs">
            <AnimatePresence mode="sync">
              {consoleOutput.map((line, i) => (
                <motion.div
                  key={`${line}-${i}`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    line.startsWith('//') && 'text-white/40 italic',
                    line.startsWith('✓') && 'text-green-400',
                    line.startsWith('✅') && 'text-green-400',
                    line.startsWith('⚠️') && 'text-amber-400',
                    line.startsWith('❌') && 'text-red-400',
                    line.startsWith('⚡') && 'text-cyan-400',
                    line.startsWith('🔍') && 'text-purple-400',
                    line.startsWith('📋') && 'text-blue-400',
                    line.startsWith('📊') && 'text-pink-400',
                    line.startsWith('🚀') && 'text-emerald-400',
                    line.startsWith('🔑') && 'text-amber-400',
                    line.startsWith('➕') && 'text-green-400',
                    line.startsWith('✨') && 'text-yellow-400',
                    !line.startsWith('//') &&
                      !line.startsWith('✓') &&
                      !line.startsWith('⚠️') &&
                      !line.startsWith('❌') &&
                      !line.startsWith('⚡') &&
                      !line.startsWith('🔍') &&
                      !line.startsWith('📋') &&
                      !line.startsWith('📊') &&
                      !line.startsWith('🚀') &&
                      !line.startsWith('🔑') &&
                      !line.startsWith('➕') &&
                      !line.startsWith('✨') &&
                      !line.startsWith('✅') &&
                      'text-white/70'
                  )}
                >
                  {line}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Metrics */}
        {metrics && (
          <div className="w-40 rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-3">
            <div className="mb-2 text-xs font-medium text-white/70">Performance</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-red-400">Direct DOM:</span>
                <span className="font-mono text-white">{metrics.directDOMOps} ops</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Virtual DOM:</span>
                <span className="font-mono text-white">{metrics.virtualDOMOps} ops</span>
              </div>
              {metrics.savedOps !== undefined && metrics.savedOps > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-2 rounded bg-emerald-500/20 px-2 py-1 text-center"
                >
                  <span className="text-emerald-400">Saved: {metrics.savedOps} ops</span>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Phase indicator showing current reconciliation phase
 */
function PhaseIndicator({ phase }: { phase: VirtualDOMState['phase'] }) {
  const phases = [
    { id: 'render', label: 'Render', color: 'bg-blue-500' },
    { id: 'diff', label: 'Diff', color: 'bg-purple-500' },
    { id: 'patch', label: 'Patch', color: 'bg-amber-500' },
    { id: 'commit', label: 'Commit', color: 'bg-green-500' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
      {phases.map((p, i) => (
        <motion.div
          key={p.id}
          className={cn(
            'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
            phase === p.id ? `${p.color} text-white` : 'text-white/40'
          )}
          animate={phase === p.id ? { scale: [1, 1.05, 1] } : {}}
        >
          <span>{i + 1}.</span>
          <span>{p.label}</span>
          {phase === p.id && (
            <motion.div layoutId="phase-indicator" className="h-1.5 w-1.5 rounded-full bg-white" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Recursive component for rendering Virtual DOM nodes
 */
interface VNodeTreeProps {
  node: VNode | string;
  depth: number;
  highlightedNodes: string[];
  variant: 'real' | 'virtual';
}

function VNodeTree({ node, depth, highlightedNodes, variant }: VNodeTreeProps) {
  // Handle text nodes
  if (typeof node === 'string') {
    return <span className="text-xs text-amber-300/70">&quot;{node}&quot;</span>;
  }

  const isHighlighted = highlightedNodes.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;

  // Get color based on node state
  const getNodeColor = (): string => {
    if (node.isNew) return '#22c55e';
    if (node.isRemoved) return '#ef4444';
    if (node.isUpdated) return '#f59e0b';
    if (node.isUnchanged) return '#6b7280';
    return variant === 'real' ? '#3b82f6' : '#a855f7';
  };

  const nodeColor = getNodeColor();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="select-none"
      style={{ paddingLeft: depth * 12 }}
    >
      <motion.div
        className={cn(
          'flex items-center gap-1 rounded px-1.5 py-0.5',
          isHighlighted && 'bg-white/10 ring-1 ring-white/20'
        )}
        animate={
          node.isUpdated
            ? {
                backgroundColor: [
                  'rgba(245,158,11,0.2)',
                  'rgba(245,158,11,0)',
                  'rgba(245,158,11,0.2)',
                ],
              }
            : {}
        }
        transition={{ duration: 1, repeat: node.isUpdated ? Infinity : 0 }}
      >
        {/* Status Icon */}
        {node.isNew && <Plus className="h-3 w-3 text-green-400" aria-hidden="true" />}
        {node.isRemoved && <Minus className="h-3 w-3 text-red-400" aria-hidden="true" />}
        {node.isUpdated && <RefreshCw className="h-3 w-3 text-amber-400" aria-hidden="true" />}
        {node.isUnchanged && <Check className="h-3 w-3 text-white/30" aria-hidden="true" />}

        {/* Tag */}
        <span className="text-white/50">&lt;</span>
        <span className="text-xs font-medium" style={{ color: nodeColor }}>
          {node.type}
        </span>

        {/* Props */}
        {node.props &&
          Object.entries(node.props).map(([key, value]) => {
            if (key === 'children') return null;
            return (
              <span key={key} className="text-xs">
                <span className="text-cyan-400/70"> {key}</span>
                <span className="text-white/30">=</span>
                <span className="text-amber-400/70">&quot;{String(value)}&quot;</span>
              </span>
            );
          })}

        <span className="text-white/50">&gt;</span>

        {/* Inline text for leaf nodes */}
        {hasChildren && node.children.length === 1 && typeof node.children[0] === 'string' && (
          <>
            <motion.span
              className="mx-1 text-xs text-white/70"
              animate={node.isUpdated ? { color: ['#ffffff', '#f59e0b', '#ffffff'] } : {}}
            >
              {node.children[0]}
            </motion.span>
            <span className="text-white/50">&lt;/</span>
            <span className="text-xs" style={{ color: nodeColor }}>
              {node.type}
            </span>
            <span className="text-white/50">&gt;</span>
          </>
        )}
      </motion.div>

      {/* Children (non-text) */}
      {hasChildren && !(node.children.length === 1 && typeof node.children[0] === 'string') && (
        <>
          {node.children.map((child, i) => (
            <VNodeTree
              key={typeof child === 'string' ? `text-${i}` : child.id}
              node={child}
              depth={depth + 1}
              highlightedNodes={highlightedNodes}
              variant={variant}
            />
          ))}
          <div style={{ paddingLeft: depth * 12 }}>
            <span className="text-white/50">&lt;/</span>
            <span className="text-xs" style={{ color: nodeColor }}>
              {node.type}
            </span>
            <span className="text-white/50">&gt;</span>
          </div>
        </>
      )}
    </motion.div>
  );
}

/**
 * Diff entry display
 */
function DiffItem({ diff }: { diff: DiffEntry }) {
  const getIcon = () => {
    switch (diff.type) {
      case 'add':
        return <Plus className="h-3 w-3 text-green-400" />;
      case 'remove':
        return <Minus className="h-3 w-3 text-red-400" />;
      case 'update':
        return <RefreshCw className="h-3 w-3 text-amber-400" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-xs"
    >
      {getIcon()}
      <span className="text-white/70">{diff.description}</span>
      <span className="text-white/40">at {diff.path}</span>
    </motion.div>
  );
}

/**
 * Patch operation display
 */
function PatchItem({ patch }: { patch: PatchOperation }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center gap-2 rounded px-2 py-1 text-xs',
        patch.isApplied ? 'bg-green-500/20' : 'bg-amber-500/10'
      )}
    >
      {patch.isApplied ? (
        <Check className="h-3 w-3 text-green-400" />
      ) : (
        <ArrowRight className="h-3 w-3 text-amber-400" />
      )}
      <span className="font-mono text-white/70">{patch.type}</span>
      <span className="text-white/40">{patch.description}</span>
    </motion.div>
  );
}

export default VirtualDOMVisual;
