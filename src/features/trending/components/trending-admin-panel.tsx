"use client";

import { useCallback, useEffect, useState } from "react";

import {
  TrendingItem,
  CreateTrendingPayload,
  UpdateTrendingPayload,
  fetchTrending,
  createTrending,
  updateTrendingById,
  deleteTrendingById,
} from "@/features/trending/api";
import { TrendingForm } from "@/features/trending/components/trending-form";
import { TrendingTable } from "@/features/trending/components/trending-table";

export function TrendingAdminPanel() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTrending();
      setItems(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Errore nel caricamento.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (payload: CreateTrendingPayload) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createTrending(payload);
      setSuccess("Destinazione creata.");
      await load();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Errore nella creazione.");
      throw createError;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: number, payload: UpdateTrendingPayload) => {
    setBusyId(id);
    setError(null);
    setSuccess(null);

    try {
      await updateTrendingById(id, payload);
      setSuccess("Destinazione aggiornata.");
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Errore nell'aggiornamento.");
      throw updateError;
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Confermi eliminazione destinazione?");
    if (!confirmed) return;

    setBusyId(id);
    setError(null);
    setSuccess(null);

    try {
      await deleteTrendingById(id);
      setSuccess("Destinazione eliminata.");
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Errore nell'eliminazione.");
    } finally {
      setBusyId(null);
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

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <TrendingForm onSubmit={handleCreate} loading={submitting} />
        <TrendingTable items={items} loading={loading} busyId={busyId} onUpdate={handleUpdate} onDelete={handleDelete} />
      </div>
    </div>
  );
}
