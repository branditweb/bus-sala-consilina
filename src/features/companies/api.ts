export type CompanyItem = {
  id: number;
  nome: string;
  slug: string;
  sito_web: string | null;
  telefono: string | null;
  email: string | null;
  attiva: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCompanyPayload = {
  nome: string;
  slug: string;
  sito_web?: string;
  telefono?: string;
  email?: string;
  attiva?: boolean;
};

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

const parseError = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
};

export const fetchCompanies = async (): Promise<CompanyItem[]> => {
  const response = await fetch("/api/companies", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await parseError(response, "Errore nel caricamento compagnie."));
  }
  return (await response.json()) as CompanyItem[];
};

export const createCompany = async (payload: CreateCompanyPayload): Promise<CompanyItem> => {
  const response = await fetch("/api/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Errore nella creazione compagnia."));
  }

  return (await response.json()) as CompanyItem;
};

export const updateCompanyById = async (
  id: number,
  payload: UpdateCompanyPayload
): Promise<CompanyItem> => {
  const response = await fetch(`/api/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Errore nell'aggiornamento compagnia."));
  }

  return (await response.json()) as CompanyItem;
};

export const deleteCompanyById = async (id: number): Promise<void> => {
  const response = await fetch(`/api/companies/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(await parseError(response, "Errore nell'eliminazione compagnia."));
  }
};

export const importCompaniesBulk = async (
  rows: Array<{
    nome?: string;
    slug?: string;
    sito_web?: string;
    telefono?: string;
    email?: string;
    attiva?: boolean;
  }>
): Promise<{ imported: number; skipped: number; message: string }> => {
  const response = await fetch("/api/companies/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rows }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Errore durante import massivo."));
  }

  return (await response.json()) as { imported: number; skipped: number; message: string };
};
