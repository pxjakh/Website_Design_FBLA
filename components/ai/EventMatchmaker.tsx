"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Download,
  MapPin,
  RotateCcw,
  Check,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { events } from "@/data/events";
import { resources } from "@/data/resources";
import { downloadICS } from "@/lib/ics";
import { formatEventDateTime } from "@/lib/utils";
import type { Audience, CommunityEvent, ResourceItem } from "@/lib/types";

type Goal = "volunteer" | "outdoors" | "wellness" | "networking";

const WHO: { value: Audience; label: string; hint: string }[] = [
  { value: "students", label: "High school student", hint: "Service hours, clubs, teen programs" },
  { value: "seniors", label: "Senior citizen", hint: "Wellness, social programs, meals" },
  { value: "families", label: "Parent or family", hint: "Youth sports, parks, family events" },
  { value: "entrepreneurs", label: "Small business owner", hint: "Networking, mentorship, workshops" },
];

const GOALS: { value: Goal; label: string; tags: string[]; audience?: Audience }[] = [
  { value: "volunteer", label: "Volunteer hours", tags: ["Volunteer"], audience: "volunteers" },
  { value: "outdoors", label: "Outdoor recreation", tags: ["Outdoors", "Youth Sports", "Community"] },
  { value: "wellness", label: "Health & wellness", tags: ["Health & Wellness"] },
  { value: "networking", label: "Local networking", tags: ["Business"], audience: "entrepreneurs" },
];

const ZIPS = ["30040", "30041", "30022", "30028", "Any zip"];

export default function EventMatchmaker() {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<Audience | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [zip, setZip] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const match = useMemo(() => {
    if (!who) return { events: [] as CommunityEvent[], resources: [] as ResourceItem[] };

    const goalDefs = GOALS.filter((g) => goals.includes(g.value));
    const goalTags = goalDefs.flatMap((g) => g.tags);
    const goalAudiences = goalDefs
      .map((g) => g.audience)
      .filter((a): a is Audience => Boolean(a));
    const wantedAudiences: Audience[] = [who, ...goalAudiences];

    const matchedEvents = events
      .filter((e) => {
        const audienceHit = wantedAudiences.some((a) => e.audience.includes(a));
        const tagHit = goalTags.length === 0 || goalTags.includes(e.tag);
        return audienceHit && tagHit;
      })
      .sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      );

    const matchedResources = resources
      .filter((r) => {
        const audienceHit = wantedAudiences.some((a) => r.audience.includes(a));
        const zipHit = !zip || zip === "Any zip" || r.zip === zip;
        return audienceHit && zipHit;
      })
      .slice(0, 4);

    return { events: matchedEvents, resources: matchedResources };
  }, [who, goals, zip]);

  function reset() {
    setStep(0);
    setWho(null);
    setGoals([]);
    setZip(null);
    setDone(false);
  }

  const canAdvance = step === 0 ? who !== null : step === 1 ? goals.length > 0 : zip !== null;

  if (done) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-sawnee-500 bg-sawnee-50 p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-sawnee-700">
            <Check className="h-5 w-5" aria-hidden="true" />
            Your personalized plan
          </h2>
          <p className="mt-2 text-sm text-earth-text">
            {match.events.length} matching {match.events.length === 1 ? "event" : "events"} and{" "}
            {match.resources.length} {match.resources.length === 1 ? "resource" : "resources"} for a{" "}
            {WHO.find((w) => w.value === who)?.label.toLowerCase()}
            {zip && zip !== "Any zip" ? ` in ${zip}` : ""}.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadICS(match.events)}
              disabled={match.events.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-sawnee-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sawnee-900 disabled:opacity-40"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download calendar (.ics)
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-earth-border px-4 py-2.5 text-sm font-medium text-sawnee-700 transition-colors hover:bg-earth-surface"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Start over
            </button>
          </div>
        </div>

        {match.events.length > 0 && (
          <section aria-labelledby="plan-events">
            <h3 id="plan-events" className="text-lg font-semibold text-sawnee-700">
              Events for you
            </h3>
            <ul className="mt-4 space-y-3">
              {match.events.map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-earth-border bg-earth-surface p-4"
                >
                  <span className="rounded-full bg-lanier-50 px-2.5 py-1 text-xs font-medium text-lanier-700">
                    {e.tag}
                  </span>
                  <h4 className="mt-2 font-semibold text-sawnee-700">{e.title}</h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-earth-muted">
                    <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {formatEventDateTime(e.startDateTime)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-earth-muted">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {e.venue}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {match.resources.length > 0 && (
          <section aria-labelledby="plan-resources">
            <h3 id="plan-resources" className="text-lg font-semibold text-sawnee-700">
              Places to know about
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {match.resources.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/resources?category=${r.category}`}
                    className="block h-full rounded-xl border border-earth-border bg-earth-surface p-4 transition-shadow hover:shadow-md"
                  >
                    <p className="font-semibold text-sawnee-700">{r.name}</p>
                    <p className="mt-1 text-sm text-earth-muted">{r.address}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {match.events.length === 0 && match.resources.length === 0 && (
          <p className="rounded-xl border border-dashed border-earth-border p-8 text-center text-earth-muted">
            No matches for that combination yet. Try a different goal or widen the
            zip code.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-earth-border bg-earth-surface p-6">
      <div className="flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              "h-1.5 flex-1 rounded-full",
              i <= step ? "bg-sawnee-700" : "bg-earth-border"
            )}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-earth-muted" aria-live="polite">
        Step {step + 1} of 3
      </p>

      <fieldset className="mt-5">
        <legend className="text-xl font-semibold text-sawnee-700">
          {step === 0
            ? "Who are you?"
            : step === 1
              ? "What are your goals?"
              : "Where are you located?"}
        </legend>
        <p className="mt-1 text-sm text-earth-muted">
          {step === 1
            ? "Pick one or more."
            : step === 2
              ? "We'll prioritize resources near you."
              : "This tailors everything that follows."}
        </p>

        <div className="mt-4 space-y-2">
          {step === 0 &&
            WHO.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setWho(o.value)}
                aria-pressed={who === o.value}
                className={clsx(
                  "block w-full rounded-lg border p-4 text-left transition-colors",
                  who === o.value
                    ? "border-sawnee-700 bg-sawnee-50"
                    : "border-earth-border hover:bg-earth-bg"
                )}
              >
                <span className="font-medium text-sawnee-700">{o.label}</span>
                <span className="mt-0.5 block text-sm text-earth-muted">{o.hint}</span>
              </button>
            ))}

          {step === 1 &&
            GOALS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() =>
                  setGoals((g) =>
                    g.includes(o.value)
                      ? g.filter((x) => x !== o.value)
                      : [...g, o.value]
                  )
                }
                aria-pressed={goals.includes(o.value)}
                className={clsx(
                  "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors",
                  goals.includes(o.value)
                    ? "border-sawnee-700 bg-sawnee-50"
                    : "border-earth-border hover:bg-earth-bg"
                )}
              >
                <span className="font-medium text-sawnee-700">{o.label}</span>
                {goals.includes(o.value) && (
                  <Check className="h-5 w-5 text-sawnee-700" aria-hidden="true" />
                )}
              </button>
            ))}

          {step === 2 &&
            ZIPS.map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZip(z)}
                aria-pressed={zip === z}
                className={clsx(
                  "block w-full rounded-lg border p-4 text-left font-medium transition-colors",
                  zip === z
                    ? "border-sawnee-700 bg-sawnee-50 text-sawnee-700"
                    : "border-earth-border text-sawnee-700 hover:bg-earth-bg"
                )}
              >
                {z}
              </button>
            ))}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-earth-border px-4 py-2.5 text-sm font-medium text-sawnee-700 transition-colors hover:bg-earth-bg disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        <button
          type="button"
          onClick={() => (step === 2 ? setDone(true) : setStep((s) => s + 1))}
          disabled={!canAdvance}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sawnee-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sawnee-900 disabled:opacity-40"
        >
          {step === 2 ? "Build my plan" : "Next"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
