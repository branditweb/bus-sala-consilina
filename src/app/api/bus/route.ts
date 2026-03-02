import { NextResponse } from "next/server";

import { createBus, listBus, listBusFiltered } from "@/features/bus/service";
import { parseCreateBusInput } from "@/features/bus/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destinazione = searchParams.get("destinazione") ?? undefined;
    const data = searchParams.get("data") ?? undefined;
    const ora = searchParams.get("ora") ?? undefined;

    const hasFilters = Boolean(destinazione || data || ora);
    const buses = hasFilters
      ? await listBusFiltered({ destinazione, data, ora })
      : await listBus();

    return NextResponse.json(buses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore nel recupero dei bus." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = parseCreateBusInput(body);
    const bus = await createBus(data);

    return NextResponse.json(bus, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore nella creazione del bus.";

    if (error instanceof SyntaxError || error instanceof Error) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ error: "Errore nella creazione del bus." }, { status: 500 });
  }
}
