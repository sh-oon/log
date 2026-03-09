import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon, Text } from '@sunghoon-log/ui';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { getPostBySlug } from '@/lib/posts';

export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <Icon
          name="arrow-left"
          size={16}
          className="mr-1"
        />
        Back to posts
      </Link>

      <article>
        <div className="flex items-center space-x-3 text-xs font-mono text-muted-foreground mb-4">
          <span>{post.date}</span>
          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
          <span className="text-primary font-bold uppercase tracking-widest">{post.category}</span>
        </div>

        <Text
          as="h1"
          typography="title-2xl-bold"
          className="mb-6 tracking-tight leading-tight"
        >
          {post.title}
        </Text>

        <Text
          typography="text-lg-regular"
          color="muted"
          className="mb-12"
        >
          {post.excerpt}
        </Text>

        <MarkdownRenderer content={post.content} />
      </article>
    </main>
  );
}
