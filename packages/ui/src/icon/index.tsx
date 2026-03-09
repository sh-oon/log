import type { ComponentProps } from 'react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

export type { IconName };

export type IconComponentProps = ComponentProps<typeof DynamicIcon>;

export function Icon(props: IconComponentProps) {
  return (
    <DynamicIcon
      aria-hidden="true"
      {...props}
    />
  );
}
