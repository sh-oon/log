'use client';

import { ArrowRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import { openProjectOverlay } from '@/components/project/use-project-overlay';

interface ProjectRowProps {
  project: Project;
}

export const ProjectRow = ({ project }: ProjectRowProps) => (
  <div
    className="p-6 rounded-2xl border border-gray-200 dark:border-white/15 hover:border-primary transition-all cursor-pointer group bg-white dark:bg-white/5"
    onClick={() => openProjectOverlay(project)}
  >
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
        {project.title}
      </h4>
      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
        <ArrowRight size={16} />
      </div>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-300 font-light leading-relaxed">
      {project.summary}
    </p>
  </div>
);
