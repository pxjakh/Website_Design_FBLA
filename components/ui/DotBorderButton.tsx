import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The dashed-border-and-corner-dots treatment, sized for a call-to-action
 * rather than a card. Wraps a real <Link> or <button> so semantics,
 * keyboard focus, and navigation are untouched.
 *
 * The effect keys off group-hover *and* group-focus-within so it fires for
 * keyboard users, and is transition-based so the global
 * prefers-reduced-motion rule collapses it to its end state.
 */

function Decoration() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 delay-[60ms] group-hover:scale-x-100 group-focus-within:scale-x-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 2px, var(--color-gold-500) 2px 4px)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-px origin-top scale-y-0 transition-transform duration-300 delay-[110ms] group-hover:scale-y-100 group-focus-within:scale-y-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 2px, var(--color-gold-500) 2px 4px)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 delay-[160ms] group-hover:scale-x-100 group-focus-within:scale-x-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 2px, var(--color-gold-500) 2px 4px)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-full w-px origin-bottom scale-y-0 transition-transform duration-300 delay-[210ms] group-hover:scale-y-100 group-focus-within:scale-y-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 2px, var(--color-gold-500) 2px 4px)",
        }}
      />

      {(
        [
          ["top-1/2 left-[25%]", "group-hover:top-0 group-hover:left-0 group-focus-within:top-0 group-focus-within:left-0", "delay-0"],
          ["top-1/2 right-[25%]", "group-hover:top-0 group-hover:right-0 group-focus-within:top-0 group-focus-within:right-0", "delay-[50ms]"],
          ["bottom-1/2 right-[25%]", "group-hover:bottom-0 group-hover:right-0 group-focus-within:bottom-0 group-focus-within:right-0", "delay-[100ms]"],
          ["bottom-1/2 left-[25%]", "group-hover:bottom-0 group-hover:left-0 group-focus-within:bottom-0 group-focus-within:left-0", "delay-[150ms]"],
        ] as const
      ).map(([rest, target, delay], i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute h-1.5 w-1.5 rounded-[2px] bg-gold-500 opacity-0 transition-all duration-300",
            rest,
            target,
            delay,
            "group-hover:opacity-100 group-focus-within:opacity-100",
          )}
        />
      ))}
    </>
  );
}

export function DotBorderLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const inner = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition-transform duration-200 group-hover:-translate-y-px",
    className,
  );

  return (
    <span className="group relative inline-block p-2">
      <Decoration />
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={inner}>
          {children}
        </a>
      ) : (
        <Link href={href} className={inner}>
          {children}
        </Link>
      )}
    </span>
  );
}

export function DotBorderButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <span className="group relative inline-block p-2">
      <Decoration />
      <button
        {...props}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition-transform duration-200 group-hover:-translate-y-px disabled:opacity-40",
          className,
        )}
      >
        {children}
      </button>
    </span>
  );
}
