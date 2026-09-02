"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin, LayoutGrid, List } from "lucide-react";
import clsx from "clsx";
import RsvpModal from "./RsvpModal";
import EmptyState from "./EmptyState";
import MonthCalendar from "./MonthCalendar";
import { events } from "@/data/events";
import { formatEventDateTime } from "@/lib/utils";
import { AUDIENCE_LABELS, type Audience, type CommunityEvent } from "@/lib/types";

export default function EventBrowser() {
  const [view, setView] = useState<"grid" | "list" | "calendar">("grid");
  const [audience, setAudience] = useState<Audience | "all">("all");
  const [selected, setSelected] = useState<CommunityEvent | null>(null);

  const filtered = useMemo(() => {
    const sorted = [...events].sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    );
    if (audience === "all") return sorted;
    return sorted.filter((e) => e.audience.includes(audience));
  }, [audience]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="audience-filter" className="text-sm font-medium">
            Show events for
          </label>
          <select
            id="audience-filter"
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience | "all")}
            className="rounded-lg border border-earth-border bg-earth-surface px-3 py-2 text-sm"
          >
            <option value="all">Everyone</option>
            {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((a) => (
              <option key={a} value={a}>
                {AUDIENCE_LABELS[a]}
              </option>
            ))}
          </select>
        </div>

        <div
          role="group"
          aria-label="Change event layout"
          className="flex rounded-lg border border-earth-border bg-earth-surface p-1"
        >
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
              view === "grid" ? "bg-sawnee-50 text-sawnee-700" : "text-earth-muted"
            )}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            Grid
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
              view === "list" ? "bg-sawnee-50 text-sawnee-700" : "text-earth-muted"
            )}
          >
            <List className="h-4 w-4" aria-hidden="true" />
            List
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            aria-pressed={view === "calendar"}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
              view === "calendar"
                ? "bg-sawnee-50 text-sawnee-700"
                : "text-earth-muted"
            )}
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Calendar
          </button>
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-earth-muted">
        {filtered.length} {filtered.length === 1 ? "event" : "events"} found
      </p>

      {view === "calendar" ? (
        <MonthCalendar events={filtered} onSelect={setSelected} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No events for that audience yet"
          message="Check back soon, or switch the filter to “Everyone” to see all upcoming community events."
        />
      ) : (
        <ul
          className={clsx(
            "grid gap-5",
            view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}
        >
          {filtered.map((event) => (
            <li key={event.id}>
              <article
                className={clsx(
                  "flex h-full rounded-xl border border-earth-border bg-earth-surface p-5",
                  view === "list"
                    ? "flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    : "flex-col"
                )}
              >
                <div className={view === "list" ? "sm:flex-1" : ""}>
                  <span className="rounded-full bg-lanier-50 px-2.5 py-1 text-xs font-medium text-lanier-700">
                    {event.tag}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold text-sawnee-700">
                    {event.title}
                  </h2>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-earth-muted">
                    <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {formatEventDateTime(event.startDateTime)}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-earth-muted">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {event.venue}
                  </p>
                  {view === "grid" && (
                    <p className="mt-3 text-sm leading-relaxed text-earth-text">
                      {event.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(event)}
                  className={clsx(
                    "rounded-lg bg-sawnee-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-sawnee-900",
                    view === "grid" ? "mt-5 self-start" : "shrink-0 self-start"
                  )}
                >
                  Details &amp; RSVP
                  <span className="sr-only"> for {event.title}</span>
                </button>
              </article>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <RsvpModal event={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
