import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { deleteTrending, getTrendingById, updateTrending } from "@/features/trending/service";
import { parseTrendingId, parseUpdateTrendingInput } from "@/features/trending/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trendId = parseTrendingId(id);
    const data = await getTrendingById(trendId);

    if (!data) {
      return NextResponse.json({ error: "Destinazione non trovata." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore nel recupero.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trendId = parseTrendingId(id);
    const body = await request.json();
    const data = parseUpdateTrendingInput(body);
    const updated = await updateTrending(trendId, data);

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Destinazione non trovata." }, { status: 404 });
    }

    const message = error instanceof Error ? error.message : "Errore nell'aggiornamento.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trendId = parseTrendingId(id);
    await deleteTrending(trendId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Destinazione non trovata." }, { status: 404 });
    }

    const message = error instanceof Error ? error.message : "Errore nell'eliminazione.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
