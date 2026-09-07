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
    contentVersion: 2,
    id: '',
    title: '',
    period: '',
    company: '',
    role: '',
    contribution: '',
    summary: '',
    tech: [],
    responsibilities: [''],
    outcomes: [''],
    narrative: [''],
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
        <Field label="기여도">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              value={form.contribution}
              onChange={(e) => setForm((f) => ({ ...f, contribution: e.target.value }))}
              placeholder="기여도 40%"
            />
          )}
        </Field>
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
        <TextListField
          label="담당 업무"
          hint="수행 내역이 아니라 어떤 문제를 어떻게 풀었는지가 드러나게 씁니다."
          items={form.responsibilities}
          onChange={(responsibilities) => setForm((f) => ({ ...f, responsibilities }))}
          rows={2}
        />
        <TextListField
          label="성과"
          hint="가능하면 시간·건수·비율로. 예) 빌드 시간 15분 → 5분"
          items={form.outcomes}
          onChange={(outcomes) => setForm((f) => ({ ...f, outcomes }))}
          rows={2}
        />
        <TextListField
          label="상세 서술"
          hint="이력서에 실리는 흐르는 문장입니다. 한 칸이 한 문단입니다."
          items={form.narrative}
          onChange={(narrative) => setForm((f) => ({ ...f, narrative }))}
          rows={5}
        />
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

// ─── Text List Field ───

/**
 * Ordered list of free-text entries — 담당 업무, 성과, 서술 문단이 모두 같은 모양이다.
 * 순서가 곧 출력 순서라 항목은 index 를 key 로 쓴다.
 *
 * @example
 * <TextListField label="성과" items={outcomes} onChange={setOutcomes} rows={2} />
 */
const TextListField = ({
  label,
  hint,
  items,
  onChange,
  rows,
}: {
  label: string;
  hint: string;
  items: string[];
  onChange: (items: string[]) => void;
  rows: number;
}) => (
  <div>
    <Flex
      justify="between"
      align="center"
      className="mb-1"
    >
      <Text typography="text-sm-bold">{label}</Text>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange([...items, ''])}
      >
        <Icon
          name="plus"
          size={14}
        />
      </Button>
    </Flex>
    <Text
      typography="text-xs-regular"
      color="muted"
      className="mb-2"
    >
      {hint}
    </Text>
    <div className="space-y-2">
      {items.map((item, index) => (
        <Flex
          // biome-ignore lint/suspicious/noArrayIndexKey: entries have no stable id, order is user-controlled
          key={index}
          gap={2}
          align="start"
        >
          <Textarea
            value={item}
            onChange={(e) =>
              onChange(items.map((current, i) => (i === index ? e.target.value : current)))
            }
            rows={rows}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
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
);
