'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Play, 
  Pause, 
  Clock,
  Layers,
  ArrowRight,
  ArrowDown,
  CornerDownRight,
  Circle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  FiberState,
  FiberNode,
  WorkLoop,
  LaneVisualization,
  FiberEvent,
  FiberOutput,
  WorkPhase,
  PriorityLane,
} from '@/lib/types';

interface FiberVisualProps {
  state: FiberState;
  className?: string;
}

export function FiberVisual({ state, className }: FiberVisualProps) {
  const {
    currentTree,
    wipTree,
    workLoop,
    timeline,
    lanes,
    output,
    activePanel,
    showAlternate,
    showPointers,
  } = state;

  const renderContent = () => {
    try {
      return (
        <div
          className={cn('grid h-full gap-4 lg:grid-cols-2', className)}
          aria-label="react fiber visualization"
        >
          {/* Left Column: Fiber Trees */}
          <div className="flex flex-col gap-4">
            {/* Trees Panel */}
            <div
              className={cn(
                'flex-1 rounded-xl border p-4 transition-all duration-300',
                activePanel === 'trees'
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="fiber trees"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Fiber Trees</h3>
                </div>
                <WorkPhaseIndicator phase={workLoop.phase} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Current Tree */}
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
                  <h4 className="mb-2 text-xs font-semibold text-blue-400">Current Tree</h4>
                  {currentTree ? (
                    <FiberTreeView node={currentTree} showPointers={showPointers} isWip={false} />
                  ) : (
                    <p className="text-muted-foreground/50 text-xs italic">No current tree</p>
                  )}
                </div>

                {/* WIP Tree */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <h4 className="mb-2 text-xs font-semibold text-amber-400">Work-In-Progress</h4>
                  {wipTree ? (
                    <FiberTreeView node={wipTree} showPointers={showPointers} isWip={true} />
                  ) : (
                    <p className="text-muted-foreground/50 text-xs italic">No WIP tree</p>
                  )}
                </div>
              </div>

              {showAlternate && currentTree && wipTree && (
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Current</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-purple-400">.alternate</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>WIP</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Work Loop, Lanes, Timeline */}
          <div className="flex flex-col gap-4">
            {/* Work Loop */}
            <div
              className={cn(
                'rounded-xl border p-4 transition-all duration-300',
                activePanel === 'workloop'
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="work loop"
            >
              <div className="mb-3 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <h3 className="text-foreground text-sm font-semibold">Work Loop</h3>
              </div>
              <WorkLoopView workLoop={workLoop} />
            </div>

            {/* Priority Lanes */}
            <div
              className={cn(
                'rounded-xl border p-4 transition-all duration-300',
                activePanel === 'lanes'
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-border/30 bg-card/30'
              )}
              aria-label="priority lanes"
            >
              <div className="mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" aria-hidden="true" />
                <h3 className="text-foreground text-sm font-semibold">Priority Lanes</h3>
              </div>
              <LanesView lanes={lanes} />
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
              <div
                className={cn(
                  'rounded-xl border p-4 transition-all duration-300',
                  activePanel === 'timeline'
                    ? 'border-pink-500/50 bg-pink-500/10'
                    : 'border-border/30 bg-card/30'
                )}
                aria-label="event timeline"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-pink-400" aria-hidden="true" />
                  <h3 className="text-foreground text-sm font-semibold">Timeline</h3>
                </div>
                <TimelineView events={timeline} />
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
                <span className="text-muted-foreground text-xs font-medium">Fiber Log</span>
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
      console.error('FiberVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Fiber tree visualization
function FiberTreeView({ 
  node, 
  showPointers, 
  isWip,
  depth = 0 
}: { 
  node: FiberNode; 
  showPointers: boolean; 
  isWip: boolean;
  depth?: number;
}) {
  const tagColors: Record<string, string> = {
    HostRoot: 'border-gray-500 bg-gray-500/10',
    FunctionComponent: 'border-purple-500 bg-purple-500/10',
    HostComponent: 'border-cyan-500 bg-cyan-500/10',
    HostText: 'border-green-500 bg-green-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('relative', depth > 0 && 'ml-3 mt-1')}
    >
      {/* Fiber Node */}
      <div
        className={cn(
          'rounded border px-2 py-1 text-xs transition-all',
          tagColors[node.tag] || 'border-muted-foreground/30',
          node.isHighlighted && 'ring-2 ring-offset-1 ring-offset-background',
          node.isHighlighted && (isWip ? 'ring-amber-500' : 'ring-blue-500'),
          node.isProcessing && 'animate-pulse'
        )}
      >
        <div className="flex items-center gap-1">
          <span className="font-medium text-foreground">{node.type}</span>
          {node.isProcessing && (
            <RefreshCw className="h-3 w-3 animate-spin text-amber-400" />
          )}
          {node.isComplete && (
            <CheckCircle className="h-3 w-3 text-emerald-400" />
          )}
        </div>
        
        {node.flags && node.flags.length > 0 && node.flags[0] !== 'NoFlags' && (
          <div className="mt-1 flex flex-wrap gap-1">
            {node.flags.filter(f => f !== 'NoFlags').map((flag, i) => (
              <span key={i} className="rounded bg-amber-500/20 px-1 text-[10px] text-amber-300">
                {flag}
              </span>
            ))}
          </div>
        )}

        {showPointers && (
          <div className="mt-1 flex gap-2 text-[10px] text-muted-foreground">
            {node.child && <span>child→</span>}
            {node.sibling && <span>sibling→</span>}
            {node.return && <span>return↑</span>}
          </div>
        )}
      </div>

      {/* Child */}
      {node.child && (
        <div className="relative ml-2 border-l border-dashed border-muted-foreground/30 pl-2">
          {showPointers && (
            <ArrowDown className="absolute -left-[5px] top-0 h-3 w-3 text-muted-foreground/50" />
          )}
          <FiberTreeView node={node.child} showPointers={showPointers} isWip={isWip} depth={depth + 1} />
        </div>
      )}

      {/* Sibling */}
      {node.sibling && (
        <div className="relative mt-1">
          {showPointers && (
            <CornerDownRight className="absolute -left-1 -top-1 h-3 w-3 text-muted-foreground/50" />
          )}
          <FiberTreeView node={node.sibling} showPointers={showPointers} isWip={isWip} depth={depth} />
        </div>
      )}
    </motion.div>
  );
}

// Work loop visualization
function WorkLoopView({ workLoop }: { workLoop: WorkLoop }) {
  return (
    <div className="space-y-3">
      {/* Phase */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Phase:</span>
        <span className={cn(
          'rounded px-2 py-0.5 text-xs font-medium',
          workLoop.phase === 'idle' ? 'bg-gray-500/20 text-gray-300' :
          workLoop.phase === 'finished' ? 'bg-emerald-500/20 text-emerald-300' :
          'bg-cyan-500/20 text-cyan-300'
        )}>
          {workLoop.phase}
        </span>
      </div>

      {/* Time Remaining */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Time remaining:</span>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn(
                'h-full rounded-full',
                workLoop.timeRemaining > 10 ? 'bg-emerald-500' :
                workLoop.timeRemaining > 5 ? 'bg-amber-500' :
                'bg-red-500'
              )}
              initial={{ width: '100%' }}
              animate={{ width: `${(workLoop.timeRemaining / 16) * 100}%` }}
            />
          </div>
          <span className="text-xs text-foreground">{workLoop.timeRemaining}ms</span>
        </div>
      </div>

      {/* Yielding Status */}
      {workLoop.isYielding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded bg-amber-500/20 px-2 py-1 text-xs text-amber-300"
        >
          ⏸ Yielding to browser...
        </motion.div>
      )}

      {/* Current Lane */}
      {workLoop.currentLane && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Current lane:</span>
          <LaneBadge lane={workLoop.currentLane} />
        </div>
      )}

      {/* Work Units */}
      {workLoop.unitsOfWork > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Units processed:</span>
          <span className="text-xs text-foreground">{workLoop.unitsOfWork}</span>
        </div>
      )}
    </div>
  );
}

// Lane badge
function LaneBadge({ lane }: { lane: PriorityLane }) {
  const laneConfig: Record<PriorityLane, { color: string; label: string }> = {
    SyncLane: { color: 'bg-red-500/20 text-red-300', label: 'Sync' },
    InputContinuousLane: { color: 'bg-orange-500/20 text-orange-300', label: 'Input' },
    DefaultLane: { color: 'bg-yellow-500/20 text-yellow-300', label: 'Default' },
    TransitionLane: { color: 'bg-emerald-500/20 text-emerald-300', label: 'Transition' },
    IdleLane: { color: 'bg-gray-500/20 text-gray-300', label: 'Idle' },
  };

  const cfg = laneConfig[lane];
  return (
    <span className={cn('rounded px-2 py-0.5 text-xs', cfg.color)}>
      {cfg.label}
    </span>
  );
}

// Priority lanes visualization
function LanesView({ lanes }: { lanes: LaneVisualization[] }) {
  return (
    <div className="space-y-2">
      {lanes.map((lane) => (
        <motion.div
          key={lane.lane}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all',
            lane.isActive ? 'bg-purple-500/20 ring-1 ring-purple-500' : 'bg-card/50'
          )}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: lane.color }}
            aria-hidden="true"
          />
          <span className="text-foreground flex-1">{lane.label}</span>
          {lane.pendingWork > 0 && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
              {lane.pendingWork} pending
            </span>
          )}
          {lane.isActive && (
            <Circle className="h-3 w-3 animate-pulse fill-current text-emerald-400" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Timeline visualization
function TimelineView({ events }: { events: FiberEvent[] }) {
  const eventIcons: Record<string, React.ReactNode> = {
    schedule: <Clock className="h-3 w-3" />,
    begin: <Play className="h-3 w-3" />,
    complete: <CheckCircle className="h-3 w-3" />,
    yield: <Pause className="h-3 w-3" />,
    resume: <Play className="h-3 w-3" />,
    commit: <Layers className="h-3 w-3" />,
  };

  const eventColors: Record<string, string> = {
    schedule: 'text-purple-400',
    begin: 'text-cyan-400',
    complete: 'text-emerald-400',
    yield: 'text-amber-400',
    resume: 'text-blue-400',
    commit: 'text-pink-400',
  };

  return (
    <div className="space-y-2 max-h-[120px] overflow-y-auto">
      {events.map((event) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs',
            event.isActive ? 'bg-pink-500/20 ring-1 ring-pink-500' : 'bg-card/50'
          )}
        >
          <span className={eventColors[event.type]}>{eventIcons[event.type]}</span>
          <span className="text-foreground">{event.description}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Work phase indicator
function WorkPhaseIndicator({ phase }: { phase: WorkPhase }) {
  const phaseLabels: Record<WorkPhase, string> = {
    idle: 'Idle',
    schedule: 'Scheduling',
    'begin-work': 'Begin Work',
    'complete-work': 'Complete Work',
    'commit-before': 'Pre-Commit',
    'commit-mutation': 'Mutation',
    'commit-layout': 'Layout',
    finished: 'Finished',
  };

  const isActive = !['idle', 'finished'].includes(phase);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={cn(
          'h-2 w-2 rounded-full',
          phase === 'finished' ? 'bg-emerald-400' :
          isActive ? 'bg-cyan-400' : 'bg-muted-foreground/50'
        )}
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <span className={cn(
        'text-xs font-medium',
        phase === 'finished' ? 'text-emerald-400' :
        isActive ? 'text-cyan-400' : 'text-muted-foreground'
      )}>
        {phaseLabels[phase]}
      </span>
    </div>
  );
}

// Output message
function OutputMessage({ message }: { message: FiberOutput }) {
  const icons: Record<string, string> = {
    info: 'ℹ',
    schedule: '📋',
    work: '⚙',
    yield: '⏸',
    commit: '✓',
    warning: '⚠',
  };

  const colors: Record<string, string> = {
    info: 'text-cyan-400',
    schedule: 'text-purple-400',
    work: 'text-emerald-400',
    yield: 'text-amber-400',
    commit: 'text-pink-400',
    warning: 'text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2"
    >
      <span className={cn('select-none', colors[message.type])}>
        {icons[message.type]}
      </span>
      <span className="text-foreground/80">{message.message}</span>
    </motion.div>
  );
}

export default FiberVisual;
