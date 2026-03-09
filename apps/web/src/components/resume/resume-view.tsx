import { Chip } from '@sunghoon-log/ui';
import { Monitor } from 'lucide-react';
import { projectsData } from '@/data/projects';
import { ProjectRow } from './project-row';
import { WorkItem } from './work-item';

const experiences = [
  {
    company: '써로마인드',
    role: 'Frontend Engineer / Researcher',
    period: '2024.10 -- Present',
    points: [
      'Next.js App Router 기반 모노레포(Turbo Repo) 아키텍처 구축',
      '선언적 API 기반의 Overlay 시스템 설계 및 promise 기반 애니메이션 구현',
      'Tailwind CSS 디자인 시스템 마이그레이션 (CSS 번들 22% 감소)',
      'Husky & dependency-cruiser 도입을 통한 아키텍처 표준화 및 자동 검증',
    ],
  },
  {
    company: '케이씨산업',
    role: 'Frontend Engineer',
    period: '2023.05 -- 2024.05',
    points: [
      'CSR -> SSG 전환을 통한 SEO 최적화 및 LCP 단축 (4.2s -> 2.0s)',
      'Three.js 연동 3D 건축 시각화 뷰어 인터페이스 고도화',
      'Puppeteer 기반 PDF 렌더링 서버 구축 및 레이아웃 오류 86% 감소',
    ],
  },
  {
    company: '모두디자이너',
    role: 'Frontend Engineer',
    period: '2021.10 -- 2023.03',
    points: [
      'Vue 2 -> Vue 3 점진적 마이그레이션 주도 및 빌드 시간 66% 단축',
      'WebRTC 기반 P2P 실시간 미아 찾기 서비스 보안 아키텍처 설계',
      'Canvas 편집 툴 Off-screen Canvas 최적화',
    ],
  },
] as const;

const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Vue.js',
  'TurboRepo',
  'React-Query',
  'Zod',
  'TailwindCSS',
  'Three.js',
  'Konva',
] as const;

export const ResumeView = () => (
  <>
    {/* Intro */}
    <section className="mb-20">
      <h1 className="text-4xl font-black mb-6 tracking-tight">정성훈</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
        사용자 경험(UX)과 개발 경험(DX)을 동시에 개선하는 4년 차 프론트엔드 개발자입니다. 단순한
        기능 구현을 넘어, 서비스와 팀이 지속 성장 가능한{' '}
        <span className="text-black dark:text-white font-medium">아키텍처 설계와 생산성 개선</span>
        을 주도합니다.
      </p>
    </section>

    {/* Experience */}
    <section className="mb-20">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8 flex items-center">
        <Monitor
          size={16}
          className="mr-2"
        />{' '}
        Professional Experience
      </h2>
      <div className="space-y-12">
        {experiences.map((exp) => (
          <WorkItem
            key={exp.company}
            {...exp}
          />
        ))}
      </div>
    </section>

    {/* Selected Projects */}
    <section className="mb-20">
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8">
        Selected Projects
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {projectsData.map((proj) => (
          <ProjectRow
            key={proj.id}
            project={proj}
          />
        ))}
      </div>
    </section>

    {/* Skills */}
    <section>
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
        Technical Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Chip
            key={skill}
            size="sm"
          >
            {skill}
          </Chip>
        ))}
      </div>
    </section>
  </>
);
