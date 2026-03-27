import Link from 'next/link';
import { Badge, Flex, Text } from '@orka-log/ui';
import type { PostMeta } from '@/types/post';

interface BlogPostCardProps {
  post: PostMeta;
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block cursor-pointer border-b border-border pb-8"
  >
    <Flex
      align="center"
      gap={3}
      className="text-xs font-mono text-muted-foreground mb-3"
    >
      <span>{post.date}</span>
      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
      <Badge>{post.category}</Badge>
    </Flex>
    <Text
      as="h3"
      typography="title-sm-bold"
      className="mb-3 group-hover:text-primary transition-colors leading-tight"
    >
      {post.title}
    </Text>
    <Text
      typography="text-sm-regular"
      color="muted"
      className="leading-relaxed"
    >
      {post.excerpt}
    </Text>
  </Link>
);
