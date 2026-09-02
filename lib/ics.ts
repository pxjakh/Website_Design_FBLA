import type { CommunityEvent } from "./types";

/**
 * Builds a real RFC 5545 .ics calendar file from selected events, entirely
 * client-side. No backend and no third-party calendar service involved.
 */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local wall-clock time, matching the floating times used in the event data. */
function toICSDate(iso: string): string {
  const d = new Date(iso);
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

/** Escapes the characters RFC 5545 reserves in TEXT values. */
function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Folds long lines to the 75-octet limit the spec requires. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    parts.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) parts.push(" " + rest);
  return parts.join("\r\n");
}

export function buildICS(events: CommunityEvent[]): string {
  const stamp = toICSDate(new Date().toISOString());

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Forsyth Connect//Community Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:My Forsyth County Schedule",
  ];

  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@forsyth-connect`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toICSDate(e.startDateTime)}`,
      `DTEND:${toICSDate(e.endDateTime)}`,
      fold(`SUMMARY:${escapeText(e.title)}`),
      fold(`DESCRIPTION:${escapeText(e.description)}`),
      fold(`LOCATION:${escapeText(`${e.venue}, ${e.address}`)}`),
      fold(`CATEGORIES:${escapeText(e.tag)}`),
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(events: CommunityEvent[], filename = "forsyth-schedule.ics") {
  const blob = new Blob([buildICS(events)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
