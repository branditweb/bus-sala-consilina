"use client";

import { FormEvent, useState } from "react";

import { CreateBusPayload } from "@/features/bus/api";

type BusFormProps = {
  onSubmit: (payload: CreateBusPayload) => Promise<void>;
  loading: boolean;
};

type FormState = {
  compagnia: string;
  orario_partenza: string;
  destinazione: string;
  sito_web_compagnia: string;
  contatti: string;
};

const initialState: FormState = {
  compagnia: "",
  orario_partenza: "",
  destinazione: "",
  sito_web_compagnia: "",
  contatti: "",
};

export function BusForm({ onSubmit, loading }: BusFormProps) {
  const [form, setForm] = useState<FormState>(initialState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      compagnia: form.compagnia,
      orario_partenza: form.orario_partenza,
      destinazione: form.destinazione,
      sito_web_compagnia: form.sito_web_compagnia,
      contatti: form.contatti,
    });

    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Nuovo viaggio</h2>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Compagnia</span>
        <input
          required
          value={form.compagnia}
          onChange={(event) => setForm((prev) => ({ ...prev, compagnia: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="Autolinee Curcio"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Orario partenza</span>
        <input
          required
          type="datetime-local"
          value={form.orario_partenza}
          onChange={(event) => setForm((prev) => ({ ...prev, orario_partenza: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Destinazione</span>
        <input
          required
          value={form.destinazione}
          onChange={(event) => setForm((prev) => ({ ...prev, destinazione: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="Roma"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Sito web compagnia</span>
        <input
          value={form.sito_web_compagnia}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, sito_web_compagnia: event.target.value }))
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="https://www.autolineecurcio.it"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Contatti</span>
        <input
          value={form.contatti}
          onChange={(event) => setForm((prev) => ({ ...prev, contatti: event.target.value }))}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="+39 ..."
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Salvataggio..." : "Aggiungi viaggio"}
      </button>
    </form>
  );
}
