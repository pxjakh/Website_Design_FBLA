"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, Globe, Clock, BadgeCheck } from "lucide-react";
import clsx from "clsx";
import type { ResourceItem } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { isOpenNow, formatHoursSummary, formatVerifiedDate } from "@/lib/utils";

export default function ResourceCard({ resource }: { resource: ResourceItem }) {
  // Open/closed depends on the viewer's clock and timezone, so it can only be
  // resolved after mount — computing it during SSR would hydrate mismatched.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = mounted ? isOpenNow(resource.hours) : null;
  const statusLabel = !mounted
    ? "Checking hours…"
    : open === null
      ? "By appointment"
      : open
        ? "Open now"
        : "Closed now";

  return (
    <article
      aria-labelledby={`resource-${resource.id}-title`}
      className="flex h-full flex-col rounded-xl border border-earth-border bg-earth-surface p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="rounded-full bg-lanier-50 px-2.5 py-1 text-xs font-medium text-lanier-700">
          {CATEGORY_LABELS[resource.category]}
        </span>
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            open === null && "bg-earth-bg text-earth-muted",
            open === true && "bg-success-50 text-success-600",
            open === false && "bg-error-50 text-error-600"
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "h-2 w-2 rounded-full",
              open === null && "bg-earth-muted",
              open === true && "bg-success-600",
              open === false && "bg-error-600"
            )}
          />
          {statusLabel}
        </span>
      </div>

      <h3
        id={`resource-${resource.id}-title`}
        className="mt-3 text-lg font-semibold leading-snug text-sawnee-700"
      >
        {resource.name}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-earth-text">
        {resource.description}
      </p>

      <dl className="mt-4 space-y-1.5 text-sm text-earth-muted">
        <div className="flex items-start gap-2">
          <dt className="sr-only">Address</dt>
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <dd>{resource.address}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="sr-only">Hours</dt>
          <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <dd>{mounted ? formatHoursSummary(resource.hours) : " "}</dd>
        </div>
      </dl>

      {resource.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {resource.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-earth-bg px-2 py-0.5 text-xs text-earth-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              resource.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-sawnee-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sawnee-900"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Directions
            <span className="sr-only"> to {resource.name}</span>
          </a>
          {resource.phone && (
            <a
              href={`tel:${resource.phone.replace(/[^\d]/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-earth-border px-3 py-2 text-sm font-medium text-sawnee-700 transition-colors hover:bg-earth-bg"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call
              <span className="sr-only"> {resource.name}</span>
            </a>
          )}
          {resource.website && (
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-earth-border px-3 py-2 text-sm font-medium text-sawnee-700 transition-colors hover:bg-earth-bg"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              Website
              <span className="sr-only"> for {resource.name}</span>
            </a>
          )}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-earth-muted">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Verified {formatVerifiedDate(resource.verifiedDate)}
        </p>
      </div>
    </article>
  );
}
