'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Checkbox, Field, Icon, Input, Text, Textarea, toast } from '@orka-log/ui';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import type { Post, PostMeta } from '@/types/post';

type StatusFilter = 'all' | 'published' | 'draft';
type EditorView = 'write' | 'split' | 'preview';
type FormErrors = Partial<
  Record<
    'slug' | 'title' | 'excerpt' | 'category' | 'date' | 'content' | 'tags' | 'seriesOrder',
    string
  >
>;

const EMPTY_POST = (): Post => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);

  return {
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    category: '',
    date: localDate,
    published: false,
    tags: [],
  };
};

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: '전체', value: 'all' },
  { label: '발행됨', value: 'published' },
  { label: '임시 글', value: 'draft' },
];

const VIEW_OPTIONS: { icon: 'pen-line' | 'columns-2' | 'eye'; label: string; value: EditorView }[] =
  [
    { icon: 'pen-line', label: '작성', value: 'write' },
    { icon: 'columns-2', label: '나란히', value: 'split' },
    { icon: 'eye', label: '미리보기', value: 'preview' },
  ];

const slugify = (value: string) =>
  value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

const validatePost = (post: Post): FormErrors => {
  const errors: FormErrors = {};

  if (!post.title.trim()) errors.title = '제목을 입력해 주세요.';
  if (!post.slug.trim()) {
    errors.slug = 'URL 주소를 입력해 주세요.';
  } else if (!/^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u.test(post.slug)) {
    errors.slug = '문자, 숫자, 하이픈(-)만 사용할 수 있습니다.';
  }
  if (!post.category.trim()) errors.category = '카테고리를 입력해 주세요.';
  if (!post.date) errors.date = '작성일을 선택해 주세요.';
  if (!post.content.trim()) errors.content = '본문을 입력해 주세요.';
  if (post.excerpt.length > 200) errors.excerpt = '요약은 200자 이내로 작성해 주세요.';
  if ((post.tags?.length ?? 0) > 10) errors.tags = '태그는 최대 10개까지 입력할 수 있습니다.';
  if (post.tags?.some((tag) => tag.length > 30)) errors.tags = '각 태그는 30자 이내여야 합니다.';
  if (
    post.seriesOrder !== undefined &&
    (!Number.isInteger(post.seriesOrder) || post.seriesOrder < 1)
  ) {
    errors.seriesOrder = '순서는 1 이상의 정수여야 합니다.';
  }

  return errors;
};

const readErrorMessage = async (response: Response, fallback: string) => {
  try {
    const body = await response.json();
    return typeof body.error === 'string' ? body.error : fallback;
  } catch {
    return fallback;
  }
};

export const PostManager = () => {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [mutatingSlug, setMutatingSlug] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok)
        throw new Error(await readErrorMessage(response, '글 목록을 불러오지 못했습니다.'));
      setPosts(await response.json());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '글 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      draft: posts.filter((post) => !post.published).length,
      published: posts.filter((post) => post.published).length,
    }),
    [posts]
  );

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'published' ? post.published : !post.published);
        const haystack = [
          post.title,
          post.excerpt,
          post.category,
          post.slug,
          post.series,
          ...(post.tags ?? []),
        ]
          .join(' ')
          .toLocaleLowerCase();
        return matchesStatus && (!deferredQuery || haystack.includes(deferredQuery));
      }),
    [deferredQuery, posts, statusFilter]
  );

  const savePost = async (post: Post) => {
    const isNew = isCreating;
    const endpoint = isNew ? '/api/posts' : `/api/posts/${editingPost?.slug}`;

    try {
      const response = await fetch(endpoint, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error(
          await readErrorMessage(response, `글 ${isNew ? '생성' : '수정'}에 실패했습니다.`)
        );
      }

      toast.success(isNew ? '새 글이 생성되었습니다.' : '글이 수정되었습니다.');
      setEditingPost(null);
      setIsCreating(false);
      await fetchPosts();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '글 저장에 실패했습니다.');
      return false;
    }
  };

  const togglePublish = async (post: PostMeta) => {
    setMutatingSlug(post.slug);
    try {
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, '발행 상태를 변경하지 못했습니다.'));
      }

      setPosts((current) =>
        current.map((item) =>
          item.slug === post.slug ? { ...item, published: !item.published } : item
        )
      );
      toast.success(post.published ? '임시 글로 전환했습니다.' : '글을 발행했습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '발행 상태를 변경하지 못했습니다.');
    } finally {
      setMutatingSlug(null);
    }
  };

  const deletePost = async (post: PostMeta) => {
    if (!window.confirm(`“${post.title}” 글을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;

    setMutatingSlug(post.slug);
    try {
      const response = await fetch(`/api/posts/${post.slug}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, '글을 삭제하지 못했습니다.'));
      }
      setPosts((current) => current.filter((item) => item.slug !== post.slug));
      toast.success('글이 삭제되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '글을 삭제하지 못했습니다.');
    } finally {
      setMutatingSlug(null);
    }
  };

  const startEdit = async (slug: string) => {
    setLoadingSlug(slug);
    try {
      const response = await fetch(`/api/posts/${slug}`);
      if (!response.ok)
        throw new Error(await readErrorMessage(response, '글을 불러오지 못했습니다.'));
      setEditingPost(await response.json());
      setIsCreating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '글을 불러오지 못했습니다.');
    } finally {
      setLoadingSlug(null);
    }
  };

  const startCreate = () => {
    setEditingPost(EMPTY_POST());
    setIsCreating(true);
  };

  return (
    <section aria-labelledby="posts-heading">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Text
            as="h2"
            id="posts-heading"
            typography="title-md-bold"
          >
            글 관리
          </Text>
          <Text
            typography="text-sm-regular"
            color="muted"
            className="mt-1"
          >
            초안을 작성하고 미리본 뒤 바로 발행할 수 있습니다.
          </Text>
        </div>
        <Button
          onClick={startCreate}
          disabled={editingPost !== null}
        >
          <Icon
            name="plus"
            size={17}
          />
          새 글 작성
        </Button>
      </div>

      {editingPost ? (
        <PostEditor
          key={isCreating ? 'new-post' : editingPost.slug}
          post={editingPost}
          isNew={isCreating}
          onSave={savePost}
          onCancel={() => {
            setEditingPost(null);
            setIsCreating(false);
          }}
        />
      ) : null}

      <div className="mb-5 rounded-2xl border border-border bg-background p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <fieldset
            className="flex flex-wrap gap-1 rounded-xl bg-muted/60 p-1"
            aria-label="발행 상태 필터"
          >
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                aria-pressed={statusFilter === filter.value}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter.label}
                <span className="ml-1.5 text-xs text-muted-foreground">{counts[filter.value]}</span>
              </button>
            ))}
          </fieldset>
          <div className="relative w-full md:max-w-xs">
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="제목, 카테고리, 태그 검색"
              aria-label="글 검색"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border">
          <Icon
            name="loader-circle"
            size={22}
            className="animate-spin text-muted-foreground"
          />
          <span className="ml-2 text-sm text-muted-foreground">글을 불러오는 중...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <Icon
            name={posts.length === 0 ? 'file-plus-2' : 'search-x'}
            size={32}
            className="mx-auto mb-3 text-muted-foreground"
          />
          <Text typography="text-md-bold">
            {posts.length === 0 ? '아직 작성한 글이 없습니다.' : '조건에 맞는 글이 없습니다.'}
          </Text>
          <Text
            typography="text-sm-regular"
            color="muted"
            className="mt-1"
          >
            {posts.length === 0 ? '첫 번째 글을 작성해 보세요.' : '검색어나 필터를 바꿔 보세요.'}
          </Text>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const isMutating = mutatingSlug === post.slug;
            const isOpening = loadingSlug === post.slug;

            return (
              <article
                key={post.slug}
                className="group rounded-2xl border border-border bg-background p-4 transition-colors hover:border-foreground/20 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant={post.published ? 'success' : 'default'}>
                        {post.published ? '발행됨' : '임시 글'}
                      </Badge>
                      {post.category ? <Badge>{post.category}</Badge> : null}
                      {post.series ? (
                        <Badge>
                          {post.series}
                          {post.seriesOrder ? ` #${post.seriesOrder}` : ''}
                        </Badge>
                      ) : null}
                      <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <Text
                      as="h3"
                      typography="text-md-bold"
                      className="truncate"
                    >
                      {post.title}
                    </Text>
                    <Text
                      typography="text-sm-regular"
                      color="muted"
                      className="mt-1 line-clamp-1"
                    >
                      {post.excerpt || `/${post.slug}`}
                    </Text>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                    {post.published ? (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                        aria-label={`${post.title} 글 보기`}
                        title="새 탭에서 글 보기"
                      >
                        <Icon
                          name="external-link"
                          size={16}
                        />
                      </a>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void togglePublish(post)}
                      disabled={isMutating}
                      aria-label={post.published ? '임시 글로 전환' : '글 발행'}
                      title={post.published ? '임시 글로 전환' : '글 발행'}
                    >
                      <Icon
                        name={isMutating ? 'loader-circle' : post.published ? 'eye-off' : 'send'}
                        size={16}
                        className={isMutating ? 'animate-spin' : ''}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void startEdit(post.slug)}
                      disabled={isOpening || editingPost !== null}
                      aria-label="글 수정"
                      title="글 수정"
                    >
                      <Icon
                        name={isOpening ? 'loader-circle' : 'pencil'}
                        size={16}
                        className={isOpening ? 'animate-spin' : ''}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void deletePost(post)}
                      disabled={isMutating}
                      aria-label="글 삭제"
                      title="글 삭제"
                      className="hover:text-destructive-500"
                    >
                      <Icon
                        name="trash-2"
                        size={16}
                      />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

interface PostEditorProps {
  post: Post;
  isNew: boolean;
  onSave: (post: Post) => Promise<boolean>;
  onCancel: () => void;
}

const PostEditor = ({ post, isNew, onSave, onCancel }: PostEditorProps) => {
  const [form, setForm] = useState<Post>(post);
  const [tagsInput, setTagsInput] = useState((post.tags ?? []).join(', '));
  const [view, setView] = useState<EditorView>('split');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [recoverableDraft, setRecoverableDraft] = useState<Post | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialPostRef = useRef(JSON.stringify(post));
  const draftKey = `orka-log:post-editor:v1:${isNew ? 'new' : post.slug}`;
  const isDirty = JSON.stringify(form) !== initialPostRef.current;
  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(draftKey);
      if (!savedDraft) return;
      const parsedDraft = JSON.parse(savedDraft) as Post;
      if (JSON.stringify(parsedDraft) !== initialPostRef.current) setRecoverableDraft(parsedDraft);
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  useEffect(() => {
    if (!isDirty) return;
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(draftKey, JSON.stringify(form));
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [draftKey, form, isDirty]);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [isDirty]);

  const updateForm = <K extends keyof Post>(field: K, value: Post[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const updateTitle = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: isNew && !slugTouched ? slugify(title) : current.slug,
    }));
    setErrors((current) => ({ ...current, slug: undefined, title: undefined }));
  };

  const insertAroundSelection = (prefix: string, suffix: string, placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.slice(start, end) || placeholder;
    const nextContent = `${form.content.slice(0, start)}${prefix}${selected}${suffix}${form.content.slice(end)}`;
    updateForm('content', nextContent);
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  };

  const prefixSelectedLines = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = form.content.lastIndexOf('\n', start - 1) + 1;
    const selected = form.content.slice(lineStart, end) || '내용';
    const replacement = selected
      .split('\n')
      .map((line) => `${prefix}${line}`)
      .join('\n');
    updateForm(
      'content',
      `${form.content.slice(0, lineStart)}${replacement}${form.content.slice(end)}`
    );
    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart, lineStart + replacement.length);
    });
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    const uploadBody = new FormData();
    uploadBody.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: uploadBody });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, '이미지 업로드에 실패했습니다.'));
      }
      const { url } = await response.json();
      insertAroundSelection('', '', `![${file.name}](${url})`);
      toast.success('이미지를 본문에 추가했습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const submit = useCallback(async () => {
    const nextForm: Post = {
      ...form,
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category.trim(),
      content: form.content.trim(),
      tags: parseTags(tagsInput),
      series: form.series?.trim() || undefined,
      seriesOrder: form.series?.trim() ? form.seriesOrder : undefined,
    };
    const nextErrors = validatePost(nextForm);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('입력 내용을 확인해 주세요.');
      return;
    }

    setIsSaving(true);
    const saved = await onSave(nextForm);
    setIsSaving(false);
    if (saved) window.localStorage.removeItem(draftKey);
  }, [draftKey, form, onSave, tagsInput]);

  useEffect(() => {
    const saveWithShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 's') {
        event.preventDefault();
        if (!isSaving) void submit();
      }
    };
    window.addEventListener('keydown', saveWithShortcut);
    return () => window.removeEventListener('keydown', saveWithShortcut);
  }, [isSaving, submit]);

  const cancel = () => {
    if (isDirty && !window.confirm('저장하지 않은 변경사항이 있습니다. 작성을 종료할까요?')) return;
    onCancel();
  };

  return (
    <div className="mb-10 overflow-hidden rounded-2xl border border-foreground/15 bg-background shadow-lg shadow-foreground/[0.04]">
      <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
            <Icon
              name={isNew ? 'file-plus-2' : 'file-pen-line'}
              size={19}
            />
          </span>
          <div>
            <Text
              as="h3"
              typography="text-lg-bold"
            >
              {isNew ? '새 글 작성' : '글 수정'}
            </Text>
            <Text
              typography="text-xs-regular"
              color="muted"
            >
              변경사항은 브라우저에 자동 임시 저장됩니다.
            </Text>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={cancel}
          aria-label="에디터 닫기"
        >
          <Icon
            name="x"
            size={18}
          />
          닫기
        </Button>
      </div>

      {recoverableDraft ? (
        <div className="flex flex-col gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 text-sm">
            <Icon
              name="history"
              size={16}
            />
            이전에 자동 저장된 작성 내용이 있습니다.
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                window.localStorage.removeItem(draftKey);
                setRecoverableDraft(null);
              }}
            >
              삭제
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setForm(recoverableDraft);
                setTagsInput((recoverableDraft.tags ?? []).join(', '));
                setRecoverableDraft(null);
                toast.success('임시 저장 내용을 복구했습니다.');
              }}
            >
              복구하기
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-6 p-4 sm:p-6">
        <Field
          label="제목"
          required
          errorMessage={errors.title}
        >
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={form.title}
              onChange={(event) => updateTitle(event.target.value)}
              placeholder="글의 핵심이 드러나는 제목을 입력하세요"
              className="h-12 text-base font-semibold"
              autoFocus
            />
          )}
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="URL 주소"
            required
            helperText={isNew ? '제목에서 자동으로 생성되며 직접 수정할 수 있습니다.' : undefined}
            errorMessage={errors.slug}
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  updateForm('slug', slugify(event.target.value));
                }}
                disabled={!isNew}
                startAdornment={<span className="text-xs text-muted-foreground">/blog/</span>}
                placeholder="my-post-slug"
                className="font-mono text-sm"
              />
            )}
          </Field>
          <Field
            label="카테고리"
            required
            errorMessage={errors.category}
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.category}
                onChange={(event) => updateForm('category', event.target.value)}
                placeholder="예: Architecture"
              />
            )}
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <Field
            label="요약"
            helperText={`${form.excerpt.length}/200자 · 글 목록과 검색 결과에 표시됩니다.`}
            errorMessage={errors.excerpt}
          >
            {(fieldProps) => (
              <Textarea
                {...fieldProps}
                value={form.excerpt}
                onChange={(event) => updateForm('excerpt', event.target.value)}
                rows={3}
                maxLength={201}
                placeholder="독자가 글의 내용을 빠르게 이해할 수 있도록 요약해 주세요."
              />
            )}
          </Field>
          <Field
            label="작성일"
            required
            errorMessage={errors.date}
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                type="date"
                value={form.date}
                onChange={(event) => updateForm('date', event.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Icon
              name="tags"
              size={16}
              className="text-muted-foreground"
            />
            <Text typography="text-sm-bold">글 분류</Text>
          </div>
          <div className="space-y-4">
            <Field
              label="태그"
              helperText="쉼표로 구분합니다. 태그별 묶어보기에 사용됩니다."
              errorMessage={errors.tags}
            >
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  value={tagsInput}
                  onChange={(event) => {
                    const value = event.target.value;
                    setTagsInput(value);
                    updateForm('tags', parseTags(value));
                  }}
                  placeholder="예: react, monorepo, dx"
                />
              )}
            </Field>
            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <Field
                label="시리즈"
                helperText="연재 글이 아니라면 비워두세요."
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={form.series ?? ''}
                    onChange={(event) => updateForm('series', event.target.value || undefined)}
                    placeholder="예: 모노레포 구축기"
                  />
                )}
              </Field>
              <Field
                label="시리즈 순서"
                errorMessage={errors.seriesOrder}
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    type="number"
                    min={1}
                    step={1}
                    value={form.seriesOrder ?? ''}
                    onChange={(event) =>
                      updateForm(
                        'seriesOrder',
                        event.target.value ? Number(event.target.value) : undefined
                      )
                    }
                    disabled={!form.series}
                    placeholder="1"
                  />
                )}
              </Field>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Text typography="text-sm-bold">
                본문 <span className="text-destructive-500">*</span>
              </Text>
              <Text
                typography="text-xs-regular"
                color="muted"
                className="mt-0.5"
              >
                Markdown 문법을 지원합니다. {wordCount}단어 · {form.content.length.toLocaleString()}
                자
              </Text>
            </div>
            <fieldset
              className="flex w-fit gap-1 rounded-lg bg-muted/70 p-1"
              aria-label="에디터 보기 방식"
            >
              {VIEW_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setView(option.value)}
                  aria-pressed={view === option.value}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    view === option.value
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon
                    name={option.icon}
                    size={14}
                  />
                  {option.label}
                </button>
              ))}
            </fieldset>
          </div>

          <div
            className={`overflow-hidden rounded-xl border ${errors.content ? 'border-destructive-500' : 'border-border'}`}
          >
            {view !== 'preview' ? (
              <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
                <ToolbarButton
                  label="제목"
                  icon="heading-2"
                  onClick={() => prefixSelectedLines('## ')}
                />
                <ToolbarButton
                  label="굵게"
                  icon="bold"
                  onClick={() => insertAroundSelection('**', '**', '굵은 텍스트')}
                />
                <ToolbarButton
                  label="기울임"
                  icon="italic"
                  onClick={() => insertAroundSelection('_', '_', '기울임 텍스트')}
                />
                <ToolbarButton
                  label="링크"
                  icon="link"
                  onClick={() => insertAroundSelection('[', '](https://)', '링크 텍스트')}
                />
                <ToolbarButton
                  label="인라인 코드"
                  icon="code-2"
                  onClick={() => insertAroundSelection('`', '`', 'code')}
                />
                <ToolbarButton
                  label="목록"
                  icon="list"
                  onClick={() => prefixSelectedLines('- ')}
                />
                <ToolbarButton
                  label="인용문"
                  icon="text-quote"
                  onClick={() => prefixSelectedLines('> ')}
                />
                <span className="mx-1 h-5 w-px bg-border" />
                <ToolbarButton
                  label={isUploading ? '업로드 중' : '이미지 추가'}
                  icon={isUploading ? 'loader-circle' : 'image-plus'}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  spinning={isUploading}
                />
              </div>
            ) : null}
            <div className={view === 'split' ? 'grid lg:grid-cols-2' : ''}>
              {view !== 'preview' ? (
                <Textarea
                  ref={textareaRef}
                  value={form.content}
                  onChange={(event) => updateForm('content', event.target.value)}
                  rows={26}
                  placeholder={'# 제목\n\n글의 내용을 Markdown으로 작성하세요...'}
                  aria-label="본문 Markdown"
                  aria-invalid={Boolean(errors.content)}
                  className="min-h-[560px] resize-y rounded-none border-0 font-mono text-sm leading-6 focus-visible:ring-0"
                />
              ) : null}
              {view !== 'write' ? (
                <div
                  className={`min-h-[560px] overflow-y-auto bg-background p-5 sm:p-7 ${view === 'split' ? 'border-t border-border lg:border-l lg:border-t-0' : ''}`}
                >
                  {form.title ? (
                    <header className="mb-8 border-b border-border pb-6">
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {form.category ? <Badge>{form.category}</Badge> : null}
                        {form.series ? (
                          <Badge>
                            {form.series}
                            {form.seriesOrder ? ` #${form.seriesOrder}` : ''}
                          </Badge>
                        ) : null}
                        <span>{form.date}</span>
                      </div>
                      <Text
                        as="h1"
                        typography="title-md-bold"
                      >
                        {form.title}
                      </Text>
                      {form.excerpt ? (
                        <Text
                          typography="text-sm-regular"
                          color="muted"
                          className="mt-3 leading-6"
                        >
                          {form.excerpt}
                        </Text>
                      ) : null}
                      {form.tags?.length ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {form.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </header>
                  ) : null}
                  {form.content ? (
                    <MarkdownRenderer content={form.content} />
                  ) : (
                    <div className="flex min-h-72 flex-col items-center justify-center text-center">
                      <Icon
                        name="scan-eye"
                        size={28}
                        className="mb-3 text-muted-foreground"
                      />
                      <Text
                        typography="text-sm-regular"
                        color="muted"
                      >
                        본문을 입력하면 실제 글과 비슷한 모습으로 확인할 수 있습니다.
                      </Text>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          {errors.content ? (
            <p className="mt-1.5 text-xs text-destructive-500">{errors.content}</p>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadImage(file);
          }}
          className="hidden"
        />

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/25 p-4 sm:flex-row sm:items-center sm:justify-between">
          <Checkbox
            checked={form.published}
            onCheckedChange={(checked) => updateForm('published', checked)}
            label="저장과 동시에 발행"
            description={
              form.published
                ? '저장 즉시 블로그에 공개됩니다.'
                : '임시 글로 저장되어 방문자에게 보이지 않습니다.'
            }
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <span className="hidden text-xs text-muted-foreground lg:inline">⌘/Ctrl + S</span>
            <Button
              variant="outline"
              onClick={cancel}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              onClick={() => void submit()}
              disabled={isSaving || isUploading}
            >
              <Icon
                name={isSaving ? 'loader-circle' : form.published ? 'send' : 'save'}
                size={16}
                className={isSaving ? 'animate-spin' : ''}
              />
              {isSaving ? '저장 중...' : form.published ? '저장하고 발행' : '임시 글 저장'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  label: string;
  icon:
    | 'heading-2'
    | 'bold'
    | 'italic'
    | 'link'
    | 'code-2'
    | 'list'
    | 'text-quote'
    | 'image-plus'
    | 'loader-circle';
  onClick: () => void;
  disabled?: boolean;
  spinning?: boolean;
}

const ToolbarButton = ({ label, icon, onClick, disabled, spinning }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
  >
    <Icon
      name={icon}
      size={15}
      className={spinning ? 'animate-spin' : ''}
    />
  </button>
);
