import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children, actions }: Props) {
  return (
    <section className="border-b border-border bg-surface-soft">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-teal-soft">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display mt-2 max-w-3xl text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        {children}
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 ${className}`}>
      {children}
    </section>
  );
}

export function CtaButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-accent text-[#141218] hover:bg-[#ffe04a]"
      : variant === "secondary"
        ? "bg-white/15 text-white ring-1 ring-white/35 hover:bg-white/25"
        : "bg-surface text-teal ring-1 ring-border hover:bg-surface-soft";

  return (
    <Link
      href={href}
      className={`inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-colors sm:w-auto ${styles}`}
    >
      {children}
    </Link>
  );
}

export function PlaceholderPhoto({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`placeholder-photo flex items-end overflow-hidden rounded-sm ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="m-3 rounded bg-teal-deep/70 px-2.5 py-1 text-xs text-white/90">
        {label}
      </span>
    </div>
  );
}
