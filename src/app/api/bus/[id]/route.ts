import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { deleteBus, getBusById, updateBus } from "@/features/bus/service";
import { parseBusId, parseUpdateBusInput } from "@/features/bus/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const busId = parseBusId(id);
    const bus = await getBusById(busId);

    if (!bus) {
      return NextResponse.json({ error: "Bus non trovato." }, { status: 404 });
    }

    return NextResponse.json(bus);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore nel recupero del bus.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const busId = parseBusId(id);
    const body = await request.json();
    const data = parseUpdateBusInput(body);

    const bus = await updateBus(busId, data);
    return NextResponse.json(bus);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Bus non trovato." }, { status: 404 });
    }

    const message = error instanceof Error ? error.message : "Errore nell'aggiornamento del bus.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const busId = parseBusId(id);

    await deleteBus(busId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Bus non trovato." }, { status: 404 });
    }

    const message = error instanceof Error ? error.message : "Errore nell'eliminazione del bus.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
