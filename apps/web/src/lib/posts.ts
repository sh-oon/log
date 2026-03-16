import fs from 'node:fs';
import path from 'node:path';
import type { Post, PostMeta } from '@/types/post';

const POSTS_FILE = path.join(process.cwd(), 'src/data/posts.json');

const readPosts = (): Post[] => {
  const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
  return JSON.parse(raw);
};

const writePosts = (posts: Post[]): void => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Write operations are only available in development mode');
  }
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
};

const toMeta = ({ content: _, ...meta }: Post): PostMeta => meta;

export const getAllPosts = async (): Promise<PostMeta[]> => {
  const posts = readPosts();
  return posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date)).map(toMeta);
};

export const getAllPostsIncludingDrafts = async (): Promise<PostMeta[]> => {
  const posts = readPosts();
  return posts.sort((a, b) => b.date.localeCompare(a.date)).map(toMeta);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = readPosts();
  return posts.find((p) => p.slug === slug) ?? null;
};

export const createPost = async (post: Post): Promise<Post> => {
  const posts = readPosts();
  if (posts.some((p) => p.slug === post.slug)) {
    throw new Error(`Post with slug "${post.slug}" already exists`);
  }
  posts.push(post);
  writePosts(posts);
  return post;
};

export const updatePost = async (slug: string, updates: Partial<Post>): Promise<Post> => {
  const posts = readPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  posts[index] = { ...posts[index], ...updates };
  writePosts(posts);
  return posts[index];
};

export const deletePost = async (slug: string): Promise<void> => {
  const posts = readPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  posts.splice(index, 1);
  writePosts(posts);
};
