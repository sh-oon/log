import { Text } from '@orka-log/ui';
import type { Metadata } from 'next';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { GroupSelector } from '@/components/blog/group-selector';
import { getAvailableGroupKeys, groupPosts, parseGroupKey } from '@/lib/post-grouping';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: '프론트엔드 아키텍처, DX 최적화, 그리고 개발 과정에서의 고민들을 기록합니다.',
};

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  searchParams: Promise<{ group?: string | string[] }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getAllPosts();
  const availableKeys = getAvailableGroupKeys(posts);

  const requestedKey = parseGroupKey((await searchParams).group);
  const groupKey = availableKeys.includes(requestedKey) ? requestedKey : 'none';
  const groups = groupPosts(posts, groupKey);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Writing</h1>
        <p className="text-gray-500">
          프론트엔드 아키텍처, DX 최적화, 그리고 개발 과정에서의 고민들을 기록합니다.
        </p>
      </div>

      <div className="mb-10">
        <GroupSelector
          options={availableKeys}
          active={groupKey}
        />
      </div>

      <div className="space-y-16">
        {groups.map((group) => (
          <section key={group.key}>
            {groupKey !== 'none' && (
              <div className="flex items-baseline gap-2 mb-6 pb-2 border-b border-border">
                <Text
                  as="h2"
                  typography="text-lg-bold"
                  color={group.isFallback ? 'muted' : undefined}
                >
                  {group.label}
                </Text>
                <Text
                  as="span"
                  typography="text-xs-regular"
                  color="muted"
                  className="font-mono"
                >
                  {group.posts.length}
                </Text>
              </div>
            )}
            <div className="space-y-12">
              {group.posts.map((post) => (
                <BlogPostCard
                  key={post.slug}
                  post={post}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
