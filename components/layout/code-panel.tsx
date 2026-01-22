'use client';

import { useEffect, useState, useMemo } from 'react';
import { codeToHtml } from 'shiki';
import { cn } from '@/lib/utils';

interface CodePanelProps {
  code: string;
  language?: string;
  highlightedLines?: number[];
  showLineNumbers?: boolean;
  className?: string;
}

export function CodePanel({
  code,
  language = 'javascript',
  highlightedLines = [],
  showLineNumbers = true,
  className,
}: CodePanelProps) {
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const lines = useMemo(() => code.split('\n'), [code]);

  useEffect(() => {
    const highlightCode = async () => {
      setIsLoading(true);
      try {
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: 'tokyo-night',
        });
        setHtml(highlighted);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language]);

  if (isLoading) {
    return (
      <div
        className={cn('flex h-full items-center justify-center', className)}
        aria-label="loading code"
      >
        <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={cn('h-full overflow-auto', className)} aria-label="code panel">
      {/* Header */}
      <div className="border-border/30 sticky top-0 z-10 flex items-center justify-between border-b bg-[#1a1b26] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" aria-hidden="true" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" aria-hidden="true" />
          </div>
          <span className="text-muted-foreground text-xs">{language}</span>
        </div>
      </div>

      {/* Code content with line highlighting */}
      <div className="relative p-4">
        {showLineNumbers ? (
          <div className="font-mono text-sm leading-relaxed">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightedLines.includes(lineNumber);

              return (
                <div
                  key={index}
                  className={cn(
                    '-mx-4 flex px-4 transition-colors duration-200',
                    isHighlighted && 'bg-primary/20 border-primary border-l-2'
                  )}
                >
                  <span
                    className={cn(
                      'mr-4 inline-block w-6 text-right select-none',
                      isHighlighted ? 'text-primary' : 'text-muted-foreground/50'
                    )}
                    aria-hidden="true"
                  >
                    {lineNumber}
                  </span>
                  <CodeLine line={line} language={language} />
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="[&>pre]:!bg-transparent [&>pre]:!p-0"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}

interface CodeLineProps {
  line: string;
  language: string;
}

function CodeLine({ line, language }: CodeLineProps) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const highlight = async () => {
      try {
        // Add a space to empty lines to maintain height
        const content = line || ' ';
        const highlighted = await codeToHtml(content, {
          lang: language,
          theme: 'tokyo-night',
        });
        // Extract just the inner content
        const match = highlighted.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        if (match) {
          setHtml(match[1]);
        } else {
          setHtml(content);
        }
      } catch {
        setHtml(line);
      }
    };
    highlight();
  }, [line, language]);

  return (
    <span
      className="flex-1 whitespace-pre"
      dangerouslySetInnerHTML={{ __html: html || line || ' ' }}
    />
  );
}

interface CodeSnippetProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeSnippet({ code, language = 'javascript', className }: CodeSnippetProps) {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    const highlight = async () => {
      try {
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: 'tokyo-night',
        });
        setHtml(highlighted);
      } catch {
        setHtml(`<pre><code>${code}</code></pre>`);
      }
    };
    highlight();
  }, [code, language]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg [&>pre]:!rounded-lg [&>pre]:!p-3 [&>pre]:text-sm',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label="code snippet"
    />
  );
}
