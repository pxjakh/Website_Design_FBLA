"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import clsx from "clsx";

/**
 * Speech-to-text using the browser's native Web Speech API.
 *
 * Support is uneven (Chrome/Edge/Safari yes, Firefox no), so the button
 * hides itself entirely when the API is unavailable rather than offering a
 * control that cannot work. Typing always remains the primary path.
 */

// Minimal shape of the vendor-prefixed API; it is not in lib.dom.d.ts.
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function VoiceSearchButton({
  onResult,
  compact = false,
}: {
  onResult: (transcript: string) => void;
  compact?: boolean;
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return () => recognitionRef.current?.stop();
  }, []);

  function toggle() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setError(null);
      onResult(transcript);
    };
    recognition.onerror = (e) => {
      setError(
        e.error === "not-allowed"
          ? "Microphone access was blocked. You can still type your question."
          : "Didn't catch that — try again or type instead."
      );
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    setError(null);
    setListening(true);
    recognition.start();
  }

  // No API means no button; typing is unaffected.
  if (!supported) return null;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={listening}
        aria-label={listening ? "Stop voice search" : "Search by voice"}
        className={clsx(
          "shrink-0 rounded-lg border transition-colors",
          compact ? "p-2.5" : "p-3",
          listening
            ? "border-error-600 bg-error-50 text-error-600"
            : "border-earth-border text-sawnee-700 hover:bg-earth-bg"
        )}
      >
        {listening ? (
          <MicOff className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
        ) : (
          <Mic className={compact ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
        )}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {listening ? "Listening" : error ?? ""}
      </span>

      {error && !compact && (
        <p className="mt-2 w-full text-sm text-error-600">{error}</p>
      )}
    </>
  );
}
