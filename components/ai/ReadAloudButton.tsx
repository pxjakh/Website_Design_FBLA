"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";
import clsx from "clsx";

/**
 * Text-to-speech via the browser's SpeechSynthesis API, for residents who
 * are blind, low-vision, or who simply find listening easier than reading.
 * Renders nothing when the API is unavailable.
 */
export default function ReadAloudButton({
  text,
  label = "Listen to this page",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function toggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    // Cancel anything already queued so two players can't overlap.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.lang = "en-US";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      className={clsx(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
        speaking
          ? "border-sawnee-700 bg-sawnee-50 text-sawnee-700"
          : "border-earth-border text-sawnee-700 hover:bg-earth-bg",
        className
      )}
    >
      {speaking ? (
        <Square className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Volume2 className="h-4 w-4" aria-hidden="true" />
      )}
      {speaking ? "Stop" : label}
    </button>
  );
}
