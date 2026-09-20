import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center border border-transparent font-medium focus:outline-hidden focus:ring-[3px] focus:ring-ring/40 [&_svg]:-ms-px [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        info: 'bg-info text-info-foreground',
        outline: 'bg-transparent border border-border text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
      appearance: {
        default: '',
        light: '',
        outline: '',
        ghost: 'border-transparent bg-transparent',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
      },
      size: {
        lg: 'rounded-md px-2 h-7 min-w-7 gap-1.5 text-xs [&_svg]:size-3.5',
        md: 'rounded-md px-1.5 h-6 min-w-6 gap-1.5 text-xs [&_svg]:size-3.5',
        sm: 'rounded-sm px-1.5 h-5 min-w-5 gap-1 text-[0.6875rem] leading-3 [&_svg]:size-3',
        xs: 'rounded-sm px-1 h-4 min-w-4 gap-1 text-[0.625rem] leading-2 [&_svg]:size-3',
      },
      shape: {
        default: '',
        circle: 'rounded-full',
      },
    },
    compoundVariants: [
      { variant: 'primary', appearance: 'light', className: 'text-primary bg-primary-soft' },
      { variant: 'secondary', appearance: 'light', className: 'bg-secondary text-secondary-foreground' },
      { variant: 'success', appearance: 'light', className: 'text-success-accent bg-success-soft' },
      { variant: 'warning', appearance: 'light', className: 'text-warning-accent bg-warning-soft' },
      { variant: 'info', appearance: 'light', className: 'text-info-accent bg-info-soft' },
      { variant: 'destructive', appearance: 'light', className: 'text-destructive bg-destructive-soft' },
      { variant: 'primary', appearance: 'outline', className: 'text-primary border-primary/25 bg-primary-soft' },
      {
        variant: 'success',
        appearance: 'outline',
        className: 'text-success-accent border-success/25 bg-success-soft',
      },
      {
        variant: 'warning',
        appearance: 'outline',
        className: 'text-warning-accent border-warning/25 bg-warning-soft',
      },
      { variant: 'info', appearance: 'outline', className: 'text-info-accent border-info/25 bg-info-soft' },
      {
        variant: 'destructive',
        appearance: 'outline',
        className: 'text-destructive border-destructive/25 bg-destructive-soft',
      },
      { variant: 'primary', appearance: 'ghost', className: 'text-primary' },
      { variant: 'secondary', appearance: 'ghost', className: 'text-secondary-foreground' },
      { variant: 'success', appearance: 'ghost', className: 'text-success-accent' },
      { variant: 'warning', appearance: 'ghost', className: 'text-warning-accent' },
      { variant: 'info', appearance: 'ghost', className: 'text-info-accent' },
      { variant: 'destructive', appearance: 'ghost', className: 'text-destructive' },
      { size: 'lg', appearance: 'ghost', className: 'px-0' },
      { size: 'md', appearance: 'ghost', className: 'px-0' },
      { size: 'sm', appearance: 'ghost', className: 'px-0' },
      { size: 'xs', appearance: 'ghost', className: 'px-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      appearance: 'default',
      size: 'md',
    },
  },
);

const badgeButtonVariants = cva(
  'cursor-pointer transition-all inline-flex items-center justify-center leading-none size-3.5 [&>svg]:opacity-100! [&>svg]:size-3.5 p-0 rounded-md -me-0.5 opacity-60 hover:opacity-100',
  {
    variants: { variant: { default: '' } },
    defaultVariants: { variant: 'default' },
  },
);

function Badge({
  className,
  variant,
  size,
  appearance,
  shape,
  asChild = false,
  disabled,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, appearance, shape, disabled }), className)}
      {...props}
    />
  );
}

function BadgeButton({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeButtonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'span';
  return (
    <Comp data-slot="badge-button" className={cn(badgeButtonVariants({ variant, className }))} role="button" {...props} />
  );
}

function BadgeDot({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="badge-dot"
      className={cn('size-1.5 rounded-full bg-[currentColor] opacity-75', className)}
      {...props}
    />
  );
}

export { Badge, BadgeButton, BadgeDot, badgeVariants };
