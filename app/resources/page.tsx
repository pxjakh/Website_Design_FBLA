import ResourceDirectory from "@/components/ResourceDirectory";
import type { Audience, ResourceCategory } from "@/lib/types";
import { CATEGORY_LABELS, AUDIENCE_LABELS } from "@/lib/types";

export const metadata = {
  title: "Resource Directory",
  description:
    "Search and filter every community resource in Forsyth County by category, audience, and zip code.",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; audience?: string }>;
}) {
  const params = await searchParams;
  const category =
    params.category && params.category in CATEGORY_LABELS
      ? (params.category as ResourceCategory)
      : undefined;
  const audience =
    params.audience && params.audience in AUDIENCE_LABELS
      ? (params.audience as Audience)
      : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-sawnee-700 sm:text-4xl">
        Resource Directory
      </h1>
      <p className="mt-3 max-w-2xl text-earth-muted">
        Every program, service, and facility we track in Forsyth County. Filter
        by what you need, who it&apos;s for, and where you are.
      </p>

      <div className="mt-10">
        <ResourceDirectory
          initialCategory={category}
          initialAudience={audience}
        />
      </div>
    </div>
  );
}
