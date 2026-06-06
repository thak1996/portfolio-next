import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type IconProps = HTMLAttributes<HTMLSpanElement> & {
  name: string;
  filled?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
};

export function Icon({
  name,
  className,
  filled = false,
  weight = 400,
  style,
  ...rest
}: IconProps) {
  const variationStyle: CSSProperties = {
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
    ...style,
  };

  return (
    <span
      aria-hidden="true"
      className={cn('material-symbols-outlined', className)}
      style={variationStyle}
      {...rest}
    >
      {name}
    </span>
  );
}
