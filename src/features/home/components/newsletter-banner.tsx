export function NewsletterBanner() {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8 text-center text-white lg:p-12">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Community</p>
      <h2 className="mt-3 text-4xl font-black tracking-tight">Ricevi avvisi su corse e promozioni</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
        Iscriviti per ricevere aggiornamenti utili sul terminal, nuove tratte e suggerimenti di viaggio.
      </p>
      <form className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="Inserisci la tua email"
          className="h-11 flex-1 rounded-full border border-slate-600 bg-slate-900 px-4 text-sm text-white outline-none focus:border-sky-400"
        />
        <button className="h-11 rounded-full bg-white px-6 text-sm font-semibold text-slate-900">Iscriviti</button>
      </form>
    </section>
  );
}
