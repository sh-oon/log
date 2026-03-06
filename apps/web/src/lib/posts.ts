import fs from 'node:fs/promises';
import path from 'node:path';
import type { Post, PostMeta } from '@/types/post';

const POSTS_PATH = path.join(process.cwd(), 'src/data/posts.json');

const readPostsFile = async (): Promise<Post[]> => {
  const raw = await fs.readFile(POSTS_PATH, 'utf-8');
  return JSON.parse(raw);
};

const writePostsFile = async (posts: Post[]): Promise<void> => {
  await fs.writeFile(POSTS_PATH, JSON.stringify(posts, null, 2), 'utf-8');
};

export const getAllPosts = async (): Promise<PostMeta[]> => {
  const posts = await readPostsFile();
  return posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ content: _, ...meta }) => meta);
};

export const getAllPostsIncludingDrafts = async (): Promise<PostMeta[]> => {
  const posts = await readPostsFile();
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ content: _, ...meta }) => meta);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await readPostsFile();
  return posts.find((p) => p.slug === slug) ?? null;
};

export const createPost = async (post: Post): Promise<Post> => {
  const posts = await readPostsFile();
  const exists = posts.some((p) => p.slug === post.slug);
  if (exists) {
    throw new Error(`Post with slug "${post.slug}" already exists`);
  }
  posts.push(post);
  await writePostsFile(posts);
  return post;
};

export const updatePost = async (slug: string, data: Partial<Post>): Promise<Post> => {
  const posts = await readPostsFile();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  posts[index] = { ...posts[index], ...data };
  await writePostsFile(posts);
  return posts[index];
};

export const deletePost = async (slug: string): Promise<void> => {
  const posts = await readPostsFile();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (filtered.length === posts.length) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  await writePostsFile(filtered);
};
