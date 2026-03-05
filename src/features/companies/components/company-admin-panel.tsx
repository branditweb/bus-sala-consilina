"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CompanyItem,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  createCompany,
  deleteCompanyById,
  fetchCompanies,
  importCompaniesBulk,
  updateCompanyById,
} from "@/features/companies/api";
import { CompanyForm } from "@/features/companies/components/company-form";
import { CompanyImport } from "@/features/companies/components/company-import";
import { CompanyTable } from "@/features/companies/components/company-table";

export function CompanyAdminPanel() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Errore nel caricamento compagnie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  const handleCreate = async (payload: CreateCompanyPayload) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createCompany(payload);
      setSuccess("Compagnia creata con successo.");
      await loadCompanies();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Errore nella creazione.");
      throw createError;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: number, payload: UpdateCompanyPayload) => {
    setBusyId(id);
    setError(null);
    setSuccess(null);

    try {
      await updateCompanyById(id, payload);
      setSuccess("Compagnia aggiornata.");
      await loadCompanies();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Errore nell'aggiornamento.");
      throw updateError;
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Confermi eliminazione compagnia?");

    if (!confirmed) {
      return;
    }

    setBusyId(id);
    setError(null);
    setSuccess(null);

    try {
      await deleteCompanyById(id);
      setSuccess("Compagnia eliminata.");
      await loadCompanies();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Errore nell'eliminazione.");
    } finally {
      setBusyId(null);
    }
  };

  const handleImport = async (
    rows: Array<{
      nome?: string;
      slug?: string;
      sito_web?: string;
      telefono?: string;
      email?: string;
      attiva?: boolean;
    }>
  ) => {
    setImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await importCompaniesBulk(rows);
      setSuccess(`${result.message} Importate: ${result.imported}, saltate: ${result.skipped}.`);
      await loadCompanies();
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Errore durante import.");
      throw importError;
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <CompanyImport onImport={handleImport} loading={importing} />

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <CompanyForm onSubmit={handleCreate} loading={submitting} />
        <CompanyTable
          companies={companies}
          loading={loading}
          busyId={busyId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
