import Image from 'next/image';
import type { Components } from 'react-markdown';
import { CodeBlock, InlineCode } from './code-block';

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="title-xl-bold mt-12 mb-4 text-foreground border-b border-border pb-3">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="title-lg-bold mt-10 mb-3 text-foreground border-b border-border pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="title-md-semibold mt-8 mb-3 text-foreground">{children}</h3>,
  h4: ({ children }) => <h4 className="title-sm-semibold mt-6 mb-2 text-foreground">{children}</h4>,
  h5: ({ children }) => <h5 className="title-xs-semibold mt-4 mb-2 text-foreground">{children}</h5>,
  h6: ({ children }) => (
    <h6 className="title-xs-medium mt-4 mb-2 text-muted-foreground">{children}</h6>
  ),

  p: ({ children }) => <p className="text-md-regular text-foreground leading-7 my-4">{children}</p>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:text-blue-600 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),

  img: ({ src, alt }) => (
    <figure className="my-6">
      <Image
        src={typeof src === 'string' ? src : ''}
        alt={alt ?? ''}
        width={768}
        height={432}
        className="rounded-lg border border-border w-full h-auto"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm-regular text-muted-foreground">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-primary pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),

  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc space-y-1 text-md-regular text-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal space-y-1 text-md-regular text-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,

  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm-regular">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-sm-semibold text-foreground border-b border-border">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-foreground border-b border-border">{children}</td>
  ),

  hr: () => <hr className="my-8 border-border" />,

  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,

  pre: ({ children }) => <>{children}</>,

  code: ({ className, children }) => {
    const isBlock = className?.includes('language-') || String(children).includes('\n');

    if (isBlock) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }

    return <InlineCode>{children}</InlineCode>;
  },
};
