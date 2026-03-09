'use client';

import { Flex, Icon, Text } from '@sunghoon-log/ui';
import { openProjectOverlay } from '@/components/project/use-project-overlay';
import type { Project } from '@/data/projects';

interface ProjectRowProps {
  project: Project;
}

export const ProjectRow = ({ project }: ProjectRowProps) => (
  <button
    type="button"
    className="w-full text-left p-6 rounded-2xl border border-border hover:border-primary transition-all cursor-pointer group bg-background"
    onClick={() => openProjectOverlay(project)}
  >
    <Flex
      justify="between"
      align="center"
      className="mb-2"
    >
      <Text
        as="h4"
        typography="text-lg-bold"
        className="group-hover:text-primary transition-colors"
      >
        {project.title}
      </Text>
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
        <Icon
          name="arrow-right"
          size={16}
        />
      </div>
    </Flex>
    <Text
      typography="text-sm-regular"
      color="muted"
      className="leading-relaxed"
    >
      {project.summary}
    </Text>
  </button>
);
