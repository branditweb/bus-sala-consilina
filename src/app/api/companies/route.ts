import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { createCompany, listCompanies } from "@/features/companies/service";
import { parseCreateCompanyInput } from "@/features/companies/validation";

export async function GET() {
  try {
    const companies = await listCompanies();
    return NextResponse.json(companies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel recupero compagnie." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = parseCreateCompanyInput(body);
    const company = await createCompany(data);

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Nome o slug gia' presenti." }, { status: 409 });
    }

    const message = error instanceof Error ? error.message : "Errore nella creazione compagnia.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
