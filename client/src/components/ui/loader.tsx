import * as React from 'react';
import { cn } from '@/lib/utils';

export function Loader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
        aria-hidden
      />
    </div>
  );
}
