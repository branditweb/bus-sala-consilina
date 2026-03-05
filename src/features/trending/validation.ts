import { TrendingPayload } from "@/features/trending/types";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const toNullableString = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("I campi opzionali devono essere stringhe.");
  }

  return value.trim();
};

export const parseTrendingId = (id: string): number => {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("ID destinazione non valido.");
  }
  return parsed;
};

export const parseCreateTrendingInput = (input: unknown) => {
  if (!input || typeof input !== "object") {
    throw new Error("Payload non valido.");
  }

  const payload = input as TrendingPayload;

  if (!isNonEmptyString(payload.city)) {
    throw new Error("city e' obbligatorio.");
  }
  if (!isNonEmptyString(payload.description)) {
    throw new Error("description e' obbligatorio.");
  }

  return {
    city: payload.city.trim(),
    description: payload.description.trim(),
    price_from: toNullableString(payload.price_from),
    rating: toNullableString(payload.rating),
    duration: toNullableString(payload.duration),
    image_url: toNullableString(payload.image_url),
    active: payload.active ?? true,
  };
};

export const parseUpdateTrendingInput = (input: unknown) => {
  if (!input || typeof input !== "object") {
    throw new Error("Payload non valido.");
  }

  const payload = input as Partial<TrendingPayload>;
  const data: {
    city?: string;
    description?: string;
    price_from?: string | null;
    rating?: string | null;
    duration?: string | null;
    image_url?: string | null;
    active?: boolean;
  } = {};

  if (payload.city !== undefined) {
    if (!isNonEmptyString(payload.city)) {
      throw new Error("city deve essere una stringa non vuota.");
    }
    data.city = payload.city.trim();
  }

  if (payload.description !== undefined) {
    if (!isNonEmptyString(payload.description)) {
      throw new Error("description deve essere una stringa non vuota.");
    }
    data.description = payload.description.trim();
  }

  if (payload.price_from !== undefined) data.price_from = toNullableString(payload.price_from);
  if (payload.rating !== undefined) data.rating = toNullableString(payload.rating);
  if (payload.duration !== undefined) data.duration = toNullableString(payload.duration);
  if (payload.image_url !== undefined) data.image_url = toNullableString(payload.image_url);

  if (payload.active !== undefined) {
    if (typeof payload.active !== "boolean") {
      throw new Error("active deve essere true o false.");
    }
    data.active = payload.active;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("Nessun campo valido da aggiornare.");
  }

  return data;
};
