import { redirect } from "next/navigation";
import { PortalNav } from "@/components/PortalNav";
import { getPatientToken } from "@/lib/auth";
import { patientGet } from "@/lib/portal";
import { pageMeta, seoCopy } from "@/lib/seo";

export const metadata = pageMeta({
  title: seoCopy.portalBilling.title,
  description: seoCopy.portalBilling.description,
  path: "/portal/billing",
});

function asList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "items", "results", "invoices", "payments"]) {
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

export default async function PortalBillingPage() {
  const token = await getPatientToken();
  if (!token) redirect("/portal/login");

  const [summary, invoices, payments] = await Promise.all([
    patientGet<Record<string, unknown>>("/patient/billing/summary"),
    patientGet<unknown>("/patient/invoices"),
    patientGet<unknown>("/patient/payments"),
  ]);

  const invoiceRows = asList(invoices.data);
  const paymentRows = asList(payments.data);

  return (
    <div>
      <PortalNav />
      <h1 className="font-display mt-8 text-3xl text-teal-deep">Billing</h1>
      <p className="mt-2 text-muted">Invoices and payment history.</p>

      {summary.error ? (
        <p className="mt-6 text-sm text-amber-800">{summary.error.message}</p>
      ) : summary.data ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {(["outstandingBalance", "balance", "amountDue", "dueDate", "currency"] as const).map(
            (key) => {
              const val = summary.data?.[key];
              if (val === undefined || val === null) return null;
              return (
                <div key={key} className="border-t border-border pt-3">
                  <dt className="text-xs uppercase tracking-wider text-muted">{key}</dt>
                  <dd className="mt-1 font-medium">{String(val)}</dd>
                </div>
              );
            },
          )}
        </dl>
      ) : null}

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-soft">
          Invoices
        </h2>
        {invoices.error ? (
          <p className="mt-3 text-sm text-amber-800">{invoices.error.message}</p>
        ) : invoiceRows.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No invoices.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {invoiceRows.map((row, i) => (
              <li key={field(row, ["id", "invoiceID"]) + i} className="flex justify-between py-4 text-sm">
                <span>
                  {field(row, ["invoiceID", "invoiceNumber", "id"])} ·{" "}
                  {field(row, ["status"])}
                </span>
                <span className="font-medium">
                  {field(row, ["total", "amount", "grandTotal"])}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-soft">
          Payments
        </h2>
        {payments.error ? (
          <p className="mt-3 text-sm text-amber-800">{payments.error.message}</p>
        ) : paymentRows.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No payments recorded.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {paymentRows.map((row, i) => (
              <li key={field(row, ["id"]) + i} className="flex justify-between py-4 text-sm">
                <span>
                  {field(row, ["paidAt", "createdAt", "date"])} ·{" "}
                  {field(row, ["method", "paymentMethod"])}
                </span>
                <span className="font-medium">
                  {field(row, ["amount", "total"])}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
