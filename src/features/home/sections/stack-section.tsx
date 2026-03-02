import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/ui/section-title";

const stack = ["Next.js", "NeonDB", "Vercel"];

export function StackSection() {
  return (
    <section className="py-12 sm:py-16">
      <Container className="space-y-6">
        <SectionTitle
          title="Stack tecnologico"
          subtitle="Base moderna full-stack per sviluppo rapido, deploy continuo e scalabilità."
        />

        <div className="grid gap-3 sm:grid-cols-3">
          {stack.map((item) => (
            <article key={item} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900">{item}</h3>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
