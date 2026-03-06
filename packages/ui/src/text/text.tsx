import { cn } from '@sunghoon-log/shared';
import type { TextAlign, TextColor, Typography } from './text.variants';
import { alignClassMap, colorClassMap } from './text.variants';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  typography?: Typography;
  color?: TextColor;
  lineLimit?: number;
  align?: TextAlign;
  ref?: React.Ref<HTMLElement>;
}

export function Text({
  as: Component = 'p',
  typography = 'text-md-regular',
  color,
  lineLimit,
  align,
  className,
  style,
  ref,
  ...props
}: TextProps) {
  const lineLimitStyle = lineLimit
    ? {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical' as const,
        WebkitLineClamp: lineLimit,
        overflow: 'hidden',
      }
    : undefined;

  return (
    <Component
      ref={ref}
      className={cn(
        color && colorClassMap[color],
        align && alignClassMap[align],
        typography,
        className
      )}
      style={{ ...lineLimitStyle, ...style }}
      {...props}
    />
  );
}
