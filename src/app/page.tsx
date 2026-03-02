import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/layout/container";
import { HomePlanner } from "@/features/home/components/home-planner";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-sky-50">
      <SiteHeader />
      <Container className="pt-6 sm:pt-8">
        <HomePlanner />
      </Container>
    </main>
  );
}
