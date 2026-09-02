import { resources } from "@/data/resources";
import { events } from "@/data/events";
import type { Audience, CommunityEvent, ResourceItem } from "@/lib/types";
import { isOpenNow } from "@/lib/utils";

/**
 * Local intent matcher for the Forsyth AI Navigator.
 *
 * This is deliberately a deterministic, offline scorer rather than a model
 * call. It is the fallback layer: when the hosted LLM endpoint is added it
 * runs first, and this takes over whenever that endpoint is slow, offline,
 * or low-confidence — so the assistant never dead-ends the user.
 */

export interface NavigatorAnswer {
  reply: string;
  resources: ResourceItem[];
  events: CommunityEvent[];
  confidence: "high" | "low";
}

/** Terms that map a natural phrase onto a structured facet. */
const AUDIENCE_TERMS: Record<Audience, string[]> = {
  students: ["student", "students", "teen", "teenager", "high school", "grader", "9th", "10th", "11th", "12th", "youth", "kid", "fbla", "deca"],
  families: ["family", "families", "parent", "parents", "child", "children", "kids", "toddler"],
  seniors: ["senior", "seniors", "elderly", "older adult", "retire", "retired", "55+"],
  entrepreneurs: ["business", "entrepreneur", "startup", "small business", "owner", "networking"],
  volunteers: ["volunteer", "volunteering", "service hours", "community service", "give back"],
};

const TOPIC_TERMS: Record<string, string[]> = {
  food: ["food", "pantry", "hungry", "meal", "meals", "groceries", "food assistance", "eat"],
  emergency: ["emergency", "crisis", "assistance", "help", "rent", "financial", "utility"],
  parks: ["park", "parks", "trail", "trails", "hike", "hiking", "outdoors", "playground", "splash pad", "lake", "swim", "boat", "greenway", "bike", "cycling"],
  library: ["library", "libraries", "book", "books", "study", "homework", "tutoring", "read"],
  wellness: ["health", "wellness", "fitness", "exercise", "balance", "medical", "clinic"],
  sports: ["sport", "sports", "soccer", "baseball", "softball", "team", "league", "field"],
  business: ["chamber", "networking", "mentor", "mentorship", "incubator", "loan", "financing", "workshop"],
  scouts: ["scout", "scouts", "eagle", "troop", "pack"],
};

const ZIP_PATTERN = /\b3\d{4}\b/;

const DAY_WORDS: Record<string, number[]> = {
  today: [new Date().getDay()],
  tonight: [new Date().getDay()],
  weekend: [0, 6],
  saturday: [6],
  sunday: [0],
};

function normalize(q: string): string {
  return q.toLowerCase().replace(/[^\w\s+]/g, " ").replace(/\s+/g, " ").trim();
}

function countHits(haystack: string, terms: string[]): number {
  return terms.reduce((n, t) => (haystack.includes(t) ? n + 1 : n), 0);
}

/** Score a resource against the parsed query. */
function scoreResource(
  r: ResourceItem,
  q: string,
  audiences: Audience[],
  topics: string[],
  zip: string | null
): number {
  let score = 0;
  const text = [r.name, r.description, r.tags.join(" "), r.address, r.category]
    .join(" ")
    .toLowerCase();

  // Direct word overlap with the query carries the most weight.
  for (const word of q.split(" ")) {
    if (word.length > 3 && text.includes(word)) score += 3;
  }

  for (const topic of topics) {
    if (countHits(text, TOPIC_TERMS[topic]) > 0) score += 6;
  }

  for (const a of audiences) {
    if (r.audience.includes(a)) score += 5;
  }

  if (zip && r.zip === zip) score += 8;

  // Only break ties among already-relevant results. Applying this to a
  // zero-score resource would surface anything merely open as a "match".
  if (score > 0 && isOpenNow(r.hours) === true) score += 2;

  return score;
}

function scoreEvent(
  e: CommunityEvent,
  q: string,
  audiences: Audience[],
  topics: string[],
  days: number[] | null
): number {
  let score = 0;
  const text = [e.title, e.description, e.tag, e.venue, e.address].join(" ").toLowerCase();

  for (const word of q.split(" ")) {
    if (word.length > 3 && text.includes(word)) score += 3;
  }
  for (const topic of topics) {
    if (countHits(text, TOPIC_TERMS[topic]) > 0) score += 6;
  }
  for (const a of audiences) {
    if (e.audience.includes(a)) score += 5;
  }
  if (days) {
    const eventDay = new Date(e.startDateTime).getDay();
    if (days.includes(eventDay)) score += 7;
  }
  return score;
}

export function askNavigator(rawQuery: string): NavigatorAnswer {
  const q = normalize(rawQuery);

  if (!q) {
    return {
      reply:
        "Ask me something like “Where can a 10th grader volunteer this weekend?” or “I need food assistance near Post Road.”",
      resources: [],
      events: [],
      confidence: "low",
    };
  }

  const audiences = (Object.keys(AUDIENCE_TERMS) as Audience[]).filter(
    (a) => countHits(q, AUDIENCE_TERMS[a]) > 0
  );
  const topics = Object.keys(TOPIC_TERMS).filter(
    (t) => countHits(q, TOPIC_TERMS[t]) > 0
  );
  const zip = q.match(ZIP_PATTERN)?.[0] ?? null;
  const dayKey = Object.keys(DAY_WORDS).find((d) => q.includes(d));
  const days = dayKey ? DAY_WORDS[dayKey] : null;

  const wantsEvents =
    topics.includes("wellness") ||
    days !== null ||
    /event|happening|class|workshop|volunteer|rsvp|calendar/.test(q);

  const scoredResources = resources
    .map((r) => ({ item: r, score: scoreResource(r, q, audiences, topics, zip) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const scoredEvents = events
    .map((e) => ({ item: e, score: scoreEvent(e, q, audiences, topics, days) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const topResources = scoredResources.slice(0, 3).map((x) => x.item);
  const topEvents = scoredEvents.slice(0, wantsEvents ? 3 : 1).map((x) => x.item);

  if (topResources.length === 0 && topEvents.length === 0) {
    return {
      reply:
        "I couldn't find a match for that. Try naming a need (food, parks, volunteering, senior wellness, small business) or a place like Cumming or Post Road. You can also browse the full directory.",
      resources: [],
      events: [],
      confidence: "low",
    };
  }

  return {
    reply: buildReply({ audiences, topics, zip, dayKey, topResources, topEvents }),
    resources: topResources,
    events: topEvents,
    confidence: scoredResources[0]?.score >= 8 || scoredEvents[0]?.score >= 8 ? "high" : "low",
  };
}

function buildReply({
  audiences,
  topics,
  zip,
  dayKey,
  topResources,
  topEvents,
}: {
  audiences: Audience[];
  topics: string[];
  zip: string | null;
  dayKey: string | undefined;
  topResources: ResourceItem[];
  topEvents: CommunityEvent[];
}): string {
  const parts: string[] = [];

  const who = audiences.includes("students")
    ? "for students"
    : audiences.includes("seniors")
      ? "for seniors"
      : audiences.includes("families")
        ? "for families"
        : audiences.includes("entrepreneurs")
          ? "for local business owners"
          : "";

  const what = topics.includes("food")
    ? "food assistance"
    : topics.includes("parks")
      ? "parks and outdoor recreation"
      : topics.includes("wellness")
        ? "health and wellness"
        : topics.includes("business")
          ? "business support"
          : topics.includes("library")
            ? "library services"
            : "community resources";

  parts.push(
    `Here's what I found${who ? ` ${who}` : ""} for ${what}${zip ? ` in ${zip}` : ""}${dayKey ? ` ${dayKey === "today" || dayKey === "tonight" ? "today" : `this ${dayKey}`}` : ""}.`
  );

  if (topResources.length > 0) {
    const open = topResources.filter((r) => isOpenNow(r.hours) === true).length;
    if (open > 0) parts.push(`${open} of these ${open === 1 ? "is" : "are"} open right now.`);
  }
  if (topEvents.length > 0) {
    parts.push(
      `I also matched ${topEvents.length} upcoming ${topEvents.length === 1 ? "event" : "events"}.`
    );
  }

  return parts.join(" ");
}

/** Starter prompts shown before the user types anything. */
export const SUGGESTED_PROMPTS = [
  "Where can a 10th grader volunteer for FBLA hours?",
  "I need food assistance near Post Road",
  "Wellness classes for seniors in Cumming",
  "Free things to do outdoors this weekend",
];
