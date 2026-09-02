import Link from "next/link";
import { TreePine } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/types";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-earth-border bg-sawnee-900 text-sawnee-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-gold-400" aria-hidden="true" />
            <span className="font-display text-lg font-semibold">
              Forsyth Connect
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sawnee-100">
            A community-built directory of programs, services, and events across
            Forsyth County, Georgia.
          </p>
        </div>

        <nav aria-labelledby="footer-categories">
          <h2
            id="footer-categories"
            className="font-display text-sm font-semibold uppercase tracking-wide text-gold-400"
          >
            Browse by Category
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
              <li key={slug}>
                <Link
                  href={`/resources?category=${slug}`}
                  className="text-sawnee-100 hover:text-white hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-explore">
          <h2
            id="footer-explore"
            className="font-display text-sm font-semibold uppercase tracking-wide text-gold-400"
          >
            Explore
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/resources" className="text-sawnee-100 hover:text-white hover:underline">
                All Resources
              </Link>
            </li>
            <li>
              <Link href="/events" className="text-sawnee-100 hover:text-white hover:underline">
                Community Events
              </Link>
            </li>
            <li>
              <Link href="/explore" className="text-sawnee-100 hover:text-white hover:underline">
                Map View
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sawnee-100 hover:text-white hover:underline">
                About This Hub
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-utility">
          <h2
            id="footer-utility"
            className="font-display text-sm font-semibold uppercase tracking-wide text-gold-400"
          >
            Get Involved
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/submit" className="text-sawnee-100 hover:text-white hover:underline">
                Submit a Resource
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="text-sawnee-100 hover:text-white hover:underline">
                Accessibility Statement
              </Link>
            </li>
            <li>
              <Link href="/about#contact" className="text-sawnee-100 hover:text-white hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-sawnee-700">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-sawnee-100 sm:px-6">
          Forsyth Connect is a student-built demonstration project. Always confirm
          hours and eligibility directly with each organization before visiting.
        </p>
      </div>
    </footer>
  );
}
