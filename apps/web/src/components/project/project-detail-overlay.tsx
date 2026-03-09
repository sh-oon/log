'use client';

import { useEffect } from 'react';
import type { IconName } from '@sunghoon-log/ui';
import { Chip, Flex, Icon, Text } from '@sunghoon-log/ui';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/data/projects';

interface ProjectDetailOverlayProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { delay: 0.2 } },
};

const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, damping: 30, stiffness: 300 },
  },
  exit: {
    x: '100%',
    transition: { type: 'spring' as const, damping: 30, stiffness: 300 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const sections = [
  {
    key: 'problem',
    icon: 'target' as IconName,
    color: 'text-destructive-500',
    title: 'The Problem',
  },
  { key: 'action', icon: 'code-2' as IconName, color: 'text-primary', title: 'My Action' },
  { key: 'result', icon: 'trophy' as IconName, color: 'text-warning-500', title: 'The Result' },
] as const;

export const ProjectDetailOverlay = ({ project, isOpen, onClose, onExit }: ProjectDetailOverlayProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <AnimatePresence onExitComplete={onExit}>
      {isOpen && (
      <motion.div key="project-overlay" className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        {/* Side Panel */}
        <motion.div
          className="relative w-full max-w-2xl bg-background h-full shadow-2xl overflow-y-auto"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Sticky Header */}
          <Flex
            justify="between"
            align="center"
            className="sticky top-0 bg-background/80 backdrop-blur-md p-6 border-b border-border z-10"
          >
            <Flex
              align="center"
              gap={2}
            >
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              />
              <Text
                as="span"
                typography="text-xs-bold"
                color="muted"
                className="font-mono tracking-widest uppercase"
              >
                Project Details
              </Text>
            </Flex>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                name="x"
                size={24}
              />
            </motion.button>
          </Flex>

          <div className="p-8 md:p-12 space-y-12 pb-24">
            {/* Header */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Text
                typography="text-sm-regular"
                color="muted"
                className="font-mono mb-2"
              >
                {project.company}
              </Text>
              <Text
                as="h2"
                typography="title-2xl-bold"
                className="tracking-tight mb-4 leading-tight"
              >
                {project.title}
              </Text>
              <Flex
                align="center"
                gap={2}
                className="text-xs font-mono text-muted-foreground mb-6"
              >
                <span>{project.period}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span>{project.contribution}</span>
              </Flex>
              <Flex
                wrap="wrap"
                gap={2}
              >
                {project.tech.map((t) => (
                  <Chip
                    key={t}
                    size="sm"
                  >
                    {t}
                  </Chip>
                ))}
              </Flex>
            </motion.section>

            {/* P-A-R Sections */}
            {sections.map((section, i) => (
              <motion.div
                key={section.key}
                className="space-y-4"
                custom={i}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <Flex
                  align="center"
                  gap={3}
                >
                  <motion.div
                    className="p-2 bg-muted rounded-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon
                      name={section.icon}
                      size={20}
                      className={section.color}
                    />
                  </motion.div>
                  <Text
                    as="h4"
                    typography="text-sm-bold"
                    color="muted"
                    className="uppercase tracking-[0.2em]"
                  >
                    {section.title}
                  </Text>
                </Flex>
                <div className="pl-12">
                  <Text
                    typography="text-lg-regular"
                    className="leading-relaxed"
                  >
                    {project[section.key]}
                  </Text>
                  {section.key === 'action' && (
                    <Text
                      typography="text-sm-regular"
                      color="muted"
                      className="mt-2 font-mono tracking-tighter"
                    >
                      {project.contribution}
                    </Text>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>
  );
};
