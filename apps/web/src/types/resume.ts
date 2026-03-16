export interface ResumeIntro {
  name: string;
  description: string;
  highlight: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  points: string[];
}

export interface ResumeData {
  intro: ResumeIntro;
  experiences: Experience[];
  skills: string[];
}
