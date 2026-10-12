"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/portal", label: "Overview", exact: true },
  { href: "/portal/appointments", label: "Appointments" },
  { href: "/portal/reports", label: "Reports" },
  { href: "/portal/billing", label: "Billing" },
  { href: "/portal/profile", label: "Profile" },
];

export function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "font-semibold text-teal"
                  : "text-muted hover:text-teal"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={logout}
        className="self-start text-sm font-medium text-muted hover:text-teal"
      >
        Sign out
      </button>
    </div>
  );
}
