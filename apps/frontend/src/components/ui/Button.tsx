import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; variant?: 'primary'|'secondary'|'ghost'|'outline'|'danger'; size?: 'sm'|'md'|'lg'; href?: string; }
export function Button({ children, variant='primary', size='md', className, href, ...props }: ButtonProps) { const classes=cn('cp-ui-button', `cp-ui-button--${variant}`, `cp-ui-button--${size}`, className); return href ? <a href={href} className={classes}>{children}</a> : <button className={classes} {...props}>{children}</button>; }
