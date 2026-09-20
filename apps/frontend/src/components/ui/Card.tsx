import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
export function Card({ children, className = '', ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('cp-ui-card', className)} {...props}>{children}</div>; }
export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) { return <div className={cn('cp-ui-card-header', className)}>{children}</div>; }
export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) { return <h2 className={cn('cp-ui-card-title', className)}>{children}</h2>; }
export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) { return <p className={cn('cp-ui-card-description', className)}>{children}</p>; }
export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) { return <div className={cn('cp-ui-card-content', className)}>{children}</div>; }
