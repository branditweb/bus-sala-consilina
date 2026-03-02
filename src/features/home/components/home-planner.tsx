"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

import { ChatApiResponse } from "@/features/chat/types";
import { BusItem } from "@/features/bus/api";

type PlannerMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const formatBusDate = (dateISO: string) =>
  new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateISO));

export function HomePlanner() {
  const [destinazione, setDestinazione] = useState("");
  const [data, setData] = useState("");
  const [ora, setOra] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<BusItem[]>([]);

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<PlannerMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: "Ciao, sono la tua assistente turistica di Sala Consilina. Posso aiutarti con bus, mete e consigli rapidi.",
    },
  ]);

  const hasResults = useMemo(() => results.length > 0, [results]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoadingSearch(true);
    setSearchError(null);

    try {
      const params = new URLSearchParams();
      if (destinazione.trim()) {
        params.set("destinazione", destinazione.trim());
      }
      if (data) {
        params.set("data", data);
      }
      if (ora) {
        params.set("ora", ora);
      }

      const response = await fetch(`/api/bus?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error ?? "Errore durante la ricerca delle corse.");
      }

      const buses = (await response.json()) as BusItem[];
      setResults(buses);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Ricerca non disponibile.");
      setResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSendChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = chatInput.trim();
    if (!message || chatLoading) {
      return;
    }

    setChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: message }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error ?? "Errore nella risposta dell'assistente.");
      }

      const data = (await response.json()) as ChatApiResponse;
      const linksText =
        data.buses.length > 0
          ? `\n\nLink utili: ${data.buses
              .filter((bus) => bus.sito_web_compagnia)
              .map((bus) => `${bus.compagnia} (${bus.sito_web_compagnia})`)
              .join(" · ")}`
          : "";

      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: `${data.reply}${linksText}`,
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-error-${Date.now()}`,
          role: "assistant",
          text:
            error instanceof Error
              ? `Ora non riesco a rispondere: ${error.message}`
              : "Ora non riesco a rispondere.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <section className="space-y-6 pb-10">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#f8fbff] via-white to-[#eef7ff] p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Terminal Bus Sala Consilina</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Pianifica la tua partenza in pochi secondi
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
          Cerca corse per destinazione, data e ora. Se hai dubbi su itinerari o turismo locale, chiedi subito alla nostra assistente AI.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <form
            onSubmit={handleSearch}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Ricerca Corse</p>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">Stile quick-booking</span>
            </div>

            <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_auto]">
              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-500">Destinazione</span>
                <input
                  required
                  value={destinazione}
                  onChange={(event) => setDestinazione(event.target.value)}
                  placeholder="Es. Roma"
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-500">Data</span>
                <input
                  required
                  type="date"
                  value={data}
                  onChange={(event) => setData(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs font-medium text-slate-500">Ora</span>
                <input
                  required
                  type="time"
                  value={ora}
                  onChange={(event) => setOra(event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <button
                type="submit"
                disabled={loadingSearch}
                className="mt-auto h-12 rounded-xl bg-[#003b95] px-6 text-sm font-semibold text-white transition hover:bg-[#002f78] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingSearch ? "Ricerca..." : "Cerca"}
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Risultati disponibili</h2>
              <Link href="/bus" className="text-xs font-semibold text-sky-700 underline underline-offset-4">
                Gestione Admin
              </Link>
            </div>

            {searchError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchError}</p>
            ) : null}

            {!searchError && !loadingSearch && !hasResults ? (
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Inserisci una destinazione, data e ora per vedere le corse disponibili dal terminal.
              </p>
            ) : null}

            {loadingSearch ? (
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">Caricamento corse...</p>
            ) : null}

            {hasResults ? (
              <div className="space-y-3">
                {results.map((bus) => (
                  <article
                    key={bus.id}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{bus.compagnia}</p>
                        <p className="text-sm text-slate-600">Sala Consilina → {bus.destinazione}</p>
                      </div>
                      <p className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        {formatBusDate(bus.orario_partenza)}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      {bus.sito_web_compagnia ? (
                        <a
                          href={bus.sito_web_compagnia}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-sky-700 underline underline-offset-4"
                        >
                          Vai al sito compagnia
                        </a>
                      ) : (
                        <span>Nessun sito disponibile</span>
                      )}
                      <span>{bus.contatti ? `Contatti: ${bus.contatti}` : "Contatti non disponibili"}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="flex h-full flex-col rounded-3xl border border-emerald-200 bg-[#d9fdd3] p-3 shadow-lg shadow-emerald-100">
          <div className="rounded-2xl bg-[#075e54] px-4 py-3 text-white">
            <p className="text-sm font-semibold">AI Assistente Turistica</p>
            <p className="text-xs text-emerald-100">Sala Consilina e tratte bus</p>
          </div>

          <div className="mt-3 flex-1 space-y-2 overflow-y-auto rounded-2xl bg-[#ece5dd] p-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "ml-auto rounded-br-sm bg-[#dcf8c6] text-slate-800"
                    : "rounded-bl-sm bg-white text-slate-800"
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
              </div>
            ))}

            {chatLoading ? (
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
                Sto controllando i bus e i suggerimenti migliori...
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSendChat} className="mt-3">
            <div className="flex items-center gap-2 rounded-full bg-white p-1.5">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Chiedi all'AI..."
                className="w-full bg-transparent px-2 text-xs text-slate-800 outline-none"
              />
              <button
                type="submit"
                disabled={chatLoading || chatInput.trim().length === 0}
                className="rounded-full bg-[#128c7e] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0f7a6e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Invia
              </button>
            </div>
          </form>

          <Link href="/chat" className="mt-3 text-center text-xs font-semibold text-emerald-900 underline underline-offset-4">
            Apri chat completa
          </Link>
        </aside>
      </div>
    </section>
  );
}
