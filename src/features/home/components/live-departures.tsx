import { BusItem } from "@/features/bus/api";

type LiveDeparturesProps = {
  buses: BusItem[];
};

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function LiveDepartures({ buses }: LiveDeparturesProps) {
  return (
    <section className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white lg:px-10">
      <h2 className="text-3xl font-black tracking-tight">Partenze Live</h2>
      <p className="mt-2 text-sm text-slate-300">Aggiornamento corse in uscita dal terminal.</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Ora</th>
              <th className="px-4 py-3 text-left">Destinazione</th>
              <th className="px-4 py-3 text-left">Compagnia</th>
              <th className="px-4 py-3 text-left">Contatti</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {buses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Nessuna partenza disponibile al momento.
                </td>
              </tr>
            ) : (
              buses.map((bus) => (
                <tr key={bus.id}>
                  <td className="px-4 py-3 font-semibold text-amber-300">{formatTime(bus.orario_partenza)}</td>
                  <td className="px-4 py-3">{bus.destinazione}</td>
                  <td className="px-4 py-3">{bus.compagnia}</td>
                  <td className="px-4 py-3 text-slate-300">{bus.contatti ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
