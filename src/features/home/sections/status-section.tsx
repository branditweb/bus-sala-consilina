import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";

export function StatusSection() {
  return (
    <section className="pb-16">
      <Container className="space-y-6">
        <SectionTitle
          title="Stato lavori"
          subtitle="La base applicativa e la struttura modulare iniziale sono configurate."
        />

        <div className="rounded-xl border border-brand-100 bg-brand-50 p-5 text-brand-900">
          <p className="text-sm font-medium sm:text-base">Impalcatura pronta.</p>
        </div>
      </Container>
    </section>
  );
}
