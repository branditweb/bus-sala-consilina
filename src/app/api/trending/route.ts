import { NextResponse } from "next/server";

import { createTrending, listTrending } from "@/features/trending/service";
import { parseCreateTrendingInput } from "@/features/trending/validation";

export async function GET() {
  try {
    const data = await listTrending(true);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel recupero trending." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = parseCreateTrendingInput(body);
    const created = await createTrending(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore nella creazione.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
