import React from 'react';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: number; max?: number }
>(({ className, value, max = 100, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}
    {...props}
  >
    <div
      className='h-full bg-blue-600 transition-all'
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
));

Progress.displayName = 'Progress';

export { Progress };
