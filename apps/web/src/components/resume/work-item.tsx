interface WorkItemProps {
  id: string;
  index: number;
  company: string;
  role: string;
  period: string;
  points: readonly string[];
}

export const WorkItem = ({ id, index, company, role, period, points }: WorkItemProps) => (
  <article
    data-testid={`work-item-${id}`}
    className="group grid gap-6 border-t border-border py-9 first:border-t-0 first:pt-0 md:grid-cols-[13rem_1fr] md:gap-12"
  >
    <header>
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="h-px w-8 bg-blue-500/40" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{company}</h3>
      <p className="mt-2 text-sm font-medium text-muted-foreground">{role}</p>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        <span className="sr-only">근무 기간: </span>
        {period}
      </p>
    </header>

    <ul className="space-y-4">
      {points.map((point) => (
        <li
          key={point}
          className="relative pl-5 text-[15px] leading-7 text-foreground/80 before:absolute before:left-0 before:top-[0.7rem] before:size-1.5 before:rounded-full before:bg-blue-500"
        >
          {point}
        </li>
      ))}
    </ul>
  </article>
);
