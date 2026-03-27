import { cn } from '@orka-log/shared';
import { Text } from '../text';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}
      data-test-id="empty-state"
    >
      {icon && (
        <div
          className="mb-4 text-muted-foreground"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <Text
        as="h3"
        typography="title-sm-semibold"
        color="foreground"
        className="mb-2"
      >
        {title}
      </Text>
      {description && (
        <Text
          as="p"
          typography="text-sm-regular"
          color="muted"
          className="mt-1"
        >
          {description}
        </Text>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
