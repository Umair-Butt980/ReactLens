'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Box, ArrowDown, Search, Circle, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  PrototypesState,
  PrototypeObject,
  ObjectProperty,
  ThisBinding,
  PropertyLookup,
} from '@/lib/types/prototypes.types';

interface PrototypesVisualProps {
  state: PrototypesState;
}

/**
 * Prototypes & this visualization component
 * Shows prototype chain with property lookup animation
 */
export function PrototypesVisual({ state }: PrototypesVisualProps) {
  const { objects, thisBinding, propertyLookup, consoleOutput, focusedObjectId } = state;

  return (
    <div
      className="flex h-full flex-col gap-4 overflow-hidden p-4"
      aria-label="Prototypes visualization"
    >
      {/* This Binding Badge */}
      <AnimatePresence mode="wait">
        {thisBinding && <ThisBindingBadge binding={thisBinding} />}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Prototype Chain */}
        <div className="flex flex-1 flex-col items-center justify-start gap-2 overflow-auto py-4">
          {objects.map((obj, index) => (
            <div key={obj.id} className="flex flex-col items-center">
              <PrototypeObjectCard
                object={obj}
                isFocused={obj.id === focusedObjectId}
                propertyLookup={propertyLookup}
              />
              {index < objects.length - 1 && obj.id !== 'null' && (
                <motion.div
                  className="flex flex-col items-center py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-[10px] text-white/40">[[Prototype]]</span>
                  <ArrowDown className="h-4 w-4 text-white/30" aria-hidden="true" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Right Panel - Property Lookup & Console */}
        <div className="flex w-72 flex-col gap-3">
          {/* Property Lookup Animation */}
          {propertyLookup && <PropertyLookupCard lookup={propertyLookup} objects={objects} />}

          {/* Console Output */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d14]">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-2 text-xs text-white/50">Console</span>
            </div>
            <div className="flex-1 overflow-auto p-3">
              <AnimatePresence mode="sync">
                {consoleOutput.map((line, i) => (
                  <motion.div
                    key={`${line}-${i}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      'font-mono text-xs',
                      line.startsWith('//') && 'text-white/40 italic',
                      line.startsWith('>') && 'text-blue-400',
                      line.startsWith('<') && 'text-green-400',
                      line.startsWith('✓') && 'text-green-400',
                      line.startsWith('✗') && 'text-red-400',
                      line.includes('→') && 'text-amber-400',
                      !line.startsWith('//') &&
                        !line.startsWith('>') &&
                        !line.startsWith('<') &&
                        !line.startsWith('✓') &&
                        !line.startsWith('✗') &&
                        !line.includes('→') &&
                        'text-white/70'
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
    </div>
  );
}

/**
 * This binding indicator badge
 */
function ThisBindingBadge({ binding }: { binding: ThisBinding }) {
  const contextColors: Record<string, string> = {
    global: '#6B7280',
    'object-method': '#06B6D4',
    constructor: '#8B5CF6',
    'arrow-function': binding.value.includes('globalThis') ? '#EF4444' : '#22c55e',
    'explicit-bind': '#F97316',
    'event-handler': '#EC4899',
    'class-method': '#8B5CF6',
  };

  const color = contextColors[binding.context] || '#6B7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-center gap-3 self-center rounded-full border px-4 py-2"
      style={{ borderColor: color, backgroundColor: `${color}15` }}
    >
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4" style={{ color }} aria-hidden="true" />
        <span className="text-sm font-medium" style={{ color }}>
          this = {binding.value}
        </span>
      </div>
      <span className="text-xs text-white/50">{binding.explanation}</span>
    </motion.div>
  );
}

/**
 * Prototype object card
 */
interface PrototypeObjectCardProps {
  object: PrototypeObject;
  isFocused: boolean;
  propertyLookup?: PropertyLookup;
}

function PrototypeObjectCard({ object, isFocused, propertyLookup }: PrototypeObjectCardProps) {
  const isInLookupPath = propertyLookup?.path.includes(object.id);
  const isCurrentLookup = propertyLookup?.currentObjectId === object.id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'w-64 rounded-xl border transition-all',
        isFocused && 'ring-2 ring-white/30',
        isCurrentLookup && 'ring-2 ring-amber-500',
        !isFocused && !isCurrentLookup && 'border-white/10'
      )}
      style={{
        borderColor: object.isHighlighted || isFocused ? object.color : undefined,
        backgroundColor: isInLookupPath ? `${object.color}10` : '#1e1e2e',
      }}
    >
      {/* Object Header */}
      <div
        className="flex items-center gap-2 rounded-t-xl border-b border-white/10 px-3 py-2"
        style={{ backgroundColor: `${object.color}20` }}
      >
        <Box className="h-4 w-4" style={{ color: object.color }} aria-hidden="true" />
        <span className="text-sm font-medium" style={{ color: object.color }}>
          {object.name}
        </span>
        {isCurrentLookup && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
            <Search className="h-4 w-4 text-amber-400" aria-hidden="true" />
          </motion.div>
        )}
      </div>

      {/* Properties */}
      <div className="p-2">
        {object.properties.length === 0 ? (
          <div className="py-2 text-center text-xs text-white/30">(end of chain)</div>
        ) : (
          <div className="space-y-1">
            {object.properties.map((prop) => (
              <PropertyItem
                key={prop.name}
                property={prop}
                isSearchTarget={propertyLookup?.propertyName === prop.name && isCurrentLookup}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Property item display
 */
function PropertyItem({
  property,
  isSearchTarget,
}: {
  property: ObjectProperty;
  isSearchTarget: boolean;
}) {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 rounded px-2 py-1 text-xs',
        property.isHighlighted && 'bg-white/10',
        isSearchTarget && 'bg-green-500/20 ring-1 ring-green-500'
      )}
      animate={isSearchTarget ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Circle
        className={cn('h-2 w-2', property.type === 'method' ? 'text-purple-400' : 'text-cyan-400')}
        fill="currentColor"
        aria-hidden="true"
      />
      <span className="font-mono text-white/80">{property.name}</span>
      <span className="text-white/40">:</span>
      <span
        className={cn(
          'truncate font-mono',
          property.type === 'method' ? 'text-purple-400' : 'text-cyan-400'
        )}
      >
        {property.value}
      </span>
      {!property.isOwn && <span className="ml-auto text-[10px] text-white/30">(inherited)</span>}
    </motion.div>
  );
}

/**
 * Property lookup visualization card
 */
function PropertyLookupCard({
  lookup,
  objects,
}: {
  lookup: PropertyLookup;
  objects: PrototypeObject[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3"
    >
      <div className="mb-2 flex items-center gap-2">
        <Search className="h-4 w-4 text-amber-400" aria-hidden="true" />
        <span className="text-xs font-medium text-amber-400">
          Looking for &quot;{lookup.propertyName}&quot;
        </span>
      </div>
      <div className="space-y-1">
        {lookup.path.map((objId, i) => {
          const obj = objects.find((o) => o.id === objId);
          const isCurrent = objId === lookup.currentObjectId;
          const isFound = isCurrent && lookup.found;

          return (
            <motion.div
              key={objId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'flex items-center gap-2 rounded px-2 py-1 text-xs',
                isCurrent && 'bg-white/10'
              )}
            >
              <span className="text-white/40">{i + 1}.</span>
              <span className="text-white/70">{obj?.name || objId}</span>
              <span className="ml-auto">
                {isFound ? (
                  <span className="text-green-400">✓ Found!</span>
                ) : isCurrent ? (
                  <span className="text-amber-400">Checking...</span>
                ) : (
                  <span className="text-white/30">✗</span>
                )}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default PrototypesVisual;
