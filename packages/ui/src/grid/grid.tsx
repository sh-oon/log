import { cn } from '@orka-log/shared';
import type { GridVariants } from './grid.variants';
import { gridVariants } from './grid.variants';

type GridOwnProps<T extends React.ElementType = 'div'> = {
  as?: T;
  ref?: React.Ref<React.ComponentRef<T>>;
} & GridVariants;

export type GridProps<T extends React.ElementType = 'div'> = GridOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof GridOwnProps<T>>;

export function Grid<T extends React.ElementType = 'div'>({
  as,
  className,
  columns,
  gap,
  align,
  justify,
  ref,
  ...props
}: GridProps<T>) {
  const Tag = (as ?? 'div') as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={cn(gridVariants({ columns, gap, align, justify }), className)}
      {...props}
    />
  );
}
