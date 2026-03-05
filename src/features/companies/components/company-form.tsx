"use client";

import { FormEvent, useState } from "react";

import { CreateCompanyPayload } from "@/features/companies/api";

type CompanyFormProps = {
  onSubmit: (payload: CreateCompanyPayload) => Promise<void>;
  loading: boolean;
};

type CompanyFormState = {
  nome: string;
  slug: string;
  sito_web: string;
  telefono: string;
  email: string;
};

const initialState: CompanyFormState = {
  nome: "",
  slug: "",
  sito_web: "",
  telefono: "",
  email: "",
};

export function CompanyForm({ onSubmit, loading }: CompanyFormProps) {
  const [form, setForm] = useState<CompanyFormState>(initialState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      nome: form.nome,
      slug: form.slug,
      sito_web: form.sito_web,
      telefono: form.telefono,
      email: form.email,
      attiva: true,
    });

    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Nuova compagnia</h2>

      <input
        required
        value={form.nome}
        onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="Nome"
      />

      <input
        required
        value={form.slug}
        onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="slug"
      />

      <input
        value={form.sito_web}
        onChange={(event) => setForm((prev) => ({ ...prev, sito_web: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="Sito web"
      />

      <input
        value={form.telefono}
        onChange={(event) => setForm((prev) => ({ ...prev, telefono: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="Telefono"
      />

      <input
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
        placeholder="Email"
      />

      <button
        type="submit"
        disabled={loading}
        className="h-10 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white"
      >
        {loading ? "Salvataggio..." : "Aggiungi compagnia"}
      </button>
    </form>
  );
}
