"use client";

import { useEffect, useRef, useState } from "react";
import { checkHealth, sendChatMessage } from "@/lib/api";
import ChatInput from "./components/ChatInput";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import WelcomeCard from "./components/WelcomeCard";
import type { ChatMessage } from "./components/types";

/** Backend status shown by the dot in the header. */
type Health = "checking" | "online" | "offline";

/**
 * Mindful Coach: chat page for the FastAPI `/api/chat` endpoint.
 *
 * The transcript lives in React state for display only. The backend is
 * single-turn, so each request sends just the latest message.
 */
export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<Health>("checking");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check backend health on load, then every 30 seconds.
  useEffect(() => {
    let active = true;
    const run = () => checkHealth().then((ok) => active && setHealth(ok ? "online" : "offline"));
    run();
    const timer = setInterval(run, 30_000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  // Keep the newest message (or typing indicator) in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  async function handleSend(text: string) {
    setError(null);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text }]);
    setPending(true);
    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
      setHealth("online");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  const healthStyles: Record<Health, { dot: string; label: string }> = {
    checking: { dot: "bg-amber-400", label: "Connecting…" },
    online: { dot: "bg-emerald-500", label: "Coach online" },
    offline: { dot: "bg-rose-500", label: "Backend offline" },
  };

  return (
    <div className="flex h-dvh flex-col">
      {/* Header: tells people what this app is, plus backend status. */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">🧘 Mindful Coach</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Your supportive mental coach, powered by AI
            </p>
          </div>
          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                }}
                disabled={pending}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                New chat
              </button>
            )}
            <span
              className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
              title="Status of the API at /api/health"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${healthStyles[health].dot}`} />
              <span className="hidden sm:inline">{healthStyles[health].label}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Transcript: scrolls independently so the input stays pinned below. */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
          {messages.length === 0 && !pending ? (
            <WelcomeCard onPick={handleSend} />
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
          {pending && <TypingIndicator />}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100"
            >
              <strong className="font-semibold">Couldn&apos;t get a reply:</strong> {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Composer + disclaimer. */}
      <footer className="border-t border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <ChatInput onSend={handleSend} disabled={pending} />
          <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            AI coach, not a substitute for professional mental-health care. If you&apos;re in
            crisis, contact local emergency services.
          </p>
        </div>
      </footer>
    </div>
  );
}
