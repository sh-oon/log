import { cn } from '@sunghoon-log/shared';
import type { FlexVariants } from './flex.variants';
import { flexVariants } from './flex.variants';

type FlexOwnProps<T extends React.ElementType = 'div'> = {
  as?: T;
  ref?: React.Ref<React.ComponentRef<T>>;
} & FlexVariants;

export type FlexProps<T extends React.ElementType = 'div'> = FlexOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof FlexOwnProps<T>>;

export function Flex<T extends React.ElementType = 'div'>({
  as,
  className,
  direction,
  align,
  justify,
  wrap,
  gap,
  ref,
  ...props
}: FlexProps<T>) {
  const Tag = (as ?? 'div') as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={cn(flexVariants({ direction, align, justify, wrap, gap }), className)}
      {...props}
    />
  );
}
