import { BusPayload } from "@/features/bus/types";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const normalizeNullableString = (value: unknown): string | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("I campi opzionali devono essere stringhe.");
  }

  return value.trim();
};

const parseDepartureDate = (value: unknown): Date => {
  if (!isNonEmptyString(value)) {
    throw new Error("orario_partenza deve essere una data valida in formato ISO.");
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("orario_partenza deve essere una data valida in formato ISO.");
  }

  return parsed;
};

export const parseCreateBusInput = (input: unknown) => {
  if (!input || typeof input !== "object") {
    throw new Error("Payload non valido.");
  }

  const payload = input as BusPayload;

  if (!isNonEmptyString(payload.compagnia)) {
    throw new Error("compagnia è obbligatorio.");
  }

  if (!isNonEmptyString(payload.destinazione)) {
    throw new Error("destinazione è obbligatorio.");
  }

  return {
    compagnia: payload.compagnia.trim(),
    orario_partenza: parseDepartureDate(payload.orario_partenza),
    destinazione: payload.destinazione.trim(),
    sito_web_compagnia: normalizeNullableString(payload.sito_web_compagnia),
    contatti: normalizeNullableString(payload.contatti),
  };
};

export const parseUpdateBusInput = (input: unknown) => {
  if (!input || typeof input !== "object") {
    throw new Error("Payload non valido.");
  }

  const payload = input as Partial<BusPayload>;
  const data: {
    compagnia?: string;
    orario_partenza?: Date;
    destinazione?: string;
    sito_web_compagnia?: string | null;
    contatti?: string | null;
  } = {};

  if (payload.compagnia !== undefined) {
    if (!isNonEmptyString(payload.compagnia)) {
      throw new Error("compagnia deve essere una stringa non vuota.");
    }
    data.compagnia = payload.compagnia.trim();
  }

  if (payload.destinazione !== undefined) {
    if (!isNonEmptyString(payload.destinazione)) {
      throw new Error("destinazione deve essere una stringa non vuota.");
    }
    data.destinazione = payload.destinazione.trim();
  }

  if (payload.orario_partenza !== undefined) {
    data.orario_partenza = parseDepartureDate(payload.orario_partenza);
  }

  if (payload.sito_web_compagnia !== undefined) {
    data.sito_web_compagnia = normalizeNullableString(payload.sito_web_compagnia);
  }

  if (payload.contatti !== undefined) {
    data.contatti = normalizeNullableString(payload.contatti);
  }

  if (Object.keys(data).length === 0) {
    throw new Error("Nessun campo valido da aggiornare.");
  }

  return data;
};

export const parseBusId = (id: string): number => {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("ID non valido.");
  }

  return parsed;
};
