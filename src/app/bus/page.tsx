import { AdminHeader } from "@/components/layout/admin-header";
import { Container } from "@/components/layout/container";
import { BusAdminPanel } from "@/features/bus/components/bus-admin-panel";

export default function BusPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/70 via-slate-50 to-slate-100">
      <AdminHeader />

      <section className="py-10 sm:py-14">
        <Container className="space-y-6">
          <div className="rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Gestione corse bus
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Visualizza tutte le partenze registrate e aggiungi nuovi viaggi manualmente.
            </p>
          </div>

          <BusAdminPanel />
        </Container>
      </section>
    </main>
  );
}
