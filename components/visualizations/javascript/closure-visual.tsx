'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Link2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClosureState, ScopeLevel, Variable, ScopeChainItem } from '@/lib/types';

interface ClosureVisualProps {
  state: ClosureState;
  className?: string;
}

export function ClosureVisual({ state, className }: ClosureVisualProps) {
  const { scopes, scopeChain, closureFormed, closureInfo, accessedVariable, output } = state;

  return (
    <div
      className={cn('grid h-full gap-4 lg:grid-cols-[1.2fr_1fr]', className)}
      aria-label="closures visualization"
    >
      {/* Left: Scope Stack */}
      <div className="flex flex-col gap-4">
        {/* Scopes */}
        <div
          className="border-primary/30 bg-primary/5 flex-1 rounded-xl border p-4"
          aria-label="scope levels"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-foreground text-sm font-semibold">Execution Contexts & Scopes</h3>
            <span className="text-muted-foreground text-xs">
              {scopes.length} scope{scopes.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex min-h-[250px] flex-col-reverse gap-3">
            <AnimatePresence mode="popLayout">
              {scopes.map((scope, index) => (
                <ScopeLevelCard
                  key={scope.id}
                  scope={scope}
                  isTop={index === scopes.length - 1}
                  accessedVariable={accessedVariable}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Console Output */}
        <div
          className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4"
          aria-label="console output"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" aria-hidden="true" />
            </div>
            <span className="text-muted-foreground text-xs font-medium">Console</span>
          </div>

          <div className="min-h-[50px] font-mono text-sm">
            <AnimatePresence mode="popLayout">
              {output.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted-foreground/50 italic"
                >
                  No output yet...
                </motion.p>
              ) : (
                output.map((line, index) => (
                  <motion.div
                    key={`${line}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                  >
                    <span className="text-muted-foreground/50 select-none">&gt;</span>
                    <span className="text-yellow-300">{line}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right: Scope Chain & Closure Info */}
      <div className="flex flex-col gap-4">
        {/* Scope Chain */}
        <div
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4"
          aria-label="scope chain"
        >
          <div className="mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <h3 className="text-foreground text-sm font-semibold">Scope Chain</h3>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {scopeChain.map((item, index) => (
                <ScopeChainItemCard
                  key={item.id}
                  item={item}
                  isLast={index === scopeChain.length - 1}
                  accessedVariable={accessedVariable}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Closure Info */}
        <AnimatePresence>
          {closureFormed && closureInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-xl border-2 border-pink-500/50 bg-pink-500/10 p-4"
              aria-label="closure formed"
            >
              <div className="mb-3 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <Lock className="h-5 w-5 text-pink-400" aria-hidden="true" />
                </motion.div>
                <h3 className="text-sm font-semibold text-pink-300">Closure Formed!</h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Function:</span>
                  <span className="text-foreground font-mono">{closureInfo.functionName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Captured:</span>
                  <div className="flex gap-1">
                    {closureInfo.capturedVariables.map((v) => (
                      <span
                        key={v}
                        className="rounded-full bg-pink-500/20 px-2 py-0.5 text-xs font-medium text-pink-300"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">From:</span>
                  <span className="text-foreground text-xs">{closureInfo.fromScope}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation Card */}
        <div className="border-border/30 bg-card/30 rounded-xl border p-4">
          <h4 className="text-foreground mb-2 text-sm font-semibold">How Closures Work</h4>
          <p className="text-muted-foreground text-xs leading-relaxed">
            When a function is created, it &quot;remembers&quot; its surrounding scope. Even after
            the outer function returns, the inner function can still access those variables through
            the <strong className="text-foreground">scope chain</strong>. This is a closure - a
            function bundled with its lexical environment.
          </p>
        </div>
      </div>
    </div>
  );
}

interface ScopeLevelCardProps {
  scope: ScopeLevel;
  isTop: boolean;
  accessedVariable?: { name: string; fromScope: string };
}

function ScopeLevelCard({ scope, isTop, accessedVariable }: ScopeLevelCardProps) {
  const isClosureScope = scope.name.includes('Closed-over') || scope.name.includes('🔒');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      layout
      className={cn(
        'rounded-xl border-2 p-3 transition-all duration-300',
        scope.isActive && 'ring-offset-background ring-2 ring-offset-2',
        isClosureScope && 'border-dashed'
      )}
      style={
        {
          borderColor: scope.color,
          backgroundColor: `${scope.color}10`,
          '--tw-ring-color': scope.isActive ? scope.color : 'transparent',
        } as React.CSSProperties
      }
      aria-label={`${scope.name} scope`}
    >
      {/* Scope Header */}
      <div className="mb-2 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${scope.color}25`, color: scope.color }}
        >
          {isClosureScope && <Lock className="h-3 w-3" />}
          {scope.name}
        </span>
        {isTop && scope.isActive && <span className="text-xs text-emerald-400">← current</span>}
      </div>

      {/* Variables */}
      <div className="space-y-1">
        {scope.variables.length === 0 ? (
          <p className="text-muted-foreground/50 text-xs italic">No local variables</p>
        ) : (
          scope.variables.map((variable) => (
            <VariableRow
              key={variable.id}
              variable={variable}
              isAccessed={
                accessedVariable?.name === variable.name &&
                scope.name.toLowerCase().includes(accessedVariable.fromScope.toLowerCase())
              }
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

interface ScopeChainItemCardProps {
  item: ScopeChainItem;
  isLast: boolean;
  accessedVariable?: { name: string; fromScope: string };
}

function ScopeChainItemCard({ item, isLast, accessedVariable }: ScopeChainItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
    >
      <div
        className={cn(
          'rounded-lg border p-2 transition-all',
          item.isActive ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-border/30 bg-card/30'
        )}
        style={{ borderColor: item.isActive ? item.color : undefined }}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: item.color }}>
            {item.contextName}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.variables.map((v) => (
            <span
              key={v.id}
              className={cn(
                'rounded px-1.5 py-0.5 font-mono text-xs',
                accessedVariable?.name === v.name
                  ? 'bg-pink-500/30 text-pink-300 ring-1 ring-pink-500'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {v.name}
            </span>
          ))}
          {item.variables.length === 0 && (
            <span className="text-muted-foreground/50 text-xs">empty</span>
          )}
        </div>
      </div>
      {!isLast && (
        <div className="flex justify-center py-1">
          <ArrowRight className="text-muted-foreground/50 h-4 w-4 rotate-90" />
        </div>
      )}
    </motion.div>
  );
}

interface VariableRowProps {
  variable: Variable;
  isAccessed: boolean;
}

function VariableRow({ variable, isAccessed }: VariableRowProps) {
  const typeColors: Record<string, string> = {
    function: '#10B981',
    var: '#F59E0B',
    let: '#06B6D4',
    const: '#8B5CF6',
    parameter: '#EC4899',
  };

  return (
    <motion.div
      className={cn(
        'flex items-center justify-between rounded px-2 py-1 text-xs transition-all',
        isAccessed && 'bg-pink-500/20 ring-1 ring-pink-500'
      )}
      animate={isAccessed ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium" style={{ color: typeColors[variable.type] || '#fff' }}>
          {variable.type === 'function' ? 'ƒ' : variable.type}
        </span>
        <span className="text-foreground font-medium">{variable.name}</span>
      </div>
      <span className="text-muted-foreground font-mono">{variable.value}</span>
    </motion.div>
  );
}
