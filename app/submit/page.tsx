"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";
import { CATEGORY_LABELS, type ResourceCategory } from "@/lib/types";
import {
  moderateSubmission,
  type ModerationResult,
} from "@/lib/ai/moderation";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState<ModerationResult | null>(null);
  const [draft, setDraft] = useState({
    name: "",
    category: "parks-recreation",
    address: "",
    description: "",
    contactEmail: "",
  });

  function set<K extends keyof typeof draft>(key: K, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
    // Clear a stale verdict as soon as the submitter starts fixing things.
    if (review) setReview(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = moderateSubmission(draft);
    setReview(result);
    if (result.status !== "blocked") setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-sawnee-700 sm:text-4xl">
        Submit a Resource
      </h1>
      <p className="mt-3 text-earth-muted">
        Tell us about a Forsyth County program or service that belongs in the
        directory. Submissions are verified before they appear.
      </p>

      {submitted ? (
        <div
          role="status"
          className="mt-8 flex items-start gap-3 rounded-xl border border-success-600 bg-success-50 p-5"
        >
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-success-600"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-semibold text-success-600">Submission received</h2>
            <p className="mt-1 text-sm text-earth-text">
              Thanks — we&apos;ll verify the details and add this resource to the
              directory. This is a demonstration form, so nothing was actually
              sent.
            </p>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {review && review.status === "blocked" && (
            <div
              role="alert"
              className="rounded-xl border border-error-600 bg-error-50 p-5"
            >
              <h2 className="flex items-center gap-2 font-semibold text-error-600">
                <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                Automated review found problems
              </h2>
              <p className="mt-1 text-sm text-earth-text">
                Fix these before submitting. This check runs in your browser —
                nothing was sent anywhere.
              </p>
              <ul className="mt-3 space-y-2">
                {review.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {f.level === "error" ? (
                      <XCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-error-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0 text-warning-600"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-earth-text">{f.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="flex items-start gap-2 rounded-lg bg-earth-surface p-3 text-xs text-earth-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Submissions are screened automatically for spam, inappropriate
            language, and missing details before a human reviewer sees them.
          </p>

          <Field id="org-name" label="Organization or program name" required>
            <input
              id="org-name"
              name="org-name"
              type="text"
              required
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded-lg border border-earth-border bg-earth-surface px-3 py-2.5"
            />
          </Field>

          <Field id="org-category" label="Category" required>
            <select
              id="org-category"
              name="org-category"
              required
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-lg border border-earth-border bg-earth-surface px-3 py-2.5"
            >
              {(Object.keys(CATEGORY_LABELS) as ResourceCategory[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>

          <Field id="org-address" label="Address" required>
            <input
              id="org-address"
              name="org-address"
              type="text"
              required
              value={draft.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="123 Main St, Cumming, GA 30040"
              className="w-full rounded-lg border border-earth-border bg-earth-surface px-3 py-2.5"
            />
          </Field>

          <Field
            id="org-description"
            label="What does it offer?"
            hint="A sentence or two on who it serves and what's available."
            required
          >
            <textarea
              id="org-description"
              name="org-description"
              rows={4}
              required
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              aria-describedby="org-description-hint"
              className="w-full rounded-lg border border-earth-border bg-earth-surface px-3 py-2.5"
            />
          </Field>

          <Field id="contact-email" label="Your email" hint="So we can follow up if we need to verify details.">
            <input
              id="contact-email"
              name="contact-email"
              type="email"
              value={draft.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              aria-describedby="contact-email-hint"
              className="w-full rounded-lg border border-earth-border bg-earth-surface px-3 py-2.5"
            />
          </Field>

          <button
            type="submit"
            className="rounded-lg bg-sawnee-700 px-5 py-3 font-semibold text-white hover:bg-sawnee-900"
          >
            Submit for review
          </button>
        </form>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required && (
          <span className="text-error-600" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-earth-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
}
