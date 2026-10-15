import { ResearchHero } from "@/components/research/ResearchHero";
import { ActiveProjectsGallery } from "@/components/research/ActiveProjectsGallery";
import { ResearchProcess } from "@/components/research/ResearchProcess";
import { PublicationsExplorer } from "@/components/research/PublicationsExplorer";

export const metadata = {
  title: "Research Project — CoPublika",
  description:
    "Galeri proyek riset aktif lintas cluster, publikasi alumni terindeks, dan kerangka kolaborasi CoPublika.",
};

export default function ResearchPage() {
  return (
    <>
      <ResearchHero />
      <ActiveProjectsGallery />
      <ResearchProcess />
      <PublicationsExplorer />
    </>
  );
}
