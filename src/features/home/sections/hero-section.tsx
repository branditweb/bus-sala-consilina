import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-slate-50 py-14 sm:py-20">
      <Container className="space-y-6">
        <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
          Impalcatura iniziale
        </p>
        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="max-w-3xl text-base text-slate-700 sm:text-lg">{siteConfig.description}</p>
        <div>
          <Link
            href="/bus"
            className="inline-flex items-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
          >
            Vai alla pagina admin
          </Link>
        </div>
      </Container>
    </section>
  );
}
