import { ArrowDownRight, Github, Mail } from 'lucide-react';
import { getProjects, getResume } from '@/lib/resume';
import { ProjectRow } from './project-row';
import { SectionHeading } from './section-heading';
import { WorkItem } from './work-item';

export const ResumeView = async () => {
  const [resume, projects] = await Promise.all([getResume(), getProjects()]);
  const { description, highlight } = resume.intro;
  const highlightIndex = highlight ? description.indexOf(highlight) : -1;
  const introBefore = highlightIndex >= 0 ? description.slice(0, highlightIndex) : description;
  const introAfter =
    highlightIndex >= 0 ? description.slice(highlightIndex + highlight.length) : '';

  return (
    <>
      <section
        aria-labelledby="intro-heading"
        className="relative overflow-hidden border-b border-border pb-20 pt-14 sm:pt-20 lg:pb-28 lg:pt-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-8 -z-10 size-72 rounded-full bg-blue-500/10 blur-[100px] sm:size-[28rem]"
        />
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.7fr)] lg:items-end lg:gap-20">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              </span>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                {resume.intro.role}
              </p>
            </div>

            <h1
              id="intro-heading"
              className="text-5xl font-bold tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[5.5rem] lg:leading-[0.95]"
            >
              정성훈<span className="text-blue-600 dark:text-blue-400">.</span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
              {introBefore}
              {highlightIndex >= 0 ? (
                <strong className="font-semibold text-foreground">{highlight}</strong>
              ) : null}
              {introAfter}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={`mailto:${resume.intro.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <Mail
                  aria-hidden="true"
                  size={16}
                />
                연락하기
              </a>
              <a
                href={resume.intro.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <Github
                  aria-hidden="true"
                  size={16}
                />
                GitHub
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-border bg-muted/45 p-7 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Current focus
            </p>
            <p className="mt-5 text-xl font-semibold leading-8 text-foreground">
              디자인 시스템의 전체 생명주기와 Agentic RAG 사용자 경험을 설계합니다.
            </p>
            <a
              href="#projects"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:gap-3 dark:text-blue-400"
            >
              프로젝트 살펴보기
              <ArrowDownRight
                aria-hidden="true"
                size={16}
              />
            </a>
          </aside>
        </div>

        <dl className="mt-16 grid border-y border-border sm:grid-cols-3 lg:mt-24">
          {resume.metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-b border-border px-0 py-7 last:border-b-0 sm:border-b-0 sm:border-r sm:px-7 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
            >
              <dt className="text-sm font-medium text-muted-foreground">{metric.label}</dt>
              <dd className="mt-2 text-3xl font-bold tracking-[-0.04em] text-foreground">
                {metric.value}
              </dd>
              <dd className="mt-2 text-xs leading-5 text-muted-foreground">{metric.context}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="experience-heading"
        className="scroll-mt-28 py-20 lg:py-28"
      >
        <SectionHeading
          id="experience-heading"
          eyebrow="01 · Experience"
          title="제품과 팀의 문제를 구조로 해결해 왔습니다."
          description="서비스 구현에 머무르지 않고 아키텍처, 성능, 디자인 시스템과 개발 프로세스까지 개선한 경험입니다."
        />
        <div>
          {resume.experiences.map((experience, index) => (
            <WorkItem
              key={experience.id}
              id={experience.id}
              index={index}
              company={experience.company}
              role={experience.role}
              period={experience.period}
              points={experience.points}
            />
          ))}
        </div>
      </section>

      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="scroll-mt-28 border-t border-border py-20 lg:py-28"
      >
        <SectionHeading
          id="projects-heading"
          eyebrow="02 · Selected work"
          title="복잡한 문제를 실제 서비스의 변화로 연결했습니다."
          description="카드를 선택하면 문제, 접근 방식, 결과를 프로젝트 단위로 확인할 수 있습니다."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-20 border-t border-border py-20 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20 lg:py-28">
        <section aria-labelledby="skills-heading">
          <SectionHeading
            id="skills-heading"
            eyebrow="03 · Capabilities"
            title="기술은 문제를 해결하기 위한 선택지입니다."
          />
          <div className="divide-y divide-border border-y border-border">
            {resume.skillGroups.map((group) => (
              <div
                key={group.label}
                className="grid gap-4 py-6 sm:grid-cols-[9rem_1fr]"
              >
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  {group.label}
                </h3>
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-sm font-medium text-foreground/80"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="education-heading">
          <SectionHeading
            id="education-heading"
            eyebrow="04 · Education"
            title="배움의 기록"
          />
          <div className="space-y-7">
            {resume.education.map((item) => (
              <article key={`${item.school}-${item.period}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-foreground">{item.school}</h3>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.course}</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">{item.period}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="mb-20 overflow-hidden rounded-[2rem] bg-blue-600 px-7 py-10 text-white sm:px-12 sm:py-14 lg:mb-28 lg:flex lg:items-end lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            Let&apos;s build better
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            사용자에게는 신뢰를, 팀에는 몰입할 수 있는 환경을 만듭니다.
          </h2>
        </div>
        <a
          href={`mailto:${resume.intro.email}`}
          className="mt-8 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 lg:mt-0"
        >
          {resume.intro.email}
          <ArrowDownRight
            aria-hidden="true"
            className="-rotate-90"
            size={16}
          />
        </a>
      </section>
    </>
  );
};
