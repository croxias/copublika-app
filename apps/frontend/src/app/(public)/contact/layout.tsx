import "../about/about.css";
import "@/components/program/program.css";
import "@/components/event/event.css";
import "@/components/contact/contact.css";

/** Contact reuses the About system, the program hero base and event form fields. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
