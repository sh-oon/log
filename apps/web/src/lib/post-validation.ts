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
  const textFields = [...requiredTextFields, 'excerpt', 'series'] as const;

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

  if (
    input.tags !== undefined &&
    (!Array.isArray(input.tags) || input.tags.some((tag) => typeof tag !== 'string'))
  ) {
    return 'tags must be an array of strings';
  }
  if (Array.isArray(input.tags)) {
    const tags = input.tags.map((tag) => (tag as string).trim()).filter(Boolean);
    if (tags.length > 10) return 'tags must contain 10 items or fewer';
    if (tags.some((tag) => tag.length > 30)) return 'each tag must be 30 characters or fewer';
  }
  if (
    input.seriesOrder !== undefined &&
    (typeof input.seriesOrder !== 'number' ||
      !Number.isInteger(input.seriesOrder) ||
      input.seriesOrder < 1)
  ) {
    return 'seriesOrder must be a positive integer';
  }

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
      tags: Array.isArray(value.tags)
        ? value.tags.map((tag) => (tag as string).trim()).filter(Boolean)
        : [],
      series:
        typeof value.series === 'string' && value.series.trim() ? value.series.trim() : undefined,
      seriesOrder:
        typeof value.series === 'string' && value.series.trim()
          ? (value.seriesOrder as number | undefined)
          : undefined,
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
    'tags',
    'series',
    'seriesOrder',
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

  const normalizedUpdates: Partial<Post> = { ...updates };
  if (updates.title !== undefined) normalizedUpdates.title = updates.title.trim();
  if (updates.excerpt !== undefined) normalizedUpdates.excerpt = updates.excerpt.trim();
  if (updates.category !== undefined) normalizedUpdates.category = updates.category.trim();
  if (updates.content !== undefined) normalizedUpdates.content = updates.content.trim();
  if (updates.tags !== undefined) {
    normalizedUpdates.tags = updates.tags.map((tag) => tag.trim()).filter(Boolean);
  }
  if (updates.series !== undefined) {
    normalizedUpdates.series = updates.series.trim() || undefined;
    if (!normalizedUpdates.series) normalizedUpdates.seriesOrder = undefined;
  }

  return { data: normalizedUpdates };
};
