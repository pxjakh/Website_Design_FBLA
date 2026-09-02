"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin } from "lucide-react";
import clsx from "clsx";
import type { CommunityEvent } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Local Y-M-D key. Avoids toISOString(), which shifts across the UTC line. */
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Six weeks from the Sunday on or before the 1st — a stable 42-cell grid, so
 *  the calendar never changes height as the user pages through months. */
function buildGrid(month: Date): Date[] {
  const first = startOfMonth(month);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function MonthCalendar({
  events,
  onSelect,
}: {
  events: CommunityEvent[];
  onSelect: (event: CommunityEvent) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(() => {
    // Open on the month holding the next event, not an empty current month.
    const upcoming = [...events].sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
    )[0];
    return startOfMonth(upcoming ? new Date(upcoming.startDateTime) : new Date());
  });

  /** Events bucketed by local day, so a lookup is O(1) per cell. */
  const byDay = useMemo(() => {
    const map = new Map<string, CommunityEvent[]>();
    for (const e of events) {
      const key = dayKey(new Date(e.startDateTime));
      const list = map.get(key);
      if (list) list.push(e);
      else map.set(key, [e]);
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() -
          new Date(b.startDateTime).getTime(),
      );
    }
    return map;
  }, [events]);

  const grid = useMemo(() => buildGrid(month), [month]);
  const monthLabel = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function shift(by: number) {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + by, 1));
  }

  /** Days in this month that actually have events — drives the phone agenda. */
  const agenda = useMemo(
    () =>
      grid
        .filter((d) => d.getMonth() === month.getMonth())
        .map((d) => ({ date: d, items: byDay.get(dayKey(d)) ?? [] }))
        .filter((row) => row.items.length > 0),
    [grid, month, byDay],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-sawnee-700" aria-live="polite">
          {monthLabel}
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="rounded-lg border border-earth-border p-2.5 text-sawnee-700 transition-colors hover:bg-earth-bg"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMonth(startOfMonth(today))}
            className="rounded-lg border border-earth-border px-4 py-2.5 text-sm font-medium text-sawnee-700 transition-colors hover:bg-earth-bg"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="rounded-lg border border-earth-border p-2.5 text-sawnee-700 transition-colors hover:bg-earth-bg"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Desktop and tablet: the month grid. A real table, so screen readers
          announce each event with its weekday and date. */}
      <table className="mt-5 hidden w-full table-fixed border-collapse sm:table">
        <caption className="sr-only">
          Community events for {monthLabel}, laid out by week.
        </caption>
        <thead>
          <tr>
            {WEEKDAYS.map((d, i) => (
              <th
                key={d}
                scope="col"
                className="border border-earth-border bg-sawnee-700 p-2 text-sm font-semibold text-white"
              >
                <abbr title={WEEKDAYS_FULL[i]} className="no-underline">
                  {d}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={week}>
              {grid.slice(week * 7, week * 7 + 7).map((date) => {
                const inMonth = date.getMonth() === month.getMonth();
                const isToday = dayKey(date) === dayKey(today);
                const items = byDay.get(dayKey(date)) ?? [];

                return (
                  <td
                    key={dayKey(date)}
                    className={clsx(
                      "h-28 border border-earth-border p-1.5 align-top",
                      inMonth ? "bg-earth-surface" : "bg-earth-bg",
                    )}
                  >
                    <span
                      className={clsx(
                        "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold",
                        isToday && "bg-gold-500 text-sawnee-900",
                        !isToday && inMonth && "text-earth-text",
                        !isToday && !inMonth && "italic text-earth-muted",
                      )}
                    >
                      {isToday && <span className="sr-only">Today, </span>}
                      {date.getDate()}
                    </span>

                    <ul className="mt-1 space-y-1">
                      {items.map((e) => (
                        <li key={e.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(e)}
                            className="w-full rounded border-l-2 border-lanier-500 bg-lanier-50 px-1.5 py-1 text-left text-xs leading-tight text-lanier-700 transition-colors hover:bg-lanier-100"
                          >
                            {e.title}
                            <span className="sr-only">
                              {" "}
                              on{" "}
                              {date.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                              . Open details.
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phones: an agenda instead of the grid. Seven columns at 375px would
          force horizontal scrolling, which the guidelines rate as a
          high-severity failure. */}
      <div className="mt-5 sm:hidden">
        {agenda.length === 0 ? (
          <p className="rounded-xl border border-dashed border-earth-border p-8 text-center text-sm text-earth-muted">
            No events scheduled in {monthLabel}.
          </p>
        ) : (
          <ol className="space-y-3">
            {agenda.map(({ date, items }) => {
              const isToday = dayKey(date) === dayKey(today);
              return (
                <li
                  key={dayKey(date)}
                  className="rounded-xl border border-earth-border bg-earth-surface p-4"
                >
                  <p
                    className={clsx(
                      "text-sm font-semibold",
                      isToday ? "text-gold-700" : "text-sawnee-700",
                    )}
                  >
                    {isToday && "Today · "}
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  <ul className="mt-3 space-y-2">
                    {items.map((e) => (
                      <li key={e.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(e)}
                          className="w-full rounded-lg border-l-4 border-lanier-500 bg-lanier-50 p-3 text-left transition-colors hover:bg-lanier-100"
                        >
                          <span className="block text-sm font-semibold text-lanier-700">
                            {e.title}
                          </span>
                          <span className="mt-1 flex items-center gap-1.5 text-xs text-earth-muted">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {new Date(e.startDateTime).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="mt-1 flex items-center gap-1.5 text-xs text-earth-muted">
                            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {e.venue}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <p className="mt-4 text-xs text-earth-muted">
        Select an event to see full details and RSVP.
      </p>
    </div>
  );
}
