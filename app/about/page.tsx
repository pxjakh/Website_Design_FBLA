import Link from "next/link";
import AccessibleContent from "@/components/ai/AccessibleContent";
import { SITE_INTRO, PILLAR_INTRO } from "@/lib/ai/translations";

export const metadata = {
  title: "About This Hub",
  description:
    "How Forsyth Connect is organized, how resources are verified, and how to suggest a change.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-sawnee-700 sm:text-4xl">
        About Forsyth Connect
      </h1>

      <p className="mt-4 text-sm text-earth-muted">
        Choose a language, switch to plain English, or listen to any section
        below.
      </p>

      <div className="mt-8 space-y-8 leading-relaxed">
        <AccessibleContent heading="Why this exists" content={SITE_INTRO} />

        <AccessibleContent
          heading="How resources are organized"
          content={PILLAR_INTRO}
        />

        <section>
          <h2 className="text-xl font-semibold text-sawnee-700">
            Content freshness
          </h2>
          <p className="mt-3 text-earth-text">
            Each resource card shows the month it was last verified. Hours,
            eligibility rules, and phone numbers change often — especially for
            volunteer-run pantries — so always confirm directly with an
            organization before making a trip.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-xl font-semibold text-sawnee-700">
            Suggest a resource or a correction
          </h2>
          <p className="mt-3 text-earth-text">
            Know a Forsyth County program that belongs here, or spotted outdated
            hours? Use the{" "}
            <Link href="/submit" className="font-medium text-lanier-500 underline">
              Submit a Resource
            </Link>{" "}
            form and we&apos;ll verify and add it.
          </p>
        </section>
      </div>
    </div>
  );
}
