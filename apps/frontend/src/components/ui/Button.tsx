import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  href,
  disabled,
  type = "button",
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2";

  const variants = {
    primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-ink)] shadow-sm",
    secondary: "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90",
    ghost: "hover:bg-[var(--surface)] text-[var(--foreground)]",
    outline: "border border-[var(--line)] hover:bg-[var(--surface)] text-[var(--foreground)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const classes = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes, disabled && "opacity-50 cursor-not-allowed")}
    >
      {children}
    </button>
  );
}
