import EventMatchmaker from "@/components/ai/EventMatchmaker";

export const metadata = {
  title: "Personal Planner",
  description:
    "Answer three questions and get a personalized list of Forsyth County events and resources, with a downloadable calendar.",
};

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-sawnee-700 sm:text-4xl">
        Build Your Community Plan
      </h1>
      <p className="mt-3 text-earth-muted">
        Three questions, then a tailored list of events and resources you can
        download straight to your calendar. Nothing is saved and no account is
        needed.
      </p>

      <div className="mt-10">
        <EventMatchmaker />
      </div>
    </div>
  );
}
