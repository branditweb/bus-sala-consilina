import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/features/home/sections/hero-section";
import { StackSection } from "@/features/home/sections/stack-section";
import { StatusSection } from "@/features/home/sections/status-section";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <StackSection />
      <StatusSection />
    </main>
  );
}
