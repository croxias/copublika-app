import "../about/about.css";
import "../research/research.css";

/** Research pages reuse the About design system (headers, buttons, hero) plus their own styles. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
