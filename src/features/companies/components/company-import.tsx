"use client";

import { ChangeEvent, useState } from "react";

type CompanyImportProps = {
  loading: boolean;
  onImport: (
    rows: Array<{
      nome?: string;
      slug?: string;
      sito_web?: string;
      telefono?: string;
      email?: string;
      attiva?: boolean;
    }>
  ) => Promise<void>;
};

const splitLine = (line: string) => line.split(/[;,\t]/).map((cell) => cell.trim());

export function CompanyImport({ loading, onImport }: CompanyImportProps) {
  const [rowsCount, setRowsCount] = useState(0);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setRowsCount(0);
      return;
    }

    const headers = splitLine(lines[0]).map((header) => header.toLowerCase());

    const rows = lines.slice(1).map((line) => {
      const values = splitLine(line);
      const get = (key: string) => {
        const idx = headers.indexOf(key);
        return idx >= 0 ? values[idx] : "";
      };

      const attivaRaw = get("attiva").toLowerCase();

      return {
        nome: get("nome"),
        slug: get("slug"),
        sito_web: get("sito_web"),
        telefono: get("telefono"),
        email: get("email"),
        attiva: attivaRaw ? ["1", "true", "si", "yes"].includes(attivaRaw) : true,
      };
    });

    setRowsCount(rows.length);
    await onImport(rows);
    event.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Import massivo compagnie</h2>
      <p className="mt-2 text-xs text-slate-600">
        Carica un CSV con intestazioni: <code>nome,slug,sito_web,telefono,email,attiva</code>
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Seleziona CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => void handleFile(event)}
            className="hidden"
            disabled={loading}
          />
        </label>
        <span className="text-xs text-slate-500">Righe rilevate: {rowsCount}</span>
      </div>
    </div>
  );
}
