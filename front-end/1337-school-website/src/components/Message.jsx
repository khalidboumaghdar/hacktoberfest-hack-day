import { Bot, User, Plus, AlertTriangle, Sparkles } from "lucide-react";
import SourceCard from "./SourceCard.jsx";


function BotAvatar() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
      <Bot size={18} />
    </span>
  );
}

export default function Message({ m, onRetry }) {
  // ---- user ----
  if (m.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-start gap-2">
          <p className="max-w-md rounded-xl bg-brand-100 px-4 py-2 text-sm text-brand-dark">{m.text}</p>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand">
            <User size={16} />
          </span>
        </div>
        <span className="mr-10 text-[11px] text-slate-400">{m.time}</span>
      </div>
    );
  }

  // ---- bot ----
  return (
    <div className="flex items-start gap-3">
      <BotAvatar />
      <div className="max-w-xl">
        {m.status === "loading" && (
          <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm">
            <div className="flex gap-1" aria-label="Assistant is typing">
              {[0, 1, 2].map((i) => <span key={i} className="typing-dot size-1.5 rounded-full bg-brand" />)}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <Sparkles size={11} /> Searching in 1337 documents...
            </p>
          </div>
        )}

        {m.status === "error" && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-red-700"><AlertTriangle size={16} /> Network error</p>
            <p className="mt-1 text-xs text-red-600">Unable to connect to the server. Please try again later.</p>
            <button onClick={() => onRetry(m)} className="mt-3 rounded-md bg-brand px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark">
              Try again
            </button>
          </div>
        )}

        {m.status === "empty" && (
          <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm leading-relaxed">
            I couldn't find specific information about that topic in the available documents. You can try
            rephrasing your question or ask about another topic.
          </p>
        )}

        {m.status === "done" && (
          <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm leading-relaxed">
            <p className="whitespace-pre-line">{m.text}</p>
            {m.sources?.length > 0 && (
              <div className="mt-3">
                <p className="flex items-center gap-1 text-xs font-semibold"><Plus size={12} /> Sources</p>
                {m.sources.map((s) => <SourceCard key={s.title} {...s} />)}
              </div>
            )}
          </div>
        )}

        {m.status !== "loading" && <span className="mt-1 block text-[11px] text-slate-400">{m.time}</span>}
      </div>
    </div>
  );
}
