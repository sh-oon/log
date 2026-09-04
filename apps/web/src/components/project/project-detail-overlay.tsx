'use client';

import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Target, Wrench, X } from 'lucide-react';
import type { Project } from '@/data/projects';

interface ProjectDetailOverlayProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
}

const sections = [
  { key: 'problem' as const, label: '문제', icon: Target },
  { key: 'action' as const, label: '접근', icon: Wrench },
  { key: 'result' as const, label: '결과', icon: CheckCircle2 },
];

export const ProjectDetailOverlay = ({
  project,
  isOpen,
  onClose,
  onExit,
}: ProjectDetailOverlayProps) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(focusFrame);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence onExitComplete={onExit}>
      {isOpen ? (
        <motion.div
          key="project-overlay"
          className="fixed inset-0 z-[100] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="프로젝트 상세 닫기"
            className="absolute inset-0 cursor-default bg-gray-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative h-full w-full max-w-2xl overflow-y-auto bg-background shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 330 }}
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-6 py-4 backdrop-blur-xl sm:px-10">
              <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Project case study
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-foreground/20 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X
                  aria-hidden="true"
                  size={18}
                />
                <span className="sr-only">닫기</span>
              </button>
            </header>

            <div className="px-6 pb-24 pt-10 sm:px-10 sm:pt-14">
              <div className="border-b border-border pb-10">
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400">
                  {project.company} · {project.period}
                </p>
                <h2
                  id={titleId}
                  className="mt-5 text-3xl font-bold leading-tight tracking-[-0.045em] text-foreground sm:text-5xl"
                >
                  {project.title}
                </h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">{project.summary}</p>
              </div>

              <dl className="grid gap-7 border-b border-border py-9 sm:grid-cols-[8rem_1fr]">
                <dt className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  담당 역할
                </dt>
                <dd className="text-sm font-medium leading-6 text-foreground">{project.role}</dd>
                <dt className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  기술
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </dl>

              <div className="space-y-14 pt-12">
                {project.challenges.map((challenge, challengeIndex) => (
                  <section key={`${project.id}-${challengeIndex}`}>
                    {project.challenges.length > 1 ? (
                      <p className="mb-8 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                        Challenge {String(challengeIndex + 1).padStart(2, '0')}
                      </p>
                    ) : null}

                    <div className="space-y-9">
                      {sections.map(({ key, label, icon: Icon }) => (
                        <div
                          key={key}
                          className="grid gap-4 sm:grid-cols-[8rem_1fr]"
                        >
                          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Icon
                              aria-hidden="true"
                              className="text-blue-600 dark:text-blue-400"
                              size={16}
                            />
                            {label}
                          </h3>
                          <p className="text-[15px] leading-7 text-foreground/75">
                            {challenge[key]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
