import type { InputHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn('cp-ui-input', className)} {...props} />; }
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cn('cp-ui-input cp-ui-textarea', className)} {...props} />; }
export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) { return <label className={cn('cp-ui-label', className)} {...props} />; }
export function Separator({ className, ...props }: HTMLAttributes<HTMLHRElement>) { return <hr className={cn('cp-ui-separator', className)} {...props} />; }
export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div role="status" className={cn('cp-ui-alert', className)} {...props} />; }
export function Progress({ value = 0, className }: { value?: number; className?: string }) { return <div className={cn('cp-ui-progress', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>; }
export default Input;
