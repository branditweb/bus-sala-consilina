"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type FloatingAiChatProps = {
  messages: ChatMessage[];
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function FloatingAiChat({
  messages,
  input,
  loading,
  onInputChange,
  onSubmit,
}: FloatingAiChatProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[360px]">
          <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Stationmaster AI</p>
              <p className="text-xs text-emerald-100">Online & Ready</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/20 px-2 py-1 text-xs"
            >
              Chiudi
            </button>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto bg-[#ece5dd] p-3">
            {messages.slice(-6).map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  message.role === "user" ? "ml-auto bg-[#dcf8c6]" : "bg-white"
                }`}
              >
                <p className="whitespace-pre-line text-slate-800">{message.text}</p>
              </div>
            ))}
            {loading ? <p className="text-xs text-slate-500">Sto cercando le migliori opzioni...</p> : null}
          </div>

          <form onSubmit={onSubmit} className="border-t border-slate-200 p-2">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
              <input
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                placeholder="Trova bus, chiedi consigli..."
                className="w-full bg-transparent px-2 text-xs outline-none"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                className="rounded-full bg-emerald-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                Invia
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-emerald-700 px-4 py-3 text-xs font-semibold text-white shadow-lg"
        >
          Apri AI
        </button>
      )}
    </div>
  );
}
