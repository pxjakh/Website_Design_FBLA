import EventBrowser from "@/components/EventBrowser";

export const metadata = {
  title: "Community Events",
  description:
    "Upcoming volunteer opportunities, wellness classes, youth sports, and business workshops across Forsyth County.",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-sawnee-700 sm:text-4xl">
        Community Events
      </h1>
      <p className="mt-3 max-w-2xl text-earth-muted">
        Volunteer shifts, wellness classes, youth sports sign-ups, and business
        workshops happening across Forsyth County.
      </p>

      <div className="mt-10">
        <EventBrowser />
      </div>
    </div>
  );
}
