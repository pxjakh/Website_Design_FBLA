export const metadata = {
  title: "Accessibility Statement",
  description:
    "How Forsyth Connect meets WCAG 2.1 AA standards for keyboard, screen reader, and low-vision users.",
};

const COMMITMENTS = [
  {
    heading: "Keyboard navigation",
    body: "Every interactive element is reachable and operable by keyboard. A skip-to-content link is the first focusable item on each page, filter menus and dialogs close with Escape, and the RSVP dialog traps focus while open and returns focus to the button that opened it.",
  },
  {
    heading: "Screen readers",
    body: "Pages use landmark regions (banner, navigation, main, contentinfo), headings in order, and labelled form controls. Filter menus expose aria-expanded and aria-controls, and result counts update through an aria-live region so filter changes are announced.",
  },
  {
    heading: "Colour and contrast",
    body: "Body text and interactive labels meet or exceed WCAG 2.1 AA contrast against their backgrounds. Colour is never the only signal — the open/closed status on each resource card pairs its colour with a text label.",
  },
  {
    heading: "Responsive and zoom-friendly",
    body: "Layouts are built mobile-first and reflow without horizontal scrolling from 375px upward. Text is sized in relative units so browser zoom and larger default font sizes scale the interface cleanly.",
  },
];

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-sawnee-700 sm:text-4xl">
        Accessibility Statement
      </h1>
      <p className="mt-3 leading-relaxed text-earth-text">
        Forsyth Connect is built to conform to WCAG 2.1 Level AA. A community
        resource directory is only useful if everyone in the community can
        actually use it.
      </p>

      <div className="mt-8 space-y-7">
        {COMMITMENTS.map((item) => (
          <section key={item.heading}>
            <h2 className="text-xl font-semibold text-sawnee-700">
              {item.heading}
            </h2>
            <p className="mt-2 leading-relaxed text-earth-text">{item.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-earth-border bg-earth-surface p-6">
        <h2 className="text-lg font-semibold text-sawnee-700">
          Found a barrier?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-earth-text">
          If any part of this site is difficult to use with assistive
          technology, we want to hear about it so it can be fixed. Report it
          through the Submit a Resource form and note that it&apos;s an
          accessibility issue.
        </p>
      </section>
    </div>
  );
}
