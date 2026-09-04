'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Field, Flex, Icon, Input, Text, Textarea, toast } from '@orka-log/ui';
import type { Project } from '@/data/projects';

// ─── Project Manager ───

/**
 * Admin tab for the project cards rendered in the "Selected work" section.
 *
 * @example
 * <ProjectManager />
 */
export const ProjectManager = () => {
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
    contentVersion: 1,
    id: '',
    title: '',
    period: '',
    company: '',
    role: '',
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
          <Field label="담당 역할">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="아키텍처 설계 및 프론트엔드 구현"
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
              // biome-ignore lint/suspicious/noArrayIndexKey: challenges have no stable id, order is user-controlled
              key={ci}
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
                          i === ci ? { ...c, problem: e.target.value } : c
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
                          i === ci ? { ...c, action: e.target.value } : c
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
                          i === ci ? { ...c, result: e.target.value } : c
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
