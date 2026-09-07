'use client';

import { ArrowUpRight } from 'lucide-react';
import { overlay } from 'overlay-kit';
import { ProjectDetailDialog } from '@/components/project/project-detail-dialog';
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
      <ProjectDetailDialog
        project={project}
        isOpen={isOpen}
        onClose={close}
        onExit={unmount}
      />
    ));
  };

  return (
    <li className="group border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-label={`${project.title} 상세보기`}
        data-testid={`project-row-${project.id}`}
        className="flex w-full flex-col gap-5 rounded-2xl py-9 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background md:grid md:grid-cols-[13rem_1fr] md:gap-x-12"
      >
        <span className="block">
          <span className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="h-px w-8 bg-blue-500/40" />
          </span>
          <span className="block text-sm font-semibold text-foreground">{project.company}</span>
          <span className="mt-2 block font-mono text-xs text-muted-foreground">
            <span className="sr-only">기간: </span>
            {project.period}
          </span>
          {project.contribution ? (
            <span className="mt-1 block font-mono text-xs text-muted-foreground">
              {project.contribution}
            </span>
          ) : null}
        </span>

        <span className="block">
          <span className="flex items-start justify-between gap-6">
            <span className="text-xl font-bold tracking-[-0.03em] text-foreground transition-colors duration-300 group-hover:text-blue-600 sm:text-2xl dark:group-hover:text-blue-400">
              {project.title}
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition duration-300 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white">
              <ArrowUpRight
                aria-hidden="true"
                size={16}
              />
            </span>
          </span>

          <span className="mt-3 block text-sm leading-6 text-muted-foreground">
            {project.summary}
          </span>

          <span className="mt-5 flex flex-wrap gap-2">
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
    </li>
  );
};
