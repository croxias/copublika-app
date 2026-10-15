import { Mail } from "lucide-react";

// lucide-react 1.x no longer ships brand marks, so LinkedIn and Instagram are drawn here.
export function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm7 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.6 4.78 6v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91H10v-11Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** Row of round social buttons for a person; links that are empty are skipped. */
export function SocialLinks({ name, linkedin, instagram, email, size = 36, className = "" }: { name: string; linkedin?: string; instagram?: string; email?: string; size?: number; className?: string }) {
  const items = [
    linkedin && { href: linkedin, label: `LinkedIn ${name}`, icon: <LinkedinIcon size={size * 0.42} /> },
    instagram && { href: instagram, label: `Instagram ${name}`, icon: <InstagramIcon size={size * 0.44} /> },
    email && { href: `mailto:${email}`, label: `Email ${name}`, icon: <Mail size={size * 0.44} strokeWidth={2} /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];
  if (!items.length) return null;
  return (
    <div className={`cp-social ${className}`}>
      {items.map((it) => (
        <a key={it.label} href={it.href} target={it.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" aria-label={it.label} title={it.label} style={{ width: size, height: size }}>
          {it.icon}
        </a>
      ))}
    </div>
  );
}
