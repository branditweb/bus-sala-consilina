"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createBus,
  fetchBuses,
  BusItem,
  CreateBusPayload,
  UpdateBusPayload,
  updateBusById,
  deleteBusById,
} from "@/features/bus/api";
import { BusForm } from "@/features/bus/components/bus-form";
import { BusTable } from "@/features/bus/components/bus-table";

export function BusAdminPanel() {
  const [buses, setBuses] = useState<BusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyRowId, setBusyRowId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadBuses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchBuses();
      setBuses(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Errore nel caricamento dei bus.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBuses();
  }, [loadBuses]);

  const handleCreateBus = async (payload: CreateBusPayload) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createBus(payload);
      setSuccess("Viaggio aggiunto con successo.");
      await loadBuses();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Errore durante il salvataggio.");
      throw createError;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBus = async (id: number, payload: UpdateBusPayload) => {
    setBusyRowId(id);
    setError(null);
    setSuccess(null);

    try {
      await updateBusById(id, payload);
      setSuccess("Viaggio aggiornato con successo.");
      await loadBuses();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Errore durante l'aggiornamento.");
      throw updateError;
    } finally {
      setBusyRowId(null);
    }
  };

  const handleDeleteBus = async (id: number) => {
    setBusyRowId(id);
    setError(null);
    setSuccess(null);

    try {
      await deleteBusById(id);
      setSuccess("Viaggio eliminato con successo.");
      await loadBuses();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Errore durante l'eliminazione.");
      throw deleteError;
    } finally {
      setBusyRowId(null);
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

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <BusForm onSubmit={handleCreateBus} loading={submitting} />
        <BusTable
          buses={buses}
          loading={loading}
          busyRowId={busyRowId}
          onUpdate={handleUpdateBus}
          onDelete={handleDeleteBus}
        />
      </div>
    </div>
  );
}
