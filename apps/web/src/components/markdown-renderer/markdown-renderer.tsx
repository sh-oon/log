'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from './markdown-components';

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeRaw];

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => (
  <div className="max-w-none">
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  </div>
);
