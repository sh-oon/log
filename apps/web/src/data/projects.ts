export interface Project {
  contentVersion: number;
  id: string;
  title: string;
  period: string;
  company: string;
  /** 맡았던 역할 한 줄 — 경력기술서의 머리말. */
  role: string;
  /** 기여도. 팀 규모가 드러나지 않는 프로젝트에서 역할의 크기를 보여준다. */
  contribution: string;
  summary: string;
  /** 주력 기술만. 사용해 본 스택을 전부 나열하면 핵심 역량이 흐려진다. */
  tech: string[];
  /** 담당 업무. 수행 내역이 아니라 어떤 문제를 어떻게 풀었는지가 드러나야 한다. */
  responsibilities: string[];
  /** 성과. 가능하면 시간·건수·비율로. */
  outcomes: string[];
  /** 이력서용 서술. 문단 단위로 흐르는 문장. */
  narrative: string[];
}
