import { redirect } from "next/navigation";
import { PortalNav } from "@/components/PortalNav";
import { getPatientToken } from "@/lib/auth";
import { patientGet } from "@/lib/portal";
import { pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.portalReports.title,
  description: seoCopy.portalReports.description,
  path: "/portal/reports",
});

function asList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "items", "results", "reports"]) {
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

export default async function PortalReportsPage() {
  const token = await getPatientToken();
  if (!token) redirect("/portal/login");

  const [labs, radiology] = await Promise.all([
    patientGet<unknown>("/patient/lab-reports"),
    patientGet<unknown>("/patient/radiology-reports"),
  ]);

  const labRows = asList(labs.data);
  const radRows = asList(radiology.data);

  return (
    <div>
      <PortalNav />
      <h1 className="font-display mt-8 text-3xl text-teal-deep">Reports</h1>
      <p className="mt-2 text-muted">Lab and radiology results from StreamTrust.</p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-soft">
          Laboratory
        </h2>
        {labs.error ? (
          <p className="mt-3 text-sm text-amber-800">{labs.error.message}</p>
        ) : labRows.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No lab reports yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {labRows.map((row, i) => (
              <li key={field(row, ["id"]) + i} className="py-4">
                <p className="font-medium">
                  {field(row, ["title", "testName", "name", "orderNumber", "id"])}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {field(row, ["status", "reportStatus"])} ·{" "}
                  {field(row, ["createdAt", "date", "reportedAt", "updatedAt"])}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-soft">
          Radiology
        </h2>
        {radiology.error ? (
          <p className="mt-3 text-sm text-amber-800">{radiology.error.message}</p>
        ) : radRows.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No radiology reports yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {radRows.map((row, i) => (
              <li key={field(row, ["id"]) + i} className="py-4">
                <p className="font-medium">
                  {field(row, ["title", "scanName", "modality", "name", "id"])}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {field(row, ["status", "reportStatus"])} ·{" "}
                  {field(row, ["createdAt", "date", "reportedAt", "updatedAt"])}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
