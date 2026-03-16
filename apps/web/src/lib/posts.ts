import type { Post, PostMeta } from '@/types/post';
import { readJson, writeJson } from './storage';

const FILE_PATH = 'src/data/posts.json';
const BLOB_PATH = 'data/posts.json';

const toMeta = ({ content: _, ...meta }: Post): PostMeta => meta;

const readPosts = async (): Promise<Post[]> => readJson<Post[]>(FILE_PATH, BLOB_PATH);

const writePosts = async (posts: Post[]): Promise<void> => writeJson(FILE_PATH, BLOB_PATH, posts);

export const getAllPosts = async (): Promise<PostMeta[]> => {
  const posts = await readPosts();
  return posts
    .filter((p) => p.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(toMeta);
};

export const getAllPostsIncludingDrafts = async (): Promise<PostMeta[]> => {
  const posts = await readPosts();
  return posts.sort((a, b) => b.date.localeCompare(a.date)).map(toMeta);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await readPosts();
  return posts.find((p) => p.slug === slug) ?? null;
};

export const createPost = async (post: Post): Promise<Post> => {
  const posts = await readPosts();
  if (posts.some((p) => p.slug === post.slug)) {
    throw new Error(`Post with slug "${post.slug}" already exists`);
  }
  posts.push(post);
  await writePosts(posts);
  return post;
};

export const updatePost = async (slug: string, updates: Partial<Post>): Promise<Post> => {
  const posts = await readPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  posts[index] = { ...posts[index], ...updates };
  await writePosts(posts);
  return posts[index];
};

export const deletePost = async (slug: string): Promise<void> => {
  const posts = await readPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  posts.splice(index, 1);
  await writePosts(posts);
};
