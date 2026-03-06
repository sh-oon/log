import Link from 'next/link';
import { Badge } from '@sunghoon-log/ui';
import type { PostMeta } from '@/types/post';

interface BlogPostCardProps {
  post: PostMeta;
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block cursor-pointer border-b border-gray-100 dark:border-white/5 pb-8"
  >
    <div className="flex items-center space-x-3 text-xs font-mono text-gray-400 mb-3">
      <span>{post.date}</span>
      <span className="w-1 h-1 bg-gray-300 rounded-full" />
      <Badge>{post.category}</Badge>
    </div>
    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
      {post.title}
    </h3>
    <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-light">
      {post.excerpt}
    </p>
  </Link>
);
