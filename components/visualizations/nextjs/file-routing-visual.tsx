'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FileText,
  FileCode,
  ChevronRight,
  Globe,
  ArrowRight,
  Layout,
  AlertCircle,
  Loader2,
  FileX,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileRoutingState, FileNode, RouteSegment, LayoutWrapper } from '@/lib/types';

interface FileRoutingVisualProps {
  state: FileRoutingState;
  className?: string;
}

export function FileRoutingVisual({ state, className }: FileRoutingVisualProps) {
  const { fileTree, browserBar, matchedSegments, layoutWrappers, annotation, showRouteArrow } =
    state;

  const renderContent = () => {
    try {
      return (
        <div
          className={cn('flex h-full flex-col gap-4', className)}
          aria-label="file-based routing visualization"
        >
          {/* Browser URL Bar */}
          <BrowserURLBar url={browserBar.url} isNavigating={browserBar.isNavigating} />

          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            {/* Left Column: File Tree */}
            <div
              className="border-border/30 bg-card/30 rounded-xl border p-4"
              aria-label="file tree panel"
            >
              <div className="mb-3 flex items-center gap-2">
                <Folder className="h-4 w-4 text-purple-400" aria-hidden="true" />
                <h3 className="text-foreground text-sm font-semibold">File System</h3>
              </div>
              <div className="space-y-1 font-mono text-sm">
                <AnimatePresence mode="popLayout">
                  {fileTree.map((node) => (
                    <FileTreeNode key={node.id} node={node} depth={0} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Route Resolution / Layout Nesting */}
            <div className="flex flex-col gap-4">
              {/* Matched Route Segments */}
              {matchedSegments.length > 0 && (
                <div
                  className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4"
                  aria-label="route segments panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Route Resolution</h3>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {matchedSegments.map((seg) => (
                        <RouteSegmentItem key={seg.id} segment={seg} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Layout Nesting */}
              {layoutWrappers.length > 0 && (
                <div
                  className="flex-1 rounded-xl border border-pink-500/30 bg-pink-500/10 p-4"
                  aria-label="layout nesting panel"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Layout className="h-4 w-4 text-pink-400" aria-hidden="true" />
                    <h3 className="text-foreground text-sm font-semibold">Layout Nesting</h3>
                  </div>
                  <LayoutNesting wrappers={layoutWrappers} />
                </div>
              )}

              {/* Route Arrow & Annotation */}
              {showRouteArrow && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
                  aria-label="route annotation"
                >
                  <ArrowRight className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span className="text-sm text-emerald-300">{annotation}</span>
                </motion.div>
              )}

              {/* Annotation when no arrow */}
              {!showRouteArrow && annotation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
                  aria-label="route annotation"
                >
                  <span className="text-sm text-amber-300">{annotation}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('FileRoutingVisual render error:', error);
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-muted-foreground">Failed to render visualization</p>
        </div>
      );
    }
  };

  return renderContent();
}

// Browser URL bar component
function BrowserURLBar({ url, isNavigating }: { url: string; isNavigating: boolean }) {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3',
        isNavigating ? 'border-purple-500/50 bg-purple-500/10' : 'border-border/30 bg-card/30'
      )}
      animate={
        isNavigating
          ? {
              borderColor: ['rgba(139,92,246,0.5)', 'rgba(139,92,246,0.8)', 'rgba(139,92,246,0.5)'],
            }
          : {}
      }
      transition={{ duration: 1.5, repeat: isNavigating ? Infinity : 0 }}
      aria-label="browser url bar"
    >
      {/* Browser dots */}
      <div className="flex gap-1.5" aria-hidden="true">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
      </div>

      {/* URL display */}
      <div className="bg-background/50 flex flex-1 items-center gap-2 rounded-lg px-3 py-1.5">
        <Globe className="text-muted-foreground h-3.5 w-3.5" aria-hidden="true" />
        <motion.span
          key={url}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-foreground font-mono text-sm"
        >
          localhost:3000{url}
        </motion.span>
        {isNavigating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" aria-hidden="true" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// File tree node (recursive)
function FileTreeNode({ node, depth }: { node: FileNode; depth: number }) {
  const isFolder = node.type === 'folder';
  const paddingLeft = depth * 20;

  const getFileIcon = () => {
    if (isFolder) {
      if (node.isRouteGroup)
        return <Folder className="h-4 w-4 text-amber-400" aria-hidden="true" />;
      if (node.isDynamic) return <Folder className="h-4 w-4 text-purple-400" aria-hidden="true" />;
      return <Folder className="h-4 w-4 text-blue-400" aria-hidden="true" />;
    }
    switch (node.specialType) {
      case 'layout':
        return <Layout className="h-4 w-4 text-pink-400" aria-hidden="true" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-yellow-400" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" aria-hidden="true" />;
      case 'not-found':
        return <FileX className="h-4 w-4 text-orange-400" aria-hidden="true" />;
      case 'route':
        return <FileCode className="h-4 w-4 text-emerald-400" aria-hidden="true" />;
      default:
        return <FileText className="h-4 w-4 text-cyan-400" aria-hidden="true" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1 transition-all',
          node.isHighlighted && 'bg-purple-500/20 ring-1 ring-purple-500/50',
          node.isActive && 'bg-cyan-500/20 ring-1 ring-cyan-500/50'
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        animate={node.isActive ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 1.5, repeat: node.isActive ? Infinity : 0 }}
        aria-label={`${node.type} ${node.name}`}
      >
        {isFolder && (
          <ChevronRight
            className={cn(
              'text-muted-foreground h-3 w-3 transition-transform',
              node.isExpanded && 'rotate-90'
            )}
            aria-hidden="true"
          />
        )}
        {!isFolder && <span className="w-3" aria-hidden="true" />}
        {getFileIcon()}
        <span
          className={cn(
            'text-xs',
            node.isHighlighted ? 'font-semibold text-purple-300' : 'text-foreground/80',
            node.isActive && 'font-semibold text-cyan-300',
            node.isDynamic && 'text-purple-300',
            node.isRouteGroup && 'text-amber-300 italic'
          )}
        >
          {node.name}
        </span>
        {node.routePath && node.isActive && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-auto font-mono text-[10px] text-emerald-400"
          >
            → {node.routePath}
          </motion.span>
        )}
      </motion.div>

      {/* Children */}
      {isFolder && node.isExpanded && node.children && (
        <AnimatePresence mode="popLayout">
          {node.children.map((child) => (
            <FileTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

// Route segment item
function RouteSegmentItem({ segment }: { segment: RouteSegment }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className={cn(
        'flex items-center justify-between rounded-lg px-3 py-2 text-xs',
        segment.isHighlighted ? 'bg-cyan-500/20 ring-1 ring-cyan-500/50' : 'bg-card/30'
      )}
      aria-label={`route segment ${segment.segment}`}
    >
      <div className="flex items-center gap-2">
        {segment.isDynamic && (
          <span className="rounded bg-purple-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300">
            DYNAMIC
          </span>
        )}
        <span
          className={cn(
            'font-mono',
            segment.isHighlighted ? 'font-semibold text-cyan-300' : 'text-foreground/70'
          )}
        >
          {segment.segment}
        </span>
      </div>
      <span className="text-muted-foreground font-mono">{segment.filePath}</span>
    </motion.div>
  );
}

// Layout nesting visualization (nested boxes)
function LayoutNesting({ wrappers }: { wrappers: LayoutWrapper[] }) {
  if (wrappers.length === 0) return null;

  const renderWrapper = (index: number): React.ReactNode => {
    if (index >= wrappers.length) return null;
    const wrapper = wrappers[index];
    const isLast = index === wrappers.length - 1;

    const colors = [
      { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-300' },
      { border: 'border-pink-500/40', bg: 'bg-pink-500/10', text: 'text-pink-300' },
      { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-300' },
      { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
    ];
    const colorSet = colors[index % colors.length];

    return (
      <motion.div
        key={wrapper.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.15 }}
        className={cn(
          'rounded-lg border-2 p-3',
          colorSet.border,
          colorSet.bg,
          wrapper.isActive && 'ring-1 ring-offset-1 ring-offset-transparent'
        )}
        style={{ '--tw-ring-color': colorSet.border } as React.CSSProperties}
        aria-label={`layout wrapper ${wrapper.name}`}
      >
        <div className="mb-2 flex items-center gap-2">
          <Layout className={cn('h-3 w-3', colorSet.text)} aria-hidden="true" />
          <span className={cn('text-xs font-semibold', colorSet.text)}>{wrapper.name}</span>
          <span className="text-muted-foreground font-mono text-[10px]">{wrapper.filePath}</span>
        </div>
        {!isLast ? (
          <div className="mt-1 ml-2">{renderWrapper(index + 1)}</div>
        ) : (
          <div className="border-foreground/20 bg-background/30 mt-1 ml-2 rounded border border-dashed px-3 py-2">
            <span className="text-muted-foreground text-xs">{'{ children }'}</span>
          </div>
        )}
      </motion.div>
    );
  };

  return <>{renderWrapper(0)}</>;
}

export default FileRoutingVisual;
