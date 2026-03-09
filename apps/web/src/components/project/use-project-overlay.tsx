'use client';

import { overlay } from 'overlay-kit';
import type { Project } from '@/data/projects';
import { ProjectDetailOverlay } from './project-detail-overlay';

export const openProjectOverlay = (project: Project) =>
  overlay.open(({ isOpen, close }) =>
    isOpen ? (
      <ProjectDetailOverlay
        project={project}
        onClose={close}
      />
    ) : null,
  );
