import Link from "next/link";
import clsx from "clsx";

/**
 * The animated dashed-border-and-corner-dots hover effect, rebuilt natively.
 *
 * The original reference implementation rendered inside a sandboxed iframe,
 * which would have made these cards unlinkable and opaque to screen readers.
 * This version is a real Next.js <Link>: keyboard focusable, announced
 * normally, and navigable. The effect is pure CSS driven by group-hover and
 * group-focus-visible, so it also fires for keyboard users — not just mouse.
 *
 * All motion here is transition-based, so the global prefers-reduced-motion
 * rule in globals.css collapses it to the final state instead of animating.
 */
export default function DotBorderCard({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("group relative h-full p-3", className)}>
      {/* Diagonal hatch, revealed last so it reads as the effect settling */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 delay-300 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-sawnee-100) 0 1px, transparent 2px 5px)",
        }}
      />

      {/* Dashed border segments — each scales in from a different origin */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 delay-[80ms] group-hover:scale-x-100 group-focus-within:scale-x-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 2px, var(--color-sawnee-500) 2px 4px)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-px origin-top scale-y-0 transition-transform duration-300 delay-[140ms] group-hover:scale-y-100 group-focus-within:scale-y-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 2px, var(--color-sawnee-500) 2px 4px)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-px w-full origin-right scale-x-0 transition-transform duration-300 delay-200 group-hover:scale-x-100 group-focus-within:scale-x-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 2px, var(--color-sawnee-500) 2px 4px)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-full w-px origin-bottom scale-y-0 transition-transform duration-300 delay-[240ms] group-hover:scale-y-100 group-focus-within:scale-y-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 2px, var(--color-sawnee-500) 2px 4px)",
        }}
      />

      {/* Corner dots travel outward from the card edge into each corner */}
      {(
        [
          ["top-1/2 left-[20%]", "group-hover:top-0 group-hover:left-0 group-focus-within:top-0 group-focus-within:left-0", "delay-0"],
          ["top-1/2 right-[20%]", "group-hover:top-0 group-hover:right-0 group-focus-within:top-0 group-focus-within:right-0", "delay-[60ms]"],
          ["bottom-1/2 right-[20%]", "group-hover:bottom-0 group-hover:right-0 group-focus-within:bottom-0 group-focus-within:right-0", "delay-[120ms]"],
          ["bottom-1/2 left-[20%]", "group-hover:bottom-0 group-hover:left-0 group-focus-within:bottom-0 group-focus-within:left-0", "delay-[180ms]"],
        ] as const
      ).map(([rest, target, delay], i) => (
        <span
          key={i}
          aria-hidden="true"
          className={clsx(
            "pointer-events-none absolute h-2 w-2 rounded-[2px] bg-gold-500 opacity-0 transition-all duration-300",
            rest,
            target,
            delay,
            "group-hover:opacity-100 group-focus-within:opacity-100"
          )}
        />
      ))}

      <Link
        href={href}
        className="relative flex h-full flex-col rounded-lg border border-earth-border bg-earth-surface p-6 transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        {children}
      </Link>
    </div>
  );
}
