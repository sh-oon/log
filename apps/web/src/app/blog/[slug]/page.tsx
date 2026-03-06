import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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

  const paragraphs = post.content.split('\n').filter((line) => line.trim() !== '');

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft
          size={16}
          className="mr-1"
        />
        Back to posts
      </Link>

      <article>
        <div className="flex items-center space-x-3 text-xs font-mono text-gray-400 mb-4">
          <span>{post.date}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-blue-500 font-bold uppercase tracking-widest">{post.category}</span>
        </div>

        <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">{post.title}</h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 font-light">{post.excerpt}</p>

        <div className="prose dark:prose-invert max-w-none space-y-4">
          {paragraphs.map((line) => {
            if (line.startsWith('# ')) {
              return (
                <h1
                  key={line}
                  className="text-3xl font-bold mt-8 mb-4"
                >
                  {line.slice(2)}
                </h1>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h2
                  key={line}
                  className="text-2xl font-bold mt-8 mb-3"
                >
                  {line.slice(3)}
                </h2>
              );
            }
            if (line.startsWith('- ')) {
              return (
                <li
                  key={line}
                  className="text-gray-600 dark:text-gray-400 ml-4"
                >
                  {line.slice(2)}
                </li>
              );
            }
            return (
              <p
                key={line}
                className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {line}
              </p>
            );
          })}
        </div>
      </article>
    </main>
  );
}
