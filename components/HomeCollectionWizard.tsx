"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { formatNgn, type CatalogTest } from "@/lib/catalog";

type Step = "tests" | "details" | "review";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  notes: string;
};

const emptyForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  landmark: "",
  notes: "",
};

export function HomeCollectionWizard({
  services,
  loadError,
}: {
  services: CatalogTest[];
  loadError?: string | null;
}) {
  const searchParams = useSearchParams();
  const eligible = services;
  const preset = searchParams.get("test");

  const initialSelected = useMemo(() => {
    if (!preset) return new Set<string>();
    const match = eligible.find(
      (service) => service.id === preset || service.slug === preset,
    );
    return match ? new Set([match.id]) : new Set<string>();
  }, [eligible, preset]);

  const [step, setStep] = useState<Step>("tests");
  const [selected, setSelected] = useState<Set<string>>(initialSelected);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedTests = eligible.filter((t) => selected.has(t.id));
  const total = selectedTests.reduce((sum, t) => sum + t.priceNgn, 0);

  function toggle(test: CatalogTest) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(test.id)) next.delete(test.id);
      else next.add(test.id);
      return next;
    });
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceIds: selectedTests.map((test) => test.id),
            purpose: "home-collection",
            customer: form,
          }),
        });
        const data = (await res.json()) as {
          authorizationUrl?: string;
          message?: string;
        };
        if (!res.ok || !data.authorizationUrl) {
          setError(data.message || "Could not start payment. Try again.");
          return;
        }
        window.location.href = data.authorizationUrl;
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  if (eligible.length === 0) {
    return (
      <p className="text-muted" role="alert">
        {loadError || "No tests are available to request right now."}
      </p>
    );
  }

  return (
    <div>
      <ol className="mb-10 flex flex-wrap gap-3 text-sm">
        {(
          [
            ["tests", "1 · Select tests"],
            ["details", "2 · Delivery details"],
            ["review", "3 · Review"],
          ] as const
        ).map(([key, label]) => (
          <li
            key={key}
            className={
              step === key
                ? "font-semibold text-teal"
                : "text-muted"
            }
          >
            {label}
          </li>
        ))}
      </ol>

      {step === "tests" ? (
        <div>
          <ul className="divide-y divide-border border-y border-border">
            {eligible.map((test) => {
              const on = selected.has(test.id);
              return (
                <li key={test.id}>
                  <label className="flex cursor-pointer items-start gap-4 py-4">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(test)}
                      className="mt-1 size-4 accent-teal"
                    />
                    <span className="flex-1">
                      <span className="block font-medium text-foreground">
                        {test.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {test.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-teal">
                      {formatNgn(test.priceNgn)}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-muted">
              {selected.size} selected · {formatNgn(total)}
            </p>
            <button
              type="button"
              disabled={selected.size === 0}
              onClick={() => setStep("details")}
              className="rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === "details" ? (
        <form
          className="mx-auto grid max-w-xl gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep("review");
          }}
        >
          {(
            [
              ["fullName", "Full name", "text"],
              ["phone", "Phone", "tel"],
              ["email", "Email", "email"],
              ["address", "Delivery address", "text"],
              ["landmark", "Landmark (optional)", "text"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="text-sm font-medium text-foreground">{label}</span>
              <input
                required={key !== "landmark"}
                type={type}
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
                className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-sm font-medium text-foreground">
              Notes (optional)
            </span>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              rows={3}
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
            />
          </label>
          <div className="mt-4 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep("tests")}
              className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-teal"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-white"
            >
              Review
            </button>
          </div>
        </form>
      ) : null}

      {step === "review" ? (
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-2xl text-teal-deep">Review request</h2>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {selectedTests.map((t) => (
              <li key={t.id} className="flex justify-between py-3 text-sm">
                <span>{t.name}</span>
                <span className="font-medium">{formatNgn(t.priceNgn)}</span>
              </li>
            ))}
            <li className="flex justify-between py-3 font-semibold">
              <span>Estimated total</span>
              <span>{formatNgn(total)}</span>
            </li>
          </ul>
          <dl className="mt-6 space-y-2 text-sm text-muted">
            <div>
              <dt className="inline font-medium text-foreground">Name: </dt>
              <dd className="inline">{form.fullName}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">Phone: </dt>
              <dd className="inline">{form.phone}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">Email: </dt>
              <dd className="inline">{form.email}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">Address: </dt>
              <dd className="inline">
                {form.address}
                {form.landmark ? ` · ${form.landmark}` : ""}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted">
            You pay the centre fee on the next page. A receipt is emailed when
            Flutterwave confirms the payment. Prices are the current centre fees.
          </p>
          {error ? (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-8 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-teal"
            >
              Back
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={submit}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-teal-deep disabled:opacity-50"
            >
              {pending ? "Opening payment…" : "Pay now"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
