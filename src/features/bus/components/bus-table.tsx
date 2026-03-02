"use client";

import { FormEvent, useMemo, useState } from "react";

import { BusItem, UpdateBusPayload } from "@/features/bus/api";

type BusTableProps = {
  buses: BusItem[];
  loading: boolean;
  busyRowId: number | null;
  onUpdate: (id: number, payload: UpdateBusPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

type EditFormState = {
  compagnia: string;
  orario_partenza: string;
  destinazione: string;
  sito_web_compagnia: string;
  contatti: string;
};

const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "short",
  timeStyle: "short",
});

const toDateTimeLocal = (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const buildInitialEditState = (bus: BusItem): EditFormState => ({
  compagnia: bus.compagnia,
  orario_partenza: toDateTimeLocal(bus.orario_partenza),
  destinazione: bus.destinazione,
  sito_web_compagnia: bus.sito_web_compagnia ?? "",
  contatti: bus.contatti ?? "",
});

export function BusTable({ buses, loading, busyRowId, onUpdate, onDelete }: BusTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);

  const editingBus = useMemo(
    () => buses.find((bus) => bus.id === editingId) ?? null,
    [buses, editingId]
  );

  const startEdit = (bus: BusItem) => {
    setEditingId(bus.id);
    setEditForm(buildInitialEditState(bus));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingBus || !editForm) {
      return;
    }

    await onUpdate(editingBus.id, {
      compagnia: editForm.compagnia,
      orario_partenza: editForm.orario_partenza,
      destinazione: editForm.destinazione,
      sito_web_compagnia: editForm.sito_web_compagnia,
      contatti: editForm.contatti,
    });

    cancelEdit();
  };

  const handleDeleteClick = async (id: number) => {
    const confirmed = window.confirm("Vuoi eliminare questo viaggio?");

    if (!confirmed) {
      return;
    }

    await onDelete(id);

    if (editingId === id) {
      cancelEdit();
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Partenze dal terminal</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-white">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-semibold">Compagnia</th>
              <th className="px-5 py-3 font-semibold">Partenza</th>
              <th className="px-5 py-3 font-semibold">Destinazione</th>
              <th className="px-5 py-3 font-semibold">Sito web</th>
              <th className="px-5 py-3 font-semibold">Contatti</th>
              <th className="px-5 py-3 font-semibold">Azioni</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  Caricamento dati in corso...
                </td>
              </tr>
            ) : buses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  Nessun viaggio disponibile.
                </td>
              </tr>
            ) : (
              buses.map((bus) => {
                const isEditing = editingId === bus.id;
                const isBusy = busyRowId === bus.id;

                if (isEditing && editForm) {
                  return (
                    <tr key={bus.id} className="bg-brand-50/40">
                      <td className="px-5 py-4 align-top">
                        <input
                          required
                          value={editForm.compagnia}
                          onChange={(event) =>
                            setEditForm((prev) => (prev ? { ...prev, compagnia: event.target.value } : prev))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </td>
                      <td className="px-5 py-4 align-top">
                        <input
                          required
                          type="datetime-local"
                          value={editForm.orario_partenza}
                          onChange={(event) =>
                            setEditForm((prev) =>
                              prev ? { ...prev, orario_partenza: event.target.value } : prev
                            )
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </td>
                      <td className="px-5 py-4 align-top">
                        <input
                          required
                          value={editForm.destinazione}
                          onChange={(event) =>
                            setEditForm((prev) => (prev ? { ...prev, destinazione: event.target.value } : prev))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </td>
                      <td className="px-5 py-4 align-top">
                        <input
                          value={editForm.sito_web_compagnia}
                          onChange={(event) =>
                            setEditForm((prev) =>
                              prev ? { ...prev, sito_web_compagnia: event.target.value } : prev
                            )
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </td>
                      <td className="px-5 py-4 align-top">
                        <input
                          value={editForm.contatti}
                          onChange={(event) =>
                            setEditForm((prev) => (prev ? { ...prev, contatti: event.target.value } : prev))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        />
                      </td>
                      <td className="px-5 py-4 align-top">
                        <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-2">
                          <button
                            type="submit"
                            disabled={isBusy}
                            className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy ? "Salvataggio..." : "Salva"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isBusy}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Annulla
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={bus.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">{bus.compagnia}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {dateFormatter.format(new Date(bus.orario_partenza))}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{bus.destinazione}</td>
                    <td className="px-5 py-4 text-slate-700">
                      {bus.sito_web_compagnia ? (
                        <a
                          href={bus.sito_web_compagnia}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-brand-700 underline decoration-brand-200 underline-offset-4"
                        >
                          Visita
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{bus.contatti ?? "-"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(bus)}
                          disabled={busyRowId !== null}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Modifica
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteClick(bus.id)}
                          disabled={busyRowId !== null}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isBusy ? "Eliminazione..." : "Elimina"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
