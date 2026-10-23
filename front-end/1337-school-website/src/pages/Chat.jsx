import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Clock, Home as HomeIcon, Paperclip, Send } from "lucide-react";
import Logo from "../components/Logo.jsx";
import Message from "../components/Message.jsx";
import { askBackend } from "../api.js";

const SUGGESTIONS = [
  "How can I join 1337?",
  "What projects do students build?",
  "What technologies are used?",
  "What facilities are available?",
];

const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function Chat() {
  const [tab, setTab] = useState("chat");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0, role: "bot", status: "done", time: time(),
      text: "Hello! I'm your 1337 assistant. I can help you find information about the school, its learning method, admissions, projects, campus life and more.\n\nWhat would you like to know today?",
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const patch = (id, data) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...data } : m)));

  async function ask(question, botId = Date.now() + 1) {
    setBusy(true);
    patch(botId, { status: "loading" });
    try {
      const data = await askBackend(question);
      if (!data.answer?.trim()) patch(botId, { status: "empty", time: time() });
      else patch(botId, { status: "done", text: data.answer, sources: data.sources, time: time() });
    } catch {
      patch(botId, { status: "error", question, time: time() });
    } finally {
      setBusy(false);
    }
  }

  function send(text) {
    const q = text.trim();
    if (!q || busy) return;
    const botId = Date.now() + 1;
    setMessages((ms) => [
      ...ms,
      { id: botId - 1, role: "user", text: q, time: time() },
      { id: botId, role: "bot", status: "loading" },
    ]);
    setInput("");
    ask(q, botId);
  }

  const history = messages.filter((m) => m.role === "user");

  return (
    <div className="mx-auto flex h-full max-w-6xl p-3 sm:p-4">
      <div className="flex w-full overflow-hidden rounded-xl bg-white shadow-xl shadow-slate-300/50">
        <aside className="hidden w-52 shrink-0 flex-col bg-navy-950 p-4 text-white sm:flex">
          <Logo />
          <nav className="mt-6 space-y-1 text-sm">
            {[
              ["chat", "Chat", MessageCircle],
              ["history", "History", Clock],
            ].map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left ${tab === key ? "bg-navy-800 font-semibold" : "text-white/80 hover:bg-white/5"}`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>
          <p className="mt-auto text-[11px] leading-tight text-white/70">
            Open-source AI
            <br />
            Powered by RAG
          </p>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h1 className="font-bold">1337 Assistant</h1>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className="size-2 rounded-full bg-emerald-500" /> Online
              </p>
            </div>
            <Link to="/" className="flex items-center gap-2 rounded-md bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-100">
              <HomeIcon size={14} /> Back to Home
            </Link>
          </header>

          {tab === "history" ? (
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="font-bold">History</h2>
              {history.length === 0 && <p className="mt-3 text-sm text-muted">No questions yet. Start a chat to see them here.</p>}
              <ul className="mt-3 space-y-2">
                {history.map((m) => (
                  <li key={m.id} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">
                    {m.text} <span className="ml-2 text-xs text-slate-400">{m.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {messages.map((m) => (
                  <Message key={m.id} m={m} onRetry={(bm) => ask(bm.question, bm.id)} />
                ))}
                <div ref={endRef} />
              </div>

              <div className="border-t border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-muted">Suggested questions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={busy}
                      className="rounded-lg border border-brand-100 bg-white px-3 py-1.5 text-xs text-brand-dark hover:border-brand disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-4 flex items-center gap-2">
                  <button type="button" aria-label="Attach file" className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
                    <Paperclip size={16} />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    aria-label="Send"
                    className="flex size-10 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
