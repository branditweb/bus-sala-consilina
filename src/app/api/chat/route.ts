import { NextResponse } from "next/server";

import { buildTouristReply } from "@/features/chat/assistant";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: string };

    if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0) {
      return NextResponse.json({ error: "Il messaggio è obbligatorio." }, { status: 400 });
    }

    const response = await buildTouristReply(body.message);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errore durante l'elaborazione della richiesta chat." },
      { status: 500 }
    );
  }
}
