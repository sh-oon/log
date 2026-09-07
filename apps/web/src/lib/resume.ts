import type { Project } from '@/data/projects';
import defaultProjects from '@/data/projects.json';
import defaultResume from '@/data/resume.json';
import type { ResumeData } from '@/types/resume';
import { readJson, writeJson } from './storage';

const RESUME_FILE = 'src/data/resume.json';
const RESUME_BLOB = 'data/resume.json';
const PROJECTS_FILE = 'src/data/projects.json';
const PROJECTS_BLOB = 'data/projects.json';
const RESUME_SCHEMA_VERSION = 1;
const PROJECT_CONTENT_VERSION = 2;

const DEFAULT_RESUME = defaultResume satisfies ResumeData;
const DEFAULT_PROJECTS = defaultProjects satisfies Project[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isCurrentResume = (resume: unknown): resume is ResumeData => {
  if (!isRecord(resume) || !isRecord(resume.intro)) return false;

  return (
    resume.schemaVersion === RESUME_SCHEMA_VERSION &&
    typeof resume.intro.role === 'string' &&
    Array.isArray(resume.metrics) &&
    Array.isArray(resume.experiences) &&
    Array.isArray(resume.skillGroups) &&
    Array.isArray(resume.education)
  );
};

const isCurrentProject = (project: unknown): project is Project =>
  isRecord(project) &&
  project.contentVersion === PROJECT_CONTENT_VERSION &&
  typeof project.role === 'string' &&
  typeof project.contribution === 'string' &&
  Array.isArray(project.tech) &&
  Array.isArray(project.responsibilities) &&
  Array.isArray(project.outcomes) &&
  Array.isArray(project.narrative);

const isCurrentProjects = (projects: unknown): projects is Project[] =>
  Array.isArray(projects) && projects.every(isCurrentProject);

// Resume
export const getResume = async (): Promise<ResumeData> => {
  const stored = await readJson<unknown>(RESUME_FILE, RESUME_BLOB, DEFAULT_RESUME);
  return isCurrentResume(stored) ? stored : DEFAULT_RESUME;
};

export const updateResume = async (data: ResumeData): Promise<ResumeData> => {
  const versioned = { ...data, schemaVersion: RESUME_SCHEMA_VERSION };
  await writeJson(RESUME_FILE, RESUME_BLOB, versioned);
  return versioned;
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const stored = await readJson<unknown>(PROJECTS_FILE, PROJECTS_BLOB, DEFAULT_PROJECTS);
  return isCurrentProjects(stored) ? stored : DEFAULT_PROJECTS;
};

export const updateProjects = async (projects: Project[]): Promise<Project[]> => {
  const versioned = projects.map((project) => ({
    ...project,
    contentVersion: PROJECT_CONTENT_VERSION,
  }));
  await writeJson(PROJECTS_FILE, PROJECTS_BLOB, versioned);
  return versioned;
};
