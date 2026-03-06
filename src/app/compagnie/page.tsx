import { Container } from "@/components/layout/container";
import { AdminHeader } from "@/components/layout/admin-header";
import { CompanyAdminPanel } from "@/features/companies/components/company-admin-panel";

export default function CompagniePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100">
      <AdminHeader />
      <section className="py-10 sm:py-14">
        <Container className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Gestione compagnie
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Crea, modifica ed elimina le compagnie bus usate dalla piattaforma.
            </p>
          </div>

          <CompanyAdminPanel />
        </Container>
      </section>
    </main>
  );
}
