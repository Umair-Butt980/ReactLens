'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FileCode, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DOMState, DOMNode } from '@/lib/types/dom.types';

interface DOMVisualProps {
  state: DOMState;
}

/**
 * DOM Basics visualization component
 * Shows DOM tree structure with node selection and manipulation
 */
export function DOMVisual({ state }: DOMVisualProps) {
  const { tree, selectedNodeId, highlightedNodeIds, currentOperation, consoleOutput } = state;

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4" aria-label="DOM visualization">
      {/* Current Operation Badge */}
      <AnimatePresence mode="wait">
        {currentOperation && (
          <motion.div
            key={currentOperation.description}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 self-start rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2"
            aria-live="polite"
          >
            <FileCode className="h-4 w-4 text-blue-400" aria-hidden="true" />
            <code className="text-sm font-medium text-blue-300">
              {currentOperation.description}
            </code>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* DOM Tree Panel */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1e1e2e]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
            </div>
            <span className="ml-2 text-xs text-white/50">DOM Tree</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <DOMTreeNode
              node={tree.root}
              depth={0}
              selectedNodeId={selectedNodeId}
              highlightedNodeIds={highlightedNodeIds}
            />
          </div>
        </div>

        {/* Console Output Panel */}
        <div className="flex w-64 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1a1a2e]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <Terminal className="h-4 w-4 text-green-400" aria-hidden="true" />
            <span className="text-xs text-white/50">Console</span>
          </div>
          <div className="flex-1 overflow-auto p-3">
            <AnimatePresence mode="sync">
              {consoleOutput.map((line, index) => (
                <motion.div
                  key={`${line}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'font-mono text-xs',
                    line.startsWith('>') && 'text-blue-400',
                    line.startsWith('<') && 'text-green-400',
                    line.startsWith('//') && 'text-white/40 italic'
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
  );
}

interface DOMTreeNodeProps {
  node: DOMNode;
  depth: number;
  selectedNodeId?: string;
  highlightedNodeIds: string[];
}

/**
 * Recursive component for rendering DOM tree nodes
 */
function DOMTreeNode({ node, depth, selectedNodeId, highlightedNodeIds }: DOMTreeNodeProps) {
  const isSelected = node.id === selectedNodeId;
  const isHighlighted = highlightedNodeIds.includes(node.id) || node.isHighlighted;
  const hasChildren = node.children.length > 0;

  // Get color based on tag type
  const getTagColor = (tagName: string): string => {
    const colors: Record<string, string> = {
      html: '#8B5CF6',
      head: '#06B6D4',
      body: '#10B981',
      div: '#3B82F6',
      h1: '#EC4899',
      h2: '#EC4899',
      h3: '#EC4899',
      p: '#F97316',
      button: '#FBBF24',
      title: '#06B6D4',
      span: '#EF4444',
    };
    return colors[tagName.toLowerCase()] || '#9CA3AF';
  };

  const tagColor = node.highlightColor || getTagColor(node.tagName);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="select-none"
      style={{ paddingLeft: depth * 16 }}
    >
      {/* Node Line */}
      <motion.div
        layout
        className={cn(
          'group flex items-center gap-1 rounded px-2 py-1 transition-colors',
          isSelected && 'ring-2 ring-offset-1 ring-offset-[#1e1e2e]',
          isHighlighted && 'bg-white/10',
          node.isModified && 'bg-green-500/20'
        )}
        style={
          {
            '--tw-ring-color': isSelected ? tagColor : 'transparent',
          } as React.CSSProperties
        }
        aria-label={`${node.tagName} element${isSelected ? ', selected' : ''}`}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <ChevronRight
            className="h-3 w-3 rotate-90 text-white/30 transition-transform"
            aria-hidden="true"
          />
        ) : (
          <span className="w-3" />
        )}

        {/* Opening Tag */}
        <span className="text-white/50">&lt;</span>
        <motion.span
          className="font-mono text-sm font-medium"
          style={{ color: tagColor }}
          animate={isHighlighted ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {node.tagName}
        </motion.span>

        {/* Attributes */}
        {node.attributes &&
          Object.entries(node.attributes).map(([key, value]) => (
            <span key={key} className="text-sm">
              <span className="text-cyan-400"> {key}</span>
              <span className="text-white/50">=</span>
              <span className="text-amber-400">&quot;{value}&quot;</span>
            </span>
          ))}

        <span className="text-white/50">&gt;</span>

        {/* Text Content (for leaf nodes) */}
        {node.textContent && !hasChildren && (
          <motion.span
            className="ml-1 text-sm text-white/70"
            animate={node.isModified ? { color: ['#ffffff', '#22c55e', '#ffffff'] } : {}}
            transition={{ duration: 0.5 }}
          >
            {node.textContent}
          </motion.span>
        )}

        {/* Inline closing tag for leaf nodes */}
        {!hasChildren && (
          <>
            <span className="text-white/50">&lt;/</span>
            <span className="font-mono text-sm" style={{ color: tagColor }}>
              {node.tagName}
            </span>
            <span className="text-white/50">&gt;</span>
          </>
        )}
      </motion.div>

      {/* Children */}
      {hasChildren && (
        <div>
          {node.children.map((child) => (
            <DOMTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              highlightedNodeIds={highlightedNodeIds}
            />
          ))}

          {/* Closing Tag */}
          <div className="flex items-center gap-1 px-2 py-1" style={{ paddingLeft: depth * 16 }}>
            <span className="w-3" />
            <span className="text-white/50">&lt;/</span>
            <span className="font-mono text-sm" style={{ color: tagColor }}>
              {node.tagName}
            </span>
            <span className="text-white/50">&gt;</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DOMVisual;
