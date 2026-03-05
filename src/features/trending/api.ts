export type TrendingItem = {
  id: number;
  city: string;
  description: string;
  price_from: string | null;
  rating: string | null;
  duration: string | null;
  image_url: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTrendingPayload = {
  city: string;
  description: string;
  price_from?: string;
  rating?: string;
  duration?: string;
  image_url?: string;
  active?: boolean;
};

export type UpdateTrendingPayload = Partial<CreateTrendingPayload>;

const parseError = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
};

export const fetchTrending = async (): Promise<TrendingItem[]> => {
  const response = await fetch("/api/trending", { cache: "no-store" });
  if (!response.ok) throw new Error(await parseError(response, "Errore nel caricamento."));
  return (await response.json()) as TrendingItem[];
};

export const createTrending = async (payload: CreateTrendingPayload): Promise<TrendingItem> => {
  const response = await fetch("/api/trending", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response, "Errore nella creazione."));
  return (await response.json()) as TrendingItem;
};

export const updateTrendingById = async (
  id: number,
  payload: UpdateTrendingPayload
): Promise<TrendingItem> => {
  const response = await fetch(`/api/trending/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response, "Errore nell'aggiornamento."));
  return (await response.json()) as TrendingItem;
};

export const deleteTrendingById = async (id: number): Promise<void> => {
  const response = await fetch(`/api/trending/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await parseError(response, "Errore nell'eliminazione."));
};
