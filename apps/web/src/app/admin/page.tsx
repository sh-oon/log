'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Field,
  Input,
  Textarea,
  ToastProvider,
  toast,
} from '@sunghoon-log/ui';
import { Eye, EyeOff, Lock, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import type { Post, PostMeta } from '@/types/post';

const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${password}`,
  };

  const fetchPosts = useCallback(async () => {
    const res = await fetch('/api/posts');
    if (res.ok) {
      setPosts(await res.json());
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated, fetchPosts]);

  const handleLogin = async () => {
    if (!password.trim()) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ slug: '__auth_test__' }),
    });

    if (res.status === 401) {
      toast.error('비밀번호가 올바르지 않습니다.');
      return;
    }

    toast.success('로그인 성공!');
    setIsAuthenticated(true);
  };

  const handleCreate = async (post: Post) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(post),
    });
    if (res.ok) {
      toast.success('새 글이 생성되었습니다.');
      setIsCreating(false);
      setEditingPost(null);
      fetchPosts();
    } else {
      const data = await res.json();
      toast.error(data.error ?? '글 생성에 실패했습니다.');
    }
  };

  const handleUpdate = async (slug: string, post: Partial<Post>) => {
    const res = await fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(post),
    });
    if (res.ok) {
      toast.success('글이 수정되었습니다.');
      setEditingPost(null);
      fetchPosts();
    } else {
      toast.error('글 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/posts/${slug}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (res.ok) {
      toast.success('글이 삭제되었습니다.');
      fetchPosts();
    } else {
      toast.error('글 삭제에 실패했습니다.');
    }
  };

  const handleTogglePublish = async (slug: string, published: boolean) => {
    await handleUpdate(slug, { published: !published });
  };

  const startEdit = async (slug: string) => {
    const res = await fetch(`/api/posts/${slug}`);
    if (res.ok) {
      setEditingPost(await res.json());
      setIsCreating(false);
    }
  };

  const startCreate = () => {
    setEditingPost({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      published: false,
    });
    setIsCreating(true);
  };

  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto px-6 py-32">
        <ToastProvider />
        <div className="text-center mb-8">
          <Lock
            size={48}
            className="mx-auto mb-4 text-gray-400"
          />
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-gray-500 text-sm">블로그 관리를 위해 비밀번호를 입력하세요.</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="flex-1"
          />
          <Button onClick={handleLogin}>Enter</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <ToastProvider />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Admin</h1>
        <Button
          onClick={startCreate}
          size="sm"
        >
          <Plus size={16} />
          New Post
        </Button>
      </div>

      {editingPost && (
        <PostEditor
          post={editingPost}
          isNew={isCreating}
          onSave={(post) =>
            isCreating ? handleCreate(post) : handleUpdate(editingPost.slug, post)
          }
          onCancel={() => {
            setEditingPost(null);
            setIsCreating(false);
          }}
        />
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-xl"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={post.published ? 'success' : 'default'}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
                <span className="text-xs font-mono text-gray-400">{post.date}</span>
                <Badge>{post.category}</Badge>
              </div>
              <h3 className="font-bold truncate">{post.title}</h3>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTogglePublish(post.slug, post.published)}
              >
                {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEdit(post.slug)}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(post.slug)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

interface PostEditorProps {
  post: Post;
  isNew: boolean;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

const PostEditor = ({ post, isNew, onSave, onCancel }: PostEditorProps) => {
  const [form, setForm] = useState<Post>(post);

  const handleChange = (field: keyof Post, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.slug || !form.title || !form.content) {
      toast.error('slug, title, content는 필수입니다.');
      return;
    }
    onSave(form);
  };

  return (
    <div className="mb-8 p-6 border border-blue-200 dark:border-blue-900/30 rounded-xl bg-blue-50/30 dark:bg-blue-900/5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{isNew ? 'New Post' : 'Edit Post'}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          <X size={20} />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Slug"
            required
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                disabled={!isNew}
                placeholder="my-post-slug"
              />
            )}
          </Field>
          <Field label="Category">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Architecture"
              />
            )}
          </Field>
        </div>
        <Field
          label="Title"
          required
        >
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Post title"
            />
          )}
        </Field>
        <Field label="Excerpt">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={form.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Short description"
            />
          )}
        </Field>
        <Field label="Date">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              placeholder="2025-01-01"
            />
          )}
        </Field>
        <Field
          label="Content (Markdown)"
          required
        >
          {(fieldProps) => (
            <Textarea
              {...fieldProps}
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={12}
              placeholder="Write your post content in Markdown..."
              className="font-mono"
            />
          )}
        </Field>
        <Checkbox
          label="Published"
          checked={form.published}
          onCheckedChange={(checked) => handleChange('published', checked)}
        />
        <Button onClick={handleSubmit}>
          <Save size={16} />
          {isNew ? 'Create' : 'Update'}
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
