interface WorkItemProps {
  company: string;
  role: string;
  period: string;
  points: readonly string[];
}

export const WorkItem = ({ company, role, period, points }: WorkItemProps) => (
  <div className="group">
    <div className="flex justify-between items-baseline mb-4">
      <h3 className="text-xl font-bold">{company}</h3>
      <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{period}</span>
    </div>
    <div className="text-sm font-medium text-muted-foreground mb-4">{role}</div>
    <ul className="space-y-2">
      {points.map((point) => (
        <li
          key={point}
          className="text-[15px] text-gray-600 dark:text-gray-300 flex items-start"
        >
          <span className="mr-3 text-gray-300 dark:text-gray-600">&mdash;</span>
          {point}
        </li>
      ))}
    </ul>
  </div>
);
