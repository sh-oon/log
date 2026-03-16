import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deletePost, getPostBySlug, updatePost } from '@/lib/posts';

const isDev = process.env.NODE_ENV === 'development';

type RouteParams = { params: Promise<{ slug: string }> };

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(post);
};

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  const session = isDev || (await auth());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json();

  try {
    const post = await updatePost(slug, body);
    return NextResponse.json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 404 });
  }
};

export const DELETE = async (_request: NextRequest, { params }: RouteParams) => {
  const session = isDev || (await auth());
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;

  try {
    await deletePost(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 404 });
  }
};
