import { Flex, Text } from '@orka-log/ui';

interface WorkItemProps {
  company: string;
  role: string;
  period: string;
  points: readonly string[];
}

export const WorkItem = ({ company, role, period, points }: WorkItemProps) => (
  <div className="group">
    <Flex
      justify="between"
      align="baseline"
      className="mb-4"
    >
      <Text
        as="h3"
        typography="text-lg-bold"
      >
        {company}
      </Text>
      <Text
        as="span"
        typography="text-xs-regular"
        color="muted"
        className="font-mono"
      >
        {period}
      </Text>
    </Flex>
    <Text
      typography="text-sm-medium"
      color="muted"
      className="mb-4"
    >
      {role}
    </Text>
    <ul className="space-y-2">
      {points.map((point) => (
        <li
          key={point}
          className="text-[15px] text-muted-foreground flex items-start"
        >
          <span className="mr-3 text-border">&mdash;</span>
          {point}
        </li>
      ))}
    </ul>
  </div>
);
