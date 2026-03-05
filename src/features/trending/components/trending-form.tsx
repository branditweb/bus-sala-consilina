"use client";

import { FormEvent, useState } from "react";

import { CreateTrendingPayload } from "@/features/trending/api";

type TrendingFormProps = {
  onSubmit: (payload: CreateTrendingPayload) => Promise<void>;
  loading: boolean;
};

const initialState: CreateTrendingPayload = {
  city: "",
  description: "",
  price_from: "",
  rating: "",
  duration: "",
  image_url: "",
  active: true,
};

export function TrendingForm({ onSubmit, loading }: TrendingFormProps) {
  const [form, setForm] = useState<CreateTrendingPayload>(initialState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Nuova destinazione</h2>
      <input
        required
        value={form.city}
        onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="Citta'"
      />
      <textarea
        required
        value={form.description}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        className="h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Descrizione breve"
      />
      <input
        value={form.price_from}
        onChange={(event) => setForm((prev) => ({ ...prev, price_from: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="Prezzo da (es. 12 EUR)"
      />
      <input
        value={form.rating}
        onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="Rating (es. 4.8)"
      />
      <input
        value={form.duration}
        onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="Durata (es. 2h 45m)"
      />
      <input
        value={form.image_url}
        onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="URL immagine"
      />
      <label className="flex items-center gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={form.active ?? true}
          onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
        />
        Attiva
      </label>
      <button type="submit" disabled={loading} className="h-10 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white">
        {loading ? "Salvataggio..." : "Aggiungi"}
      </button>
    </form>
  );
}
