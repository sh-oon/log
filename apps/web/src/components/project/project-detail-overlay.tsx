'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Code2, Target, Trophy, X } from 'lucide-react';
import { Chip } from '@sunghoon-log/ui';
import type { Project } from '@/data/projects';

interface ProjectDetailOverlayProps {
  project: Project;
  onClose: () => void;
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
  { key: 'problem', icon: Target, color: 'text-red-500', title: 'The Problem' },
  { key: 'action', icon: Code2, color: 'text-primary', title: 'My Action' },
  { key: 'result', icon: Trophy, color: 'text-amber-500', title: 'The Result' },
] as const;

export const ProjectDetailOverlay = ({ project, onClose }: ProjectDetailOverlayProps) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
  <AnimatePresence>
    <div className="fixed inset-0 z-[100] flex justify-end">
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
        className="relative w-full max-w-2xl bg-white dark:bg-[#0f0f0f] h-full shadow-2xl overflow-y-auto"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-md p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center z-10">
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            />
            <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
              Project Details
            </span>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        <div className="p-8 md:p-12 space-y-12 pb-24">
          {/* Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <div className="text-muted-foreground text-sm font-mono mb-2">
              {project.company}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-black dark:text-white mb-4 leading-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 dark:text-gray-500 mb-6">
              <span>{project.period}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span>{project.contribution}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Chip
                  key={t}
                  size="sm"
                >
                  {t}
                </Chip>
              ))}
            </div>
          </motion.section>

          {/* P-A-R Sections */}
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.key}
                className="space-y-4"
                custom={i}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon
                      size={20}
                      className={section.color}
                    />
                  </motion.div>
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
                    {section.title}
                  </h4>
                </div>
                <div className="pl-12">
                  <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-light">
                    {project[section.key]}
                  </p>
                  {section.key === 'action' && (
                    <div className="mt-2 text-sm text-muted-foreground font-mono tracking-tighter">
                      {project.contribution}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
  );
};
