import { prisma } from "@/lib/prisma";
import { ChatBusResult } from "@/features/chat/types";

const BUS_KEYWORDS = ["bus", "autobus", "corse", "orari", "partenza", "partenze", "terminal"];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);

const getTourismHint = (message: string) => {
  const text = normalize(message);

  if (text.includes("cosa vedere") || text.includes("visitare")) {
    return "A Sala Consilina puoi visitare il centro storico e usarla come base per esplorare il Vallo di Diano e la Certosa di Padula.";
  }

  if (text.includes("mangiare") || text.includes("ristorante")) {
    return "Per mangiare bene, ti consiglio locali tipici nel centro e zone limitrofe con cucina del territorio.";
  }

  if (text.includes("dormire") || text.includes("hotel") || text.includes("b&b")) {
    return "Trovi diverse soluzioni tra B&B e hotel nell'area di Sala Consilina, utili come punto di partenza per escursioni.";
  }

  return "Posso aiutarti sia con consigli turistici su Sala Consilina sia con gli orari bus disponibili dal terminal.";
};

export async function buildTouristReply(userMessage: string): Promise<{ reply: string; buses: ChatBusResult[] }> {
  const message = normalize(userMessage);
  const hasBusIntent = BUS_KEYWORDS.some((keyword) => message.includes(keyword));

  const buses = await prisma.bus.findMany({
    orderBy: {
      orario_partenza: "asc",
    },
  });

  const matchedByDestination = buses.filter((bus) => message.includes(normalize(bus.destinazione)));
  const matchedByCompany = buses.filter((bus) => message.includes(normalize(bus.compagnia)));

  let selected = matchedByDestination;
  if (selected.length === 0) {
    selected = matchedByCompany;
  }
  if (selected.length === 0 && hasBusIntent) {
    selected = buses.slice(0, 5);
  }

  const serializedBuses: ChatBusResult[] = selected.slice(0, 5).map((bus) => ({
    id: bus.id,
    compagnia: bus.compagnia,
    destinazione: bus.destinazione,
    orario_partenza: bus.orario_partenza.toISOString(),
    sito_web_compagnia: bus.sito_web_compagnia,
    contatti: bus.contatti,
  }));

  if (serializedBuses.length > 0) {
    const preview = serializedBuses
      .map((bus) => `- ${bus.compagnia} verso ${bus.destinazione} (${formatDateTime(new Date(bus.orario_partenza))})`)
      .join("\n");

    const reply = [
      "Certo, ti aiuto volentieri.",
      "Ho trovato queste corse in partenza dal Terminal Bus di Sala Consilina:",
      preview,
      "Se vuoi, posso filtrare meglio per fascia oraria o destinazione.",
    ].join("\n\n");

    return { reply, buses: serializedBuses };
  }

  const tourismHint = getTourismHint(userMessage);

  return {
    reply: `${tourismHint}\n\nAl momento non ho trovato corse specifiche collegate alla tua richiesta. Scrivimi ad esempio: "bus per Roma" o "orari per Salerno" e ti mostro i link utili delle compagnie.`,
    buses: [],
  };
}
