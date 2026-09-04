export interface Challenge {
  problem: string;
  action: string;
  result: string;
}

export interface Project {
  contentVersion: number;
  id: string;
  title: string;
  period: string;
  company: string;
  role: string;
  summary: string;
  tech: string[];
  challenges: Challenge[];
}
