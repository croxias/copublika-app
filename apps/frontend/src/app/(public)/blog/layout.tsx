import "../about/about.css";
import "@/components/program/program.css";
import "@/components/blog/blog.css";

/** Blog pages reuse the About system and the program hero base, plus blog styles. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
