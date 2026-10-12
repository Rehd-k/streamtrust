"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CtaButton } from "@/components/ui";
import type { HeroSlide } from "@/lib/gallery";
import { org } from "@/lib/org";

const INTERVAL_MS = 6800;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const active = slides[index];

  const go = useCallback(
    (step: number) => {
      setIndex((current) => (current + step + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!active) return null;

  return (
    <section
      className="relative isolate min-h-[min(92vh,820px)] overflow-hidden bg-teal-deep text-white"
      aria-roledescription="carousel"
      aria-label="Photos from the centre"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {slides.map((slide, slideIndex) => {
        const isActive = slideIndex === index;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <div className={`absolute inset-0 ${isActive ? "hero-image-in" : ""}`}>
              <div className={`absolute inset-0 ${isActive ? "hero-kenburns" : ""}`}>
                <Image
                  src={slide.src}
                  alt={isActive ? slide.alt : ""}
                  fill
                  priority={slideIndex === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "linear-gradient(100deg, rgba(11,11,11,0.88) 0%, rgba(11,11,11,0.55) 42%, rgba(11,11,11,0.15) 100%)",
        }}
      />

      <div className="relative z-30 mx-auto flex min-h-[min(92vh,820px)] w-full max-w-6xl flex-col justify-end px-4 py-14 sm:px-6 sm:py-16 lg:pb-20 lg:pt-28">
        <div key={active.src} className="max-w-xl">
          <p className="hero-text-in font-display text-[2.5rem] leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {org.shortName}
          </p>
          <h1 className="hero-text-in-late mt-4 max-w-lg text-lg font-medium leading-snug text-white/95 sm:mt-5 sm:text-2xl">
            Clarity you can trust — diagnostics in the heart of Uyo.
          </h1>
          <p className="hero-text-in-late mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:mt-4 sm:text-base">
            {active.line}
          </p>
        </div>
        <div className="hero-text-in-late mt-7 flex w-full max-w-xl flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
          <CtaButton href="/book">Book a visit</CtaButton>
          <CtaButton href="/home-collection" variant="secondary">
            Request home kit
          </CtaButton>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg ring-1 ring-white/30 transition hover:bg-white/25"
            aria-label="Previous photo"
            onClick={() => go(-1)}
          >
            ‹
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose a photo">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={slide.line}
                className={`h-2 rounded-full transition-all duration-500 ${
                  slideIndex === index
                    ? "w-8 bg-accent"
                    : "w-2 bg-white/45 hover:bg-white/70"
                }`}
                onClick={() => setIndex(slideIndex)}
              />
            ))}
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg ring-1 ring-white/30 transition hover:bg-white/25"
            aria-label="Next photo"
            onClick={() => go(1)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
