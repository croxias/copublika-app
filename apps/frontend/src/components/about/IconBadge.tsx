import {
  Award, BookOpen, Building2, CalendarCheck, CalendarDays, Coffee, Compass, Eye, FileText, FlaskConical, Flag, Globe,
  GraduationCap, Handshake, Hourglass, Layers, LayoutGrid, MapPin, Network, Rocket, ScanSearch, ShieldCheck, Sprout, Target,
  TrendingUp, Users, type LucideIcon,
} from "lucide-react";

const ICONS = {
  award: Award, book: BookOpen, building: Building2, calendarCheck: CalendarCheck, calendar: CalendarDays, coffee: Coffee,
  compass: Compass, eye: Eye, file: FileText, flask: FlaskConical, flag: Flag, globe: Globe, cap: GraduationCap,
  handshake: Handshake, hourglass: Hourglass, layers: Layers, grid: LayoutGrid, pin: MapPin, network: Network, rocket: Rocket,
  scan: ScanSearch, shield: ShieldCheck, sprout: Sprout, target: Target, trend: TrendingUp, users: Users,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/**
 * Rounded icon badge. Tones: "solid" (orange), "soft" (orange tint), "dark" (for ink surfaces).
 * Any ancestor with `.cp-ab-hov` animates it on hover (icon nudges, a light sweeps across).
 */
export function IconBadge({ icon, tone = "soft", size = 48, className = "" }: { icon: IconName; tone?: "solid" | "soft" | "dark"; size?: number; className?: string }) {
  const Icon = ICONS[icon];
  return (
    <span className={`cp-ib cp-ib--${tone} ${className}`} style={{ width: size, height: size, borderRadius: Math.round(size * 0.3) }} aria-hidden="true">
      <Icon size={Math.round(size * 0.46)} strokeWidth={1.9} className="cp-ib__icon" />
    </span>
  );
}
