export type CompanyPayload = {
  nome: string;
  slug: string;
  sito_web?: string | null;
  telefono?: string | null;
  email?: string | null;
  attiva?: boolean;
};
