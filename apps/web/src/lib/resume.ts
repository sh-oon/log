import fs from 'node:fs';
import path from 'node:path';
import type { Project } from '@/data/projects';
import type { ResumeData } from '@/types/resume';

const RESUME_FILE = path.join(process.cwd(), 'src/data/resume.json');
const PROJECTS_FILE = path.join(process.cwd(), 'src/data/projects.json');

const writeGuard = () => {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Write operations are only available in development mode');
  }
};

// Resume
export const getResume = (): ResumeData => {
  const raw = fs.readFileSync(RESUME_FILE, 'utf-8');
  return JSON.parse(raw);
};

export const updateResume = (data: ResumeData): ResumeData => {
  writeGuard();
  fs.writeFileSync(RESUME_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return data;
};

// Projects
export const getProjects = (): Project[] => {
  const raw = fs.readFileSync(PROJECTS_FILE, 'utf-8');
  return JSON.parse(raw);
};

export const updateProjects = (projects: Project[]): Project[] => {
  writeGuard();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  return projects;
};
