import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalNav } from "@/components/PortalNav";
import { getPatientToken } from "@/lib/auth";
import { patientGet } from "@/lib/portal";
import { pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.portal.title,
  description: seoCopy.portal.description,
  path: "/portal",
});

function asList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "items", "results", "appointments", "invoices", "reports"]) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
  }
  return [];
}

function pickString(obj: unknown, keys: string[]) {
  if (!obj || typeof obj !== "object") return null;
  const record = obj as Record<string, unknown>;
  for (const key of keys) {
    const v = record[key];
    if (typeof v === "string" && v.trim()) return v;
    if (typeof v === "number") return String(v);
  }
  return null;
}

export default async function PortalDashboardPage() {
  const token = await getPatientToken();
  if (!token) redirect("/portal/login");

  const me = await patientGet<Record<string, unknown>>("/patient-auth/me");
  if (me.error?.status === 401) redirect("/portal/login");

  const [apptDash, billing, labs] = await Promise.all([
    patientGet<unknown>("/patient/appointments/dashboard"),
    patientGet<unknown>("/patient/billing/summary"),
    patientGet<unknown>("/patient/lab-reports"),
  ]);

  const deviceMessage =
    me.error && me.error.status !== 401
      ? me.error.message
      : null;

  const name =
    pickString(me.data, ["fullName", "name", "firstName"]) ||
    pickString(
      me.data && typeof me.data === "object" && "patient" in me.data
        ? (me.data as { patient: unknown }).patient
        : null,
      ["fullName", "name", "firstName"],
    ) ||
    "Patient";

  const labCount = asList(labs.data).length;
  const outstanding = pickString(billing.data, [
    "outstandingBalance",
    "balance",
    "amountDue",
    "totalOutstanding",
  ]);

  return (
    <div>
      <PortalNav />
      <header className="mt-8">
        <p className="text-sm font-medium uppercase tracking-wider text-teal-soft">
          Portal
        </p>
        <h1 className="font-display mt-1 text-3xl text-teal-deep">
          Welcome, {name}
        </h1>
        {deviceMessage ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {deviceMessage}
            {" — "}
            If your device is pending approval, visit the front desk with your
            Patient ID.
          </p>
        ) : null}
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <DashCard
          title="Appointments"
          body={
            apptDash.error
              ? apptDash.error.message
              : pickString(apptDash.data, ["summary", "upcomingCount", "message"]) ||
                "View and manage visits"
          }
          href="/portal/appointments"
        />
        <DashCard
          title="Lab reports"
          body={
            labs.error
              ? labs.error.message
              : labCount
                ? `${labCount} report(s) available`
                : "No lab reports yet"
          }
          href="/portal/reports"
        />
        <DashCard
          title="Billing"
          body={
            billing.error
              ? billing.error.message
              : outstanding
                ? `Outstanding: ${outstanding}`
                : "View invoices & payments"
          }
          href="/portal/billing"
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/book"
          className="rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white"
        >
          Book appointment
        </Link>
        <Link
          href="/home-collection"
          className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-teal"
        >
          Home sample kit
        </Link>
      </div>
    </div>
  );
}

function DashCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block border-t border-border pt-4 transition-colors hover:bg-surface-soft/40"
    >
      <h2 className="font-display text-xl text-teal-deep">{title}</h2>
      <p className="mt-2 text-sm text-muted line-clamp-3">{body}</p>
    </Link>
  );
}
