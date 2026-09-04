import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { validateNewPost } from '@/lib/post-validation';
import { createPost, getAllPosts, getAllPostsIncludingDrafts } from '@/lib/posts';

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validated = validateNewPost(body);
  if (!validated.data) return NextResponse.json({ error: validated.error }, { status: 400 });

  try {
    const post = await createPost(validated.data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 409 });
  }
};
