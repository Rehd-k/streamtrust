"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { org } from "@/lib/org";

const links = [
  { href: "/services", label: "Services" },
  { href: "/home-collection", label: "Home Kit" },
  { href: "/book", label: "Book" },
  { href: "/about", label: "About" },
  { href: "/health", label: "Health" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isPortal = pathname.startsWith("/portal");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src={org.logoPath}
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
          />
          <span className="font-display truncate text-lg tracking-tight text-foreground sm:text-2xl">
            {org.shortName}
            <span className="ml-1.5 hidden text-sm font-sans font-normal text-muted sm:inline">
              Diagnostics
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm text-foreground/80 transition-colors hover:text-teal"
              data-active={
                pathname === link.href || pathname.startsWith(`${link.href}/`)
              }
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={isPortal ? "/portal" : "/portal/login"}
            className="rounded-md bg-teal px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c41f78]"
          >
            Patient portal
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm text-teal lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/portal/login"
              className="mt-1 rounded-md bg-teal px-3.5 py-2.5 text-center text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Patient portal
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
