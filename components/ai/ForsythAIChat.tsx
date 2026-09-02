"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, MapPin, CalendarDays } from "lucide-react";
import Link from "next/link";
import { askNavigator, SUGGESTED_PROMPTS } from "@/lib/ai/navigator";
import type { CommunityEvent, ResourceItem } from "@/lib/types";
import { formatEventDateTime } from "@/lib/utils";
import VoiceSearchButton from "./VoiceSearchButton";

interface Turn {
  id: number;
  role: "user" | "assistant";
  text: string;
  resources?: ResourceItem[];
  events?: CommunityEvent[];
}

const GREETING: Turn = {
  id: 0,
  role: "assistant",
  text: "Hi! I'm the Forsyth AI Navigator. Tell me what you need in plain English and I'll point you at the right resource.",
};

export default function ForsythAIChat() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([GREETING]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: "end" });
  }, [turns, thinking]);

  function submit(text: string) {
    const query = text.trim();
    if (!query || thinking) return;

    setTurns((t) => [...t, { id: nextId.current++, role: "user", text: query }]);
    setInput("");
    setThinking(true);

    // A short delay keeps the answer legible as a response rather than
    // appearing instantly alongside the question.
    window.setTimeout(() => {
      const answer = askNavigator(query);
      setTurns((t) => [
        ...t,
        {
          id: nextId.current++,
          role: "assistant",
          text: answer.reply,
          resources: answer.resources,
          events: answer.events,
        },
      ]);
      setThinking(false);
    }, 400);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="forsyth-ai-panel"
        // Clears the home indicator on notched phones.
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        className="fixed right-4 z-50 flex items-center gap-2 rounded-full bg-sawnee-700 px-5 py-4 text-white shadow-lg transition-colors hover:bg-sawnee-900 sm:right-5"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="text-sm font-semibold">
          {open ? "Close" : "Ask Forsyth AI"}
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id="forsyth-ai-panel"
          role="dialog"
          aria-label="Forsyth AI Navigator"
          style={{ bottom: "calc(max(1.25rem, env(safe-area-inset-bottom)) + 4.5rem)" }}
          className="fixed right-4 z-50 flex max-h-[min(600px,70vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-earth-border bg-earth-surface shadow-2xl sm:right-5"
        >
          <div className="flex items-center gap-2 border-b border-earth-border bg-sawnee-700 px-4 py-3 text-white">
            <Sparkles className="h-5 w-5 text-gold-400" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold">Forsyth AI Navigator</h2>
              <p className="text-xs text-sawnee-100">
                Searches local resources — no login, no data stored
              </p>
            </div>
          </div>

          <div
            className="flex-1 space-y-4 overflow-y-auto p-4"
            role="log"
            aria-live="polite"
            aria-label="Conversation"
          >
            {turns.map((turn) => (
              <div key={turn.id}>
                <div
                  className={
                    turn.role === "user"
                      ? "ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-lanier-500 px-3 py-2 text-sm text-white"
                      : "w-fit max-w-[90%] rounded-xl rounded-bl-sm bg-earth-bg px-3 py-2 text-sm text-earth-text"
                  }
                >
                  <span className="sr-only">
                    {turn.role === "user" ? "You said: " : "Navigator replied: "}
                  </span>
                  {turn.text}
                </div>

                {turn.resources && turn.resources.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {turn.resources.map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/resources?category=${r.category}`}
                          className="block rounded-lg border border-earth-border p-3 transition-colors hover:bg-earth-bg"
                        >
                          <p className="text-sm font-semibold text-sawnee-700">
                            {r.name}
                          </p>
                          <p className="mt-1 flex items-start gap-1.5 text-xs text-earth-muted">
                            <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                            {r.address}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {turn.events && turn.events.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {turn.events.map((e) => (
                      <li key={e.id}>
                        <Link
                          href="/events"
                          className="block rounded-lg border border-lanier-100 bg-lanier-50 p-3 transition-colors hover:bg-lanier-100"
                        >
                          <p className="text-sm font-semibold text-lanier-700">
                            {e.title}
                          </p>
                          <p className="mt-1 flex items-start gap-1.5 text-xs text-lanier-700">
                            <CalendarDays className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                            {formatEventDateTime(e.startDateTime)}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {thinking && (
              <p className="text-sm text-earth-muted" role="status">
                Searching Forsyth County resources…
              </p>
            )}

            {turns.length === 1 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-earth-muted">Try asking:</p>
                <ul className="mt-2 space-y-1.5">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <li key={p}>
                      <button
                        type="button"
                        onClick={() => submit(p)}
                        className="w-full rounded-lg border border-earth-border px-3 py-2 text-left text-xs text-earth-text transition-colors hover:bg-earth-bg"
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div ref={logEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-center gap-2 border-t border-earth-border p-3"
          >
            <label htmlFor="forsyth-ai-input" className="sr-only">
              Ask the Forsyth AI Navigator a question
            </label>
            <input
              ref={inputRef}
              id="forsyth-ai-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about resources or events…"
              className="min-w-0 flex-1 rounded-lg border border-earth-border px-3 py-2.5 text-sm"
            />
            <VoiceSearchButton onResult={(t) => submit(t)} compact />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="rounded-lg bg-sawnee-700 p-2.5 text-white transition-colors hover:bg-sawnee-900 disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Send question</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
