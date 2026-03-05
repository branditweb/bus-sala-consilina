import { FormEvent } from "react";

import { BusItem } from "@/features/bus/api";

type BookingHeroProps = {
  destinazione: string;
  data: string;
  ora: string;
  loading: boolean;
  featuredBus: BusItem | null;
  onDestinazioneChange: (value: string) => void;
  onDataChange: (value: string) => void;
  onOraChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function BookingHero({
  destinazione,
  data,
  ora,
  loading,
  featuredBus,
  onDestinazioneChange,
  onDataChange,
  onOraChange,
  onSubmit,
}: BookingHeroProps) {
  return (
    <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
      <div>
        <p className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          Nuove corse disponibili
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Il tuo viaggio parte da qui.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
          Cerca la prossima partenza dal Terminal Bus di Sala Consilina e ricevi supporto AI in tempo reale.
        </p>

        <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <input
              required
              value={destinazione}
              onChange={(event) => onDestinazioneChange(event.target.value)}
              placeholder="Destinazione"
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <input
              required
              type="date"
              value={data}
              onChange={(event) => onDataChange(event.target.value)}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <input
              required
              type="time"
              value={ora}
              onChange={(event) => onOraChange(event.target.value)}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Cerco..." : "Cerca"}
            </button>
          </div>
        </form>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-sky-900 via-slate-900 to-black p-6 text-white">
        <div className="absolute -right-12 -top-10 h-36 w-36 rounded-full bg-sky-400/30 blur-3xl" />
        <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Prossima partenza</p>
        <p className="mt-3 text-2xl font-bold">{featuredBus ? `Sala Consilina → ${featuredBus.destinazione}` : "Nessuna corsa"}</p>
        <p className="mt-2 text-sm text-slate-300">
          {featuredBus ? `${featuredBus.compagnia} · ${formatTime(featuredBus.orario_partenza)}` : "Effettua una ricerca per vedere le opzioni."}
        </p>
        {featuredBus?.sito_web_compagnia ? (
          <a
            href={featuredBus.sito_web_compagnia}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/30"
          >
            Sito compagnia
          </a>
        ) : null}
      </div>
    </section>
  );
}
