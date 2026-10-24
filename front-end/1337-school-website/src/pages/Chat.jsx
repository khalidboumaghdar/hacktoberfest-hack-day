
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Clock,
  Home as HomeIcon,
  Paperclip,
  Send,
  Plus,
} from "lucide-react";

import Logo from "../components/Logo.jsx";
import Message from "../components/Message.jsx";
import { askBackend } from "../api.js";

const STORAGE_KEY = "1337-chat-conversations";
const ACTIVE_KEY = "1337-active-conversation";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "bot",
  status: "done",
  time: "",
  text:
    "Hello! I'm your 1337 assistant. I can help you find information about the school, its learning method, admissions, projects, campus life and more.\n\nWhat would you like to know today?",
};

const SUGGESTIONS = [
  "How can I join 1337?",
  "What projects do students build?",
  "What technologies are used?",
  "What facilities are available?",
];

const time = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

function createConversation() {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    updatedAt: Date.now(),
    messages: [
      {
        ...WELCOME_MESSAGE,
        id: crypto.randomUUID(),
        time: time(),
      },
    ],
  };
}

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (
        Array.isArray(parsed) &&
        parsed.every(
          (conversation) =>
            typeof conversation.id === "string" &&
            Array.isArray(conversation.messages)
        )
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load conversations:", error);
  }

  return [createConversation()];
}

export default function Chat() {
  const [tab, setTab] = useState("chat");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const [conversations, setConversations] = useState(
    loadConversations
  );

  const [activeConversationId, setActiveConversationId] = useState(
    () => {
      try {
        return localStorage.getItem(ACTIVE_KEY);
      } catch {
        return null;
      }
    }
  );

  const endRef = useRef(null);

  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === activeConversationId
    ) || conversations[0];

  const messages = activeConversation?.messages || [];

  // Save all conversations whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(conversations)
      );
    } catch (error) {
      console.error("Could not save conversations:", error);
    }
  }, [conversations]);

  // Remember which conversation is currently open.
  useEffect(() => {
    if (
      activeConversation &&
      activeConversation.id !== activeConversationId
    ) {
      setActiveConversationId(activeConversation.id);
    }

    try {
      if (activeConversation) {
        localStorage.setItem(ACTIVE_KEY, activeConversation.id);
      }
    } catch (error) {
      console.error("Could not save active conversation:", error);
    }
  }, [activeConversation, activeConversationId]);

  // Scroll to the latest message.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function updateConversation(conversationId, updater) {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? updater(conversation)
          : conversation
      )
    );
  }

  function newChat() {
    if (busy) return;

    const conversation = createConversation();

    setConversations((previous) => [
      conversation,
      ...previous,
    ]);

    setActiveConversationId(conversation.id);
    setTab("chat");
    setInput("");
  }

  function openConversation(conversationId) {
    if (busy) return;

    setActiveConversationId(conversationId);
    setTab("chat");
    setInput("");
  }

  async function ask(question, conversationId, botId) {
    setBusy(true);

    try {
      const data = await askBackend(question);

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        updatedAt: Date.now(),
        messages: conversation.messages.map((message) =>
          message.id === botId
            ? {
                ...message,
                status: data.answer?.trim() ? "done" : "empty",
                text: data.answer || "",
                sources: data.sources,
                time: time(),
              }
            : message
        ),
      }));
    } catch (error) {
      console.error("Chat request failed:", error);

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        updatedAt: Date.now(),
        messages: conversation.messages.map((message) =>
          message.id === botId
            ? {
                ...message,
                status: "error",
                question,
                time: time(),
              }
            : message
        ),
      }));
    } finally {
      setBusy(false);
    }
  }

  function send(text) {
    const question = text.trim();

    if (!question || busy || !activeConversation) return;

    const conversationId = activeConversation.id;
    const userId = crypto.randomUUID();
    const botId = crypto.randomUUID();
    const now = time();

    updateConversation(conversationId, (conversation) => {
      const isFirstQuestion = !conversation.messages.some(
        (message) => message.role === "user"
      );

      return {
        ...conversation,
        title: isFirstQuestion
          ? question.slice(0, 50)
          : conversation.title,
        updatedAt: Date.now(),
        messages: [
          ...conversation.messages,
          {
            id: userId,
            role: "user",
            text: question,
            time: now,
          },
          {
            id: botId,
            role: "bot",
            status: "loading",
          },
        ],
      };
    });

    setInput("");
    ask(question, conversationId, botId);
  }

  const history = [...conversations].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  return (
    <div className="mx-auto flex h-full max-w-6xl p-3 sm:p-4">
      <div className="flex w-full overflow-hidden rounded-xl bg-white shadow-xl shadow-slate-300/50">
        <aside className="hidden w-52 shrink-0 flex-col bg-navy-950 p-4 text-white sm:flex">
          <Logo />

          <button
            onClick={newChat}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-3 text-sm font-semibold hover:bg-white/20 disabled:opacity-50"
          >
            <Plus size={18} />
            New Chat
          </button>

          <nav className="mt-3 space-y-1 text-sm">
            {[
              ["chat", "Chat", MessageCircle],
              ["history", "History", Clock],
            ].map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left ${
                  tab === key
                    ? "bg-navy-800 font-semibold"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <p className="mt-auto text-[11px] leading-tight text-white/70">
            By Team
            <br />
            Khaliha ala Alah
          </p>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h1 className="font-bold">1337 Assistant</h1>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className="size-2 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={newChat}
                disabled={busy}
                className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 sm:hidden"
              >
                <Plus size={14} />
                New Chat
              </button>

              <Link
                to="/"
                className="flex items-center gap-2 rounded-md bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-100"
              >
                <HomeIcon size={14} />
                Back to Home
              </Link>
            </div>
          </header>

          {tab === "history" ? (
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="font-bold">Chat History</h2>

              {history.length === 0 && (
                <p className="mt-3 text-sm text-muted">
                  No conversations yet. Start a new chat!
                </p>
              )}

              <ul className="mt-3 space-y-2">
                {history.map((conversation) => (
                  <li key={conversation.id}>
                    <button
                      onClick={() =>
                        openConversation(conversation.id)
                      }
                      disabled={busy}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                        conversation.id === activeConversation?.id
                          ? "border-brand bg-brand-50"
                          : "border-slate-200 hover:bg-slate-50"
                      } disabled:opacity-50`}
                    >
                      <p className="truncate text-sm font-semibold">
                        {conversation.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          conversation.updatedAt
                        ).toLocaleString()}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {
                          conversation.messages.filter(
                            (message) => message.role === "user"
                          ).length
                        }{" "}
                        questions
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    m={message}
                    onRetry={(failedMessage) =>
                      ask(
                        failedMessage.question,
                        activeConversation.id,
                        failedMessage.id
                      )
                    }
                  />
                ))}

                <div ref={endRef} />
              </div>

              <div className="border-t border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-muted">
                  Suggested questions
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => send(suggestion)}
                      disabled={busy}
                      className="rounded-lg border border-brand-100 bg-white px-3 py-1.5 text-xs text-brand-dark hover:border-brand disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    send(input);
                  }}
                  className="mt-4 flex items-center gap-2"
                >
                  <button
                    type="button"
                    aria-label="Attach file"
                    className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500"
                  >
                    <Paperclip size={16} />
                  </button>

                  <input
                    value={input}
                    onChange={(event) =>
                      setInput(event.target.value)
                    }
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
