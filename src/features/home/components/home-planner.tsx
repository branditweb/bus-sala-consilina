"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { BusItem } from "@/features/bus/api";
import { ChatApiResponse } from "@/features/chat/types";
import { FloatingAiChat } from "@/features/home/components/floating-ai-chat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type TrendItem = {
  city: string;
  price: string;
  rating: string;
  duration: string;
  image: string;
  description: string;
};

const defaultTrending: TrendItem[] = [
  {
    city: "Sala Consilina",
    price: "da 9 EUR",
    rating: "4.8",
    duration: "2h 45m viaggio",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    description: "Snodo principale per collegamenti veloci nel sud Italia.",
  },
  {
    city: "Roma Tiburtina",
    price: "da 18 EUR",
    rating: "4.9",
    duration: "3h 15m viaggio",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
    description: "Gate di accesso alla capitale con collegamenti frequenti.",
  },
  {
    city: "Salerno",
    price: "da 8 EUR",
    rating: "4.6",
    duration: "1h 35m viaggio",
    image:
      "https://images.unsplash.com/photo-1543674892-7d64d45f6100?auto=format&fit=crop&w=900&q=80",
    description: "Mare, porto e interscambi ferroviari.",
  },
  {
    city: "Napoli",
    price: "da 12 EUR",
    rating: "4.7",
    duration: "2h 10m viaggio",
    image:
      "https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?auto=format&fit=crop&w=900&q=80",
    description: "Centro storico e hub turistico regionale.",
  },
];

const formatDeparture = (iso: string) =>
  new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function HomePlanner() {
  const [destinazione, setDestinazione] = useState("");
  const [data, setData] = useState("");
  const [ora, setOra] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [results, setResults] = useState<BusItem[]>([]);
  const [liveDepartures, setLiveDepartures] = useState<BusItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today");
  const [companyFilter, setCompanyFilter] = useState("all");

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Ciao, sono la guida AI del Terminal Bus di Sala Consilina. Posso consigliarti tratte e destinazioni.",
    },
  ]);
  const [trendingItems, setTrendingItems] = useState<TrendItem[]>(defaultTrending);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/bus", { cache: "no-store" });
        if (!response.ok) return;
        const buses = (await response.json()) as BusItem[];
        setLiveDepartures(buses.slice(0, 6));
      } catch {
        setLiveDepartures([]);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await fetch("/api/trending", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as Array<{
          city: string;
          description: string;
          price_from: string | null;
          rating: string | null;
          duration: string | null;
          image_url: string | null;
        }>;

        if (data.length === 0) return;
        setTrendingItems(
          data.map((item) => ({
            city: item.city,
            description: item.description,
            price: item.price_from ?? "",
            rating: item.rating ?? "",
            duration: item.duration ?? "",
            image: item.image_url ?? defaultTrending[0]?.image ?? "",
          }))
        );
      } catch {
        // fallback to defaultTrending
      }
    };

    void loadTrending();
  }, []);

  const featuredBus = useMemo(() => results[0] ?? liveDepartures[0] ?? null, [results, liveDepartures]);
  const displayedDepartures = useMemo(
    () => (results.length > 0 ? results : liveDepartures),
    [results, liveDepartures]
  );
  const companies = useMemo(() => {
    const set = new Set(displayedDepartures.map((bus) => bus.compagnia));
    return ["all", ...Array.from(set)];
  }, [displayedDepartures]);
  const filteredDepartures = useMemo(() => {
    if (companyFilter === "all") return displayedDepartures;
    return displayedDepartures.filter((bus) => bus.compagnia === companyFilter);
  }, [displayedDepartures, companyFilter]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoadingSearch(true);
    try {
      const params = new URLSearchParams();
      if (destinazione.trim()) params.set("destinazione", destinazione.trim());
      const baseDate = new Date();
      if (selectedDay === "tomorrow") {
        baseDate.setDate(baseDate.getDate() + 1);
      }
      const dateParam = data || formatLocalDate(baseDate);
      params.set("data", dateParam);
      if (ora) params.set("ora", ora);

      const response = await fetch(`/api/bus?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) {
        setResults([]);
        return;
      }

      const buses = (await response.json()) as BusItem[];
      setResults(buses);
      if (buses.length > 0) setLiveDepartures(buses.slice(0, 6));
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSendChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    setChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: message }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Risposta AI non disponibile");

      const data = (await response.json()) as ChatApiResponse;
      const links = data.buses
        .filter((bus) => bus.sito_web_compagnia)
        .map((bus) => `${bus.compagnia}: ${bus.sito_web_compagnia}`)
        .join("\n");

      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: links ? `${data.reply}\n\nLink utili:\n${links}` : data.reply,
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { id: `a-err-${Date.now()}`, role: "assistant", text: "Non riesco a recuperare i dati ora. Riprova." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-24">
      <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">
            Nuove corse disponibili
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
            Il tuo viaggio
            <br />
            <span className="text-slate-400">parte da qui.</span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-500">
            Ricerca rapida in stile booking: destinazione, data e ora. Tutto connesso ai dati reali del terminal.
          </p>

          <form onSubmit={handleSearch} className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
              <input
                required
                value={destinazione}
                onChange={(event) => setDestinazione(event.target.value)}
                placeholder="Dove vuoi andare?"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
              <input
                required
                type="date"
                value={data}
                onChange={(event) => setData(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
              <input
                required
                type="time"
                value={ora}
                onChange={(event) => setOra(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                disabled={loadingSearch}
                className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white"
              >
                {loadingSearch ? "Cerco..." : "Cerca"}
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            <span className="pt-1 text-slate-400">Popular:</span>
            {["Roma", "Napoli", "Salerno", "Potenza"].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setDestinazione(city)}
                className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Next departure</p>
          <p className="mt-3 text-2xl font-bold">
            {featuredBus ? `Sala Consilina -> ${featuredBus.destinazione}` : "Nessuna corsa"}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {featuredBus
              ? `${featuredBus.compagnia} · ${formatDeparture(featuredBus.orario_partenza)}`
              : "Effettua una ricerca per vedere le partenze."}
          </p>
          {featuredBus?.sito_web_compagnia ? (
            <a
              href={featuredBus.sito_web_compagnia}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-semibold"
            >
              Vai al sito compagnia
            </a>
          ) : null}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm lg:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          LIVE STATION UPDATES
        </div>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Departures</h2>
        <p className="mt-2 text-sm text-slate-500">
          Real-time schedule for {selectedDay === "today" ? "today" : "tomorrow"}&apos;s departures from Sala Consilina.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedDay("today")}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              selectedDay === "today" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setSelectedDay("tomorrow")}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              selectedDay === "tomorrow" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Tomorrow
          </button>
          <select
            value={companyFilter}
            onChange={(event) => setCompanyFilter(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
          >
            {companies.map((company) => (
              <option key={company} value={company}>
                {company === "all" ? "Company" : company}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="grid grid-cols-[90px_1fr_90px] gap-2 border-b border-slate-100 px-5 py-3 text-xs font-semibold text-slate-400">
            <span>TIME</span>
            <span>DESTINATION</span>
            <span className="text-right">STATUS</span>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredDepartures.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-slate-500">Nessuna partenza disponibile.</div>
            ) : (
              filteredDepartures.map((bus) => (
                <div key={bus.id} className="grid grid-cols-[90px_1fr_90px] items-center gap-2 px-5 py-4">
                  <div className="text-lg font-semibold text-slate-900">{formatDeparture(bus.orario_partenza)}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{bus.destinazione}</p>
                    <p className="text-xs text-slate-400">{bus.compagnia}</p>
                  </div>
                  <div className="flex justify-end">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600">
                      ONTIME
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Trending Destinations</h2>
            <p className="mt-1 text-sm text-slate-500">Le tratte piu&apos; richieste in questo momento.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {trendingItems.map((item) => (
            <button
              key={item.city}
              type="button"
              onClick={() => setDestinazione(item.city)}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="relative h-40 overflow-hidden">
                <img src={item.image} alt={item.city} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute right-2 top-2 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-800">
                  {item.price}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-slate-900">{item.city}</p>
                  <span className="text-xs font-semibold text-amber-500">{item.rating} ★</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{item.duration}</span>
                  <span className="text-[11px] font-semibold text-slate-900 underline underline-offset-4">
                    Cerca corsa
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <FloatingAiChat
        messages={chatMessages}
        input={chatInput}
        loading={chatLoading}
        onInputChange={setChatInput}
        onSubmit={handleSendChat}
      />
    </div>
  );
}
