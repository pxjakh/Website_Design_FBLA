import Link from "next/link";

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

      <div className="mt-8 space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-sawnee-700">Why this exists</h2>
          <p className="mt-3 text-earth-text">
            Forsyth County residents have access to a wide range of parks,
            library programs, family services, and business support — but that
            information is spread across county department pages, nonprofit
            sites, and social media. Forsyth Connect pulls it into one directory
            organized around what people actually need, not around which agency
            happens to run it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-sawnee-700">
            How resources are organized
          </h2>
          <p className="mt-3 text-earth-text">
            Every resource is filed under one of four pillars — Parks &amp;
            Recreation, Civic &amp; Youth Engagement, Human &amp; Family
            Services, and Business &amp; Workforce — and tagged with the
            audiences it serves. That means a high school student looking for
            volunteer hours and a parent looking for youth sports both reach
            their result in three clicks or fewer.
          </p>
        </section>

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
