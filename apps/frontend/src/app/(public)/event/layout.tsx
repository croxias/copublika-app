import "../about/about.css";
import "@/components/program/program.css";
import "@/components/event/event.css";

/** Event pages reuse the About system and the program hero base, plus event styles. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
