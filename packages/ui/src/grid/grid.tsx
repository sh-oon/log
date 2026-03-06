import { cn } from '@sunghoon-log/shared';
import type { GridVariants } from './grid.variants';
import { gridVariants } from './grid.variants';

export interface GridProps extends React.HTMLAttributes<HTMLElement>, GridVariants {
  as?: React.ElementType;
  ref?: React.Ref<HTMLElement>;
}

export function Grid({
  as: Tag = 'div',
  className,
  columns,
  gap,
  align,
  justify,
  ref,
  ...props
}: GridProps) {
  return (
    <Tag
      ref={ref}
      className={cn(gridVariants({ columns, gap, align, justify }), className)}
      {...props}
    />
  );
}
