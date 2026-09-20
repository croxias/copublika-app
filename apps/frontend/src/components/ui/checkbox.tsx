'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

const sizeClasses = {
  sm: 'size-4 [&_svg]:size-3',
  md: 'size-4.5 [&_svg]:size-3.5',
  lg: 'size-5 [&_svg]:size-4',
} as const;

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { size?: keyof typeof sizeClasses }
>(({ className, size = 'sm', ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      'peer shrink-0 rounded-[5px] border border-input bg-background shadow-xs transition-[color,box-shadow] outline-none',
      'focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:border-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
      sizeClasses[size],
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className="flex items-center justify-center text-current"
    >
      {props.checked === 'indeterminate' ? <Minus strokeWidth={3} /> : <Check strokeWidth={3} />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
