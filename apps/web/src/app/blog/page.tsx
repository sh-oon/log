import { BlogPostCard } from '@/components/blog/blog-post-card';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Writing</h1>
        <p className="text-gray-500">
          프론트엔드 아키텍처, DX 최적화, 그리고 개발 과정에서의 고민들을 기록합니다.
        </p>
      </div>
      <div className="space-y-12">
        {posts.map((post) => (
          <BlogPostCard
            key={post.slug}
            post={post}
          />
        ))}
      </div>
    </main>
  );
}
