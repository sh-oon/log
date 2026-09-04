'use client';

import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Badge, Button, Field, Flex, Icon, Input, Text, Textarea, toast } from '@orka-log/ui';
import { ResumePdfButton } from '@/components/resume/resume-pdf-button';
import type { Education, Experience, ResumeData, ResumeMetric, SkillGroup } from '@/types/resume';

// ─── Section Shell ───

interface EditableSectionProps<T> {
  title: string;
  value: T;
  onSave: (value: T) => void;
  preview: (value: T) => ReactNode;
  children: (draft: T, setDraft: Dispatch<SetStateAction<T>>) => ReactNode;
}

/**
 * Read-only card that swaps to a draft editor, committing only on Save.
 * Cancel restores the last persisted value, so a discarded draft never reaches the API.
 */
const EditableSection = <T,>({
  title,
  value,
  onSave,
  preview,
  children,
}: EditableSectionProps<T>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!isEditing) {
    return (
      <div className="p-4 border border-border rounded-xl">
        <Flex
          justify="between"
          align="center"
          className="mb-3"
        >
          <Text typography="text-lg-bold">{title}</Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(value);
              setIsEditing(true);
            }}
          >
            <Icon
              name="pencil"
              size={16}
            />
          </Button>
        </Flex>
        {preview(value)}
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
        {title} 편집
      </Text>
      <div className="space-y-4">{children(draft, setDraft)}</div>
      <Flex
        gap={2}
        className="mt-4"
      >
        <Button
          onClick={() => {
            onSave(draft);
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
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
      </Flex>
    </div>
  );
};

// ─── List Shell ───

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  itemLabel: (item: T, index: number) => string;
  addLabel: string;
  children: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
}

/**
 * Ordered list of records with add / remove / move controls.
 * Order is meaningful on the public page, so items keep their index as key.
 */
const ListEditor = <T,>({
  items,
  onChange,
  createItem,
  itemLabel,
  addLabel,
  children,
}: ListEditorProps<T>) => {
  const move = (index: number, offset: number) => {
    const target = index + offset;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: list has no stable id, order is user-controlled
          key={index}
          className="p-4 border border-border rounded-lg space-y-3 bg-background"
        >
          <Flex
            justify="between"
            align="center"
          >
            <Text
              typography="text-xs-bold"
              color="muted"
            >
              {itemLabel(item, index)}
            </Text>
            <Flex gap={1}>
              <Button
                variant="ghost"
                size="sm"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <Icon
                  name="chevron-up"
                  size={14}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                <Icon
                  name="chevron-down"
                  size={14}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
              >
                <Icon
                  name="trash-2"
                  size={14}
                />
              </Button>
            </Flex>
          </Flex>
          {children(item, (patch) =>
            onChange(items.map((current, i) => (i === index ? { ...current, ...patch } : current)))
          )}
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, createItem()])}
      >
        <Icon
          name="plus"
          size={14}
        />
        {addLabel}
      </Button>
    </div>
  );
};

// ─── Resume Manager ───

/**
 * Admin tab for every field the public resume page and the PDF render:
 * intro, metrics, experiences, skill groups and education.
 *
 * @example
 * <ResumeManager />
 */
export const ResumeManager = () => {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);

  const fetchResume = useCallback(async () => {
    const res = await fetch('/api/resume');
    if (res.ok) setResume(await res.json());
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

  const savePatch = async (patch: Partial<ResumeData>) => {
    if (!resume) return;
    await saveResume({ ...resume, ...patch });
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
    await saveResume({ ...resume, experiences: resume.experiences.filter((e) => e.id !== id) });
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
        <ResumePdfButton fileName={`${resume.intro.name || 'resume'}_이력서.pdf`} />
      </Flex>

      <EditableSection
        title="소개"
        value={resume.intro}
        onSave={(intro) => savePatch({ intro })}
        preview={(intro) => (
          <>
            <Text typography="text-md-bold">
              {intro.name} · {intro.role}
            </Text>
            <Text
              typography="text-sm-regular"
              color="muted"
              className="mt-1"
            >
              {intro.description}
            </Text>
            <Text
              typography="text-xs-regular"
              color="muted"
              className="mt-2"
            >
              {intro.email} · {intro.github}
            </Text>
          </>
        )}
      >
        {(draft, setDraft) => (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="이름">
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={draft.name}
                    onChange={(e) => setDraft((f) => ({ ...f, name: e.target.value }))}
                  />
                )}
              </Field>
              <Field label="역할">
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={draft.role}
                    onChange={(e) => setDraft((f) => ({ ...f, role: e.target.value }))}
                    placeholder="Frontend Developer"
                  />
                )}
              </Field>
            </div>
            <Field label="소개">
              {(fieldProps) => (
                <Textarea
                  {...fieldProps}
                  value={draft.description}
                  onChange={(e) => setDraft((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              )}
            </Field>
            <Field label="강조 텍스트">
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  value={draft.highlight}
                  onChange={(e) => setDraft((f) => ({ ...f, highlight: e.target.value }))}
                  placeholder="소개 문장 내에서 볼드 처리할 텍스트"
                />
              )}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="이메일">
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraft((f) => ({ ...f, email: e.target.value }))}
                  />
                )}
              </Field>
              <Field label="GitHub">
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={draft.github}
                    onChange={(e) => setDraft((f) => ({ ...f, github: e.target.value }))}
                    placeholder="https://github.com/username"
                  />
                )}
              </Field>
            </div>
          </>
        )}
      </EditableSection>

      <EditableSection
        title="핵심 지표"
        value={resume.metrics}
        onSave={(metrics) => savePatch({ metrics })}
        preview={(metrics) => (
          <Flex
            wrap="wrap"
            gap={2}
          >
            {metrics.length === 0 ? (
              <Text
                typography="text-sm-regular"
                color="muted"
              >
                등록된 지표가 없습니다.
              </Text>
            ) : (
              metrics.map((metric, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: labels may repeat while a new metric is blank
                <Badge key={index}>
                  {metric.value} · {metric.label}
                </Badge>
              ))
            )}
          </Flex>
        )}
      >
        {(draft, setDraft) => (
          <ListEditor<ResumeMetric>
            items={draft}
            onChange={setDraft}
            createItem={() => ({ value: '', label: '', context: '' })}
            itemLabel={(_, index) => `지표 ${index + 1}`}
            addLabel="Add Metric"
          >
            {(metric, update) => (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="수치">
                    {(fieldProps) => (
                      <Input
                        {...fieldProps}
                        value={metric.value}
                        onChange={(e) => update({ value: e.target.value })}
                        placeholder="28%"
                      />
                    )}
                  </Field>
                  <Field label="레이블">
                    {(fieldProps) => (
                      <Input
                        {...fieldProps}
                        value={metric.label}
                        onChange={(e) => update({ label: e.target.value })}
                        placeholder="서버 부하 절감"
                      />
                    )}
                  </Field>
                </div>
                <Field label="설명">
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      value={metric.context}
                      onChange={(e) => update({ context: e.target.value })}
                      placeholder="TanStack Query 캐시·Refetch 정책"
                    />
                  )}
                </Field>
              </>
            )}
          </ListEditor>
        )}
      </EditableSection>

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

      <EditableSection
        title="Skills"
        value={resume.skillGroups}
        onSave={(skillGroups) => savePatch({ skillGroups })}
        preview={(skillGroups) => (
          <div className="space-y-3">
            {skillGroups.map((group, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: labels may repeat while a new group is blank
              <div key={index}>
                <Text
                  typography="text-xs-bold"
                  color="muted"
                  className="mb-1"
                >
                  {group.label}
                </Text>
                <Flex
                  wrap="wrap"
                  gap={2}
                >
                  {group.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </Flex>
              </div>
            ))}
          </div>
        )}
      >
        {(draft, setDraft) => (
          <ListEditor<SkillGroup>
            items={draft}
            onChange={setDraft}
            createItem={() => ({ label: '', skills: [] })}
            itemLabel={(group, index) => group.label || `그룹 ${index + 1}`}
            addLabel="Add Group"
          >
            {(group, update) => (
              <SkillGroupFields
                group={group}
                onChange={update}
              />
            )}
          </ListEditor>
        )}
      </EditableSection>

      <EditableSection
        title="학력"
        value={resume.education}
        onSave={(education) => savePatch({ education })}
        preview={(education) => (
          <div className="space-y-2">
            {education.map((item, index) => (
              <Flex
                // biome-ignore lint/suspicious/noArrayIndexKey: schools may repeat while a new entry is blank
                key={index}
                justify="between"
                align="center"
                gap={2}
              >
                <Text typography="text-sm-regular">
                  {item.school} · {item.course}
                </Text>
                <Text
                  typography="text-xs-regular"
                  color="muted"
                >
                  {item.status} · {item.period}
                </Text>
              </Flex>
            ))}
          </div>
        )}
      >
        {(draft, setDraft) => (
          <ListEditor<Education>
            items={draft}
            onChange={setDraft}
            createItem={() => ({ school: '', course: '', status: '', period: '' })}
            itemLabel={(item, index) => item.school || `학력 ${index + 1}`}
            addLabel="Add Education"
          >
            {(item, update) => (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="학교">
                    {(fieldProps) => (
                      <Input
                        {...fieldProps}
                        value={item.school}
                        onChange={(e) => update({ school: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field label="과정">
                    {(fieldProps) => (
                      <Input
                        {...fieldProps}
                        value={item.course}
                        onChange={(e) => update({ course: e.target.value })}
                        placeholder="컴퓨터과학과 · 학사 과정"
                      />
                    )}
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="상태">
                    {(fieldProps) => (
                      <Input
                        {...fieldProps}
                        value={item.status}
                        onChange={(e) => update({ status: e.target.value })}
                        placeholder="재학 중"
                      />
                    )}
                  </Field>
                  <Field label="기간">
                    {(fieldProps) => (
                      <Input
                        {...fieldProps}
                        value={item.period}
                        onChange={(e) => update({ period: e.target.value })}
                        placeholder="2025.03 — 현재"
                      />
                    )}
                  </Field>
                </div>
              </>
            )}
          </ListEditor>
        )}
      </EditableSection>
    </div>
  );
};

// ─── Skill Group Fields ───

const SkillGroupFields = ({
  group,
  onChange,
}: {
  group: SkillGroup;
  onChange: (patch: Partial<SkillGroup>) => void;
}) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill || group.skills.includes(skill)) return;
    onChange({ skills: [...group.skills, skill] });
    setNewSkill('');
  };

  return (
    <>
      <Field label="그룹명">
        {(fieldProps) => (
          <Input
            {...fieldProps}
            value={group.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Frontend"
          />
        )}
      </Field>
      <Flex
        wrap="wrap"
        gap={2}
      >
        {group.skills.map((skill) => (
          <Badge
            key={skill}
            className="cursor-pointer"
            onClick={() => onChange({ skills: group.skills.filter((s) => s !== skill) })}
          >
            {skill} ×
          </Badge>
        ))}
      </Flex>
      <Input
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
          }
        }}
        placeholder="새 스킬 입력 후 Enter"
      />
    </>
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
