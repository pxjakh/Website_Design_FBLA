"use client";

import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { events } from "@/data/events";
import { resources } from "@/data/resources";
import { formatEventDateTime } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/types";

/**
 * Featured strip on the home page: upcoming events first, then a few
 * volunteer-friendly places, built from the same data the directory uses so
 * the two can never drift apart.
 */
function buildSlides(): CoverflowSlide[] {
  const eventSlides: CoverflowSlide[] = [...events]
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
    )
    .slice(0, 6)
    .map((e) => ({
      id: `event-${e.id}`,
      tag: e.tag,
      title: e.title,
      subtitle: e.description,
      meta: [
        { label: "When", value: formatEventDateTime(e.startDateTime) },
        { label: "Where", value: e.venue },
        {
          label: "Sign-up",
          value: e.registrationLink ? "Registration open" : "Just show up",
        },
      ],
      href: "/events",
      actionLabel: "See event",
    }));

  const volunteerSlides: CoverflowSlide[] = resources
    .filter((r) => r.audience.includes("volunteers"))
    .slice(0, 4)
    .map((r) => ({
      id: `resource-${r.id}`,
      tag: "Volunteer",
      title: r.name,
      subtitle: r.description,
      meta: [
        { label: "Category", value: CATEGORY_LABELS[r.category] },
        { label: "Area", value: r.zip },
        { label: "Verified", value: r.verifiedDate.slice(0, 7) },
      ],
      href: `/resources?category=${r.category}`,
      actionLabel: "View resource",
    }));

  return [...eventSlides, ...volunteerSlides];
}

export default function FeaturedCarousel() {
  const slides = buildSlides();

  return (
    <CoverflowCarousel
      slides={slides}
      label="Featured events and volunteer opportunities"
    />
  );
}
