import SmoothScroll from "@/components/SmoothScroll";
import Menu from "@/components/Menu";
import Hero from "@/components/Hero";
import WorkSection from "@/components/WorkSection";

export default function Home() {
  return (
    <SmoothScroll>
      <Menu />
      <main>
        <Hero />
        <WorkSection />
      </main>
    </SmoothScroll>
  );
}
