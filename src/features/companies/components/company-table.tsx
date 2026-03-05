"use client";

import { FormEvent, useMemo, useState } from "react";

import { CompanyItem, UpdateCompanyPayload } from "@/features/companies/api";

type CompanyTableProps = {
  companies: CompanyItem[];
  loading: boolean;
  busyId: number | null;
  onUpdate: (id: number, payload: UpdateCompanyPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

type EditState = {
  nome: string;
  slug: string;
  sito_web: string;
  telefono: string;
  email: string;
  attiva: boolean;
};

const toEditState = (company: CompanyItem): EditState => ({
  nome: company.nome,
  slug: company.slug,
  sito_web: company.sito_web ?? "",
  telefono: company.telefono ?? "",
  email: company.email ?? "",
  attiva: company.attiva,
});

export function CompanyTable({ companies, loading, busyId, onUpdate, onDelete }: CompanyTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);

  const editingCompany = useMemo(
    () => companies.find((item) => item.id === editingId) ?? null,
    [companies, editingId]
  );

  const startEdit = (company: CompanyItem) => {
    setEditingId(company.id);
    setEditState(toEditState(company));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState(null);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingCompany || !editState) {
      return;
    }

    await onUpdate(editingCompany.id, {
      nome: editState.nome,
      slug: editState.slug,
      sito_web: editState.sito_web,
      telefono: editState.telefono,
      email: editState.email,
      attiva: editState.attiva,
    });

    cancelEdit();
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Compagnie registrate</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Sito</th>
              <th className="px-4 py-3">Telefono</th>
              <th className="px-4 py-3">Email</th>
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
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  Nessuna compagnia.
                </td>
              </tr>
            ) : (
              companies.map((company) => {
                const isEditing = editingId === company.id;
                const isBusy = busyId === company.id;

                if (isEditing && editState) {
                  return (
                    <tr key={company.id} className="bg-slate-50">
                      <td className="px-4 py-3">
                        <input
                          value={editState.nome}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, nome: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editState.slug}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, slug: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editState.sito_web}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, sito_web: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editState.telefono}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, telefono: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editState.email}
                          onChange={(event) =>
                            setEditState((prev) => (prev ? { ...prev, email: event.target.value } : prev))
                          }
                          className="h-9 w-full rounded-lg border border-slate-300 px-2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={editState.attiva}
                            onChange={(event) =>
                              setEditState((prev) => (prev ? { ...prev, attiva: event.target.checked } : prev))
                            }
                          />
                          Attiva
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <form onSubmit={handleSave} className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isBusy}
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Salva
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isBusy}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                          >
                            Annulla
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={company.id}>
                    <td className="px-4 py-3 font-medium">{company.nome}</td>
                    <td className="px-4 py-3">{company.slug}</td>
                    <td className="px-4 py-3">{company.sito_web ?? "-"}</td>
                    <td className="px-4 py-3">{company.telefono ?? "-"}</td>
                    <td className="px-4 py-3">{company.email ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          company.attiva
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {company.attiva ? "Attiva" : "Disattiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(company)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                        >
                          Modifica
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(company.id)}
                          disabled={isBusy}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                        >
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
