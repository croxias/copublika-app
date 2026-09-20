import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
export function Badge({ children, tone = 'default', className = '' }: { children: ReactNode; tone?: 'default'|'accent'|'success'|'warning'|'danger'|'info'; className?: string }) { return <span className={cn('cp-ui-badge', `cp-ui-badge--${tone}`, className)}>{children}</span>; }
