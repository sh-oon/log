import { type NextRequest, NextResponse } from 'next/server';
import { createPost, getAllPostsIncludingDrafts } from '@/lib/posts';
import type { Post } from '@/types/post';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin1234';

const isAuthorized = (request: NextRequest): boolean => {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${ADMIN_PASSWORD}`;
};

export const GET = async () => {
  const posts = await getAllPostsIncludingDrafts();
  return NextResponse.json(posts);
};

export const POST = async (request: NextRequest) => {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: Post = await request.json();

  if (!body.slug || !body.title || !body.content) {
    return NextResponse.json({ error: 'slug, title, content are required' }, { status: 400 });
  }

  try {
    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 409 });
  }
};
