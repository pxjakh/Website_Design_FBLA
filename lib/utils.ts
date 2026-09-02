import type { OperatingHoursBlock, ResourceItem } from "./types";

const DAY_ORDER: OperatingHoursBlock["day"][] = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export function isOpenNow(
  hours: ResourceItem["hours"],
  now: Date = new Date()
): boolean | null {
  if (hours === "always-open") return true;
  if (hours === "by-appointment") return null;

  const today = DAY_ORDER[now.getDay()];
  const block = hours.find((h) => h.day === today);
  if (!block) return false;

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = block.open.split(":").map(Number);
  const [closeH, closeM] = block.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return minutesNow >= openMinutes && minutesNow < closeMinutes;
}

export function formatHoursSummary(hours: ResourceItem["hours"]): string {
  if (hours === "always-open") return "Open 24 hours";
  if (hours === "by-appointment") return "By appointment";
  if (hours.length === 0) return "Hours not listed";

  const today = DAY_ORDER[new Date().getDay()];
  const block = hours.find((h) => h.day === today);
  if (!block) return "Closed today";

  return `Today ${formatTime(block.open)} – ${formatTime(block.close)}`;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, "0")}${period}`;
}

export function fuzzyMatch(haystack: string, needle: string): boolean {
  if (!needle.trim()) return true;
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

// Date-only ISO strings parse as UTC, which shifts back a day in US timezones —
// format from the string parts instead so server and client always agree.
export function formatVerifiedDate(isoDate: string): string {
  const [year, month] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatEventDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
