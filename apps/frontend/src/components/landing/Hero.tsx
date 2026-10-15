import { getHeroSlides } from "@/lib/content/hero";
import { HeroSlider } from "./HeroSlider";

// Landing hero: the latest CoPublika updates as a paper-curl slider. Slides are
// content, managed from the admin "Hero" page; layout and motion stay in code.
export async function Hero() {
  const slides = await getHeroSlides();
  return <HeroSlider slides={slides} />;
}

export default Hero;
