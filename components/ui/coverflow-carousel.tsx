"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  id: string;
  /** Small category chip at the top of the card. */
  tag: string;
  title: string;
  subtitle?: string;
  /** Label/value rows shown on the face of the card. */
  meta?: { label: string; value: string }[];
  /** Where the card's action goes. */
  href: string;
  actionLabel?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  fade?: number;
  cardWidth?: string;
  cardHeight?: string;
  gap?: number;
  loop?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  label?: string;
  /** Set on a dark background so the pagination dots stay visible. */
  onDark?: boolean;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  // Sized off the viewport so a phone gets a card that fills most of the
  // screen. The height has to clear the tallest card's content — a 45-char
  // title over a 3-line description, three meta rows, and the action —
  // because the card clips its overflow.
  cardWidth = "clamp(250px, 74vw, 320px)",
  cardHeight = "clamp(344px, 92vw, 384px)",
  gap = 0.08,
  loop = true,
  showPagination = true,
  showNavigation = true,
  label = "Featured opportunities",
  onDark = false,
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);
  /** Motion preference is read once on mount; honouring it means snapping
   *  between cards instead of easing, which is the point of the setting. */
  const reduceMotionRef = React.useRef(false);

  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      if (reduceMotionRef.current) {
        posRef.current = target;
        paint();
        return;
      }

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Let clicks on the card's own link or button through untouched.
    if ((event.target as HTMLElement).closest("a,button")) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <div
      className={cn("w-full", className)}
      style={{
        ["--cf-card" as string]: cardWidth,
        ["--cf-card-h" as string]: cardHeight,
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none focus-visible:ring-2 focus-visible:ring-lanier-500 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card-h)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isActive = index === selected;
              return (
                <div
                  key={slide.id}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}: ${slide.title}`}
                  aria-hidden={!isActive}
                  // Off-centre cards are angled away and partly transparent;
                  // leaving them focusable would tab the keyboard into
                  // content the user cannot read.
                  inert={!isActive}
                  className={cn(
                    "absolute left-1/2 top-0 flex flex-col overflow-hidden rounded-2xl border border-earth-border bg-earth-surface p-5 shadow-xl will-change-transform",
                    cardClassName,
                  )}
                  style={{ width: "var(--cf-card)", height: "var(--cf-card-h)" }}
                >
                  <span className="w-fit rounded-full bg-lanier-50 px-2.5 py-1 text-xs font-medium text-lanier-700">
                    {slide.tag}
                  </span>

                  <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-sawnee-700 sm:text-lg">
                    {slide.title}
                  </h3>

                  {slide.subtitle && (
                    <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-earth-muted">
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.meta && slide.meta.length > 0 && (
                    <dl className="mt-4 space-y-1.5 text-xs">
                      {slide.meta.map((row) => (
                        <div key={row.label} className="flex justify-between gap-3">
                          <dt className="shrink-0 text-earth-muted">{row.label}</dt>
                          <dd className="text-right font-medium text-earth-text">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <a
                    href={slide.href}
                    className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-lg bg-sawnee-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sawnee-900"
                  >
                    {slide.actionLabel ?? "Learn more"}
                    <span className="sr-only"> about {slide.title}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-3 top-1/2 z-[200] hidden -translate-y-1/2 rounded-full border border-earth-border bg-earth-surface/80 p-3 text-sawnee-700 backdrop-blur transition-colors hover:bg-earth-surface sm:block"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-3 top-1/2 z-[200] hidden -translate-y-1/2 rounded-full border border-earth-border bg-earth-surface/80 p-3 text-sawnee-700 backdrop-blur transition-colors hover:bg-earth-surface sm:block"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        Slide {selected + 1} of {count}: {slides[selected]?.title}
      </p>

      <p
        className={cn(
          "mt-1 text-center text-xs",
          onDark ? "text-sawnee-100" : "text-earth-muted",
        )}
      >
        Drag, swipe, or use the arrow keys to browse
      </p>

      {showPagination && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-opacity",
                onDark ? "bg-gold-400" : "bg-sawnee-700",
                index === selected
                  ? "opacity-100"
                  : "opacity-30 hover:opacity-60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
