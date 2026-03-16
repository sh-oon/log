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

// Resume
export const getResume = async (): Promise<ResumeData> =>
  readJson<ResumeData>(RESUME_FILE, RESUME_BLOB, DEFAULT_RESUME);

export const updateResume = async (data: ResumeData): Promise<ResumeData> => {
  await writeJson(RESUME_FILE, RESUME_BLOB, data);
  return data;
};

// Projects
export const getProjects = async (): Promise<Project[]> =>
  readJson<Project[]>(PROJECTS_FILE, PROJECTS_BLOB, []);

export const updateProjects = async (projects: Project[]): Promise<Project[]> => {
  await writeJson(PROJECTS_FILE, PROJECTS_BLOB, projects);
  return projects;
};
