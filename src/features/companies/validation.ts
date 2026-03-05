import { CompanyPayload } from "@/features/companies/types";

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

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const parseCompanyId = (id: string): number => {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("ID compagnia non valido.");
  }

  return parsed;
};

export const parseCreateCompanyInput = (input: unknown) => {
  if (!input || typeof input !== "object") {
    throw new Error("Payload non valido.");
  }

  const payload = input as CompanyPayload;

  if (!isNonEmptyString(payload.nome)) {
    throw new Error("nome e' obbligatorio.");
  }

  const slug = isNonEmptyString(payload.slug) ? normalizeSlug(payload.slug) : normalizeSlug(payload.nome);

  if (!slug) {
    throw new Error("slug non valido.");
  }

  return {
    nome: payload.nome.trim(),
    slug,
    sito_web: toNullableString(payload.sito_web),
    telefono: toNullableString(payload.telefono),
    email: toNullableString(payload.email),
    attiva: payload.attiva ?? true,
  };
};

export const parseUpdateCompanyInput = (input: unknown) => {
  if (!input || typeof input !== "object") {
    throw new Error("Payload non valido.");
  }

  const payload = input as Partial<CompanyPayload>;
  const data: {
    nome?: string;
    slug?: string;
    sito_web?: string | null;
    telefono?: string | null;
    email?: string | null;
    attiva?: boolean;
  } = {};

  if (payload.nome !== undefined) {
    if (!isNonEmptyString(payload.nome)) {
      throw new Error("nome deve essere una stringa non vuota.");
    }
    data.nome = payload.nome.trim();
  }

  if (payload.slug !== undefined) {
    if (!isNonEmptyString(payload.slug)) {
      throw new Error("slug deve essere una stringa non vuota.");
    }
    const normalized = normalizeSlug(payload.slug);
    if (!normalized) {
      throw new Error("slug non valido.");
    }
    data.slug = normalized;
  }

  if (payload.sito_web !== undefined) {
    data.sito_web = toNullableString(payload.sito_web);
  }

  if (payload.telefono !== undefined) {
    data.telefono = toNullableString(payload.telefono);
  }

  if (payload.email !== undefined) {
    data.email = toNullableString(payload.email);
  }

  if (payload.attiva !== undefined) {
    if (typeof payload.attiva !== "boolean") {
      throw new Error("attiva deve essere true o false.");
    }
    data.attiva = payload.attiva;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("Nessun campo valido da aggiornare.");
  }

  return data;
};
