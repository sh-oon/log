export interface ResumeIntro {
  name: string;
  role: string;
  description: string;
  highlight: string;
  email: string;
  github: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  points: string[];
}

export interface ResumeMetric {
  value: string;
  label: string;
  context: string;
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export interface Education {
  school: string;
  course: string;
  status: string;
  period: string;
}

export interface ResumeData {
  schemaVersion: number;
  intro: ResumeIntro;
  metrics: ResumeMetric[];
  experiences: Experience[];
  skillGroups: SkillGroup[];
  education: Education[];
}
