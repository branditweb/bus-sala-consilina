const items = [
  { city: "Roma", note: "Capitale culturale e connessioni frequenti." },
  { city: "Salerno", note: "Mare, porto e collegamenti regionali rapidi." },
  { city: "Napoli", note: "Centro storico, arte e hub trasporti principali." },
  { city: "Potenza", note: "Soluzione comoda per spostamenti interni in Basilicata." },
];

export function TrendingDestinations() {
  return (
    <section>
      <h2 className="text-3xl font-black tracking-tight text-slate-900">Destinazioni richieste</h2>
      <p className="mt-2 text-sm text-slate-600">Le mete piu&apos; cercate dagli utenti in partenza da Sala Consilina.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article key={item.city} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">{item.city}</p>
            <p className="mt-2 text-sm text-slate-600">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
