"use client";

import { FormEvent, useMemo, useState } from "react";

import { ChatApiResponse, ChatBusResult } from "@/features/chat/types";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  buses?: ChatBusResult[];
};

const formatTime = (dateISO: string) =>
  new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateISO));

export function ChatWindow() {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Ciao, sono la tua assistente turistica per Sala Consilina. Chiedimi orari bus, destinazioni o consigli su cosa visitare.",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();

    if (!message || sending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Errore durante la risposta AI.");
      }

      const data = (await response.json()) as ChatApiResponse;

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: data.reply,
          buses: data.buses,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: "assistant",
          text:
            error instanceof Error
              ? `Non riesco a rispondere ora: ${error.message}`
              : "Non riesco a rispondere ora.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-emerald-200 bg-[#e5ddd5] shadow-2xl">
      <div className="flex items-center gap-3 border-b border-emerald-300 bg-[#075e54] px-5 py-4 text-white">
        <div className="h-9 w-9 rounded-full bg-emerald-200/30" />
        <div>
          <p className="text-sm font-semibold">Assistente Turistica Sala Consilina</p>
          <p className="text-xs text-emerald-100">online</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cream-pixels.png')] p-4 sm:p-5">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] ${
              message.role === "user"
                ? "ml-auto rounded-br-sm bg-[#dcf8c6] text-slate-800"
                : "rounded-bl-sm bg-white text-slate-800"
            }`}
          >
            <p className="whitespace-pre-line leading-relaxed">{message.text}</p>

            {message.role === "assistant" && message.buses && message.buses.length > 0 ? (
              <div className="mt-3 space-y-2">
                {message.buses.map((bus) => (
                  <div key={bus.id} className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                    <p className="text-xs font-semibold text-emerald-900">{bus.compagnia}</p>
                    <p className="text-xs text-slate-700">
                      {bus.destinazione} · {formatTime(bus.orario_partenza)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      {bus.sito_web_compagnia ? (
                        <a
                          href={bus.sito_web_compagnia}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-emerald-700 underline underline-offset-2"
                        >
                          Sito compagnia
                        </a>
                      ) : null}
                      {bus.contatti ? <span className="text-slate-600">Contatti: {bus.contatti}</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}

        {sending ? (
          <div className="max-w-[60%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            Sto cercando le informazioni migliori per te...
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-emerald-200 bg-[#f0f2f5] p-3 sm:p-4">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 sm:px-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Scrivi un messaggio (es. bus per Roma)..."
            className="w-full bg-transparent px-2 text-sm text-slate-800 outline-none"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-full bg-[#128c7e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0f7a6e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Invia
          </button>
        </div>
      </form>
    </div>
  );
}
