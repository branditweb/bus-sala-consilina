import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <p className="text-sm font-semibold tracking-wide text-brand-700">{siteConfig.name}</p>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          Inizio progetto
        </span>
      </Container>
    </header>
  );
}
