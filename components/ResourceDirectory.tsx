"use client";

import { useMemo, useState } from "react";
import SearchFilterBar, { type Filters } from "./SearchFilterBar";
import ResourceCard from "./ResourceCard";
import EmptyState from "./EmptyState";
import { resources } from "@/data/resources";
import { fuzzyMatch } from "@/lib/utils";
import type { Audience, ResourceCategory } from "@/lib/types";

export default function ResourceDirectory({
  initialCategory,
  initialAudience,
}: {
  initialCategory?: ResourceCategory;
  initialAudience?: Audience;
}) {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    categories: initialCategory ? [initialCategory] : [],
    audiences: initialAudience ? [initialAudience] : [],
    zips: [],
  });

  const availableZips = useMemo(
    () => Array.from(new Set(resources.map((r) => r.zip))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const haystack = [r.name, r.description, ...r.tags, r.address].join(" ");
      if (!fuzzyMatch(haystack, filters.query)) return false;
      if (filters.categories.length && !filters.categories.includes(r.category))
        return false;
      if (
        filters.audiences.length &&
        !filters.audiences.some((a) => r.audience.includes(a))
      )
        return false;
      if (filters.zips.length && !filters.zips.includes(r.zip)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-8">
      <SearchFilterBar
        filters={filters}
        onChange={setFilters}
        availableZips={availableZips}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No resources match those filters"
          message="Try removing a filter or searching for a broader term, like “library” or “food”."
          action={
            <button
              type="button"
              onClick={() =>
                setFilters({ query: "", categories: [], audiences: [], zips: [] })
              }
              className="rounded-lg bg-sawnee-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-sawnee-900"
            >
              Reset all filters
            </button>
          }
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
