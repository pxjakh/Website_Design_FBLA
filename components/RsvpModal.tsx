"use client";

import { useEffect, useRef } from "react";
import { X, MapPin, CalendarDays, ExternalLink } from "lucide-react";
import type { CommunityEvent } from "@/lib/types";
import { formatEventDateTime } from "@/lib/utils";

export default function RsvpModal({
  event,
  onClose,
}: {
  event: CommunityEvent;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
        className="w-full max-w-lg rounded-xl bg-earth-surface p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-lanier-50 px-2.5 py-1 text-xs font-medium text-lanier-700">
              {event.tag}
            </span>
            <h2
              id="rsvp-title"
              className="mt-3 text-xl font-semibold text-sawnee-700"
            >
              {event.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close event details"
            className="shrink-0 rounded-md p-3 text-earth-muted transition-colors hover:bg-earth-bg"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <dl className="mt-4 space-y-2 text-sm text-earth-muted">
          <div className="flex items-start gap-2">
            <dt className="sr-only">Date and time</dt>
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <dd>
              {formatEventDateTime(event.startDateTime)} –{" "}
              {new Date(event.endDateTime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">Location</dt>
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <dd>
              {event.venue}
              <br />
              {event.address}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-sm leading-relaxed text-earth-text">
          {event.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {event.registrationLink ? (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-sawnee-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-sawnee-900"
            >
              Register for this event
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <p className="rounded-lg bg-earth-bg px-4 py-2.5 text-sm text-earth-muted">
              No registration required — just show up.
            </p>
          )}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              event.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-earth-border px-4 py-2.5 text-sm font-medium text-sawnee-700 hover:bg-earth-bg"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}
