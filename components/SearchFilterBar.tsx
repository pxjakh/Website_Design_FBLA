"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import clsx from "clsx";
import {
  AUDIENCE_LABELS,
  CATEGORY_LABELS,
  type Audience,
  type ResourceCategory,
} from "@/lib/types";
import VoiceSearchButton from "./ai/VoiceSearchButton";

export interface Filters {
  query: string;
  categories: ResourceCategory[];
  audiences: Audience[];
  zips: string[];
}

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
  availableZips: string[];
  resultCount: number;
}

export default function SearchFilterBar({
  filters,
  onChange,
  availableZips,
  resultCount,
}: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  function toggleValue<T extends string>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  }

  const activeFilterCount =
    filters.categories.length + filters.audiences.length + filters.zips.length;

  return (
    <div ref={containerRef} className="space-y-3">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex items-start gap-2"
      >
        <label htmlFor="resource-search" className="sr-only">
          Search resources by name, description, or tag
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-earth-muted"
            aria-hidden="true"
          />
          <input
            id="resource-search"
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search parks, libraries, food pantries…"
            className="w-full rounded-lg border border-earth-border bg-earth-surface py-3 pl-11 pr-4 text-base placeholder:text-earth-muted"
          />
        </div>
        <VoiceSearchButton
          onResult={(transcript) => onChange({ ...filters, query: transcript })}
        />
      </form>

      {/* `relative` here is what the filter panels resolve against on
          phones, where they span this row instead of hanging off a chip. */}
      <div className="relative flex flex-wrap items-center gap-2">
        <FilterDropdown
          id="category"
          label="Category"
          selectedCount={filters.categories.length}
          isOpen={openMenu === "category"}
          onToggle={() =>
            setOpenMenu(openMenu === "category" ? null : "category")
          }
        >
          {(Object.keys(CATEGORY_LABELS) as ResourceCategory[]).map((cat) => (
            <CheckboxRow
              key={cat}
              label={CATEGORY_LABELS[cat]}
              checked={filters.categories.includes(cat)}
              onChange={() =>
                onChange({
                  ...filters,
                  categories: toggleValue(filters.categories, cat),
                })
              }
            />
          ))}
        </FilterDropdown>

        <FilterDropdown
          id="audience"
          label="Audience"
          selectedCount={filters.audiences.length}
          isOpen={openMenu === "audience"}
          onToggle={() =>
            setOpenMenu(openMenu === "audience" ? null : "audience")
          }
        >
          {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((aud) => (
            <CheckboxRow
              key={aud}
              label={AUDIENCE_LABELS[aud]}
              checked={filters.audiences.includes(aud)}
              onChange={() =>
                onChange({
                  ...filters,
                  audiences: toggleValue(filters.audiences, aud),
                })
              }
            />
          ))}
        </FilterDropdown>

        <FilterDropdown
          id="zip"
          label="Zip Code"
          selectedCount={filters.zips.length}
          isOpen={openMenu === "zip"}
          onToggle={() => setOpenMenu(openMenu === "zip" ? null : "zip")}
        >
          {availableZips.map((zip) => (
            <CheckboxRow
              key={zip}
              label={zip}
              checked={filters.zips.includes(zip)}
              onChange={() =>
                onChange({ ...filters, zips: toggleValue(filters.zips, zip) })
              }
            />
          ))}
        </FilterDropdown>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() =>
              onChange({ query: filters.query, categories: [], audiences: [], zips: [] })
            }
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-lanier-500 hover:bg-lanier-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      <p aria-live="polite" className="text-sm text-earth-muted">
        {resultCount} {resultCount === 1 ? "resource" : "resources"} found
      </p>
    </div>
  );
}

function FilterDropdown({
  id,
  label,
  selectedCount,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  selectedCount: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    // Not positioned on phones, so the panel below anchors to the filter
    // row and cannot run off the right edge of a narrow screen.
    <div className="sm:relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-filter-panel`}
        className={clsx(
          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
          selectedCount > 0
            ? "border-sawnee-500 bg-sawnee-50 text-sawnee-700"
            : "border-earth-border bg-earth-surface text-earth-text hover:bg-earth-bg"
        )}
      >
        {label}
        {selectedCount > 0 && (
          <span className="rounded-full bg-sawnee-700 px-1.5 text-xs text-white">
            {selectedCount}
          </span>
        )}
        <ChevronDown
          className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={`${id}-filter-panel`}
          className="absolute inset-x-0 top-full z-30 mt-2 rounded-lg border border-earth-border bg-earth-surface p-2 shadow-lg sm:inset-x-auto sm:left-0 sm:min-w-56"
        >
          <fieldset>
            <legend className="sr-only">Filter by {label}</legend>
            {children}
          </fieldset>
        </div>
      )}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-earth-bg">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-sawnee-700"
      />
      {label}
    </label>
  );
}
