"use client";

import { FormEvent, useMemo, useState } from "react";

import { TrendingItem, UpdateTrendingPayload } from "@/features/trending/api";

type TrendingTableProps = {
  items: TrendingItem[];
  loading: boolean;
  busyId: number | null;
  onUpdate: (id: number, payload: UpdateTrendingPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

type EditState = {
  city: string;
  description: string;
  price_from: string;
  rating: string;
  duration: string;
  image_url: string;
  active: boolean;
};

const toEditState = (item: TrendingItem): EditState => ({
  city: item.city,
  description: item.description,
  price_from: item.price_from ?? "",
  rating: item.rating ?? "",
  duration: item.duration ?? "",
  image_url: item.image_url ?? "",
  active: item.active,
});

export function TrendingTable({ items, loading, busyId, onUpdate, onDelete }: TrendingTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);

  const editingItem = useMemo(() => items.find((item) => item.id === editingId) ?? null, [items, editingId]);

  const startEdit = (item: TrendingItem) => {
    setEditingId(item.id);
    setEditState(toEditState(item));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState(null);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem || !editState) return;

    await onUpdate(editingItem.id, editState);
    cancelEdit();
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Trending registrate</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Citta&apos;</th>
              <th className="px-4 py-3">Descrizione</th>
              <th className="px-4 py-3">Prezzo</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Durata</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  Caricamento...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  Nessuna destinazione.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isEditing = editingId === item.id;
                const isBusy = busyId === item.id;

                if (isEditing && editState) {
                  return (
                    <tr key={item.id} className="bg-slate-50">
                      <td className="px-4 py-3">
                        <input
                          value={editState.city}
                          onChange={(event) => setEditState((prev) => (prev ? { ...prev, city: event.target.value } : prev))}
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editState.description}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, description: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editState.price_from}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, price_from: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editState.rating}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, rating: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editState.duration}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, duration: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={editState.active}
                            onChange={(event) =>
                              setEditState((prev) => (prev ? { ...prev, active: event.target.checked } : prev))
                            }
                          />
                          Attiva
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <form onSubmit={handleSave} className="flex gap-2">
                          <button type="submit" disabled={isBusy} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white">
                            Salva
                          </button>
                          <button type="button" onClick={cancelEdit} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs">
                            Annulla
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium">{item.city}</td>
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3">{item.price_from ?? "-"}</td>
                    <td className="px-4 py-3">{item.rating ?? "-"}</td>
                    <td className="px-4 py-3">{item.duration ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                        {item.active ? "Attiva" : "Disattiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => startEdit(item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs">
                          Modifica
                        </button>
                        <button type="button" onClick={() => void onDelete(item.id)} disabled={isBusy} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
                          Elimina
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
