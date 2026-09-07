'use client';

import { ArrowUpRight } from 'lucide-react';
import { overlay } from 'overlay-kit';
import { ProjectDetailOverlay } from '@/components/project/project-detail-overlay';
import type { Project } from '@/data/projects';

interface ProjectRowProps {
  project: Project;
  index: number;
}

const MAX_VISIBLE_TECH = 4;

export const ProjectRow = ({ project, index }: ProjectRowProps) => {
  const visibleTech = project.tech.slice(0, MAX_VISIBLE_TECH);
  const hiddenTechCount = project.tech.length - visibleTech.length;

  const handleOpen = () => {
    overlay.open(({ isOpen, close, unmount }) => (
      <ProjectDetailOverlay
        project={project}
        isOpen={isOpen}
        onClose={close}
        onExit={unmount}
      />
    ));
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      aria-haspopup="dialog"
      aria-label={`${project.title} 상세보기`}
      data-testid={`project-row-${project.id}`}
      className="group relative flex min-h-80 w-full flex-col overflow-hidden rounded-3xl border border-border bg-background p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:p-8 dark:hover:shadow-blue-950/20"
    >
      <span
        aria-hidden="true"
        className="absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/0 blur-2xl transition-colors duration-300 group-hover:bg-blue-500/10"
      />

      <span className="relative mb-10 flex items-start justify-between gap-6">
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, '0')} / {project.company}
        </span>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition duration-300 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white">
          <ArrowUpRight
            aria-hidden="true"
            size={18}
          />
        </span>
      </span>

      <span className="relative block text-2xl font-bold tracking-[-0.03em] text-foreground">
        {project.title}
      </span>
      <span className="relative mt-3 block text-sm leading-6 text-muted-foreground">
        {project.summary}
      </span>

      <span className="relative mt-auto block pt-8">
        <span className="mb-4 block font-mono text-xs text-muted-foreground">
          {project.period}
          {project.contribution ? ` · ${project.contribution}` : ''}
        </span>
        <span className="flex flex-wrap gap-2">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80"
            >
              {tech}
            </span>
          ))}
          {hiddenTechCount > 0 ? (
            <span className="px-1 py-1 font-mono text-xs text-muted-foreground">
              +{hiddenTechCount}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
};
