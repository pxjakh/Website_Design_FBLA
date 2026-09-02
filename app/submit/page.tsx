"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CATEGORY_LABELS, type ResourceCategory } from "@/lib/types";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

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
        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <Field id="org-name" label="Organization or program name" required>
            <input
              id="org-name"
              name="org-name"
              type="text"
              required
              className="w-full rounded-lg border border-earth-border bg-earth-surface px-3 py-2.5"
            />
          </Field>

          <Field id="org-category" label="Category" required>
            <select
              id="org-category"
              name="org-category"
              required
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
              aria-describedby="org-description-hint"
              className="w-full rounded-lg border border-earth-border bg-earth-surface px-3 py-2.5"
            />
          </Field>

          <Field id="contact-email" label="Your email" hint="So we can follow up if we need to verify details.">
            <input
              id="contact-email"
              name="contact-email"
              type="email"
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
