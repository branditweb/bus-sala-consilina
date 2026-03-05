import { FormEvent } from "react";

type DockMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type AiDockProps = {
  messages: DockMessage[];
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function AiDock({ messages, input, loading, onInputChange, onSubmit }: AiDockProps) {
  return (
    <aside className="fixed bottom-4 right-4 z-40 hidden w-[340px] rounded-2xl border border-slate-200 bg-white shadow-2xl lg:block">
      <div className="rounded-t-2xl bg-emerald-700 px-4 py-3 text-white">
        <p className="text-sm font-semibold">Assistente AI</p>
        <p className="text-xs text-emerald-100">Turismo + orari bus</p>
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto bg-[#ece5dd] p-3">
        {messages.slice(-5).map((message) => (
          <div
            key={message.id}
            className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
              message.role === "user" ? "ml-auto bg-[#dcf8c6]" : "bg-white"
            }`}
          >
            <p className="whitespace-pre-line text-slate-800">{message.text}</p>
          </div>
        ))}
        {loading ? <p className="text-xs text-slate-500">Sto elaborando...</p> : null}
      </div>
      <form onSubmit={onSubmit} className="border-t border-slate-200 p-2">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
          <input
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Chiedi all'assistente"
            className="w-full bg-transparent px-2 text-xs outline-none"
          />
          <button
            type="submit"
            disabled={loading || input.trim().length === 0}
            className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            Invia
          </button>
        </div>
      </form>
    </aside>
  );
}
