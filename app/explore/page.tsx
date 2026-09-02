"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[70vh] min-h-96 w-full animate-pulse rounded-xl bg-earth-border"
      aria-label="Loading map"
    />
  ),
});

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-sawnee-700 sm:text-4xl">
        Explore Forsyth County
      </h1>
      <p className="mt-3 max-w-2xl text-earth-muted">
        Every resource in the directory, plotted across the county. Select a
        marker for the address and category.
      </p>

      <div className="mt-8">
        <MapView />
      </div>

      <p className="mt-4 text-sm text-earth-muted">
        Prefer a text list? The{" "}
        <Link href="/resources" className="font-medium text-lanier-500 underline">
          Resource Directory
        </Link>{" "}
        has the same resources with full details, search, and filters.
      </p>
    </div>
  );
}
