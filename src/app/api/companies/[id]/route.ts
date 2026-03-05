import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { deleteCompany, getCompanyById, updateCompany } from "@/features/companies/service";
import { parseCompanyId, parseUpdateCompanyInput } from "@/features/companies/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companyId = parseCompanyId(id);
    const company = await getCompanyById(companyId);

    if (!company) {
      return NextResponse.json({ error: "Compagnia non trovata." }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore nel recupero compagnia.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companyId = parseCompanyId(id);
    const body = await request.json();
    const data = parseUpdateCompanyInput(body);
    const company = await updateCompany(companyId, data);

    return NextResponse.json(company);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Compagnia non trovata." }, { status: 404 });
      }
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Nome o slug gia' presenti." }, { status: 409 });
      }
    }

    const message = error instanceof Error ? error.message : "Errore nell'aggiornamento compagnia.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companyId = parseCompanyId(id);
    await deleteCompany(companyId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Compagnia non trovata." }, { status: 404 });
    }

    const message = error instanceof Error ? error.message : "Errore nell'eliminazione compagnia.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
