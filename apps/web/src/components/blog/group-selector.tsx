import Link from 'next/link';
import { cn } from '@orka-log/shared';
import { GROUP_LABELS, type GroupKey } from '@/lib/post-grouping';

interface GroupSelectorProps {
  options: GroupKey[];
  active: GroupKey;
}

const hrefFor = (key: GroupKey) => (key === 'none' ? '/blog' : `/blog?group=${key}`);

export const GroupSelector = ({ options, active }: GroupSelectorProps) => {
  if (options.length <= 1) return null;

  return (
    <nav
      aria-label="글 묶어보기 기준"
      className="flex flex-wrap items-center gap-2"
    >
      {options.map((option) => {
        const isActive = option === active;
        return (
          <Link
            key={option}
            href={hrefFor(option)}
            scroll={false}
            aria-current={isActive ? 'page' : undefined}
            data-test-id={`group-option-${option}`}
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
              isActive
                ? 'border border-primary bg-primary text-primary-foreground'
                : 'glass glass-hover text-muted-foreground hover:text-foreground'
            )}
          >
            {GROUP_LABELS[option]}
          </Link>
        );
      })}
    </nav>
  );
};
