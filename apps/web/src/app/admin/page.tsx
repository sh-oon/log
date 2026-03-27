'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Field,
  Flex,
  Icon,
  Input,
  Text,
  Textarea,
  ToastProvider,
  toast,
} from '@sunghoon-log/ui';
import { signIn, useSession } from 'next-auth/react';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { ResumePdfButton } from '@/components/resume/resume-pdf-button';
import type { Project } from '@/data/projects';
import type { Post, PostMeta } from '@/types/post';
import type { Experience, ResumeData } from '@/types/resume';

const isDev = process.env.NODE_ENV === 'development';

type Tab = 'posts' | 'resume' | 'projects';

const AdminPage = () => {
  const { data: session, status } = useSession();
  const isAuthed = isDev || !!session;
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  if (!isDev && status === 'loading') {
    return (
      <main className="max-w-md mx-auto px-6 py-32 text-center">
        <Text
          typography="text-sm-regular"
          color="muted"
        >
          Loading...
        </Text>
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="max-w-md mx-auto px-6 py-32">
        <ToastProvider />
        <div className="text-center mb-8">
          <Icon
            name="lock"
            size={48}
            className="mx-auto mb-4 text-muted-foreground"
          />
          <Text
            as="h1"
            typography="title-md-bold"
            className="mb-2"
          >
            Admin Login
          </Text>
          <Text
            typography="text-sm-regular"
            color="muted"
          >
            블로그 관리를 위해 GitHub으로 로그인하세요.
          </Text>
        </div>
        <Button
          onClick={() => signIn('github')}
          className="w-full"
        >
          <Icon
            name="github"
            size={16}
          />
          Sign in with GitHub
        </Button>
      </main>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'posts', label: 'Posts' },
    { key: 'resume', label: 'Resume' },
    { key: 'projects', label: 'Projects' },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <ToastProvider />
      <Text
        as="h1"
        typography="title-lg-bold"
        className="mb-8"
      >
        Admin
      </Text>

      <Flex
        gap={1}
        className="mb-8 border-b border-border"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </Flex>

      {activeTab === 'posts' && <PostsTab />}
      {activeTab === 'resume' && <ResumeTab />}
      {activeTab === 'projects' && <ProjectsTab />}
    </main>
  );
};

// ─── Posts Tab ───

const PostsTab = () => {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchPosts = useCallback(async () => {
    const res = await fetch('/api/posts');
    if (res.ok) setPosts(await res.json());
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreate = async (post: Post) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
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

  return (
    <>
      <Flex
        justify="between"
        align="center"
        className="mb-6"
      >
        <Text
          as="h2"
          typography="text-lg-bold"
        >
          Posts
        </Text>
        <Button
          onClick={startCreate}
          size="sm"
        >
          <Icon
            name="plus"
            size={16}
          />
          New Post
        </Button>
      </Flex>

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
          <Flex
            key={post.slug}
            align="center"
            justify="between"
            className="p-4 border border-border rounded-xl"
          >
            <div className="flex-1 min-w-0">
              <Flex
                align="center"
                gap={2}
                className="mb-1"
              >
                <Badge variant={post.published ? 'success' : 'default'}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
                <Text
                  as="span"
                  typography="text-xs-regular"
                  color="muted"
                  className="font-mono"
                >
                  {post.date}
                </Text>
                <Badge>{post.category}</Badge>
              </Flex>
              <Text
                as="h3"
                typography="text-md-bold"
                className="truncate"
              >
                {post.title}
              </Text>
            </div>
            <Flex
              align="center"
              gap={1}
              className="ml-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTogglePublish(post.slug, post.published)}
              >
                <Icon
                  name={post.published ? 'eye' : 'eye-off'}
                  size={16}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEdit(post.slug)}
              >
                <Icon
                  name="pencil"
                  size={16}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(post.slug)}
              >
                <Icon
                  name="trash-2"
                  size={16}
                />
              </Button>
            </Flex>
          </Flex>
        ))}
      </div>
    </>
  );
};

// ─── Post Editor ───

interface PostEditorProps {
  post: Post;
  isNew: boolean;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

const PostEditor = ({ post, isNew, onSave, onCancel }: PostEditorProps) => {
  const [form, setForm] = useState<Post>(post);
  const [showPreview, setShowPreview] = useState(true);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof Post, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? '이미지 업로드에 실패했습니다.');
        return;
      }

      const { url } = await res.json();
      const markdown = `![image](${url})`;

      const textarea = textareaRef.current;
      if (textarea) {
        const { selectionStart } = textarea;
        const before = form.content.slice(0, selectionStart);
        const after = form.content.slice(selectionStart);
        handleChange('content', `${before}\n${markdown}\n${after}`);
      } else {
        handleChange('content', `${form.content}\n${markdown}\n`);
      }

      toast.success('이미지가 업로드되었습니다.');
    } catch {
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!form.slug || !form.title || !form.content) {
      toast.error('slug, title, content는 필수입니다.');
      return;
    }
    onSave(form);
  };

  return (
    <div className="mb-8 p-6 border border-primary/20 rounded-xl bg-primary/5">
      <Flex
        justify="between"
        align="center"
        className="mb-4"
      >
        <Text
          as="h2"
          typography="text-lg-bold"
        >
          {isNew ? 'New Post' : 'Edit Post'}
        </Text>
        <Flex
          gap={2}
          align="center"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
          >
            <Icon
              name={showPreview ? 'eye-off' : 'eye'}
              size={16}
            />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            <Icon
              name="x"
              size={20}
            />
          </Button>
        </Flex>
      </Flex>
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
        <div className={showPreview ? 'grid grid-cols-2 gap-4' : ''}>
          <Field
            label="Content (Markdown)"
            required
          >
            {(fieldProps) => (
              <Textarea
                {...fieldProps}
                ref={textareaRef}
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={24}
                placeholder="Write your post content in Markdown..."
                className="font-mono text-sm"
              />
            )}
          </Field>
          {showPreview && (
            <div>
              <Text
                typography="text-sm-bold"
                className="mb-2"
              >
                Preview
              </Text>
              <div className="h-[calc(24*1.5rem+2rem)] overflow-y-auto p-4 border border-border rounded-lg bg-background">
                {form.content ? (
                  <MarkdownRenderer content={form.content} />
                ) : (
                  <Text
                    typography="text-sm-regular"
                    color="muted"
                  >
                    마크다운을 입력하면 여기에 미리보기가 표시됩니다.
                  </Text>
                )}
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          className="hidden"
        />
        <Flex
          gap={2}
          align="center"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Icon
              name={uploading ? 'loader' : 'image'}
              size={16}
              className={uploading ? 'animate-spin' : ''}
            />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          <Text
            typography="text-xs-regular"
            color="muted"
          >
            이미지를 업로드하면 커서 위치에 마크다운이 삽입됩니다. (최대 5MB, 개발 모드 전용)
          </Text>
        </Flex>
        <Checkbox
          label="Published"
          checked={form.published}
          onCheckedChange={(checked) => handleChange('published', checked)}
        />
        <Button onClick={handleSubmit}>
          <Icon
            name="save"
            size={16}
          />
          {isNew ? 'Create' : 'Update'}
        </Button>
      </div>
    </div>
  );
};

// ─── Resume Tab ───

const ResumeTab = () => {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);

  const fetchResume = useCallback(async () => {
    const [resumeRes, projectsRes] = await Promise.all([
      fetch('/api/resume'),
      fetch('/api/projects'),
    ]);
    if (resumeRes.ok) setResume(await resumeRes.json());
    if (projectsRes.ok) setProjects(await projectsRes.json());
  }, []);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const saveResume = async (data: ResumeData) => {
    const res = await fetch('/api/resume', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success('이력서가 저장되었습니다.');
      setResume(data);
    } else {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleIntroSave = async (intro: ResumeData['intro']) => {
    if (!resume) return;
    await saveResume({ ...resume, intro });
  };

  const handleSkillsSave = async (skills: string[]) => {
    if (!resume) return;
    await saveResume({ ...resume, skills });
  };

  const handleExpSave = async (exp: Experience, isNew: boolean) => {
    if (!resume) return;
    const experiences = isNew
      ? [...resume.experiences, exp]
      : resume.experiences.map((e) => (e.id === exp.id ? exp : e));
    await saveResume({ ...resume, experiences });
    setEditingExpId(null);
    setIsAddingExp(false);
  };

  const handleExpDelete = async (id: string) => {
    if (!resume || !confirm('정말 삭제하시겠습니까?')) return;
    const experiences = resume.experiences.filter((e) => e.id !== id);
    await saveResume({ ...resume, experiences });
  };

  if (!resume) {
    return (
      <Text
        typography="text-sm-regular"
        color="muted"
      >
        Loading...
      </Text>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with PDF Download */}
      <Flex
        justify="between"
        align="center"
      >
        <Text
          as="h2"
          typography="text-lg-bold"
        >
          Resume
        </Text>
        <ResumePdfButton
          resume={resume}
          projects={projects}
        />
      </Flex>

      {/* Intro */}
      <IntroEditor
        intro={resume.intro}
        onSave={handleIntroSave}
      />

      {/* Experiences */}
      <div>
        <Flex
          justify="between"
          align="center"
          className="mb-4"
        >
          <Text
            as="h3"
            typography="text-lg-bold"
          >
            경력
          </Text>
          <Button
            size="sm"
            onClick={() => setIsAddingExp(true)}
          >
            <Icon
              name="plus"
              size={16}
            />
            Add
          </Button>
        </Flex>

        {isAddingExp && (
          <ExperienceEditor
            experience={{ id: '', company: '', role: '', period: '', points: [''] }}
            isNew
            onSave={(exp) => handleExpSave(exp, true)}
            onCancel={() => setIsAddingExp(false)}
          />
        )}

        <div className="space-y-4">
          {resume.experiences.map((exp) =>
            editingExpId === exp.id ? (
              <ExperienceEditor
                key={exp.id}
                experience={exp}
                isNew={false}
                onSave={(e) => handleExpSave(e, false)}
                onCancel={() => setEditingExpId(null)}
              />
            ) : (
              <Flex
                key={exp.id}
                align="center"
                justify="between"
                className="p-4 border border-border rounded-xl"
              >
                <div>
                  <Text typography="text-md-bold">{exp.company}</Text>
                  <Text
                    typography="text-sm-regular"
                    color="muted"
                  >
                    {exp.role} · {exp.period}
                  </Text>
                </div>
                <Flex
                  gap={1}
                  className="ml-4"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingExpId(exp.id)}
                  >
                    <Icon
                      name="pencil"
                      size={16}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExpDelete(exp.id)}
                  >
                    <Icon
                      name="trash-2"
                      size={16}
                    />
                  </Button>
                </Flex>
              </Flex>
            )
          )}
        </div>
      </div>

      {/* Skills */}
      <SkillsEditor
        skills={resume.skills}
        onSave={handleSkillsSave}
      />
    </div>
  );
};

// ─── Intro Editor ───

const IntroEditor = ({
  intro,
  onSave,
}: {
  intro: ResumeData['intro'];
  onSave: (intro: ResumeData['intro']) => void;
}) => {
  const [form, setForm] = useState(intro);
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return (
      <div className="p-4 border border-border rounded-xl">
        <Flex
          justify="between"
          align="center"
          className="mb-2"
        >
          <Text typography="text-lg-bold">소개</Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Icon
              name="pencil"
              size={16}
            />
          </Button>
        </Flex>
        <Text typography="text-md-bold">{form.name}</Text>
        <Text
          typography="text-sm-regular"
          color="muted"
          className="mt-1"
        >
          {form.description}
        </Text>
      </div>
    );
  }

  return (
    <div className="p-6 border border-primary/20 rounded-xl bg-primary/5">
      <Text
        as="h3"
        typography="text-lg-bold"
        className="mb-4"
      >
        소개 편집
      </Text>
      <div className="space-y-4">
        <Field label="이름">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          )}
        </Field>
        <Field label="소개">
          {(fieldProps) => (
            <Textarea
              {...fieldProps}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          )}
        </Field>
        <Field label="강조 텍스트">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={form.highlight}
              onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.value }))}
              placeholder="소개 문장 내에서 볼드 처리할 텍스트"
            />
          )}
        </Field>
        <Flex gap={2}>
          <Button
            onClick={() => {
              onSave(form);
              setIsEditing(false);
            }}
          >
            <Icon
              name="save"
              size={16}
            />
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setForm(intro);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </Flex>
      </div>
    </div>
  );
};

// ─── Experience Editor ───

const ExperienceEditor = ({
  experience,
  isNew,
  onSave,
  onCancel,
}: {
  experience: Experience;
  isNew: boolean;
  onSave: (exp: Experience) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(experience);

  const handlePointChange = (index: number, value: string) => {
    const points = [...form.points];
    points[index] = value;
    setForm((f) => ({ ...f, points }));
  };

  const addPoint = () => setForm((f) => ({ ...f, points: [...f.points, ''] }));

  const removePoint = (index: number) => {
    setForm((f) => ({ ...f, points: f.points.filter((_, i) => i !== index) }));
  };

  return (
    <div className="mb-4 p-6 border border-primary/20 rounded-xl bg-primary/5">
      <Flex
        justify="between"
        align="center"
        className="mb-4"
      >
        <Text typography="text-lg-bold">{isNew ? '경력 추가' : '경력 편집'}</Text>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          <Icon
            name="x"
            size={20}
          />
        </Button>
      </Flex>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="회사명">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            )}
          </Field>
          <Field label="ID">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                disabled={!isNew}
                placeholder="company-id"
              />
            )}
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="역할">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
            )}
          </Field>
          <Field label="기간">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.period}
                onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                placeholder="2024.01 -- Present"
              />
            )}
          </Field>
        </div>
        <div>
          <Flex
            justify="between"
            align="center"
            className="mb-2"
          >
            <Text typography="text-sm-bold">주요 성과</Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={addPoint}
            >
              <Icon
                name="plus"
                size={14}
              />
            </Button>
          </Flex>
          <div className="space-y-2">
            {form.points.map((point, i) => (
              <Flex
                key={`point-${form.id}-${i}`}
                gap={2}
                align="center"
              >
                <Input
                  value={point}
                  onChange={(e) => handlePointChange(i, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePoint(i)}
                >
                  <Icon
                    name="x"
                    size={14}
                  />
                </Button>
              </Flex>
            ))}
          </div>
        </div>
        <Button
          onClick={() => {
            if (!form.id || !form.company) {
              toast.error('ID와 회사명은 필수입니다.');
              return;
            }
            onSave(form);
          }}
        >
          <Icon
            name="save"
            size={16}
          />
          {isNew ? 'Add' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

// ─── Skills Editor ───

const SkillsEditor = ({
  skills,
  onSave,
}: {
  skills: string[];
  onSave: (skills: string[]) => void;
}) => {
  const [list, setList] = useState(skills);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  if (!isEditing) {
    return (
      <div className="p-4 border border-border rounded-xl">
        <Flex
          justify="between"
          align="center"
          className="mb-3"
        >
          <Text typography="text-lg-bold">Skills</Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Icon
              name="pencil"
              size={16}
            />
          </Button>
        </Flex>
        <Flex
          wrap="wrap"
          gap={2}
        >
          {list.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </Flex>
      </div>
    );
  }

  return (
    <div className="p-6 border border-primary/20 rounded-xl bg-primary/5">
      <Text
        as="h3"
        typography="text-lg-bold"
        className="mb-4"
      >
        Skills 편집
      </Text>
      <Flex
        wrap="wrap"
        gap={2}
        className="mb-4"
      >
        {list.map((s) => (
          <Badge
            key={s}
            className="cursor-pointer"
            onClick={() => setList((l) => l.filter((x) => x !== s))}
          >
            {s} ×
          </Badge>
        ))}
      </Flex>
      <Flex
        gap={2}
        className="mb-4"
      >
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newSkill.trim()) {
              setList((l) => [...l, newSkill.trim()]);
              setNewSkill('');
            }
          }}
          placeholder="새 스킬 입력 후 Enter"
          className="flex-1"
        />
      </Flex>
      <Flex gap={2}>
        <Button
          onClick={() => {
            onSave(list);
            setIsEditing(false);
          }}
        >
          <Icon
            name="save"
            size={16}
          />
          Save
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setList(skills);
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
      </Flex>
    </div>
  );
};

// ─── Projects Tab ───

const ProjectsTab = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchProjects = useCallback(async () => {
    const res = await fetch('/api/projects');
    if (res.ok) setProjects(await res.json());
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const saveAll = async (updated: Project[]) => {
    const res = await fetch('/api/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      toast.success('프로젝트가 저장되었습니다.');
      setProjects(updated);
    } else {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleSave = async (project: Project, isNew: boolean) => {
    const updated = isNew
      ? [...projects, project]
      : projects.map((p) => (p.id === project.id ? project : p));
    await saveAll(updated);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await saveAll(projects.filter((p) => p.id !== id));
  };

  const emptyProject: Project = {
    id: '',
    title: '',
    period: '',
    company: '',
    contribution: '',
    summary: '',
    tech: [],
    challenges: [{ problem: '', action: '', result: '' }],
  };

  return (
    <>
      <Flex
        justify="between"
        align="center"
        className="mb-6"
      >
        <Text
          as="h2"
          typography="text-lg-bold"
        >
          Projects
        </Text>
        <Button
          size="sm"
          onClick={() => setIsAdding(true)}
        >
          <Icon
            name="plus"
            size={16}
          />
          Add
        </Button>
      </Flex>

      {isAdding && (
        <ProjectEditor
          project={emptyProject}
          isNew
          onSave={(p) => handleSave(p, true)}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="space-y-4">
        {projects.map((proj) =>
          editingId === proj.id ? (
            <ProjectEditor
              key={proj.id}
              project={proj}
              isNew={false}
              onSave={(p) => handleSave(p, false)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <Flex
              key={proj.id}
              align="center"
              justify="between"
              className="p-4 border border-border rounded-xl"
            >
              <div className="flex-1 min-w-0">
                <Flex
                  align="center"
                  gap={2}
                  className="mb-1"
                >
                  <Text
                    as="span"
                    typography="text-xs-regular"
                    color="muted"
                    className="font-mono"
                  >
                    {proj.period}
                  </Text>
                  <Badge>{proj.company}</Badge>
                </Flex>
                <Text
                  typography="text-md-bold"
                  className="truncate"
                >
                  {proj.title}
                </Text>
              </div>
              <Flex
                gap={1}
                className="ml-4"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(proj.id)}
                >
                  <Icon
                    name="pencil"
                    size={16}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(proj.id)}
                >
                  <Icon
                    name="trash-2"
                    size={16}
                  />
                </Button>
              </Flex>
            </Flex>
          )
        )}
      </div>
    </>
  );
};

// ─── Project Editor ───

const ProjectEditor = ({
  project,
  isNew,
  onSave,
  onCancel,
}: {
  project: Project;
  isNew: boolean;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(project);
  const [techInput, setTechInput] = useState('');

  return (
    <div className="mb-4 p-6 border border-primary/20 rounded-xl bg-primary/5">
      <Flex
        justify="between"
        align="center"
        className="mb-4"
      >
        <Text typography="text-lg-bold">{isNew ? '프로젝트 추가' : '프로젝트 편집'}</Text>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          <Icon
            name="x"
            size={20}
          />
        </Button>
      </Flex>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="ID">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                disabled={!isNew}
                placeholder="project-id"
              />
            )}
          </Field>
          <Field label="기간">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.period}
                onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                placeholder="2024.01 - 진행 중"
              />
            )}
          </Field>
        </div>
        <Field label="프로젝트명">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          )}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="회사">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            )}
          </Field>
          <Field label="기여도">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.contribution}
                onChange={(e) => setForm((f) => ({ ...f, contribution: e.target.value }))}
                placeholder="40% (역할 설명)"
              />
            )}
          </Field>
        </div>
        <Field label="요약">
          {(fieldProps) => (
            <Textarea
              {...fieldProps}
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              rows={2}
            />
          )}
        </Field>
        <div>
          <Text
            typography="text-sm-bold"
            className="mb-2"
          >
            기술 스택
          </Text>
          <Flex
            wrap="wrap"
            gap={2}
            className="mb-2"
          >
            {form.tech.map((t) => (
              <Badge
                key={t}
                className="cursor-pointer"
                onClick={() => setForm((f) => ({ ...f, tech: f.tech.filter((x) => x !== t) }))}
              >
                {t} ×
              </Badge>
            ))}
          </Flex>
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && techInput.trim()) {
                setForm((f) => ({ ...f, tech: [...f.tech, techInput.trim()] }));
                setTechInput('');
              }
            }}
            placeholder="기술 입력 후 Enter"
          />
        </div>
        {/* Challenges */}
        <div className="space-y-4">
          <Flex
            justify="between"
            align="center"
          >
            <Text typography="text-sm-bold">Challenges (Problem → Action → Result)</Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  challenges: [...f.challenges, { problem: '', action: '', result: '' }],
                }))
              }
            >
              <Icon
                name="plus"
                size={14}
              />
              Add Challenge
            </Button>
          </Flex>
          {form.challenges.map((ch, ci) => (
            <div
              key={`challenge-${ci}`}
              className="p-4 border border-border rounded-lg space-y-3"
            >
              <Flex
                justify="between"
                align="center"
              >
                <Text
                  typography="text-xs-bold"
                  color="muted"
                >
                  Challenge {ci + 1}
                </Text>
                {form.challenges.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        challenges: f.challenges.filter((_, i) => i !== ci),
                      }))
                    }
                  >
                    <Icon
                      name="trash-2"
                      size={14}
                    />
                  </Button>
                )}
              </Flex>
              <Field label="Problem">
                {(fieldProps) => (
                  <Textarea
                    {...fieldProps}
                    value={ch.problem}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        challenges: f.challenges.map((c, i) =>
                          i === ci ? { ...c, problem: e.target.value } : c,
                        ),
                      }))
                    }
                    rows={3}
                  />
                )}
              </Field>
              <Field label="Action">
                {(fieldProps) => (
                  <Textarea
                    {...fieldProps}
                    value={ch.action}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        challenges: f.challenges.map((c, i) =>
                          i === ci ? { ...c, action: e.target.value } : c,
                        ),
                      }))
                    }
                    rows={3}
                  />
                )}
              </Field>
              <Field label="Result">
                {(fieldProps) => (
                  <Textarea
                    {...fieldProps}
                    value={ch.result}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        challenges: f.challenges.map((c, i) =>
                          i === ci ? { ...c, result: e.target.value } : c,
                        ),
                      }))
                    }
                    rows={3}
                  />
                )}
              </Field>
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            if (!form.id || !form.title) {
              toast.error('ID와 프로젝트명은 필수입니다.');
              return;
            }
            onSave(form);
          }}
        >
          <Icon
            name="save"
            size={16}
          />
          {isNew ? 'Add' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
