import { NextResponse } from "next/server";

import { upsertCompaniesBulk } from "@/features/companies/service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      rows?: Array<{
        nome?: string;
        slug?: string;
        sito_web?: string | null;
        telefono?: string | null;
        email?: string | null;
        attiva?: boolean;
      }>;
    };

    if (!body.rows || !Array.isArray(body.rows) || body.rows.length === 0) {
      return NextResponse.json({ error: "Nessuna riga da importare." }, { status: 400 });
    }

    const result = await upsertCompaniesBulk(body.rows);

    return NextResponse.json({
      message: "Import completato.",
      imported: result.imported,
      skipped: result.skipped,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore durante l'import massivo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
