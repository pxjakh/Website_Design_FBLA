import Link from "next/link";
import {
  Trees,
  Users,
  HeartHandshake,
  Briefcase,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import DotBorderCard from "@/components/ui/DotBorderCard";
import { events } from "@/data/events";
import { resources } from "@/data/resources";
import { formatEventDateTime } from "@/lib/utils";

const PILLARS = [
  {
    slug: "parks-recreation",
    label: "Parks & Recreation",
    description:
      "Lake Lanier access, Sawnee Mountain, greenway trails, and county athletic fields.",
    Icon: Trees,
  },
  {
    slug: "civic-youth",
    label: "Civic & Youth Engagement",
    description:
      "Library programs, Teen Advisory Boards, Scouting, and student volunteer hours.",
    Icon: Users,
  },
  {
    slug: "family-services",
    label: "Human & Family Services",
    description:
      "Food pantries, emergency assistance, senior services, and family support.",
    Icon: HeartHandshake,
  },
  {
    slug: "business-workforce",
    label: "Business & Workforce",
    description:
      "Chamber resources, FBLA and DECA partnerships, mentorship, and incubator space.",
    Icon: Briefcase,
  },
];

export default function Home() {
  const upcoming = [...events]
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
    )
    .slice(0, 3);

  return (
    <>
      <section className="bg-sawnee-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <p className="font-medium text-gold-400">Forsyth County, Georgia</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Every community resource in Forsyth County, in one place.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sawnee-50">
            Find parks and trails, library programs, food assistance, senior
            services, volunteer opportunities, and small business support —
            organized so you can get to what you need in a few clicks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-3 font-semibold text-sawnee-900 transition-colors hover:bg-gold-400"
            >
              Browse the directory
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-lg border border-sawnee-300 px-5 py-3 font-semibold text-white transition-colors hover:bg-sawnee-900"
            >
              See upcoming events
            </Link>
          </div>
          <p className="mt-8 text-sm text-sawnee-100">
            {resources.length} verified resources · {events.length} upcoming
            community events
          </p>
        </div>
      </section>

      <section
        aria-labelledby="pillars-heading"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      >
        <h2
          id="pillars-heading"
          className="text-2xl font-semibold text-sawnee-700 sm:text-3xl"
        >
          Start with what you need
        </h2>
        <p className="mt-2 max-w-2xl text-earth-muted">
          Four pillars cover the services Forsyth County residents look for most.
        </p>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ slug, label, description, Icon }) => (
            <li key={slug}>
              <DotBorderCard href={`/resources?category=${slug}`}>
                <Icon
                  className="h-8 w-8 text-sawnee-500 transition-colors group-hover:text-sawnee-700"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-lg font-semibold text-sawnee-700">
                  {label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-earth-muted">
                  {description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-lanier-500">
                  Explore
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </DotBorderCard>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="events-heading"
        className="border-y border-earth-border bg-earth-surface"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="events-heading"
                className="text-2xl font-semibold text-sawnee-700 sm:text-3xl"
              >
                Happening soon
              </h2>
              <p className="mt-2 text-earth-muted">
                Community events across the county this month.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-lanier-500 hover:underline"
            >
              View all events
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {upcoming.map((event) => (
              <li
                key={event.id}
                className="rounded-xl border border-earth-border bg-earth-bg p-5"
              >
                <span className="rounded-full bg-lanier-50 px-2.5 py-1 text-xs font-medium text-lanier-700">
                  {event.tag}
                </span>
                <h3 className="mt-3 text-base font-semibold text-sawnee-700">
                  {event.title}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-earth-muted">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {formatEventDateTime(event.startDateTime)}
                </p>
                <p className="mt-1 text-sm text-earth-muted">{event.venue}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
