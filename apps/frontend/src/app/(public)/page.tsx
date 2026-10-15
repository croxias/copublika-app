import { Hero } from "@/components/landing/Hero";
import { StatsSection } from "@/components/landing/StatsSection";
import { WhyJoinBento } from "@/components/landing/WhyJoinBento";
import { ProgramHighlight } from "@/components/landing/ProgramHighlight";
import { ResearchMarquee } from "@/components/landing/ResearchMarquee";
import { EventsList } from "@/components/landing/EventsList";
import { BlogFeatured } from "@/components/landing/BlogFeatured";
import { AlumniMarquee } from "@/components/landing/AlumniMarquee";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <WhyJoinBento />
      <ProgramHighlight />
      <ResearchMarquee />
      <EventsList />
      <BlogFeatured />
      <AlumniMarquee />
      <FAQ />
      <FinalCTA />
      <ScrollReveal />
    </>
  );
}
