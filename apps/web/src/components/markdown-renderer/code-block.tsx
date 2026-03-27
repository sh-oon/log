'use client';

import { useState } from 'react';
import { Icon } from '@orka-log/ui';

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

const extractLanguage = (className?: string): string | null =>
  className?.match(/language-(\w+)/)?.[1] ?? null;

export const CodeBlock = ({ className, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const language = extractLanguage(className);
  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-lg border border-border bg-muted overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        {language && (
          <span className="text-xs-medium text-muted-foreground uppercase tracking-wider">
            {language}
          </span>
        )}
        {!language && <span />}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon
            name={copied ? 'check' : 'copy'}
            size={14}
          />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm-regular leading-relaxed !m-0 !bg-transparent">
        <code className={className}>{codeText}</code>
      </pre>
    </div>
  );
};

export const InlineCode = ({ children }: { children?: React.ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded-md bg-muted border border-border text-sm-medium text-foreground">
    {children}
  </code>
);
