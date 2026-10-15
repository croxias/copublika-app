import "../about/about.css";
import "@/components/program/program.css";

/** Program pages reuse the About design system (headers, buttons, reveal) plus program styles. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
