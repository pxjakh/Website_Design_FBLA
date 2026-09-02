"use client";

import { useState } from "react";
import { Languages, WrapText, List, Type } from "lucide-react";
import clsx from "clsx";
import {
  LANGUAGES,
  type ContentVariants,
  type LanguageCode,
} from "@/lib/ai/translations";
import ReadAloudButton from "./ReadAloudButton";

type ReadingMode = "standard" | "simple" | "bullets";

/**
 * Wraps a block of content with language selection, a plain-language
 * toggle, and read-aloud — the three controls that decide whether a
 * resident can actually use the information.
 */
export default function AccessibleContent({
  content,
  heading,
}: {
  content: ContentVariants;
  heading?: string;
}) {
  const [lang, setLang] = useState<LanguageCode>("en");
  const [mode, setMode] = useState<ReadingMode>("standard");

  // Plain-language and bullet variants are authored in English only, so
  // selecting another language returns to the standard translated text.
  const showingVariant = lang === "en" && mode !== "standard";
  const bodyText =
    showingVariant && mode === "simple" ? content.simple : content[lang];

  const spokenText =
    showingVariant && mode === "bullets"
      ? content.bullets.join(". ")
      : bodyText;

  return (
    <section className="rounded-xl border border-earth-border bg-earth-surface p-5">
      {heading && (
        <h2 className="mb-4 text-lg font-semibold text-sawnee-700">{heading}</h2>
      )}

      <div className="flex flex-wrap items-center gap-3 border-b border-earth-border pb-4">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-earth-muted" aria-hidden="true" />
          <label htmlFor="content-language" className="sr-only">
            Choose language
          </label>
          <select
            id="content-language"
            value={lang}
            onChange={(e) => setLang(e.target.value as LanguageCode)}
            className="rounded-lg border border-earth-border bg-earth-surface px-3 py-2 text-sm"
          >
            {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
              <option key={code} value={code}>
                {LANGUAGES[code].native}
              </option>
            ))}
          </select>
        </div>

        <div
          role="group"
          aria-label="Reading level"
          className="flex rounded-lg border border-earth-border p-1"
        >
          {(
            [
              { value: "standard", label: "Standard", Icon: Type },
              { value: "simple", label: "Simplify", Icon: WrapText },
              { value: "bullets", label: "Key points", Icon: List },
            ] as const
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              disabled={lang !== "en" && value !== "standard"}
              title={
                lang !== "en" && value !== "standard"
                  ? "Plain-language versions are available in English"
                  : undefined
              }
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40",
                mode === value
                  ? "bg-sawnee-50 text-sawnee-700"
                  : "text-earth-muted hover:bg-earth-bg"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <ReadAloudButton
          text={spokenText}
          label="Listen"
          className="ml-auto !py-1.5 !text-xs"
        />
      </div>

      <div
        className="mt-4"
        lang={lang}
        dir={LANGUAGES[lang].dir}
        aria-live="polite"
      >
        {showingVariant && mode === "bullets" ? (
          <ul className="list-inside list-disc space-y-2 leading-relaxed text-earth-text">
            {content.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        ) : (
          <p className="leading-relaxed text-earth-text">{bodyText}</p>
        )}
      </div>

      {lang !== "en" && (
        <p className="mt-3 text-xs text-earth-muted">
          Translation reviewed by a person. Always confirm eligibility and
          hours directly with the organization.
        </p>
      )}
    </section>
  );
}
