export type BusItem = {
  id: number;
  compagnia: string;
  orario_partenza: string;
  destinazione: string;
  sito_web_compagnia: string | null;
  contatti: string | null;
};

export type CreateBusPayload = {
  compagnia: string;
  orario_partenza: string;
  destinazione: string;
  sito_web_compagnia?: string;
  contatti?: string;
};

export type UpdateBusPayload = Partial<CreateBusPayload>;

const parseError = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
};

export async function fetchBuses(): Promise<BusItem[]> {
  const response = await fetch("/api/bus", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(await parseError(response, "Errore durante il caricamento dei bus."));
  }

  return (await response.json()) as BusItem[];
}

export async function createBus(payload: CreateBusPayload): Promise<BusItem> {
  const response = await fetch("/api/bus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Errore durante la creazione del bus."));
  }

  return (await response.json()) as BusItem;
}

export async function updateBusById(id: number, payload: UpdateBusPayload): Promise<BusItem> {
  const response = await fetch(`/api/bus/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Errore durante l'aggiornamento del bus."));
  }

  return (await response.json()) as BusItem;
}

export async function deleteBusById(id: number): Promise<void> {
  const response = await fetch(`/api/bus/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Errore durante l'eliminazione del bus."));
  }
}
