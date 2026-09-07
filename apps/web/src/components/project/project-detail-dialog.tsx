'use client';

import { type PointerEvent as ReactPointerEvent, useEffect, useId, useRef } from 'react';
import { cn } from '@orka-log/shared';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';
import type { Project } from '@/data/projects';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ProjectDetailDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
}

/** Tailwind `sm` breakpoint. 아래로는 바텀 시트, 위로는 가운데 모달로 뜬다. */
const DESKTOP_QUERY = '(min-width: 640px)';
const SHEET_CLOSE_OFFSET = 120;
const SHEET_CLOSE_VELOCITY = 600;

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

const DetailSection = ({ title, children }: DetailSectionProps) => (
  <section>
    <h3 className="mb-6 flex items-center gap-3 text-base font-bold tracking-tight text-foreground">
      <span
        aria-hidden="true"
        className="h-4 w-1 rounded-full bg-blue-600 dark:bg-blue-400"
      />
      {title}
    </h3>
    {children}
  </section>
);

export const ProjectDetailDialog = ({
  project,
  isOpen,
  onClose,
  onExit,
}: ProjectDetailDialogProps) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dragControls = useDragControls();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const hasSingleOutcome = project.outcomes.length === 1;

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

  // 본문 스크롤과 충돌하지 않도록 손잡이 영역에서 시작한 제스처만 시트를 끈다.
  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (isDesktop) return;
    if (!(event.target as HTMLElement).closest('[data-drag-handle]')) return;
    dragControls.start(event);
  };

  const motionProps = isDesktop
    ? {
        initial: { opacity: 0, scale: 0.96, y: 16 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.97, y: 8 },
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
      };

  return (
    <AnimatePresence onExitComplete={onExit}>
      {isOpen ? (
        <motion.div
          key="project-dialog"
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="프로젝트 상세 닫기"
            className="absolute inset-0 cursor-default bg-gray-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-border bg-background shadow-2xl sm:max-h-[88vh] sm:max-w-4xl sm:rounded-3xl sm:border lg:max-w-5xl"
            drag={isDesktop ? false : 'y'}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onPointerDown={handlePointerDown}
            onDragEnd={(_, info) => {
              if (info.offset.y > SHEET_CLOSE_OFFSET || info.velocity.y > SHEET_CLOSE_VELOCITY) {
                onClose();
              }
            }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            {...motionProps}
          >
            <div
              data-drag-handle
              className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-3 active:cursor-grabbing sm:hidden"
            >
              <span
                aria-hidden="true"
                className="h-1 w-10 rounded-full bg-border"
              />
            </div>

            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-10">
              <div
                data-drag-handle
                className="flex touch-none items-center gap-3 sm:touch-auto"
              >
                <span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Project case study
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-foreground/20 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X
                  aria-hidden="true"
                  size={18}
                />
                <span className="sr-only">닫기</span>
              </button>
            </header>

            <div className="overflow-y-auto overscroll-contain">
              <div className="relative overflow-hidden border-b border-border px-5 pb-9 pt-8 sm:px-10 sm:pb-11 sm:pt-11">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-16 size-64 rounded-full bg-blue-500/10 blur-[90px]"
                />

                <p className="relative font-mono text-xs text-blue-600 dark:text-blue-400">
                  {project.company} · {project.period}
                  {project.contribution ? (
                    <span className="ml-2 text-muted-foreground">{project.contribution}</span>
                  ) : null}
                </p>

                <h2
                  id={titleId}
                  className="relative mt-4 text-[1.75rem] font-bold leading-tight tracking-[-0.045em] text-foreground sm:text-[2.75rem]"
                >
                  {project.title}
                </h2>

                <p className="relative mt-4 max-w-3xl text-base font-semibold leading-7 text-foreground/90 sm:text-lg sm:leading-8">
                  {project.role}
                </p>

                <p className="relative mt-3 max-w-3xl text-[15px] leading-7 text-muted-foreground sm:leading-8">
                  {project.summary}
                </p>

                <ul className="relative mt-7 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-foreground/80"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-12 px-5 pb-14 pt-10 sm:px-10 sm:space-y-14 sm:pt-12">
                {project.outcomes.length > 0 ? (
                  <DetailSection title="성과">
                    <ul className="grid gap-4 sm:grid-cols-2">
                      {project.outcomes.map((item) => (
                        <li
                          key={item}
                          className={cn(
                            'rounded-2xl border border-blue-500/25 bg-blue-500/[0.06] p-5 text-base font-semibold leading-7 text-foreground sm:p-6 sm:text-lg sm:leading-8',
                            hasSingleOutcome && 'sm:col-span-2'
                          )}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </DetailSection>
                ) : null}

                {project.responsibilities.length > 0 ? (
                  <DetailSection title="담당 업무">
                    <ol className="border-y border-border">
                      {project.responsibilities.map((item, index) => (
                        <li
                          key={item}
                          className="grid gap-2 border-t border-border py-5 first:border-t-0 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                        >
                          <span
                            aria-hidden="true"
                            className="font-mono text-xs font-semibold text-blue-600 sm:pt-1 dark:text-blue-400"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <p className="max-w-3xl text-[15px] leading-7 text-foreground/85">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </DetailSection>
                ) : null}

                {project.narrative.length > 0 ? (
                  <DetailSection title="프로젝트 이야기">
                    <div className="max-w-3xl space-y-6">
                      {project.narrative.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-[15px] leading-8 text-foreground/75"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </DetailSection>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
