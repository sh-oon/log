import type { Post, PostMeta } from '@/types/post';
import { supabase, supabaseAdmin } from './supabase';

export const getAllPosts = async (): Promise<PostMeta[]> => {
  const { data, error } = await supabase
    .get()
    .from('posts')
    .select('slug, title, excerpt, category, date, published')
    .eq('published', true)
    .order('date', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const getAllPostsIncludingDrafts = async (): Promise<PostMeta[]> => {
  const { data, error } = await supabaseAdmin
    .get()
    .from('posts')
    .select('slug, title, excerpt, category, date, published')
    .order('date', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabaseAdmin
    .get()
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
};

export const createPost = async (post: Post): Promise<Post> => {
  const { data, error } = await supabaseAdmin.get().from('posts').insert(post).select().single();

  if (error) throw new Error(error.message);
  return data;
};

export const updatePost = async (slug: string, updates: Partial<Post>): Promise<Post> => {
  const { data, error } = await supabaseAdmin
    .get()
    .from('posts')
    .update(updates)
    .eq('slug', slug)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deletePost = async (slug: string): Promise<void> => {
  const { error } = await supabaseAdmin.get().from('posts').delete().eq('slug', slug);

  if (error) throw new Error(error.message);
};
