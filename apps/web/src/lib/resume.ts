import type { Project } from '@/data/projects';
import type { ResumeData } from '@/types/resume';
import { readJson, writeJson } from './storage';

const RESUME_FILE = 'src/data/resume.json';
const RESUME_BLOB = 'data/resume.json';
const PROJECTS_FILE = 'src/data/projects.json';
const PROJECTS_BLOB = 'data/projects.json';

const DEFAULT_RESUME: ResumeData = {
  intro: { name: '', description: '', highlight: '' },
  experiences: [],
  skills: [],
};

// Migrate legacy project format (problem/action/result strings) to challenges array
interface LegacyProject {
  id: string;
  title: string;
  period: string;
  company: string;
  contribution: string;
  summary: string;
  tech: string[];
  problem?: string;
  action?: string;
  result?: string;
  challenges?: Project['challenges'];
}

const migrateProject = (raw: LegacyProject): Project => {
  if (raw.challenges && raw.challenges.length > 0) {
    return raw as Project;
  }
  return {
    id: raw.id,
    title: raw.title,
    period: raw.period,
    company: raw.company,
    contribution: raw.contribution,
    summary: raw.summary,
    tech: raw.tech,
    challenges: [
      {
        problem: raw.problem ?? '',
        action: raw.action ?? '',
        result: raw.result ?? '',
      },
    ],
  };
};

// Resume
export const getResume = async (): Promise<ResumeData> =>
  readJson<ResumeData>(RESUME_FILE, RESUME_BLOB, DEFAULT_RESUME);

export const updateResume = async (data: ResumeData): Promise<ResumeData> => {
  await writeJson(RESUME_FILE, RESUME_BLOB, data);
  return data;
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const raw = await readJson<LegacyProject[]>(PROJECTS_FILE, PROJECTS_BLOB, []);
  const needsMigration = raw.some((p) => !p.challenges || p.challenges.length === 0);
  const migrated = raw.map(migrateProject);

  if (needsMigration) {
    await writeJson(PROJECTS_FILE, PROJECTS_BLOB, migrated);
  }

  return migrated;
};

export const updateProjects = async (projects: Project[]): Promise<Project[]> => {
  await writeJson(PROJECTS_FILE, PROJECTS_BLOB, projects);
  return projects;
};
