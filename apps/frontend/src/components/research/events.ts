// Lets one section of /research steer another (e.g. the hero globe filtering the publications
// table) without lifting their state into the page.

export type ResearchFocus =
  | { target: "projects"; status: string }
  | { target: "publications"; cluster: string };

const EVENT = "cp:research-focus";

export function focusResearch(detail: ResearchFocus) {
  window.dispatchEvent(new CustomEvent<ResearchFocus>(EVENT, { detail }));
  const id = detail.target === "projects" ? "proyek" : "publikasi";
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function onResearchFocus(handler: (detail: ResearchFocus) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ResearchFocus>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
