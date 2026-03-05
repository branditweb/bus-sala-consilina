const items = [
  {
    title: "Aggiornamenti in tempo reale",
    description: "Monitora variazioni di orario e disponibilita' partenze dal terminal.",
  },
  {
    title: "Prenotazione semplice",
    description: "Ricerca rapida con data e ora, con link diretto alle compagnie.",
  },
  {
    title: "Assistenza AI locale",
    description: "Ricevi consigli su tratte bus e punti di interesse a Sala Consilina.",
  },
];

export function ServiceHighlights() {
  return (
    <section className="rounded-[2rem] bg-slate-100 px-6 py-12 lg:px-10">
      <h2 className="text-center text-3xl font-black tracking-tight text-slate-900">Viaggiare, ma meglio</h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600">
        Abbiamo unito ricerca corse, monitoraggio partenze e assistente intelligente in un&apos;unica homepage.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
