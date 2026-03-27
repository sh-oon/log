export interface Challenge {
  problem: string;
  action: string;
  result: string;
}

export interface Project {
  id: string;
  title: string;
  period: string;
  company: string;
  contribution: string;
  summary: string;
  tech: string[];
  challenges: Challenge[];
}
