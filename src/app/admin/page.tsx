import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SiteHeader } from "@/components/layout/site-header";

const tiles = [
  {
    title: "Gestione Bus",
    description: "Crea e modifica le corse disponibili dal terminal.",
    href: "/bus",
  },
  {
    title: "Gestione Compagnie",
    description: "Aggiorna le compagnie e importa liste in blocco.",
    href: "/compagnie",
  },
  {
    title: "Trending Destinations",
    description: "Gestisci le destinazioni in evidenza della homepage.",
    href: "/trending",
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100">
      <SiteHeader />
      <section className="py-10 sm:py-14">
        <Container className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Backend Terminal</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Gestisci rapidamente dati, compagnie e sezioni pubbliche della piattaforma.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {tiles.map((tile) => (
              <Link
                key={tile.title}
                href={tile.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
              >
                <h2 className="text-lg font-semibold text-slate-900">{tile.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{tile.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
