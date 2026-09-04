import type { Post } from '@/types/post';

type ValidationResult<T> = { data: T; error?: never } | { data?: never; error: string };

const SLUG_PATTERN = /^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const hasValidDate = (value: string) => {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const validateFields = (input: Record<string, unknown>, partial: boolean): string | null => {
  const requiredTextFields = ['slug', 'title', 'category', 'date', 'content'] as const;
  const textFields = [...requiredTextFields, 'excerpt'] as const;

  for (const field of textFields) {
    const value = input[field];
    if (value !== undefined && typeof value !== 'string') return `${field} must be a string`;
    if (!partial && requiredTextFields.includes(field as (typeof requiredTextFields)[number])) {
      if (typeof value !== 'string' || !value.trim()) return `${field} is required`;
    }
  }

  if (input.published !== undefined && typeof input.published !== 'boolean') {
    return 'published must be a boolean';
  }
  if (!partial && typeof input.published !== 'boolean') return 'published is required';

  if (typeof input.slug === 'string' && !SLUG_PATTERN.test(input.slug)) {
    return 'slug may only contain letters, numbers, and hyphens';
  }
  if (typeof input.date === 'string' && !hasValidDate(input.date)) {
    return 'date must be a valid YYYY-MM-DD date';
  }
  if (typeof input.excerpt === 'string' && input.excerpt.length > 200) {
    return 'excerpt must be 200 characters or fewer';
  }
  if (partial) {
    for (const field of ['title', 'category', 'content'] as const) {
      if (typeof input[field] === 'string' && !input[field].trim())
        return `${field} cannot be empty`;
    }
  }

  return null;
};

export const validateNewPost = (value: unknown): ValidationResult<Post> => {
  if (!isRecord(value)) return { error: 'request body must be an object' };
  const error = validateFields(value, false);
  if (error) return { error };

  return {
    data: {
      slug: (value.slug as string).trim(),
      title: (value.title as string).trim(),
      excerpt: typeof value.excerpt === 'string' ? value.excerpt.trim() : '',
      category: (value.category as string).trim(),
      date: value.date as string,
      content: (value.content as string).trim(),
      published: value.published as boolean,
    },
  };
};

export const validatePostUpdates = (
  value: unknown,
  currentSlug: string
): ValidationResult<Partial<Post>> => {
  if (!isRecord(value)) return { error: 'request body must be an object' };
  const allowedFields = new Set<keyof Post>([
    'slug',
    'title',
    'excerpt',
    'category',
    'date',
    'content',
    'published',
  ]);
  const updates = Object.fromEntries(
    Object.entries(value).filter(([key]) => allowedFields.has(key as keyof Post))
  ) as Partial<Post>;

  if (Object.keys(updates).length === 0) return { error: 'no valid fields to update' };
  if (updates.slug !== undefined && updates.slug !== currentSlug) {
    return { error: 'slug cannot be changed' };
  }

  const error = validateFields(updates as Record<string, unknown>, true);
  if (error) return { error };

  return { data: updates };
};
