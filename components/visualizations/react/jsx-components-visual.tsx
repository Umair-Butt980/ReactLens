'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ArrowRight, Braces, Box, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  JSXComponentsState,
  JSXElement,
  JSXText,
  CreateElementCall,
  VirtualDOMNode,
  ComponentDefinition,
  TransformationPhase,
} from '@/lib/types';

interface JSXComponentsVisualProps {
  state: JSXComponentsState;
  className?: string;
}

export function JSXComponentsVisual({ state, className }: JSXComponentsVisualProps) {
  const {
    jsxTree,
    createElementCalls,
    virtualDOM,
    phase,
    component,
    showTransformation,
    output,
    activePanel,
  } = state;

  return (
    <div
      className={cn('grid h-full gap-4 lg:grid-cols-2', className)}
      aria-label="jsx and components visualization"
    >
      {/* Left Column */}
      <div className="flex flex-col gap-4">
        {/* JSX Tree Panel */}
        <div
          className={cn(
            'flex-1 rounded-xl border p-4 transition-all duration-300',
            activePanel === 'jsx'
              ? 'border-cyan-500/50 bg-cyan-500/10'
              : 'border-border/30 bg-card/30'
          )}
          aria-label="jsx tree panel"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <h3 className="text-foreground text-sm font-semibold">JSX Structure</h3>
            </div>
            <PhaseIndicator phase={phase} targetPhase="jsx-written" />
          </div>

          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {jsxTree ? (
                <JSXTreeView key="jsx-tree" element={jsxTree} />
              ) : (
                <EmptyState key="jsx-empty" message="JSX will appear here" />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Component Definition Panel */}
        {component && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'rounded-xl border p-4 transition-all duration-300',
              activePanel === 'component'
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-border/30 bg-card/30'
            )}
            aria-label="component definition panel"
          >
            <div className="mb-3 flex items-center gap-2">
              <Box className="h-4 w-4 text-purple-400" aria-hidden="true" />
              <h3 className="text-foreground text-sm font-semibold">Component</h3>
            </div>
            <ComponentView component={component} />
          </motion.div>
        )}
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-4">
        {/* createElement Panel */}
        <div
          className={cn(
            'flex-1 rounded-xl border p-4 transition-all duration-300',
            activePanel === 'createElement'
              ? 'border-amber-500/50 bg-amber-500/10'
              : 'border-border/30 bg-card/30'
          )}
          aria-label="createElement panel"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Braces className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <h3 className="text-foreground text-sm font-semibold">React.createElement()</h3>
            </div>
            <PhaseIndicator phase={phase} targetPhase="createElement" />
          </div>

          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {createElementCalls ? (
                <CreateElementView key="ce-tree" call={createElementCalls} />
              ) : (
                <EmptyState key="ce-empty" message="Transformed code will appear here" />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Virtual DOM Panel */}
        <div
          className={cn(
            'rounded-xl border p-4 transition-all duration-300',
            activePanel === 'virtualDOM'
              ? 'border-emerald-500/50 bg-emerald-500/10'
              : 'border-border/30 bg-card/30'
          )}
          aria-label="virtual dom panel"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <h3 className="text-foreground text-sm font-semibold">React Element (Virtual DOM)</h3>
            </div>
            <PhaseIndicator phase={phase} targetPhase="virtual-dom" />
          </div>

          <div className="min-h-[150px]">
            <AnimatePresence mode="wait">
              {virtualDOM ? (
                <VirtualDOMView key="vdom-tree" node={virtualDOM} />
              ) : (
                <EmptyState key="vdom-empty" message="Virtual DOM will appear here" />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Output Console */}
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
            <span className="text-muted-foreground text-xs font-medium">Pipeline Output</span>
          </div>

          <div className="min-h-[60px] space-y-1 font-mono text-xs">
            <AnimatePresence mode="popLayout">
              {output.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-2"
                >
                  <span
                    className={cn(
                      'select-none',
                      msg.type === 'transform' && 'text-amber-400',
                      msg.type === 'render' && 'text-emerald-400',
                      msg.type === 'info' && 'text-cyan-400',
                      msg.type === 'warning' && 'text-red-400'
                    )}
                  >
                    {msg.type === 'transform' ? '⚡' : msg.type === 'render' ? '→' : 'ℹ'}
                  </span>
                  <span className="text-foreground/80">{msg.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Transformation Arrow */}
      <AnimatePresence>
        {showTransformation && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Babel Transform</span>
              <ArrowRight className="h-5 w-5 text-amber-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to check if a node is JSXElement
function isJSXElement(node: JSXElement | JSXText): node is JSXElement {
  return 'tag' in node;
}

// JSX Tree visualization
function JSXTreeView({ element, depth = 0 }: { element: JSXElement; depth?: number }) {
  const isComponent = element.type === 'component';
  const colorClass = isComponent ? 'text-purple-400' : 'text-cyan-400';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: depth * 0.1 }}
      className={cn(
        'relative',
        depth > 0 && 'border-muted-foreground/30 ml-4 border-l border-dashed pl-3'
      )}
    >
      <div
        className={cn(
          'rounded-lg px-3 py-2 transition-all',
          element.isHighlighted ? 'bg-cyan-500/20 ring-1 ring-cyan-500' : 'bg-card/50'
        )}
      >
        {/* Tag opening */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
          <span className="text-muted-foreground">&lt;</span>
          <span className={cn('font-semibold', colorClass)}>{element.tag}</span>

          {/* Props */}
          {element.props.map((prop) => (
            <span key={prop.id} className="ml-1">
              <span className="text-pink-400">{prop.name}</span>
              <span className="text-muted-foreground">=</span>
              <span className="text-amber-300">
                {prop.valueType === 'string' ? `"${prop.value}"` : `{${prop.value}}`}
              </span>
            </span>
          ))}

          {element.children.length === 0 && <span className="text-muted-foreground">/&gt;</span>}
          {element.children.length > 0 && <span className="text-muted-foreground">&gt;</span>}
        </div>

        {/* Children */}
        {element.children.length > 0 && (
          <div className="mt-2 space-y-2">
            {element.children.map((child, index) =>
              isJSXElement(child) ? (
                <JSXTreeView key={child.id} element={child} depth={depth + 1} />
              ) : (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-4 font-mono text-xs"
                >
                  {child.isExpression ? (
                    <span className="text-amber-300">{`{${child.content}}`}</span>
                  ) : (
                    <span className="text-foreground/70">{child.content}</span>
                  )}
                </motion.div>
              )
            )}

            {/* Closing tag */}
            <div className="font-mono text-xs">
              <span className="text-muted-foreground">&lt;/</span>
              <span className={colorClass}>{element.tag}</span>
              <span className="text-muted-foreground">&gt;</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// createElement visualization
function CreateElementView({ call, depth = 0 }: { call: CreateElementCall; depth?: number }) {
  const isComponent = call.typeCategory === 'function' || call.typeCategory === 'class';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: depth * 0.1 }}
      className={cn('relative', depth > 0 && 'ml-4')}
    >
      <div
        className={cn(
          'rounded-lg px-3 py-2 font-mono text-xs transition-all',
          call.isHighlighted ? 'bg-amber-500/20 ring-1 ring-amber-500' : 'bg-card/50'
        )}
      >
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-amber-400">React.createElement</span>
          <span className="text-muted-foreground">(</span>
        </div>

        <div className="mt-1 ml-4 space-y-1">
          {/* Type */}
          <div className="flex items-center gap-1">
            <span className={isComponent ? 'text-purple-400' : 'text-cyan-400'}>
              {isComponent ? call.type : `'${call.type}'`}
            </span>
            <span className="text-muted-foreground">,</span>
            <span className="text-muted-foreground/50 ml-2">// type</span>
          </div>

          {/* Props */}
          <div className="flex items-center gap-1">
            <span className="text-pink-400">
              {Object.keys(call.props).length > 0
                ? `{ ${Object.entries(call.props)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')} }`
                : 'null'}
            </span>
            <span className="text-muted-foreground">,</span>
            <span className="text-muted-foreground/50 ml-2">// props</span>
          </div>

          {/* Children */}
          {call.children.length > 0 && (
            <div>
              <span className="text-muted-foreground/50">// children:</span>
              {call.children.map((child, index) =>
                typeof child === 'string' ? (
                  <div key={index} className="ml-2 text-emerald-400">
                    &apos;{child}&apos;
                  </div>
                ) : (
                  <CreateElementView key={child.id} call={child} depth={depth + 1} />
                )
              )}
            </div>
          )}
        </div>

        <div className="text-muted-foreground">)</div>
      </div>
    </motion.div>
  );
}

// Virtual DOM visualization
function VirtualDOMView({ node, depth = 0 }: { node: VirtualDOMNode; depth?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: depth * 0.1 }}
      className={cn('relative', depth > 0 && 'ml-4')}
    >
      <div
        className={cn(
          'rounded-lg border px-3 py-2 transition-all',
          node.isHighlighted
            ? 'border-emerald-500 bg-emerald-500/20'
            : 'border-border/30 bg-card/50'
        )}
      >
        <div className="font-mono text-xs">
          <span className="text-muted-foreground">{'{'}</span>

          <div className="ml-3 space-y-0.5">
            <div>
              <span className="text-pink-400">$$typeof</span>
              <span className="text-muted-foreground">:</span>
              <span className="ml-1 text-emerald-400">{node.$$typeof}</span>
            </div>
            <div>
              <span className="text-pink-400">type</span>
              <span className="text-muted-foreground">:</span>
              <span className="ml-1 text-cyan-400">&apos;{node.type}&apos;</span>
            </div>
            <div>
              <span className="text-pink-400">props</span>
              <span className="text-muted-foreground">:</span>
              <span className="ml-1 text-amber-400">
                {Object.keys(node.props).length > 0
                  ? `{ ${Object.entries(node.props)
                      .map(([k, v]) => `${k}: "${v}"`)
                      .join(', ')} }`
                  : '{}'}
              </span>
            </div>
            <div>
              <span className="text-pink-400">key</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-muted-foreground/70 ml-1">{node.key || 'null'}</span>
            </div>
          </div>

          <span className="text-muted-foreground">{'}'}</span>
        </div>

        {/* Children indicator */}
        {node.children.length > 0 && (
          <div className="mt-2 space-y-2">
            {node.children.map((child) => (
              <VirtualDOMView key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Component definition visualization
function ComponentView({ component }: { component: ComponentDefinition }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-lg border px-3 py-2 transition-all',
        component.isHighlighted
          ? 'border-purple-500 bg-purple-500/20'
          : 'border-border/30 bg-card/50'
      )}
    >
      <div className="font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">{component.type}</span>
          <span className="text-foreground font-semibold">{component.name}</span>
          <span className="text-muted-foreground">(</span>
          <span className="text-pink-400">
            {`{ ${component.props.map((p) => p.name).join(', ')} }`}
          </span>
          <span className="text-muted-foreground">)</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {component.props.map((prop) => (
            <span
              key={prop.id}
              className="rounded-full bg-purple-500/20 px-2 py-0.5 text-purple-300"
            >
              {prop.name}: {prop.type}
            </span>
          ))}
        </div>

        <div className="mt-2 flex gap-2 text-xs">
          {component.returnsJSX && (
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
              Returns JSX
            </span>
          )}
          {component.hasState && (
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-300">Has State</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Phase indicator component
function PhaseIndicator({
  phase,
  targetPhase,
}: {
  phase: TransformationPhase;
  targetPhase: string;
}) {
  const phases: TransformationPhase[] = [
    'jsx-written',
    'babel-parsing',
    'createElement',
    'virtual-dom',
    'reconciliation',
    'dom-update',
  ];

  const currentIndex = phases.indexOf(phase);
  const targetIndex = phases.indexOf(targetPhase as TransformationPhase);
  const isActive = currentIndex >= targetIndex;
  const isCurrent =
    phase === targetPhase ||
    (targetPhase === 'jsx-written' && currentIndex <= 1) ||
    (targetPhase === 'createElement' && (currentIndex === 2 || currentIndex === 3)) ||
    (targetPhase === 'virtual-dom' && currentIndex >= 3);

  return (
    <div className="flex items-center gap-1">
      <div
        className={cn(
          'h-2 w-2 rounded-full transition-all',
          isCurrent
            ? 'animate-pulse bg-emerald-400'
            : isActive
              ? 'bg-emerald-400/50'
              : 'bg-muted-foreground/30'
        )}
        aria-hidden="true"
      />
      <span className={cn('text-xs', isCurrent ? 'text-emerald-400' : 'text-muted-foreground')}>
        {isCurrent ? 'Active' : isActive ? 'Done' : 'Pending'}
      </span>
    </div>
  );
}

// Empty state component
function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full min-h-[100px] items-center justify-center"
    >
      <p className="text-muted-foreground/50 text-sm italic">{message}</p>
    </motion.div>
  );
}

export default JSXComponentsVisual;
