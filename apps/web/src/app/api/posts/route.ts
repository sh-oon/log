import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createPost, getAllPosts, getAllPostsIncludingDrafts } from '@/lib/posts';
import type { Post } from '@/types/post';

const isDev = process.env.NODE_ENV === 'development';

export const GET = async () => {
  const session = isDev || (await auth());
  const posts = session ? await getAllPostsIncludingDrafts() : await getAllPosts();
  return NextResponse.json(posts);
};

export const POST = async (request: Request) => {
  const session = isDev || (await auth());
  if (!session) {
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
