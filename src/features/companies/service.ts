import { prisma } from "@/lib/prisma";

export const listCompanies = () =>
  prisma.company.findMany({
    orderBy: {
      nome: "asc",
    },
  });

export const getCompanyById = (id: number) =>
  prisma.company.findUnique({
    where: { id },
  });

export const createCompany = (data: {
  nome: string;
  slug: string;
  sito_web: string | null;
  telefono: string | null;
  email: string | null;
  attiva: boolean;
}) =>
  prisma.company.create({
    data,
  });

export const updateCompany = (
  id: number,
  data: {
    nome?: string;
    slug?: string;
    sito_web?: string | null;
    telefono?: string | null;
    email?: string | null;
    attiva?: boolean;
  }
) =>
  prisma.company.update({
    where: { id },
    data,
  });

export const deleteCompany = (id: number) =>
  prisma.company.delete({
    where: { id },
  });

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const upsertCompaniesBulk = async (
  rows: Array<{
    nome?: string;
    slug?: string;
    sito_web?: string | null;
    telefono?: string | null;
    email?: string | null;
    attiva?: boolean;
  }>
) => {
  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    const nome = row.nome?.trim();
    if (!nome) {
      skipped += 1;
      continue;
    }

    const slug = normalizeSlug((row.slug && row.slug.trim()) || nome);
    if (!slug) {
      skipped += 1;
      continue;
    }

    await prisma.company.upsert({
      where: { slug },
      update: {
        nome,
        sito_web: row.sito_web?.trim() || null,
        telefono: row.telefono?.trim() || null,
        email: row.email?.trim() || null,
        attiva: row.attiva ?? true,
      },
      create: {
        nome,
        slug,
        sito_web: row.sito_web?.trim() || null,
        telefono: row.telefono?.trim() || null,
        email: row.email?.trim() || null,
        attiva: row.attiva ?? true,
      },
    });

    imported += 1;
  }

  return { imported, skipped };
};
