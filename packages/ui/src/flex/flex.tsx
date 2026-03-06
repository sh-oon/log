import { cn } from '@sunghoon-log/shared';
import type { FlexVariants } from './flex.variants';
import { flexVariants } from './flex.variants';

export interface FlexProps extends React.HTMLAttributes<HTMLElement>, FlexVariants {
  as?: React.ElementType;
  ref?: React.Ref<HTMLElement>;
}

export function Flex({
  as: Tag = 'div',
  className,
  direction,
  align,
  justify,
  wrap,
  gap,
  ref,
  ...props
}: FlexProps) {
  return (
    <Tag
      ref={ref}
      className={cn(flexVariants({ direction, align, justify, wrap, gap }), className)}
      {...props}
    />
  );
}
