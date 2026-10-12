import Link from "next/link";
import { redirect } from "next/navigation";
import { PortalNav } from "@/components/PortalNav";
import { getPatientToken } from "@/lib/auth";
import { patientGet } from "@/lib/portal";
import { pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.portalAppointments.title,
  description: seoCopy.portalAppointments.description,
  path: "/portal/appointments",
});

function asList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "items", "results", "appointments"]) {
      if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
    }
  }
  return [];
}

function field(row: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" || typeof v === "number") return String(v);
  }
  return "—";
}

export default async function PortalAppointmentsPage() {
  const token = await getPatientToken();
  if (!token) redirect("/portal/login");

  const list = await patientGet<unknown>("/patient/appointments");
  const rows = asList(list.data);

  return (
    <div>
      <PortalNav />
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-teal-deep">Appointments</h1>
          <p className="mt-2 text-muted">Your scheduled and requested visits.</p>
        </div>
        <Link
          href="/book"
          className="rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white"
        >
          Book new
        </Link>
      </div>

      {list.error ? (
        <p className="mt-8 rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
          {list.error.message}
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-muted">No appointments yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {rows.map((row, i) => (
            <li key={field(row, ["id"]) + i} className="py-4">
              <p className="font-medium">
                {field(row, ["specialty", "specialtyName", "reason", "type", "id"])}
              </p>
              <p className="mt-1 text-sm text-muted">
                {field(row, ["scheduledAt", "date", "appointmentDate", "createdAt"])} ·{" "}
                {field(row, ["status", "state"])}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
