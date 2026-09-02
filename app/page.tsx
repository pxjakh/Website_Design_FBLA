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
import { DotBorderLink } from "@/components/ui/DotBorderButton";
import FeaturedCarousel from "@/components/FeaturedCarousel";
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
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden bg-sawnee-900 text-white"
      >
        {/* Diagonal hatch, matching the card hover treatment */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #ffffff 0 1px, transparent 2px 6px)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-14 text-center sm:px-6 md:pt-20">
          <p className="font-medium text-gold-400">Forsyth County, Georgia</p>
          <h1
            id="hero-heading"
            className="mx-auto mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl"
          >
            Every community resource in Forsyth County, in one place.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-sawnee-50">
            Parks and trails, library programs, food assistance, senior
            services, volunteer shifts, and small business support — organized
            so you can get to what you need in a few clicks.
          </p>
        </div>

        {/* The carousel is the hero image: real events and volunteer
            opportunities rather than decorative stock photography. */}
        <div className="relative mt-2">
          <FeaturedCarousel />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 text-center sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-1">
            <DotBorderLink
              href="/resources"
              className="bg-gold-500 text-sawnee-900 hover:bg-gold-400"
            >
              Browse the directory
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </DotBorderLink>
            <DotBorderLink
              href="/planner"
              className="border border-sawnee-300 text-white hover:bg-sawnee-700"
            >
              Build my plan
            </DotBorderLink>
            <DotBorderLink
              href="/events"
              className="border border-sawnee-300 text-white hover:bg-sawnee-700"
            >
              See upcoming events
            </DotBorderLink>
          </div>
          <p className="mt-6 text-sm text-sawnee-100">
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
